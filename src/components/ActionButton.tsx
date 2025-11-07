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
	style?: ViewStyle | ViewStyle[];
	disabled?: boolean;
	testID?: string;
	accessibilityLabel?: string;
};

const COLORS = {
	primary: "#a3bfd4",
	secondary: "#e6b5b8",
	disabled: "#cccccc",
};

export default function ActionButton({
	label,
	href,
	onPress,
	variant = "primary",
	style,
	disabled = false,
}: Props) {
	const backgroundColor = disabled ? COLORS.disabled : COLORS[variant];

	const content = (
		<TouchableHighlight
			onPress={disabled ? undefined : onPress} // ✅ desativa clique
			underlayColor={disabled ? undefined : "#00000020"} // ✅ sem underlay
			style={[
				styles.button,
				{ backgroundColor, opacity: disabled ? 0.6 : 1 }, // ✅ aparência
				style,
			]}
			disabled={disabled} // ✅ importante para acessibilidade
		>
			<Text size="md" weight="bold" color="#fff">
				{label}
			</Text>
		</TouchableHighlight>
	);

	if (href && !disabled) {
		return (
			<Link
				href={href}
				asChild
				style={[styles.button, { backgroundColor }, style]}
			>
				{content}
			</Link>
		);
	}

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
