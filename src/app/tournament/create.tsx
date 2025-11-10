import type React from "react";
import { useState, useMemo, useCallback } from "react";
import {
	View,
	TextInput,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	Alert,
	ScrollView,
	type ListRenderItem,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import Text from "../../components/Text";
import ActionButton from "../../components/ActionButton";
import AddPlayerModal from "../../components/AddPlayerModal";

import { useTournamentStore } from "../../store/useTournamentStore";
import { usePlayerStore } from "../../store/usePlayerStore";

import { Colors } from "../../theme/tokens/colorsV2";
import { Space } from "../../theme/tokens/space";
import { Shape } from "../../theme/tokens/shape";
import { Font } from "../../theme/tokens/font";

import { uuid } from "../../utils/uuid";
import { generateGroups } from "../../core/tournament/groupGenerator";

import type { Tournament } from "../../store/types";
import type { Group } from "../../core/tournament/types";
import type { Player } from "../../store/types";

type GroupDraft = {
	id: string;
	name: string;
	playerIds: string[];
};

const MIN_PLAYERS_PER_GROUP = 4;

const TIEBREAK_OPTIONS = [
	{ id: "vitorias", label: "Vitórias", required: false },
	{ id: "gamesAfavor", label: "Games a favor", required: false },
	{ id: "saldoGames", label: "Saldo de games", required: false },
	{ id: "confrontoDireto", label: "Confronto direto", required: false },
] as const;

type TieBreaker = (typeof TIEBREAK_OPTIONS)[number]["id"];

const CreateTournamentScreen: React.FC = () => {
	const router = useRouter();
	const { createTournament } = useTournamentStore();
	const { players } = usePlayerStore();

	const [step, setStep] = useState<1 | 2 | 3>(1);
	const [name, setName] = useState("");
	const [sport, setSport] = useState<Tournament["sport"]>(
		"Beach Tennis" as Tournament["sport"],
	);
	const [isAddModalVisible, setAddModalVisible] = useState(false);
	const [search, setSearch] = useState("");
	const [groups, setGroups] = useState<GroupDraft[]>([
		{ id: uuid(), name: "Grupo 1", playerIds: [] },
	]);
	const [activeGroupIndex, setActiveGroupIndex] = useState(0);
	const [tieBreakRules, setTieBreakRules] = useState<TieBreaker[]>([]);

	const filteredPlayers = useMemo(() => {
		if (!search.trim()) return players;
		return players.filter((p) =>
			p.name.toLowerCase().includes(search.toLowerCase()),
		);
	}, [players, search]);

	const isGroupValid = useCallback(
		(g: GroupDraft) =>
			g.playerIds.length >= MIN_PLAYERS_PER_GROUP &&
			g.playerIds.length % 2 === 0,
		[],
	);

	const allGroupsValid = groups.length > 0 && groups.every(isGroupValid);

	const togglePlayerInActiveGroup = useCallback(
		(playerId: string) => {
			setGroups((prev) =>
				prev.map((g, idx) => {
					if (idx === activeGroupIndex) {
						const has = g.playerIds.includes(playerId);
						return {
							...g,
							playerIds: has
								? g.playerIds.filter((id) => id !== playerId)
								: [...g.playerIds, playerId],
						};
					}
					return {
						...g,
						playerIds: g.playerIds.filter((id) => id !== playerId),
					};
				}),
			);
		},
		[activeGroupIndex],
	);

	const handleAddGroup = useCallback(() => {
		setGroups((prev) => {
			const nextIndex = prev.length + 1;
			return [
				...prev,
				{ id: uuid(), name: `Grupo ${nextIndex}`, playerIds: [] },
			];
		});
		setActiveGroupIndex(groups.length);
	}, [groups.length]);

	const handleRemoveGroup = useCallback(
		(index: number) => {
			if (groups.length === 1) {
				Alert.alert("Atenção", "Deve existir ao menos um grupo.");
				return;
			}
			setGroups((prev) => {
				const next = prev.filter((_, i) => i !== index);
				return next.map((g, i) => ({ ...g, name: `Grupo ${i + 1}` }));
			});
			setActiveGroupIndex((old) =>
				Math.max(0, Math.min(groups.length - 2, old)),
			);
		},
		[groups.length],
	);

	const handleNextStep = useCallback(() => {
		if (!name.trim()) {
			Alert.alert("Atenção", "Dê um nome ao torneio.");
			return;
		}
		setStep(2);
	}, [name]);

	const handleConfirmTieBreakRules = useCallback(() => {
		if (tieBreakRules.length < 2) {
			Alert.alert("Atenção", "Selecione pelo menos 2 critérios.");
			return;
		}
		setStep(3);
	}, [tieBreakRules]);

	const handleCreateTournament = useCallback(() => {
		if (!allGroupsValid) {
			Alert.alert(
				"Atenção",
				"Todos os grupos devem ter pelo menos 4 jogadores e um número par de jogadores.",
			);
			return;
		}
		const formatGroup: Group[] = groups.flatMap((g) =>
			generateGroups(g.name, g.playerIds, 1),
		);
		createTournament(name, sport, formatGroup);
		router.canGoBack() ? router.back() : router.replace("home");
	}, [allGroupsValid, createTournament, groups, name, sport, router]);

	const findGroupIndexOfPlayer = useCallback(
		(playerId: string) =>
			groups.findIndex((g) => g.playerIds.includes(playerId)),
		[groups],
	);

	const toggleTieBreaker = (rule: TieBreaker) => {
		setTieBreakRules((prev) => {
			return prev.includes(rule)
				? prev.filter((r) => r !== rule)
				: [...prev, rule];
		});
	};

	// STEP 1: nome e esporte
	if (step === 1) {
		return (
			<View style={styles.container}>
				<Text size="xl" weight="bold" style={styles.title}>
					Novo Torneio
				</Text>

				<TextInput
					style={styles.input}
					placeholder="Nome do torneio"
					value={name}
					onChangeText={setName}
				/>

				<TextInput
					style={styles.input}
					placeholder="Esporte"
					value={sport}
					editable={false}
				/>

				<ActionButton
					label="Avançar"
					onPress={handleNextStep}
					variant="primary"
					style={styles.button}
				/>
			</View>
		);
	}

	// STEP 2: critérios de desempate
	if (step === 2) {
		return (
			<View style={styles.container}>
				<Text size="xl" weight="bold" style={styles.title}>
					Critérios de desempate
				</Text>

				<Text size="sm" style={{ marginBottom: Space.md }}>
					Selecione pelo menos 2 critérios.
				</Text>

				{TIEBREAK_OPTIONS.map((opt) => {
					const selected = tieBreakRules.includes(opt.id);
					return (
						<TouchableOpacity
							key={opt.id}
							style={[styles.tieOption, selected && styles.tieOptionSelected]}
							onPress={() => toggleTieBreaker(opt.id)}
							disabled={opt.required}
						>
							<Text
								size="md"
								color={selected ? Colors.text.inverse : Colors.text.primary}
							>
								{opt.label}
							</Text>
							{opt.required && (
								<Text size="sm" color={Colors.text.secondary}>
									(obrigatório)
								</Text>
							)}
						</TouchableOpacity>
					);
				})}

				<View style={styles.footerRow}>
					<ActionButton
						label="Avançar"
						onPress={handleConfirmTieBreakRules}
						variant="primary"
					/>
					<ActionButton
						label="Voltar"
						onPress={() => setStep(1)}
						variant="secondary"
					/>
				</View>
			</View>
		);
	}

	// STEP 3: montagem dos grupos
	const activeGroup = groups[activeGroupIndex];
	const renderPlayer: ListRenderItem<Player> = ({ item }) => {
		const assignedGroupIndex = findGroupIndexOfPlayer(item.id);
		const isInActive = assignedGroupIndex === activeGroupIndex;
		const isAssignedElsewhere =
			assignedGroupIndex !== -1 && assignedGroupIndex !== activeGroupIndex;

		return (
			<View>
				{isInActive ? (
					<LinearGradient
						colors={[
							Colors.button.secondary.background,
							Colors.button.primary.background,
						]}
						start={{ x: 0, y: 0 }}
						end={{ x: 0.5, y: 1 }}
						style={styles.playerItem}
					>
						<TouchableOpacity
							onPress={() => togglePlayerInActiveGroup(item.id)}
						>
							<Text size="md" color={Colors.text.inverse}>
								{item.name}
							</Text>
						</TouchableOpacity>
					</LinearGradient>
				) : (
					<TouchableOpacity
						style={[
							styles.playerItem,
							isAssignedElsewhere && styles.playerItemDisabled,
						]}
						onPress={() => togglePlayerInActiveGroup(item.id)}
					>
						<Text size="md" color={Colors.text.primary}>
							{item.name}
						</Text>
					</TouchableOpacity>
				)}
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<AddPlayerModal
				visible={isAddModalVisible}
				onClose={() => setAddModalVisible(false)}
			/>

			<Text size="xl" weight="bold" style={styles.title}>
				Montar Grupos
			</Text>

			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				style={styles.groupsScroll}
			>
				{groups.map((g, idx) => {
					const valid = isGroupValid(g);
					const isActive = activeGroupIndex === idx;
					return (
						<TouchableOpacity
							key={g.id}
							onPress={() => setActiveGroupIndex(idx)}
							style={[
								styles.groupTab,
								isActive && styles.groupTabActive,
								valid && styles.groupTabValid,
								!valid && g.playerIds.length > 0 && styles.groupTabInvalid,
							]}
							onLongPress={() => {
								if (groups.length > 1) {
									Alert.alert(
										"Remover grupo",
										`Deseja realmente remover o grupo ${idx + 1}?`,
										[
											{ text: "Cancelar", style: "cancel" },
											{
												text: "Remover",
												style: "destructive",
												onPress: () => handleRemoveGroup(idx),
											},
										],
									);
								}
							}}
							delayLongPress={400}
						>
							<Text
								size="sm"
								weight="bold"
								color={isActive ? Colors.text.inverse : Colors.text.primary}
							>
								{g.name} ({g.playerIds.length})
							</Text>
						</TouchableOpacity>
					);
				})}

				<TouchableOpacity
					onPress={handleAddGroup}
					style={[styles.groupTab, styles.addGroupTab]}
				>
					<Text size="sm" weight="bold">
						+ Grupo
					</Text>
				</TouchableOpacity>
			</ScrollView>

			<Text size="md" weight="bold" style={styles.subtitle}>
				Grupo ativo: {activeGroup.name} — Jogadores:{" "}
				{activeGroup.playerIds.length}
			</Text>

			<View style={styles.row}>
				<TextInput
					style={styles.searchInput}
					placeholder="Buscar jogador..."
					value={search}
					onChangeText={setSearch}
				/>
				<ActionButton
					label="Add"
					onPress={() => setAddModalVisible(true)}
					variant="primary"
				/>
			</View>

			<FlatList
				data={filteredPlayers}
				keyExtractor={(item) => item.id}
				contentContainerStyle={{ paddingBottom: Space.xxl }}
				renderItem={renderPlayer}
			/>

			<View style={styles.footerRow}>
				<ActionButton
					label="Criar torneio"
					onPress={handleCreateTournament}
					variant="primary"
					disabled={!allGroupsValid}
				/>
				<ActionButton
					label="Voltar"
					onPress={() => setStep(2)}
					variant="secondary"
				/>
			</View>
		</View>
	);
};

export default CreateTournamentScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: Space.lg,
		backgroundColor: Colors.surface.allwaysWhite,
	},
	title: {
		marginBottom: Space.md,
	},
	input: {
		backgroundColor: Colors.surface.elevated,
		borderWidth: 1,
		borderColor: Colors.surface.border,
		borderRadius: Shape.radiusMd,
		paddingHorizontal: Space.md,
		paddingVertical: Space.sm,
		fontSize: Font.size.md,
		fontFamily: Font.family.primary,
		marginBottom: Space.sm,
		color: Colors.text.primary,
	},
	subtitle: {
		marginVertical: Space.sm,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	searchInput: {
		backgroundColor: Colors.surface.elevated,
		borderWidth: 1,
		borderColor: Colors.surface.border,
		borderRadius: Shape.radiusMd,
		paddingHorizontal: Space.md,
		paddingVertical: Space.sm,
		fontSize: Font.size.md,
		color: Colors.text.primary,
		width: "80%",
	},
	playerItem: {
		backgroundColor: Colors.surface.elevated,
		padding: Space.md,
		borderRadius: Shape.radiusSm,
		borderWidth: 1,
		borderColor: Colors.surface.border,
		marginVertical: Space.xs,
	},
	playerItemDisabled: {
		opacity: 0.6,
	},
	groupTab: {
		height: 120,
		alignSelf: "center",
		alignContent: "center",
		justifyContent: "center",
		paddingHorizontal: Space.md,
		paddingVertical: Space.sm,
		borderRadius: Shape.radiusMd,
		backgroundColor: Colors.surface.elevated,
		marginRight: Space.xs,
		borderWidth: 2,
		borderColor: "transparent",
	},
	groupTabActive: {
		backgroundColor: Colors.button.primary.background,
	},
	groupTabValid: {
		borderColor: Colors.status.success.background,
	},
	groupTabInvalid: {
		borderColor: Colors.status.error.background,
	},
	addGroupTab: {
		backgroundColor: Colors.surface.elevated,
		borderStyle: "dashed",
	},
	groupsScroll: {
		marginBottom: Space.sm,
		padding: Space.md,
	},
	footerRow: {
		position: "absolute",
		left: Space.lg,
		right: Space.lg,
		bottom: Space.lg,
		flexDirection: "row",
		gap: Space.sm,
		justifyContent: "space-between",
	},
	button: {
		marginTop: Space.md,
	},
	tieOption: {
		padding: Space.md,
		borderWidth: 1,
		borderColor: Colors.surface.border,
		borderRadius: Shape.radiusMd,
		marginBottom: Space.sm,
		backgroundColor: Colors.surface.elevated,
	},
	tieOptionSelected: {
		backgroundColor: Colors.button.primary.background,
		borderColor: Colors.button.primary.background,
	},
});
