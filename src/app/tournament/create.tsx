// src/screens/CreateTournamentScreen.tsx
import React, { useState, useMemo } from "react";
import {
	View,
	TextInput,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	Alert,
} from "react-native";
import { useRouter } from "expo-router";
import Text from "../../components/Text";
import ActionButton from "../../components/ActionButton";
import { useTournamentStore } from "../../store/useTournamentStore";
import { usePlayerStore } from "../../store/usePlayerStore";
import { Shape } from "../../theme/tokens/shape";
import type { Tournament } from "../../store/types";
import AddPlayerModal from "../../components/AddPlayerModal";
import { Colors } from "../../theme/tokens/colors";
import { LinearGradient } from "expo-linear-gradient";

export default function CreateTournamentScreen() {
	const router = useRouter();
	const { createTournament } = useTournamentStore();
	const { players } = usePlayerStore();

	const [name, setName] = useState("");
	const [sport, setSport] = useState<Tournament["sport"]>(
		"Beach Tennis" as Tournament["sport"],
	);
	const [isAddModalVisible, setAddModalVisible] = useState(false);

	const [groups, setGroups] = useState(1);
	const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
	const [search, setSearch] = useState("");

	const handleSelectPlayer = (id: string) => {
		setSelectedPlayers((prev) =>
			prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id],
		);
	};

	const handleCreateTournament = () => {
		if (!name.trim()) {
			Alert.alert("Atenção", "Dê um nome ao torneio.");
			return;
		}

		if (isInvalid) {
			Alert.alert(
				"Atenção",
				`Selecione um número válido de jogadores (mínimo ${minRequired}).`,
			);
			return;
		}

		createTournament(name, sport, selectedPlayers, groups);
		router.canGoBack() ? router.back() : router.replace("home");
	};

	// --- Lógica de mínimo dinâmico ---
	const minRequired = (() => {
		if (selectedPlayers.length <= 4) return 4;
		return selectedPlayers.length % 2 === 0
			? selectedPlayers.length
			: selectedPlayers.length + 1;
	})();

	const isInvalid =
		selectedPlayers.length < 4 || selectedPlayers.length % 2 !== 0;

	const filteredPlayers = useMemo(() => {
		if (!search.trim()) return players;
		return players.filter((p) =>
			p.name.toLowerCase().includes(search.toLowerCase()),
		);
	}, [players, search]);

	return (
		<View style={styles.container}>
			<AddPlayerModal
				visible={isAddModalVisible}
				onClose={() => setAddModalVisible(false)}
			/>

			<Text size="xl" weight="bold" style={styles.title}>
				Novo Torneio
			</Text>

			<TextInput
				style={styles.input}
				placeholder="Nome do torneio"
				value={name}
				onChangeText={setName}
			/>

			<TextInput
				style={styles.input}
				placeholder="Esporte"
				value={sport}
				editable={false}
			/>

			<View style={styles.row}>
				<View style={styles.column}>
					<Text size="sm" weight="bold">
						Nº de grupos
					</Text>
					<TextInput
						style={styles.inputSmall}
						keyboardType="numeric"
						value={groups.toString()}
						onChangeText={(text) => setGroups(Number(text) || 1)}
					/>
				</View>
			</View>

			<Text
				size="md"
				weight="bold"
				style={[
					styles.subtitle,
					isInvalid && selectedPlayers.length > 0
						? { color: Colors.status.error }
						: selectedPlayers.length >= minRequired
							? { color: Colors.status.success }
							: {},
				]}
			>
				Selecione os jogadores ({selectedPlayers.length}/{minRequired})
			</Text>
			<View style={styles.row}>
				<TextInput
					style={styles.searchInput}
					placeholder="Buscar jogador..."
					value={search}
					onChangeText={setSearch}
				/>
				<ActionButton label="Add" onPress={() => setAddModalVisible(true)} />
			</View>

			<FlatList
				data={filteredPlayers}
				keyExtractor={(item) => item.id}
				contentContainerStyle={{ paddingBottom: 100 }}
				renderItem={({ item }) => {
					const isSelected = selectedPlayers.includes(item.id);
					return (
						<View>
							{isSelected ? (
								<LinearGradient
									colors={[Colors.action.secondary, Colors.action.primary]}
									start={{ x: 0, y: 0 }}
									end={{ x: 0.5, y: 1 }}
									style={styles.playerItem}
								>
									<TouchableOpacity onPress={() => handleSelectPlayer(item.id)}>
										<Text size="md" color={Colors.base.textSecundary}>
											{item.name}
										</Text>
									</TouchableOpacity>
								</LinearGradient>
							) : (
								<TouchableOpacity
									style={styles.playerItem}
									onPress={() => handleSelectPlayer(item.id)}
								>
									<Text size="md" color={Colors.base.text}>
										{item.name}
									</Text>
								</TouchableOpacity>
							)}
						</View>
					);
				}}
			/>

			<ActionButton
				label="Criar torneio"
				onPress={handleCreateTournament}
				variant="primary"
				style={styles.button}
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
	input: {
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#E0E0E0",
		borderRadius: Shape.radiusMd,
		paddingHorizontal: 12,
		paddingVertical: 10,
		fontSize: 16,
		marginBottom: 10,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	column: {
		flex: 1,
		marginRight: 8,
	},
	inputSmall: {
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#E0E0E0",
		borderRadius: Shape.radiusMd,
		paddingHorizontal: 12,
		paddingVertical: 10,
		fontSize: 16,
		marginTop: 5,
	},
	subtitle: {
		marginVertical: 15,
	},
	searchInput: {
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#E0E0E0",
		borderRadius: Shape.radiusMd,
		paddingHorizontal: 12,
		paddingVertical: 10,
		fontSize: 16,
		marginBottom: 10,
		width: "80%",
	},
	playerItem: {
		backgroundColor: "#fff",
		padding: 12,
		borderRadius: Shape.radiusSm,
		borderWidth: 1,
		borderColor: "#E0E0E0",
		marginBottom: 8,
	},
	button: {
		marginTop: 20,
	},
});
