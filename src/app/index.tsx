import { View, TouchableHighlight, Alert } from "react-native";
import { Colors } from "../theme/tokens/colors";
import { useTournamentStore } from "../store";
import CardTournament from "../components/CardTournament";
import Text from "../components/Text";
import ActionButton from "../components/ActionButton";

export default function HomeScreen() {
	const { tournaments, deleteTournament } = useTournamentStore();

	return (
		<View
			style={{ flex: 1, padding: 20, backgroundColor: Colors.base.background }}
		>
			<View style={{ flexDirection: "column", flex: 1 }}>
				{tournaments.map((tournament) => (
					<CardTournament
						key={tournament.id}
						tournament={tournament}
						onLongPress={() => {
							Alert.alert(
								"Remover torneio",
								`Deseja realmente remover o torneio ${tournament.name}?`,
								[
									{ text: "Cancelar", style: "cancel" },
									{
										text: "Remover",
										style: "destructive",
										onPress: () => deleteTournament(tournament.id),
									},
								],
							);
						}}
					/>
				))}
			</View>

			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-evenly",
					marginBottom: 15,
				}}
			>
				<ActionButton
					label={"Gerenciar Jogadores"}
					href={"/players"}
					variant="primary"
				/>

				<ActionButton
					label={"Criar Torneio"}
					href={"/tournament/create"}
					variant="secondary"
				/>
			</View>
		</View>
	);
}
