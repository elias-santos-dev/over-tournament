import { View, Text, Button } from "react-native";
import { usePlayerStore } from "../../store/usePlayerStore";
import { Link } from "expo-router";

export default function PlayersScreen() {
	const { players } = usePlayerStore();

	return (
		<View style={{ flex: 1, padding: 20 }}>
			<Text style={{ fontSize: 18, marginBottom: 16 }}>👥 Jogadores</Text>

			{players.length === 0 ? (
				<Text>Nenhum jogador cadastrado</Text>
			) : (
				players.map((p) => <Text key={p.id}>• {p.name}</Text>)
			)}

			<Link href="/" asChild>
				<Button title="Voltar" />
			</Link>
		</View>
	);
}
