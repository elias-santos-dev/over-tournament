import { View, Text, Button, FlatList } from "react-native";
import { Link, router } from "expo-router";
import { usePlayerStore, useTournamentStore } from "../../store";

export default function CreateTournamentScreen() {
  const { players } = usePlayerStore();
  const { createTournament } = useTournamentStore();

  const handleCreateTournament = () => {
    if (players.length === 0) return;

    const playerIds = players.map((p) => p.id);
    createTournament("Primavera", "beach_tennis", playerIds, 1);

    router.push("/"); // volta pra home
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 16 }}>🏆 Criar Torneio</Text>

      <Text style={{ marginBottom: 8 }}>Jogadores disponíveis:</Text>
      <FlatList
        data={players}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text>• {item.name}</Text>}
      />

      <Button title="Criar Torneio" onPress={handleCreateTournament} />

      <Link href="/" asChild>
        <Button title="Voltar" />
      </Link>
    </View>
  );
}
