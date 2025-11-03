import {
	TouchableHighlight,
	StyleSheet,
	View,
	type ViewStyle,
} from "react-native";
import { Link } from "expo-router";
import { Shape } from "../theme/tokens/shape";
import Text from "./Text";

type Props = {
	label: string;
	href?: string;
	onPress?: () => void;
	variant?: "primary" | "secondary";
	style?: ViewStyle | ViewStyle[]; // ✅ nova prop para customização externa
};

const COLORS = {
	primary: "#a3bfd4",
	secondary: "#e6b5b8",
};

export default function ActionButton({
	label,
	href,
	onPress,
	variant = "primary",
	style,
}: Props) {
	const backgroundColor = COLORS[variant];

	const content = (
		<TouchableHighlight
			onPress={onPress}
			underlayColor="#00000020"
			style={[styles.button, { backgroundColor }, style]}
		>
			<Text size="md" weight="bold" color="#fff">
				{label}
			</Text>
		</TouchableHighlight>
	);

	// Se tiver href, usamos o Link como wrapper
	if (href) {
		return (
			<Link
				href={href}
				asChild
				style={[styles.button, { backgroundColor }, style]}
			>
				{/* <View */}
				{content}
				{/* </View> */}
			</Link>
		);
	}

	// Caso contrário, apenas o botão normal
	return <View style={style}>{content}</View>;
}

const styles = StyleSheet.create({
	button: {
		paddingVertical: 15,
		paddingHorizontal: 20,
		borderRadius: Shape.radiusLg,
		justifyContent: "center",
		alignItems: "center",
	},
});
