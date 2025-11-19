import React, { useState } from "react";
import {
	View,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	TextInput,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Text from "../../components/Text";
import { useTournamentStore } from "../../store/useTournamentStore";
import { Shape } from "../../theme/tokens/shape";
import type { Match } from "../../core/tournament/types";
import { usePlayerStore } from "../../store";
import { Colors } from "../../theme/tokens/colorsV2";
import ActionButton from "../../components/ActionButton";

export default function GroupDetailsScreen() {
	const router = useRouter();
	const { tournamentId, groupId } = useLocalSearchParams();
	const { tournaments, updateMatchResult } = useTournamentStore();
	const { getPlayer } = usePlayerStore();

	const tournament = tournaments.find((t) => t.id === tournamentId);
	const group = tournament?.groups.find((g) => g.id === groupId);

	const [activeRound, setActiveRound] = useState(0);
	const [scores, setScores] = useState<{
		[matchId: string]: { scoreA?: string; scoreB?: string };
	}>({});

	if (!tournament || !group) {
		return (
			<View style={styles.container}>
				<Text size="lg" weight="bold" color={Colors.text.primary}>
					Grupo ou torneio não encontrado
				</Text>
			</View>
		);
	}

	const rounds = group.matches as Match[][];

	const handleSaveScore = (match: Match) => {
		const matchScore = scores[match.id];
		if (!matchScore?.scoreA && !matchScore?.scoreB) return;

		updateMatchResult(
			tournament.id,
			group.id,
			match.id,
			matchScore.scoreA !== undefined ? Number(matchScore.scoreA) : 0,
			matchScore.scoreB !== undefined ? Number(matchScore.scoreB) : 0,
		);
	};

	const renderMatch = (match: Match) => {
		const statusColors =
			match.status === "finished"
				? Colors.status.success
				: Colors.status.warning;

		const duoA = `${getPlayer(match.player1)?.name} + ${getPlayer(match.player2)?.name}`;
		const duoB = `${getPlayer(match.player3)?.name} + ${getPlayer(match.player4)?.name}`;

		let winnerText = "";
		if (match.status === "finished") {
			if (match.scoreA > match.scoreB) winnerText = duoA;
			else if (match.scoreB > match.scoreA) winnerText = duoB;
			else winnerText = "Empate";
		}

		return (
			<View
				style={[
					styles.matchCard,
					{
						borderColor: Colors.card.border,
						backgroundColor: Colors.card.background,
						shadowColor: Colors.card.shadow,
					},
				]}
			>
				<View style={styles.teamsRow}>
					<Text
						size="md"
						weight="bold"
						style={winnerText === duoA ? styles.winnerStyle : undefined}
						color={Colors.text.primary}
					>
						{duoA}
					</Text>
					<Text size="md" weight="bold" color={Colors.text.secondary}>
						vs
					</Text>
					<Text
						size="md"
						weight="bold"
						style={winnerText === duoB ? styles.winnerStyle : undefined}
						color={Colors.text.primary}
					>
						{duoB}
					</Text>
				</View>

				<View style={styles.scoresRow}>
					<TextInput
						style={[
							styles.scoreInput,
							{
								backgroundColor: Colors.input.background,
								borderColor: Colors.input.border,
								color: Colors.input.text,
							},
						]}
						placeholder="-"
						placeholderTextColor={Colors.input.placeholder}
						keyboardType="numeric"
						value={
							scores[match.id]?.scoreA ??
							(match.scoreA !== undefined ? match.scoreA.toString() : "")
						}
						onChangeText={(text) =>
							setScores((prev) => ({
								...prev,
								[match.id]: { ...prev[match.id], scoreA: text },
							}))
						}
					/>

					<Text size="md" weight="bold" color={Colors.text.primary}>
						x
					</Text>

					<TextInput
						style={[
							styles.scoreInput,
							{
								backgroundColor: Colors.input.background,
								borderColor: Colors.input.border,
								color: Colors.input.text,
							},
						]}
						placeholder="-"
						placeholderTextColor={Colors.input.placeholder}
						keyboardType="numeric"
						value={
							scores[match.id]?.scoreB ??
							(match.scoreB !== undefined ? match.scoreB.toString() : "")
						}
						onChangeText={(text) =>
							setScores((prev) => ({
								...prev,
								[match.id]: { ...prev[match.id], scoreB: text },
							}))
						}
					/>
				</View>

				<ActionButton
					label="Salvar"
					onPress={() => handleSaveScore(match)}
					variant="primary"
				/>

				{winnerText ? (
					<View
						style={[
							styles.winnerBanner,
							{ backgroundColor: statusColors.background },
						]}
					>
						<Text
							size="sm"
							weight="bold"
							color={statusColors.text}
							style={{ textAlign: "center" }}
						>
							Vencedores: {winnerText}
						</Text>
					</View>
				) : null}
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<Text
				size="xl"
				weight="bold"
				style={styles.title}
				color={Colors.text.primary}
			>
				{tournament.name} - {group.name}
			</Text>
			<View style={{ flex: 1 }}>
				{/* Tabs das rodadas */}
				<FlatList
					horizontal
					data={rounds}
					keyExtractor={(_, index) => index.toString()}
					renderItem={({ index }) => (
						<TouchableOpacity
							style={[
								styles.roundTab,
								activeRound === index
									? { backgroundColor: Colors.primary.main }
									: { backgroundColor: Colors.secondary.main, opacity: 0.7 },
							]}
							onPress={() => setActiveRound(index)}
						>
							<Text
								size="sm"
								weight="bold"
								color={
									activeRound === index
										? Colors.primary.onPrimary
										: Colors.secondary.onSecondary
								}
							>
								Rodada {index + 1}
							</Text>
						</TouchableOpacity>
					)}
					style={styles.roundTabs}
					showsHorizontalScrollIndicator={false}
				/>

				{/* Lista de partidas */}
				<FlatList
					data={rounds[activeRound]}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => renderMatch(item)}
					contentContainerStyle={{ paddingBottom: 80 }}
				/>

				<ActionButton
					href={`groups/StandingsScreen?tournamentId=${tournamentId}&groupId=${groupId}`}
					label="Ver Classificação"
					variant="primary"
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: Colors.surface.allwaysWhite,
	},
	title: {
		marginBottom: 20,
	},
	roundTabs: {
		flexDirection: "row",
		marginBottom: 15,
	},
	roundTab: {
		flex: 1,
		height: 60,
		marginRight: 10,
		paddingHorizontal: 15,
		paddingVertical: 8,
		borderRadius: Shape.radiusMd,
		justifyContent: "center",
	},
	matchCard: {
		padding: 15,
		gap: 10,
		borderWidth: 1,
		borderRadius: Shape.radiusMd,
		marginBottom: 12,
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 2,
	},
	teamsRow: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "center",
		gap: 10,
	},
	scoresRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 10,
		gap: 20,
	},
	scoreInput: {
		width: 50,
		height: 40,
		borderWidth: 1,
		borderRadius: Shape.radiusSm,
		textAlign: "center",
		fontSize: 16,
	},
	winnerBanner: {
		marginTop: 10,
		padding: 6,
		borderRadius: Shape.radiusSm,
	},
	winnerStyle: {
		textShadowColor: Colors.accent.dark,
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 3,
	},
});
