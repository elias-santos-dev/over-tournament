import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Colors } from "../theme/tokens/colors";
import { Shape } from "../theme/tokens/shape";
import type { Tournament } from "../store";
import Text from "./Text";

type Props = {
	tournament: Tournament;
};

export default function CardTournament({ tournament }: Props) {
	return (
		<LinearGradient
			colors={[Colors.accent.primary, Colors.accent.secundary]}
			style={styles.container}
			start={{ x: 0, y: 0 }}
			end={{ x: 0.5, y: 1 }}
		>
			<View>
				<Text size="lg" color="black" weight="bold">
					{tournament.name}
				</Text>
				<Text size="sm" color="black">
					{tournament.sport}
				</Text>
			</View>

			<View style={styles.iconContainer}>
				<MaterialCommunityIcons name="tennis-ball" size={24} color="black" />
			</View>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
		margin: 10,
		borderRadius: Shape.cardRadius,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	iconContainer: {
		backgroundColor: Colors.accent.primary,
		padding: 10,
		borderRadius: 50,
	},
});
