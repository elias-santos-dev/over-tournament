import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
	View,
	FlatList,
	TextInput,
	Modal,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { usePlayerStore } from "../../store/usePlayerStore";
import { Colors } from "../../theme/tokens/colors";
import ActionButton from "../../components/ActionButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Text from "../../components/Text";
import { LinearGradient } from "expo-linear-gradient";

export const options = { title: "Jogadores 🎾" };

const PAGE_SIZE = 10;

export default function PlayersScreen() {
	const { players, addPlayer, editPlayer, removePlayer } = usePlayerStore();

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingName, setEditingName] = useState("");
	const [isAddModalVisible, setAddModalVisible] = useState(false);
	const [newPlayerName, setNewPlayerName] = useState("");
	const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
	const [playerToDelete, setPlayerToDelete] = useState<string | null>(null);

	useEffect(() => setPage(1), []);

	const filteredPlayers = useMemo(() => {
		if (!search.trim()) return players;
		return players.filter((p) =>
			p.name.toLowerCase().includes(search.toLowerCase()),
		);
	}, [players, search]);

	const visiblePlayers = useMemo(() => {
		const end = page * PAGE_SIZE;
		return filteredPlayers.slice(0, end);
	}, [filteredPlayers, page]);

	const handleLoadMore = useCallback(() => {
		const maxPages = Math.ceil(filteredPlayers.length / PAGE_SIZE);
		if (page < maxPages) setPage((p) => p + 1);
	}, [filteredPlayers.length, page]);

	// === CRUD ===
	const handleAddPlayer = () => {
		setNewPlayerName("");
		setAddModalVisible(true);
	};

	const confirmAddPlayer = () => {
		if (newPlayerName.trim()) {
			addPlayer(newPlayerName.trim());
			setAddModalVisible(false);
			setNewPlayerName("");
		}
	};

	const handleEdit = (id: string, name: string) => {
		setEditingId(id);
		setEditingName(name);
	};

	const handleSaveEdit = () => {
		if (editingId && editingName.trim()) {
			editPlayer(editingId, editingName.trim());
			setEditingId(null);
			setEditingName("");
		}
	};

	const handleCancelEdit = () => {
		setEditingId(null);
		setEditingName("");
	};

	const handleDelete = (id: string) => {
		setPlayerToDelete(id);
		setDeleteModalVisible(true);
	};

	const confirmDelete = () => {
		if (playerToDelete) removePlayer(playerToDelete);
		setDeleteModalVisible(false);
		setPlayerToDelete(null);
	};

	// === Render ===
	const renderItem = ({ item }: { item: (typeof players)[number] }) => {
		if (editingId === item.id) {
			return (
				<LinearGradient
					colors={[Colors.action.secondary, Colors.action.primary]}
					start={{ x: 0, y: 0 }}
					end={{ x: 0.5, y: 1 }}
					style={editStyles.row}
				>
					<View style={editStyles.editContainer}>
						<TextInput
							style={editStyles.editInput}
							value={editingName}
							onChangeText={setEditingName}
							placeholder="Nome"
						/>
					</View>

					<View style={editStyles.actions}>
						<TouchableOpacity onPress={handleSaveEdit}>
							<MaterialCommunityIcons
								name="content-save"
								size={24}
								color={Colors.iconsColor.primary}
							/>
						</TouchableOpacity>
						<TouchableOpacity onPress={handleCancelEdit}>
							<MaterialCommunityIcons
								name="cancel"
								size={24}
								color={Colors.iconsColor.primary}
							/>
						</TouchableOpacity>
					</View>
				</LinearGradient>
			);
		}

		return (
			<LinearGradient
				colors={[Colors.action.secondary, Colors.action.primary]}
				start={{ x: 0, y: 0 }}
				end={{ x: 0.5, y: 1 }}
				style={styles.row}
			>
				<View style={styles.playerInfo}>
					<Text size="md" weight="bold" color={Colors.base.text}>
						{item.name}
					</Text>
				</View>

				<View style={styles.actions}>
					<TouchableOpacity onPress={() => handleEdit(item.id, item.name)}>
						<MaterialCommunityIcons
							name="account-edit"
							size={24}
							color={Colors.iconsColor.primary}
						/>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => handleDelete(item.id)}>
						<MaterialCommunityIcons
							name="delete"
							size={24}
							color={Colors.iconsColor.primary}
						/>
					</TouchableOpacity>
				</View>
			</LinearGradient>
		);
	};

	return (
		<View style={styles.container}>
			<TextInput
				placeholder="Buscar jogador..."
				value={search}
				onChangeText={setSearch}
				style={styles.search}
				placeholderTextColor="#666"
			/>

			<FlatList
				data={visiblePlayers}
				keyExtractor={(item) => item.id}
				renderItem={renderItem}
				style={styles.list}
				contentContainerStyle={{ paddingBottom: 24 }}
				onEndReached={handleLoadMore}
				onEndReachedThreshold={0.4}
				ListEmptyComponent={<Text>Nenhum jogador encontrado</Text>}
			/>

			<View style={styles.footer}>
				<ActionButton
					label="+ Adicionar Jogador"
					onPress={handleAddPlayer}
					variant="primary"
					style={{ width: "100%" }}
				/>
			</View>

			{/* Modal Adicionar */}
			<Modal visible={isAddModalVisible} transparent animationType="fade">
				<View style={addModalStyles.overlay}>
					<View style={addModalStyles.content}>
						<Text weight="bold" size="lg" color={Colors.base.text}>
							Novo jogador
						</Text>
						<TextInput
							placeholder="Digite o nome"
							value={newPlayerName}
							onChangeText={setNewPlayerName}
							style={addModalStyles.input}
						/>
						<View style={addModalStyles.actions}>
							<ActionButton
								label="Adicionar"
								onPress={confirmAddPlayer}
								variant="primary"
								style={{ width: 125 }}
							/>
							<ActionButton
								label="Cancelar"
								onPress={() => setAddModalVisible(false)}
								variant="secondary"
								style={{ width: 125 }}
							/>
						</View>
					</View>
				</View>
			</Modal>

			{/* Modal de Exclusão */}
			<Modal visible={isDeleteModalVisible} transparent animationType="fade">
				<View style={addModalStyles.overlay}>
					<View style={addModalStyles.content}>
						<MaterialCommunityIcons
							name="alert-circle-outline"
							size={48}
							color={Colors.iconsColor.primary}
							style={{ marginBottom: 8 }}
						/>
						<Text weight="bold" size="lg" color={Colors.base.text}>
							Remover jogador
						</Text>
						<Text style={{ textAlign: "center", marginBottom: 16 }}>
							Tem certeza que deseja remover este jogador?
						</Text>
						<View style={addModalStyles.actions}>
							<ActionButton
								label="Cancelar"
								onPress={() => setDeleteModalVisible(false)}
								variant="secondary"
								style={{ width: 125 }}
							/>
							<ActionButton
								label="Remover"
								onPress={confirmDelete}
								variant="primary"
								style={{ width: 125 }}
							/>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
}

