import React, { useEffect, useMemo, useCallback, type FC } from "react"; // ✅ Adicionado FC para tipagem do componente
import {
	View,
	FlatList,
	StyleSheet,
	type ListRenderItem,
	Share,
} from "react-native"; // ✅ Adicionado ListRenderItem
import { useLocalSearchParams } from "expo-router";
import Text from "../../components/Text";
import { useTournamentStore } from "../../store/useTournamentStore"; // ✅ Removido import não utilizado (TournamentState)
import { usePlayerStore } from "../../store/usePlayerStore";
import { Colors } from "../../theme/tokens/colorsV2";
import { Space } from "../../theme/tokens/space";
import ActionButton from "../../components/ActionButton";
import type { PlayerStats } from "../../core/tournament/types";

const StandingsScreen: FC = () => {
	const { tournamentId, groupId } = useLocalSearchParams() as {
		tournamentId?: string;
		groupId?: string;
	};

	const tournaments = useTournamentStore((s) => s.tournaments);
	const updateStandings = useTournamentStore(
		(s) => s.updateStandings, // ✅ Simplificada a seleção do estado
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
		updateStandings?.(group.id, tournamentId);
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

	// Função para identificar o critério de desempate entre dois jogadores
	const getTiebreak = (current: PlayerStats, previous?: PlayerStats) => {
		if (!previous) return "-";
		if (current.wins !== previous.wins) return "V"; // Vitórias
		if (
			(current.pointsFor ?? 0) - (current.pointsAgainst ?? 0) !==
			(previous.pointsFor ?? 0) - (previous.pointsAgainst ?? 0)
		)
			return "Dif"; // Saldo de games
		if (current.pointsFor !== previous.pointsFor) return "+"; // Games a favor
		return "CD"; // Confronto direto
	};

	const handleShare = async () => {
		if (!tournament || !group || !standings.length) return;

		let shareableText = `Classificação: ${tournament.name} — ${group.name}\n\n`;
		shareableText += "Pos | Jogador | V | D | + | - | Dif\n";
		shareableText += "-----------------------------------\n";

		standings.forEach((item, index) => {
			const playerName = getPlayerName(item.playerId);
			const pos = index + 1;
			const wins = item.wins ?? 0;
			const losses = item.losses ?? 0;
			const pointsFor = item.pointsFor ?? 0;
			const pointsAgainst = item.pointsAgainst ?? 0;
			const pointsDiff = item.pointsDiff ?? 0;

			shareableText += `${pos} | ${playerName} | ${wins} | ${losses} | ${pointsFor} | ${pointsAgainst} | ${pointsDiff}\n`;
		});

		try {
			await Share.share({
				title: `Classificação do ${group.name}`,
				message: shareableText,
			});
		} catch (error) {
			console.error("Erro ao compartilhar classificação", error);
		}
	};

	// ✅ Extraído o item da lista para um componente separado para melhor organização
	const renderStandingRow: ListRenderItem<PlayerStats> = useCallback(
		({ item, index }) => {
			const podiumColor =
				index === 0
					? PodiumColors.gold
					: index === 1
						? PodiumColors.silver
						: index === 2
							? PodiumColors.bronze
							: undefined;

			const tiebreak = getTiebreak(item, standings[index - 1]);
			const displayName =
				tiebreak !== "-"
					? `${getPlayerName(item.playerId)} — ${tiebreak}`
					: getPlayerName(item.playerId);

			return (
				<View
					style={[
						styles.row,
						index % 2 === 0 && styles.rowEven,
						// ✅ Aplicado token de cor para o pódio com opacidade
						podiumColor && { backgroundColor: podiumColor + "22" },
					]}
					// ✅ Adicionado testID e accessibilityLabel para melhor acessibilidade e testes
					testID={`standing-row-${index}`}
					accessibilityLabel={`Posição ${index + 1}, jogador ${displayName}`}
				>
					<Text
						style={[styles.colRank, podiumColor && { color: podiumColor }]}
						accessibilityLabel={`Posição ${index + 1}`}
					>
						{index + 1}
					</Text>

					<View style={styles.colPlayer}>
						<Text weight="medium" color={podiumColor ?? Colors.text.primary}>
							{displayName}
						</Text>
					</View>

					<Text style={styles.colSmall}>{item.wins ?? 0}</Text>
					<Text style={styles.colSmall}>{item.losses ?? 0}</Text>
					<Text style={styles.colSmall}>{item.pointsFor ?? 0}</Text>
					<Text style={styles.colSmall}>{item.pointsAgainst ?? 0}</Text>
					<Text style={styles.colSmall}>{item.pointsDiff ?? 0}</Text>
				</View>
			);
		},
		[standings, getPlayerName],
	);

	return (
		<View style={styles.container}>
			<View style={styles.screenHeader}>
				<Text
					size="lg"
					weight="bold"
					color={Colors.text.primary}
					style={styles.headerTitle}
				>
					{tournament.name} — {group.name}
				</Text>
				<ActionButton
					onPress={handleShare}
					icon="share-variant"
					variant="secondary"
				/>
			</View>

			<View style={styles.tableHeader}>
				<Text
					weight="bold"
					style={styles.colPlayer}
					color={Colors.text.primary}
				>
					Jogador
				</Text>
				<Text weight="bold" style={styles.colSmall} color={Colors.text.primary}>
					V
				</Text>
				<Text weight="bold" style={styles.colSmall} color={Colors.text.primary}>
					D
				</Text>
				<Text weight="bold" style={styles.colSmall} color={Colors.text.primary}>
					+
				</Text>
				<Text weight="bold" style={styles.colSmall} color={Colors.text.primary}>
					-
				</Text>
				<Text weight="bold" style={styles.colSmall} color={Colors.text.primary}>
					Dif
				</Text>
			</View>

			<FlatList
				data={standings}
				keyExtractor={(item) => item.playerId}
				renderItem={renderStandingRow}
				contentContainerStyle={{ paddingBottom: Space.xxl }}
				ListEmptyComponent={renderEmpty}
			/>
		</View>
	);
};

// ✅ Adicionadas constantes para cores do pódio para melhor legibilidade
const PodiumColors = {
	gold: "#FFD700",
	silver: "#C0C0C0",
	bronze: "#CD7F32",
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.surface.allwaysWhite,
	},
	// ✅ Renomeado para evitar conflito com tableHeader e ser mais descritivo
	screenHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingTop: Space.lg,
		paddingBottom: Space.md,
		paddingHorizontal: Space.md,
		borderBottomWidth: 1,
		borderColor: Colors.surface.border,
	},
	headerTitle: {
		flex: 1,
	},
	tableHeader: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: Space.md,
		paddingVertical: Space.sm,
		backgroundColor: Colors.surface.allwaysWhite,
		borderBottomWidth: 1,
		borderColor: Colors.surface.border,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: Space.md,
		paddingHorizontal: Space.md,
	},
	rowEven: {
		backgroundColor: Colors.surface.background,
	},
	colRank: {
		width: 28,
		textAlign: "center",
		color: Colors.text.primary,
		fontWeight: "700", // TODO: Substituir por token de peso de fonte se disponível (ex: Font.weight.bold)
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

export default StandingsScreen;
