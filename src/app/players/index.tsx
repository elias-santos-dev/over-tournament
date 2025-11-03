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
import AddPlayerModal from "../../components/AddPlayerModal";
import DeletePlayerModal from "../../components/DeletePlayerModal";

export const options = { title: "Jogadores 🎾" };

const PAGE_SIZE = 10;

export default function PlayersScreen() {
	const { players, addPlayer, editPlayer, removePlayer } = usePlayerStore();

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingName, setEditingName] = useState("");
	const [isAddModalVisible, setAddModalVisible] = useState(false);
	const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
	const [playerToDelete, setPlayerToDelete] = useState<string>("");

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
					onPress={() => setAddModalVisible(true)}
					variant="primary"
					style={{ width: "100%" }}
				/>
			</View>

			{/* Modal Adicionar */}
			<AddPlayerModal
				visible={isAddModalVisible}
				onClose={() => setAddModalVisible(false)}
			/>

			{/* Modal de Exclusão */}
			<DeletePlayerModal
				playerId={playerToDelete}
				visible={isDeleteModalVisible}
				onClose={() => setDeleteModalVisible(false)}
				message="Tem certeza que deseja remover este jogador?"
			/>
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
