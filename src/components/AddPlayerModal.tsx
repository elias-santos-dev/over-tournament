// src/components/AddPlayerModal.tsx
import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Text from "./Text";
import ActionButton from "./ActionButton";
import Modal from "./Modal";
import { Colors } from "../theme/tokens/colorsV2";
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
			.trim()
			.split(/\n+/)
			.map((name) => name.trim())
			.filter(Boolean);

		if (players.length === 0) return;

		players.forEach((name) => {
			addPlayer(name);
		});
		setNewPlayerNames("");
		onClose();
	};

	return (
		<Modal
			visible={visible}
			onCancel={onClose}
			onConfirm={confirmAddPlayer}
			title="Novo(s) jogador(es)"
		>
			<View>
				<Text
					size="sm"
					color={Colors.text.secondary}
					style={{ marginBottom: 10 }}
				>
					Digite um jogador por linha (ex: {"\n"}elias{"\n"}santos{"\n"}silva)
				</Text>

				<TextInput
					placeholder="Digite os nomes"
					placeholderTextColor={Colors.text.primary}
					value={newPlayerNames}
					onChangeText={setNewPlayerNames}
					style={styles.input}
					multiline
					autoFocus
				/>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	input: {
		backgroundColor: Colors.surface.allwaysWhite,
		borderWidth: 1,
		borderColor: Colors.surface.border,
		borderRadius: Shape.radiusMd,
		paddingHorizontal: 12,
		paddingVertical: 10,
		fontSize: 16,
		height: 120,
		textAlignVertical: "top",
		marginBottom: 16,
	},
	actions: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
});
