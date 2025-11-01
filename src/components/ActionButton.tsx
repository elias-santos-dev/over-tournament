import { TouchableHighlight, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Shape } from "../theme/tokens/shape";
import Text from "./Text";

type Props = {
	label: string;
	href: string;
	variant?: "primary" | "secondary";
};

const COLORS = {
	primary: "#a3bfd4",
	secondary: "#e6b5b8",
};

export default function ActionButton({
	label,
	href,
	variant = "primary",
}: Props) {
	const backgroundColor = COLORS[variant];

	return (
		<Link href={href} asChild style={[styles.button, { backgroundColor }]}>
			<TouchableHighlight>
				<Text size="md" weight="bold" color="#fff">
					{label}
				</Text>
			</TouchableHighlight>
		</Link>
	);
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
