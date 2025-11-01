import { View, TouchableHighlight } from "react-native";
import { Link } from "expo-router";
import { Colors } from "../theme/tokens/colors";
import { useTournamentStore } from "../store";

import { Shape } from "../theme/tokens/shape";
import CardTournament from "../components/CardTournament";
import Text from "../components/Text";
import ActionButton from "../components/ActionButton";

export default function HomeScreen() {
	const { tournaments } = useTournamentStore();

	return (
		<View
			style={{ flex: 1, padding: 20, backgroundColor: Colors.base.background }}
		>
			<View style={{ flexDirection: "column", flex: 1 }}>
				{tournaments.map((tournament) => (
					<CardTournament key={tournament.id} tournament={tournament} />
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
