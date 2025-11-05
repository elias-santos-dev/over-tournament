// src/screens/CreateTournamentScreen.tsx
import React, { useState, useMemo } from "react";
import {
	View,
	TextInput,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	Alert,
	ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import Text from "../../components/Text";
import ActionButton from "../../components/ActionButton";
import { useTournamentStore } from "../../store/useTournamentStore";
import { usePlayerStore } from "../../store/usePlayerStore";
import { Shape } from "../../theme/tokens/shape";
import type { Tournament } from "../../store/types";
import AddPlayerModal from "../../components/AddPlayerModal";
import { Colors } from "../../theme/tokens/colors";
import { LinearGradient } from "expo-linear-gradient";
import { uuid } from "../../utils/uuid";
import { generateGroups } from "../../core/tournament/groupGenerator";
import type { Group } from "../../core/tournament/types";

type GroupDraft = {
	id: string;
	name: string;
	playerIds: string[];
};

export default function CreateTournamentScreen() {
	const router = useRouter();
	const { createTournament } = useTournamentStore();
	const { players } = usePlayerStore();

	const [step, setStep] = useState<1 | 2>(1);

	const [name, setName] = useState("");
	const [sport, setSport] = useState<Tournament["sport"]>(
		"Beach Tennis" as Tournament["sport"],
	);

	const [isAddModalVisible, setAddModalVisible] = useState(false);
	const [search, setSearch] = useState("");

	// grupos manuais
	const [groups, setGroups] = useState<GroupDraft[]>(() => [
		{ id: uuid(), name: "Grupo 1", playerIds: [] },
	]);
	const [activeGroupIndex, setActiveGroupIndex] = useState(0);

	// filtro jogadores
	const filteredPlayers = useMemo(() => {
		if (!search.trim()) return players;
		return players.filter((p) =>
			p.name.toLowerCase().includes(search.toLowerCase()),
		);
	}, [players, search]);

	// helpers de validação por grupo: mínimo 4 e par
	const isGroupValid = (g: GroupDraft) =>
		g.playerIds.length >= 4 && g.playerIds.length % 2 === 0;

	const allGroupsValid = groups.length > 0 && groups.every(isGroupValid);

	// toggle jogador no grupo ativo (remove de outros grupos)
	const togglePlayerInActiveGroup = (playerId: string) => {
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
				// remover de outros grupos para garantir exclusividade
				return { ...g, playerIds: g.playerIds.filter((id) => id !== playerId) };
			}),
		);
	};

	// adicionar novo grupo vazio
	const handleAddGroup = () => {
		setGroups((prev) => {
			const nextIndex = prev.length + 1;
			return [
				...prev,
				{ id: uuid(), name: `Grupo ${nextIndex}`, playerIds: [] },
			];
		});
		setActiveGroupIndex(groups.length); // ativa o novo grupo
	};

	// renomear grupo (simples) - opcional, aqui mantemos padrão "Grupo X"
	const handleRemoveGroup = (index: number) => {
		if (groups.length === 1) {
			Alert.alert("Atenção", "Deve existir ao menos um grupo.");
			return;
		}
		setGroups((prev) => {
			const next = prev.filter((_, i) => i !== index);
			// reindexar nomes
			return next.map((g, i) => ({ ...g, name: `Grupo ${i + 1}` }));
		});
		setActiveGroupIndex((old) => Math.max(0, Math.min(groups.length - 2, old)));
	};

	// avançar etapa 1 -> 2
	const handleNextStep = () => {
		if (!name.trim()) {
			Alert.alert("Atenção", "Dê um nome ao torneio.");
			return;
		}
		setStep(2);
	};

	// criar torneio: valida todos os grupos e chama createTournament com os grupos
	const handleCreateTournament = () => {
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
	};

	// Aux: checar em qual grupo está um jogador (retorna -1 se nenhum)
	const findGroupIndexOfPlayer = (playerId: string) => {
		return groups.findIndex((g) => g.playerIds.includes(playerId));
	};

	// Etapa 1: configuração básica
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

	// Etapa 2: montagem manual dos grupos
	const activeGroup = groups[activeGroupIndex];

	return (
		<View style={styles.container}>
			<AddPlayerModal
				visible={isAddModalVisible}
				onClose={() => setAddModalVisible(false)}
			/>

			<Text size="xl" weight="bold" style={styles.title}>
				Montar Grupos
			</Text>

			{/* abas de grupos + add/remove */}
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				style={{ marginBottom: 12 }}
			>
				{groups.map((g, idx) => {
					const valid = isGroupValid(g);
					return (
						<TouchableOpacity
							key={g.id}
							onPress={() => setActiveGroupIndex(idx)}
							style={[
								styles.groupTab,
								activeGroupIndex === idx && {
									backgroundColor: Colors.action.primary,
								},
								valid && { borderColor: Colors.status.success },
								!valid &&
									g.playerIds.length > 0 && {
										borderColor: Colors.status.error,
									},
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
							delayLongPress={400} // <- toque longo (~0.4s)
						>
							<Text
								size="sm"
								weight="bold"
								color={activeGroupIndex === idx ? "#fff" : "#333"}
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
				<ActionButton label="Add" onPress={() => setAddModalVisible(true)} />
			</View>

			<FlatList
				data={filteredPlayers}
				keyExtractor={(item) => item.id}
				contentContainerStyle={{ paddingBottom: 120 }}
				renderItem={({ item }) => {
					const assignedGroupIndex = findGroupIndexOfPlayer(item.id);
					const isInActive = assignedGroupIndex === activeGroupIndex;
					const isAssignedElsewhere =
						assignedGroupIndex !== -1 &&
						assignedGroupIndex !== activeGroupIndex;

					// botão de toggle: se estiver em outro grupo, ao clicar vai mover para o ativo
					return (
						<View>
							{isInActive ? (
								<LinearGradient
									colors={[Colors.action.secondary, Colors.action.primary]}
									start={{ x: 0, y: 0 }}
									end={{ x: 0.5, y: 1 }}
									style={styles.playerItem}
								>
									<TouchableOpacity
										onPress={() => togglePlayerInActiveGroup(item.id)}
									>
										<Text size="md" color={Colors.base.textSecundary}>
											{item.name}
										</Text>
									</TouchableOpacity>
								</LinearGradient>
							) : (
								<TouchableOpacity
									style={[
										styles.playerItem,
										isAssignedElsewhere && { opacity: 0.6 }, // visual para quem tá em outro grupo
									]}
									onPress={() => togglePlayerInActiveGroup(item.id)}
								>
									<Text size="md" color={Colors.base.text}>
										{item.name}
									</Text>
								</TouchableOpacity>
							)}
						</View>
					);
				}}
			/>

			<View style={styles.footerRow}>
				<ActionButton
					label="Criar torneio"
					onPress={handleCreateTournament}
					variant="primary"
					style={[styles.button]}
					disabled={!allGroupsValid}
				/>
				<ActionButton
					label="Voltar"
					onPress={() => setStep(1)}
					variant="secondary"
					style={styles.button}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#F8F8F8",
	},
	title: {
		marginBottom: 20,
	},
	input: {
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#E0E0E0",
		borderRadius: Shape.radiusMd,
		paddingHorizontal: 12,
		paddingVertical: 10,
		fontSize: 16,
		marginBottom: 10,
	},
	subtitle: {
		marginVertical: 8,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	searchInput: {
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#E0E0E0",
		borderRadius: Shape.radiusMd,
		paddingHorizontal: 12,
		paddingVertical: 10,
		fontSize: 16,
		marginBottom: 10,
		width: "80%",
	},
	playerItem: {
		backgroundColor: "#fff",
		padding: 12,
		borderRadius: Shape.radiusSm,
		borderWidth: 1,
		borderColor: "#E0E0E0",
		marginBottom: 8,
	},
	button: {
		marginTop: 12,
	},
	groupTab: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: Shape.radiusMd,
		backgroundColor: "#EDEDED",
		marginRight: 8,
		borderWidth: 2,
		borderColor: "transparent",
	},
	addGroupTab: {
		backgroundColor: "#FFF",
		borderStyle: "dashed",
	},
	footerRow: {
		position: "absolute",
		left: 20,
		right: 20,
		bottom: 20,
		flexDirection: "row",
		gap: 12,
		justifyContent: "space-between",
	},
});
