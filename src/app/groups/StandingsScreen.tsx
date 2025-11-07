import React, { useEffect, useMemo, useCallback } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Text from "../../components/Text";
import {
	type TournamentState,
	useTournamentStore,
} from "../../store/useTournamentStore";
import { usePlayerStore } from "../../store/usePlayerStore";
import { Colors } from "../../theme/tokens/colorsV2";
import { Space } from "../../theme/tokens/space";
import { Shape } from "../../theme/tokens/shape";
import type { PlayerStats } from "../../core/tournament/types";

export default function StandingsScreen() {
	const router = useRouter();
	const { tournamentId, groupId } = useLocalSearchParams() as {
		tournamentId?: string;
		groupId?: string;
	};

	const tournaments = useTournamentStore((s) => s.tournaments);
	const updateStandings = useTournamentStore(
		(s) => (s as TournamentState).updateStandings,
	);
	const players = usePlayerStore((s) => s.players);

	const tournament = useMemo(
		() => tournaments.find((t) => t.id === tournamentId),
		[tournaments, tournamentId],
	);

	const group = useMemo(
		() => tournament?.groups.find((g) => g.id === groupId),
		[tournament, groupId],
	);

	useEffect(() => {
		if (!group || !tournamentId) return;
		if (typeof updateStandings === "function") {
			updateStandings(group.id, tournamentId);
		}
	}, []);

	const standings: PlayerStats[] = useMemo(
		() => group?.standings ?? [],
		[group],
	);

	const getPlayerName = useCallback(
		(id?: string) => players.find((pl) => pl.id === id)?.name ?? "—",
		[players],
	);

	const renderEmpty = useCallback(
		() => (
			<View style={styles.centered}>
				<Text size="md" color={Colors.text.secondary}>
					Nenhuma classificação disponível — registre partidas primeiro.
				</Text>
			</View>
		),
		[],
	);

	if (!tournament || !group) {
		return (
			<View style={styles.container}>
				<View style={styles.centered}>
					<Text size="lg" weight="bold" color={Colors.text.primary}>
						Grupo não encontrado
					</Text>
					<Text size="sm" color={Colors.text.secondary}>
						Verifique se os parâmetros estão corretos.
					</Text>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text size="lg" weight="bold" color={Colors.text.primary}>
					{tournament.name} — {group.name}
				</Text>
			</View>

			<View style={styles.tableHeader}>
				<Text weight="bold" style={styles.colPlayer}>
					Jogador
				</Text>
				<Text weight="bold" style={styles.colSmall}>
					V
				</Text>
				<Text weight="bold" style={styles.colSmall}>
					D
				</Text>
				<Text weight="bold" style={styles.colSmall}>
					+
				</Text>
				<Text weight="bold" style={styles.colSmall}>
					-
				</Text>
				<Text weight="bold" style={styles.colSmall}>
					Dif
				</Text>
			</View>

			<FlatList
				data={standings}
				keyExtractor={(item) => item.playerId}
				contentContainerStyle={{ paddingBottom: Space.xxl }}
				ListEmptyComponent={renderEmpty}
				renderItem={({ item, index }) => {
					const podiumColor =
						index === 0
							? "#FFD700"
							: index === 1
								? "#C0C0C0"
								: index === 2
									? "#CD7F32"
									: undefined;

					return (
						<View
							style={[
								styles.row,
								index % 2 === 0 && styles.rowEven,
								podiumColor && { backgroundColor: podiumColor + "22" }, // leve transparência
							]}
						>
							<Text
								style={[styles.colRank, podiumColor && { color: podiumColor }]}
								accessibilityLabel={`Posição ${index + 1}`}
							>
								{index + 1}
							</Text>

							<View style={styles.colPlayer}>
								<Text
									weight="medium"
									color={podiumColor ?? Colors.text.primary}
								>
									{getPlayerName(item.playerId)}
								</Text>
							</View>

							<Text style={styles.colSmall}>{item.wins ?? 0}</Text>
							<Text style={styles.colSmall}>{item.losses ?? 0}</Text>
							<Text style={styles.colSmall}>{item.pointsFor ?? 0}</Text>
							<Text style={styles.colSmall}>{item.pointsAgainst ?? 0}</Text>
							<Text style={styles.colSmall}>{item.pointsDiff ?? 0}</Text>
						</View>
					);
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.surface.allwaysWhite,
	},
	header: {
		paddingTop: Space.lg,
		paddingBottom: Space.md,
		paddingHorizontal: Space.md,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		borderBottomWidth: 1,
		borderColor: Colors.surface.border,
	},
	tableHeader: {
		flexDirection: "row",
		paddingHorizontal: Space.md,
		paddingVertical: Space.sm,
		alignItems: "center",
		borderBottomWidth: 1,
		borderColor: Colors.surface.border,
		backgroundColor: Colors.surface.allwaysWhite,
	},
	row: {
		flexDirection: "row",
		paddingVertical: Space.sm,
		paddingHorizontal: Space.md,
		alignItems: "center",
	},
	rowEven: {
		backgroundColor: Colors.surface.background,
	},
	colRank: {
		width: 28,
		textAlign: "center",
		fontWeight: "700",
		color: Colors.text.primary,
	},
	colPlayer: {
		flex: 1,
		paddingHorizontal: Space.xs,
	},
	colSmall: {
		width: 48,
		textAlign: "center",
		color: Colors.text.primary,
	},
	centered: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: Space.lg,
	},
});
