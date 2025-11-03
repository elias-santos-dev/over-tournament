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

export default function GroupDetailsScreen() {
	const router = useRouter();
	const { tournamentId, groupId } = useLocalSearchParams();
	const { tournaments, updateMatchResult } = useTournamentStore();

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

	// Agora o group.matches já é Match[][] (rodadas)
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
		const statusColor = match.status === "finished" ? "#D4EDDA" : "#FFF3CD";

		const duoA = `${match.player1} + ${match.player2}`;
		const duoB = `${match.player3} + ${match.player4}`;

		let winnerText = "";
		if (match.status === "finished") {
			if (match.scoreA > match.scoreB) winnerText = duoA;
			else if (match.scoreB > match.scoreA) winnerText = duoB;
			else winnerText = "Empate";
		}

		return (
			<View style={[styles.matchCard, { backgroundColor: statusColor }]}>
				<Text size="md" weight="bold">
					{duoA} vs {duoB}
				</Text>

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
					<TouchableOpacity
						style={styles.saveButton}
						onPress={() => handleSaveScore(match)}
					>
						<Text size="sm" weight="bold" color="#fff">
							Salvar
						</Text>
					</TouchableOpacity>
				</View>

				{winnerText ? (
					<Text size="sm" color="#555">
						Vencedor: {winnerText}
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

			{/* Abas das rodadas */}
			<FlatList
				horizontal
				data={rounds}
				keyExtractor={(_, index) => index.toString()}
				renderItem={({ index }) => (
					<TouchableOpacity
						style={[
							styles.roundTab,
							activeRound === index && { backgroundColor: "#a3bfd4" },
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
			/>

			{/* Partidas da rodada ativa */}
			<FlatList
				data={rounds[activeRound]}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => renderMatch(item)}
				contentContainerStyle={{ paddingBottom: 80 }}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 20, backgroundColor: "#F8F8F8" },
	title: { marginBottom: 20 },
	roundTabs: { flexDirection: "row", marginBottom: 15 },
	roundTab: {
		paddingHorizontal: 15,
		paddingVertical: 8,
		borderRadius: Shape.radiusMd,
		backgroundColor: "#E0E0E0",
		marginRight: 8,
	},
	matchCard: {
		backgroundColor: "#FFF",
		padding: 15,
		borderRadius: Shape.radiusMd,
		borderWidth: 1,
		borderColor: "#E0E0E0",
		marginBottom: 12,
	},
	scoresRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
	scoreInput: {
		width: 50,
		height: 35,
		borderWidth: 1,
		borderColor: "#E0E0E0",
		borderRadius: Shape.radiusSm,
		paddingHorizontal: 8,
		marginRight: 5,
		textAlign: "center",
	},
	saveButton: {
		marginLeft: 10,
		backgroundColor: "#a3bfd4",
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: Shape.radiusSm,
	},
});
