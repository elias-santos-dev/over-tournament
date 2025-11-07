import type React from "react";
import { Modal, View, StyleSheet } from "react-native";
import { Shape } from "../theme/tokens/shape";
import { Colors } from "../theme/tokens/colorsV2";
import Text from "./Text";
import ActionButton from "./ActionButton";

type Props = {
	visible: boolean;
	children?: React.ReactNode;
	title?: string;
	message?: string | React.ReactNode;
	confirmLabel?: string;
	cancelLabel?: string;
	onConfirm: () => void;
	onCancel: () => void;
	icon?: React.ReactNode;
};

export default function ConfirmModal({
	visible,
	children,
	title = "Confirmação",
	message,
	confirmLabel = "Confirmar",
	cancelLabel = "Cancelar",
	onConfirm,
	onCancel,
	icon,
}: Props) {
	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onCancel}
		>
			<View style={styles.overlay}>
				<View style={styles.content}>
					{icon && <View style={styles.icon}>{icon}</View>}
					<Text weight="bold" size="lg" color={Colors.text.primary}>
						{title}
					</Text>

					{message &&
						(typeof message === "string" ? (
							<Text style={styles.message}>{message}</Text>
						) : (
							message
						))}

					<View style={{ width: "100%" }}>{children}</View>

					<View style={styles.actions}>
						<ActionButton
							label={cancelLabel}
							onPress={onCancel}
							variant="secondary"
							style={{ flex: 1, marginRight: 8, height: 45 }}
						/>
						<ActionButton
							label={confirmLabel}
							onPress={onConfirm}
							variant="primary"
							style={{ flex: 1, marginLeft: 8 }}
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
		backgroundColor: Colors.surface.allwaysWhite,
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
		marginTop: 10,
	},
	icon: {
		marginBottom: 8,
	},
});
