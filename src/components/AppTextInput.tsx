// src/components/AppTextInput.tsx
import React from "react";
import { TextInput, StyleSheet, type TextInputProps } from "react-native";
import { Shape } from "../theme/tokens/shape";

export default function AppTextInput(props: TextInputProps) {
	return <TextInput style={[styles.input, props.style]} {...props} />;
}

const styles = StyleSheet.create({
	input: {
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#E0E0E0",
		borderRadius: Shape.radiusMd,
		paddingHorizontal: 12,
		paddingVertical: 10,
		fontSize: 16,
	},
});
