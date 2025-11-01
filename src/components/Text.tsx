import {
	Text as RNText,
	StyleSheet,
	type TextProps as RNTextProps,
	type TextStyle,
} from "react-native";
import { Font } from "../theme/tokens/font";
import { Colors } from "../theme/tokens/colors";

type TextSize = keyof typeof Font.size;
type TextWeight = keyof typeof Font.weight;

type Props = RNTextProps & {
	size?: TextSize;
	weight?: TextWeight;
	color?: string;
	align?: "left" | "center" | "right";
	children: React.ReactNode;
};

export default function Text({
	size = "md",
	weight = "regular",
	color = "white",
	align = "left",
	style,
	children,
	...rest
}: Props) {
	const fontWeight = Font.weight[weight] as TextStyle["fontWeight"];

	return (
		<RNText
			style={[
				styles.base,
				{
					fontSize: Font.size[size],
					fontWeight,
					fontFamily: Font.family.primary,
					color,
					textAlign: align,
				},
				style,
			]}
			{...rest}
		>
			{children}
		</RNText>
	);
}

const styles = StyleSheet.create({
	base: {
		includeFontPadding: false,
		textAlignVertical: "center",
	},
});
