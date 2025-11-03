import React from "react";
import { View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Text from "../../components/Text";
import { useTournamentStore } from "../../store/useTournamentStore";
import { Shape } from "../../theme/tokens/shape";

export default function GroupsScreen() {
	const router = useRouter();
	const { id } = useLocalSearchParams();
	const { tournaments } = useTournamentStore();

	const tournament = tournaments.find((t) => t.id === id);

	if (!tournament) {
		return (
			<View style={styles.container}>
				<Text size="lg" weight="bold">
					Torneio não encontrado
				</Text>
			</View>
		);
	}

	const handleGoToGroup = (groupId: string) => {
		router.push(
			`/groups/GroupDetailsScreen?tournamentId=${tournament.id}&groupId=${groupId}`,
		);
	};

	const renderGroup = ({ item }: { item: (typeof tournament.groups)[0] }) => {
		const totalMatches = item.matches.length;
		const playedMatches = item.matches.filter(
			(m) => m.status === "finished",
		).length;

		return (
			<TouchableOpacity
				style={styles.groupCard}
				onPress={() => handleGoToGroup(item.id)}
			>
				<Text size="md" weight="bold">
					{item.name}
				</Text>
				<Text size="sm" color="#555">
					Partidas: {playedMatches}/{totalMatches} jogadas
				</Text>
				<Text size="sm" color="#555">
					Jogadores: {item.playerIds.length}
				</Text>
			</TouchableOpacity>
		);
	};

	return (
		<View style={styles.container}>
			<Text size="xl" weight="bold" style={styles.title}>
				{tournament.name} - Grupos
			</Text>

			<FlatList
				data={tournament.groups}
				keyExtractor={(item) => item.id}
				renderItem={renderGroup}
				contentContainerStyle={{ paddingBottom: 80 }}
			/>
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
	groupCard: {
		backgroundColor: "#fff",
		borderRadius: Shape.radiusMd,
		padding: 15,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "#E0E0E0",
	},
});
