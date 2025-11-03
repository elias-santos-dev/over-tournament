// src/components/AppModal.tsx
import type React from "react";
import { View, Modal, StyleSheet } from "react-native";

interface Props {
	visible: boolean;
	children: React.ReactNode;
}

export default function AppModal({ visible, children }: Props) {
	return (
		<Modal visible={visible} transparent animationType="fade">
			<View style={styles.overlay}>
				<View style={styles.content}>{children}</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
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
});
