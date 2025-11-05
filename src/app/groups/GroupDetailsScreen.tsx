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
import { Colors } from "../../theme/tokens/colors";
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
				<Text size="lg" weight="bold">
					Grupo ou torneio não encontrado
				</Text>
			</View>
		);
	}

	const rounds = group.matches as Match[][];

	const handleSaveScore = (match: Match) => {
		const matchScore = scores[match.id];
		if (!matchScore?.scoreA || !matchScore?.scoreB) return;

		updateMatchResult(
			tournament.id,
			group.id,
			match.id,
			Number(matchScore.scoreA),
			Number(matchScore.scoreB),
		);
	};

	const renderMatch = (match: Match) => {
		const statusColor =
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
			<View style={[styles.matchCard, { backgroundColor: statusColor }]}>
				<View
					style={{
						alignItems: "center",
						flexDirection: "row",
						justifyContent: "center",
						gap: 10,
					}}
				>
					<Text
						size="md"
						weight="bold"
						style={winnerText === duoA ? styles.winnerStyle : {}}
					>
						{duoA}
					</Text>
					<Text size="md" weight="bold">
						vs
					</Text>
					<Text
						size="md"
						weight="bold"
						style={winnerText === duoB ? styles.winnerStyle : {}}
					>
						{duoB}
					</Text>
				</View>

				<View style={styles.scoresRow}>
					<TextInput
						style={styles.scoreInput}
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

					<Text size="md" weight="bold">
						x
					</Text>

					<TextInput
						style={styles.scoreInput}
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
					<Text size="md" color="#555" weight="bold" style={styles.winnerStyle}>
						Vencedores: {winnerText}
					</Text>
				) : null}
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<Text size="xl" weight="bold" style={styles.title}>
				{tournament.name} - {group.name}
			</Text>
			<View>
				{/* Abas das rodadas */}
				<FlatList
					horizontal
					data={rounds}
					keyExtractor={(_, index) => index.toString()}
					renderItem={({ index }) => (
						<TouchableOpacity
							style={[
								styles.roundTab,
								activeRound === index
									? { backgroundColor: Colors.action.primary }
									: { backgroundColor: Colors.action.secondary, opacity: 0.5 },
							]}
							onPress={() => setActiveRound(index)}
						>
							<Text
								size="sm"
								weight="bold"
								color={activeRound === index ? "#fff" : "#333"}
							>
								Rodada {index + 1}
							</Text>
						</TouchableOpacity>
					)}
					style={styles.roundTabs}
					showsHorizontalScrollIndicator={false}
				/>

				{/* Partidas da rodada ativa */}
				<FlatList
					data={rounds[activeRound]}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => renderMatch(item)}
					contentContainerStyle={{ paddingBottom: 80 }}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: Colors.base.background,
	},
	title: { marginBottom: 20 },
	roundTabs: { flexDirection: "row", marginBottom: 15 },
	roundTab: {
		marginRight: 10,
		paddingHorizontal: 15,
		paddingVertical: 8,
		borderRadius: Shape.radiusMd,
		backgroundColor: Colors.base.background,
		height: 150,
	},
	matchCard: {
		backgroundColor: "#FFF",
		padding: 15,
		gap: 10,
		borderRadius: Shape.radiusMd,
		borderWidth: 1,
		borderColor: "#E0E0E0",
		marginBottom: 12,
	},
	scoresRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 10,
		gap: 20,
	},
	scoreInput: {
		width: 40,
		height: 40,
		borderWidth: 1,
		borderRadius: Shape.radiusSm,
		paddingHorizontal: 2,
		textAlign: "center",
	},
	saveButton: {
		marginLeft: 10,
		backgroundColor: "#a3bfd4",
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: Shape.radiusSm,
	},
	winnerStyle: {
		textShadowColor: Colors.accent.primary,
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 3,
	},
});
