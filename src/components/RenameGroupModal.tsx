import type React from "react";
import { useState, useEffect } from "react";
import {
	View,
	Modal,
	TextInput,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import Text from "./Text";
import ActionButton from "./ActionButton";
import { Colors } from "../theme/tokens/colorsV2";
import { Space } from "../theme/tokens/space";
import { Shape } from "../theme/tokens/shape";

interface RenameGroupModalProps {
	visible: boolean;
	currentName: string;
	onClose: () => void;
	onSave: (newName: string) => void;
}

const RenameGroupModal: React.FC<RenameGroupModalProps> = ({
	visible,
	currentName,
	onClose,
	onSave,
}) => {
	const [name, setName] = useState(currentName);

	useEffect(() => {
		if (visible) {
			setName(currentName);
		}
	}, [visible, currentName]);

	const handleSave = () => {
		if (name.trim()) {
			onSave(name.trim());
		}
	};

	return (
		<Modal
			transparent
			animationType="fade"
			visible={visible}
			onRequestClose={onClose}
		>
			<TouchableOpacity
				style={styles.overlay}
				activeOpacity={1}
				onPress={onClose}
			>
				<View style={styles.container} onStartShouldSetResponder={() => true}>
					<Text size="lg" weight="bold" style={styles.title}>
						Renomear Grupo
					</Text>
					<TextInput
						style={styles.input}
						value={name}
						onChangeText={setName}
						placeholder="Digite o novo nome"
						autoFocus
					/>
					<View style={styles.buttonRow}>
						<ActionButton
							label="Cancelar"
							onPress={onClose}
							variant="secondary"
						/>
						<ActionButton
							label="Salvar"
							onPress={handleSave}
							variant="primary"
						/>
					</View>
				</View>
			</TouchableOpacity>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
		padding: Space.lg,
	},
	container: {
		width: "100%",
		backgroundColor: Colors.surface.allwaysWhite,
		borderRadius: Shape.radiusLg,
		padding: Space.lg,
		gap: Space.md,
	},
	title: { color: Colors.text.primary },
	input: {
		borderWidth: 1,
		borderColor: Colors.surface.border,
		borderRadius: Shape.radiusMd,
		padding: Space.sm,
		fontSize: 16,
	},
	buttonRow: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: Space.sm,
	},
});

export default RenameGroupModal;
