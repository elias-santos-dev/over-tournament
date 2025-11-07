import React, { useMemo, useState, useCallback } from "react";
import {
	View,
	FlatList,
	TextInput,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePlayerStore } from "../../store/usePlayerStore";
import { Colors } from "../../theme/tokens/colorsV2";
import Text from "../../components/Text";
import ActionButton from "../../components/ActionButton";
import AddPlayerModal from "../../components/AddPlayerModal";
import DeletePlayerModal from "../../components/DeletePlayerModal";
import type { Player } from "../../store/types";

const PAGE_SIZE = 10;

export default function PlayersScreen() {
	const { players, editPlayer } = usePlayerStore();
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingName, setEditingName] = useState("");
	const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
	const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
	const [isAddModalVisible, setAddModalVisible] = useState(false);

	const filteredPlayers = useMemo(() => {
		const filtered = players.filter((p) =>
			p.name.toLowerCase().includes(search.toLowerCase()),
		);
		return filtered.slice(0, page * PAGE_SIZE);
	}, [players, search, page]);

	const handleLoadMore = () => {
		setPage((prev) => prev + 1);
	};

	const handleEdit = useCallback((id: string, name: string) => {
		setEditingId(id);
		setEditingName(name);
	}, []);

	const handleSaveEdit = useCallback(() => {
		if (!editingId || !editingName.trim()) return;
		editPlayer(editingId, editingName.trim());
		setEditingId(null);
		setEditingName("");
	}, [editingId, editingName, editPlayer]);

	const handleCancelEdit = useCallback(() => {
		setEditingId(null);
		setEditingName("");
	}, []);

	const handleDelete = useCallback((id: string) => {
		setSelectedPlayerId(id);
		setDeleteModalVisible(true);
	}, []);

	const renderItem = useCallback(
		({ item }: { item: Player }) => (
			<PlayerRow
				item={item}
				editingId={editingId}
				editingName={editingName}
				onEdit={handleEdit}
				onSave={handleSaveEdit}
				onCancel={handleCancelEdit}
				onDelete={handleDelete}
				setEditingName={setEditingName}
			/>
		),
		[
			editingId,
			editingName,
			handleEdit,
			handleSaveEdit,
			handleCancelEdit,
			handleDelete,
		],
	);

	return (
		<SafeAreaView style={styles.container}>
			<TextInput
				style={styles.searchInput}
				placeholder="Buscar jogador..."
				value={search}
				onChangeText={setSearch}
			/>

			<FlatList
				data={filteredPlayers}
				keyExtractor={(item) => item.id}
				renderItem={renderItem}
				onEndReached={handleLoadMore}
				onEndReachedThreshold={0.3}
				contentContainerStyle={{ paddingBottom: 100 }}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<Text size="md" color={Colors.text.secondary}>
							Nenhum jogador encontrado
						</Text>
					</View>
				}
			/>

			<ActionButton
				label="Adicionar Jogador"
				onPress={() => setAddModalVisible(true)}
			/>

			<AddPlayerModal
				visible={isAddModalVisible}
				onClose={() => setAddModalVisible(false)}
			/>

			<DeletePlayerModal
				visible={isDeleteModalVisible}
				onClose={() => setDeleteModalVisible(false)}
				playerId={selectedPlayerId && ""}
			/>
		</SafeAreaView>
	);
}

const PlayerRow = React.memo(
	({
		item,
		editingId,
		editingName,
		onEdit,
		onSave,
		onCancel,
		onDelete,
		setEditingName,
	}: {
		item: Player;
		editingId: string | null;
		editingName: string;
		onEdit: (id: string, name: string) => void;
		onSave: () => void;
		onCancel: () => void;
		onDelete: (id: string) => void;
		setEditingName: (name: string) => void;
	}) => {
		const isEditing = editingId === item.id;

		return (
			<LinearGradient
				colors={
					isEditing
						? [Colors.action.primary, Colors.action.secondary]
						: [Colors.action.secondary, Colors.action.primary]
				}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={styles.playerContainer}
			>
				{isEditing ? (
					<View style={styles.playerRow}>
						<TextInput
							style={styles.editInput}
							value={editingName}
							onChangeText={setEditingName}
							autoFocus
							placeholder="Nome"
						/>
						<View style={styles.actions}>
							<TouchableOpacity onPress={onSave}>
								<Text size="md" weight="bold" color={Colors.text.primary}>
									Salvar
								</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={onCancel}>
								<Text size="md" weight="bold" color={Colors.text.primary}>
									Cancelar
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				) : (
					<View style={styles.playerRow}>
						<Text size="md" weight="bold" color={Colors.text.primary}>
							{item.name}
						</Text>
						<View style={styles.actions}>
							<TouchableOpacity onPress={() => onEdit(item.id, item.name)}>
								<Text size="md" weight="bold" color={Colors.text.primary}>
									Editar
								</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => onDelete(item.id)}>
								<Text size="md" weight="bold" color={Colors.text.secondary}>
									Excluir
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				)}
			</LinearGradient>
		);
	},
);

PlayerRow.displayName = "PlayerRow";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.surface.allwaysWhite,
		padding: 16,
	},
	searchInput: {
		borderRadius: 12,
		padding: 12,
		marginBottom: 12,
		borderColor: Colors.input.border,
		backgroundColor: Colors.input.background,
		borderWidth: 1,
	},
	playerContainer: {
		borderRadius: 12,
		marginBottom: 10,
		padding: 15,
		paddingVertical: 15,
	},
	playerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	editContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	editInput: {
		flex: 1,
		backgroundColor: Colors.input.background,
		borderWidth: 1,
		borderColor: Colors.input.border,

		borderRadius: 8,
		padding: 8,
		marginRight: 15,
		color: Colors.text.primary,
	},
	actions: {
		flexDirection: "row",
		gap: 16,
	},
	emptyContainer: {
		alignItems: "center",
		marginTop: 40,
	},
});
