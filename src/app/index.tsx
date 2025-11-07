import type React from "react";
import { useCallback } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { Colors } from "../theme/tokens/colorsV2";
import { Space } from "../theme/tokens/space";
import { useTournamentStore } from "../store";
import CardTournament from "../components/CardTournament";
import ActionButton from "../components/ActionButton";
import Text from "../components/Text"; // mantido (mesmo que não usado agora)

// ✅ Tipagem explícita opcional — define tipo se já existir no projeto
// import { Tournament } from "../types";

const HomeScreen: React.FC = () => {
	const { tournaments, deleteTournament } = useTournamentStore();

	// ✅ Callback memorizado para evitar recriação inline
	const handleDeleteTournament = useCallback(
		(id: string, name: string) => {
			Alert.alert(
				"Remover torneio",
				`Deseja realmente remover o torneio ${name}?`,
				[
					{ text: "Cancelar", style: "cancel" },
					{
						text: "Remover",
						style: "destructive",
						onPress: () => deleteTournament(id),
					},
				],
			);
		},
		[deleteTournament],
	);

	return (
		<View style={styles.container}>
			<View style={styles.tournamentList}>
				{tournaments.map((tournament) => (
					<CardTournament
						key={tournament.id}
						tournament={tournament}
						onLongPress={() =>
							handleDeleteTournament(tournament.id, tournament.name)
						}
						testID={`tournament-${tournament.id}`}
					/>
				))}
			</View>

			<View style={styles.actionsContainer}>
				<ActionButton
					label="Gerenciar Jogadores"
					href="/players"
					variant="primary"
					testID="button-manage-players"
					accessibilityLabel="Gerenciar jogadores"
				/>

				<ActionButton
					label="Criar Torneio"
					href="/tournament/create"
					variant="secondary"
					testID="button-create-tournament"
					accessibilityLabel="Criar novo torneio"
				/>
			</View>
		</View>
	);
};

export default HomeScreen;

/* ===========================
   Styles usando design tokens
   =========================== */
const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: Space.lg, // ✅ token de espaçamento
		backgroundColor: Colors.surface.allwaysWhite, // ✅ token de cor base de fundo
	},
	tournamentList: {
		flex: 1,
		flexDirection: "column",
	},
	actionsContainer: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		marginBottom: Space.md, // ✅ token de espaçamento
	},
});
