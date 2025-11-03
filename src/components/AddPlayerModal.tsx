// src/components/AddPlayerModal.tsx
import React, { useState } from "react";
import { Modal, View, TextInput, StyleSheet, ScrollView } from "react-native";
import Text from "./Text";
import ActionButton from "./ActionButton";
import { Colors } from "../theme/tokens/colors";
import { Shape } from "../theme/tokens/shape";
import { usePlayerStore } from "../store";

type Props = {
	visible: boolean;
	onClose: () => void;
};

export default function AddPlayerModal({ visible, onClose }: Props) {
	const { addPlayer } = usePlayerStore();

	const [newPlayerNames, setNewPlayerNames] = useState("");

	const confirmAddPlayer = () => {
		const players = newPlayerNames
			.split("\n")
			.map((name) => name.trim())
			.filter(Boolean); // remove linhas vazias

		if (players.length === 0) return;

		players.forEach((name) => {
			addPlayer(name);
		});
		setNewPlayerNames("");
		onClose();
	};

	return (
		<Modal visible={visible} transparent animationType="fade">
			<View style={styles.overlay}>
				<View style={styles.content}>
					<Text weight="bold" size="lg" color={Colors.base.text}>
						Novo(s) jogador(es)
					</Text>

					<Text size="sm" color={Colors.base.text} style={{ marginTop: 5 }}>
						Digite um jogador por linha (ex: {"\n"}elias{"\n"}santos{"\n"}silva)
					</Text>

					<TextInput
						placeholder="Digite os nomes"
						value={newPlayerNames}
						onChangeText={setNewPlayerNames}
						style={[styles.input, { height: 120, textAlignVertical: "top" }]}
						multiline
					/>

					<View style={styles.actions}>
						<ActionButton
							label="Cancelar"
							onPress={onClose}
							variant="secondary"
							style={{ width: 125 }}
						/>
						<ActionButton
							label="Adicionar"
							onPress={confirmAddPlayer}
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
	},
	input: {
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#E0E0E0",
		borderRadius: Shape.radiusMd,
		paddingHorizontal: 12,
		paddingVertical: 10,
		fontSize: 16,
		marginTop: 15,
		marginBottom: 20,
	},
	actions: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
});
