import React, { useCallback } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Text from "../../components/Text";
import { useTournamentStore } from "../../store/useTournamentStore";
import { Colors } from "../../theme/tokens/colorsV2";
import { Space } from "../../theme/tokens/space";
import { Shape } from "../../theme/tokens/shape";
import type { Match, Tournament } from "../../core/tournament/types";

export default function GroupsScreen() {
	const router = useRouter();
	const { id } = useLocalSearchParams();
	const { tournaments } = useTournamentStore();

	const tournament = tournaments.find((t) => t.id === id);

	const handleGoToGroup = useCallback(
		(groupId: string) => {
			router.push(
				`/groups/GroupDetailsScreen?tournamentId=${tournament?.id}&groupId=${groupId}`,
			);
		},
		[router, tournament],
	);

	const renderGroup = useCallback(
		({
			item,
		}: {
			item: typeof tournament extends undefined
				? never
				: Tournament["groups"][0];
		}) => {
			if (!tournament) return null;

			const allMatches: Match[] = Array.isArray(item.matches[0])
				? (item.matches as Match[][]).flat()
				: (item.matches as unknown as Match[]);

			const totalMatches = allMatches.length;
			const playedMatches = allMatches.filter(
				(m) => m.status === "finished",
			).length;

			return (
				<TouchableOpacity
					style={styles.groupCard}
					activeOpacity={0.8}
					onPress={() => handleGoToGroup(item.id)}
				>
					<Text size="md" weight="bold" color={Colors.text.primary}>
						{item.name}
					</Text>
					<Text size="sm" color={Colors.text.secondary}>
						Partidas: {playedMatches}/{totalMatches} jogadas
					</Text>
					<Text size="sm" color={Colors.text.secondary}>
						Jogadores: {item.playerIds.length}
					</Text>
				</TouchableOpacity>
			);
		},
		[handleGoToGroup, tournament],
	);

	if (!tournament) {
		return (
			<View style={styles.centered}>
				<Text size="lg" weight="bold" color={Colors.text.primary}>
					Torneio não encontrado
				</Text>
				<Text size="sm" color={Colors.text.secondary}>
					Verifique se o link está correto.
				</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text
				size="xl"
				weight="bold"
				color={Colors.text.primary}
				style={styles.title}
			>
				{tournament.name} — Grupos
			</Text>

			<FlatList
				data={tournament.groups}
				keyExtractor={(item) => item.id}
				renderItem={renderGroup}
				ListEmptyComponent={() => (
					<Text
						size="md"
						color={Colors.text.secondary}
						style={{ textAlign: "center", marginTop: Space.xl }}
					>
						Nenhum grupo criado ainda.
					</Text>
				)}
				contentContainerStyle={{ paddingBottom: Space.xxl }}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: Space.lg,
		backgroundColor: Colors.surface.allwaysWhite,
	},
	centered: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.surface.background,
		padding: Space.lg,
	},
	title: {
		marginBottom: Space.md,
	},
	groupCard: {
		backgroundColor: Colors.card.background,
		borderRadius: Shape.radiusMd,
		padding: Space.md,
		marginBottom: Space.sm,
		borderWidth: 1,
		borderColor: Colors.surface.border,
		shadowColor: "#000",
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
});
