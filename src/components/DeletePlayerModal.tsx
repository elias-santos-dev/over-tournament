// src/components/DeletePlayerModal.tsx
import React from "react";
import { Modal, View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Text from "./Text";
import ActionButton from "./ActionButton";
import { Colors } from "../theme/tokens/colors";
import { Shape } from "../theme/tokens/shape";
import { usePlayerStore } from "../store";

type Props = {
	playerId: string | null;
	visible: boolean;
	onClose: () => void;
	message?: string;
};

export default function DeletePlayerModal({
	playerId,
	visible,
	onClose,
	message = "Tem certeza que deseja remover este jogador?",
}: Props) {
	const { removePlayer } = usePlayerStore();

	const confirmDeletePlayer = () => {
		if (playerId) {
			removePlayer(playerId);
			onClose();
		}
	};
	return (
		<Modal visible={visible} transparent animationType="fade">
			<View style={styles.overlay}>
				<View style={styles.content}>
					<MaterialCommunityIcons
						name="alert-circle-outline"
						size={48}
						color={Colors.iconsColor.primary}
						style={{ marginBottom: 8 }}
					/>
					<Text weight="bold" size="lg" color={Colors.base.text}>
						Remover jogador
					</Text>
					<Text style={styles.message}>{message}</Text>

					<View style={styles.actions}>
						<ActionButton
							label="Cancelar"
							onPress={onClose}
							variant="secondary"
							style={{ width: 125 }}
						/>
						<ActionButton
							label="Remover"
							onPress={confirmDeletePlayer}
							variant="primary"
							style={{ width: 125 }}
						/>
					</View>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	content: {
		backgroundColor: "#fff",
		borderRadius: Shape.radiusLg,
		padding: 20,
		width: "90%",
		maxWidth: 400,
		alignItems: "center",
	},
	message: {
		textAlign: "center",
		marginBottom: 16,
	},
	actions: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
	},
});