// === Estilos gerais ===
const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, backgroundColor: Colors.base.background },
	search: {
		backgroundColor: "#fff",
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderColor: "#ddd",
		borderWidth: 1,
		marginBottom: 12,
	},
	list: { flex: 1 },
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		borderRadius: 12,
		paddingHorizontal: 15,
		paddingVertical: 12,
		marginBottom: 12,
	},
	playerInfo: { flexDirection: "row", alignItems: "center", flex: 4 },
	actions: { flexDirection: "row", alignItems: "center", gap: 16 },
	footer: { marginTop: 12 },
});

// === Estilos do modal de adição / exclusão ===
const addModalStyles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		alignItems: "center",
		justifyContent: "center",
		padding: 24,
	},
	content: {
		width: "100%",
		borderRadius: 16,
		backgroundColor: "#fff",
		padding: 20,
		alignItems: "center",
	},
	input: {
		backgroundColor: Colors.base.background,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: Colors.base.border,
		padding: 8,
		width: "100%",
		marginVertical: 12,
	},
	actions: {
		flexDirection: "row",
		gap: 12,
		justifyContent: "space-between",
		width: "100%",
	},
});

// === Estilos da edição inline ===
const editStyles = StyleSheet.create({
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		borderRadius: 12,
		paddingHorizontal: 15,
		paddingVertical: 12,
		marginBottom: 12,
	},
	editContainer: {
		flexDirection: "row",
		alignItems: "center",
		flex: 4,
		marginRight: 16,
	},
	editInput: {
		backgroundColor: Colors.base.background,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: Colors.base.border,
		padding: 8,
		width: "100%",
	},
	actions: {
		flexDirection: "row",
		alignItems: "center",
		gap: 16,
	},
});
