// src/components/PlayerItem.tsx
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Text from "./Text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../theme/tokens/colors";

interface Props {
	name: string;
	selected?: boolean;
	editing?: boolean;
	onPress?: () => void;
	onEdit?: () => void;
	onDelete?: () => void;
}

export default function PlayerItem({
	name,
	selected,
	editing,
	onPress,
	onEdit,
	onDelete,
}: Props) {
	if (editing) {
		return (
			<View style={styles.editRow}>
				{/* Você pode inserir aqui o TextInput de edição */}
			</View>
		);
	}

	return (
		<TouchableOpacity
			style={[styles.row, selected && { backgroundColor: "#a3bfd4" }]}
			onPress={onPress}
		>
			<Text size="md" color={selected ? "#fff" : "#333"}>
				{name}
			</Text>
			<View style={styles.actions}>
				{onEdit && (
					<TouchableOpacity onPress={onEdit}>
						<MaterialCommunityIcons
							name="account-edit"
							size={24}
							color={Colors.iconsColor.primary}
						/>
					</TouchableOpacity>
				)}
				{onDelete && (
					<TouchableOpacity onPress={onDelete}>
						<MaterialCommunityIcons
							name="delete"
							size={24}
							color={Colors.iconsColor.primary}
						/>
					</TouchableOpacity>
				)}
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#fff",
		padding: 12,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#E0E0E0",
		marginBottom: 8,
	},
	actions: { flexDirection: "row", gap: 12 },
	editRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 12,
		borderRadius: 8,
		marginBottom: 8,
	},
});
