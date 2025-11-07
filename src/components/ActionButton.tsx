import {
	View,
	TouchableHighlight,
	StyleSheet,
	type ViewStyle,
} from "react-native";
import { Link } from "expo-router";
import Text from "./Text";
import { Colors } from "../theme/tokens/colorsV2";
import { Shape } from "../theme/tokens/shape";
import { Space } from "../theme/tokens/space";

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

export default function ActionButton({
	label,
	href,
	onPress,
	variant = "primary",
	style,
	disabled = false,
	testID,
	accessibilityLabel,
}: Props) {
	const palette = Colors.button[variant];
	const backgroundColor = disabled ? palette.disabledBg : palette.background;

	const pressedColor = disabled ? palette.disabledBg : palette.pressed;
	const textColor = palette.text ?? Colors.text.onPrimary;

	const content = (
		<TouchableHighlight
			onPress={disabled ? undefined : onPress}
			underlayColor={pressedColor}
			style={[
				styles.button,
				{ backgroundColor, opacity: disabled ? 0.7 : 1 },
				style,
			]}
			disabled={disabled}
			accessibilityRole="button"
			accessibilityState={{ disabled }}
			accessibilityLabel={accessibilityLabel ?? label}
			testID={testID}
		>
			<Text size="md" weight="bold" color={textColor}>
				{label}
			</Text>
		</TouchableHighlight>
	);

	if (href && !disabled) {
		return (
			<Link
				href={href}
				asChild
				style={[
					styles.button,
					{ backgroundColor, opacity: disabled ? 0.7 : 1 },
					style,
				]}
			>
				{content}
			</Link>
		);
	}

	return <View style={style}>{content}</View>;
}

const styles = StyleSheet.create({
	button: {
		paddingVertical: Space.md,
		paddingHorizontal: Space.lg,
		borderRadius: Shape.radiusLg,
		justifyContent: "center",
		alignItems: "center",
	},
});
