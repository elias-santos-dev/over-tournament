import { View, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Colors } from "../theme/tokens/colors";
import { Shape } from "../theme/tokens/shape";
import type { Tournament } from "../store";
import Text from "./Text";
import { Link } from "expo-router";

type Props = {
	testID: string;
	tournament: Tournament;
	onLongPress: () => void;
};

export default function CardTournament({ tournament, onLongPress }: Props) {
	return (
		<Link key={tournament.id} href={`/groups?id=${tournament.id}`} asChild>
			<Pressable onLongPress={() => onLongPress()} delayLongPress={400}>
				<LinearGradient
					colors={[Colors.accent.primary, Colors.accent.secundary]}
					start={{ x: 0, y: 0 }}
					end={{ x: 0.5, y: 1 }}
					style={styles.container}
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
						<MaterialCommunityIcons
							name="tennis-ball"
							size={24}
							color="black"
						/>
					</View>
				</LinearGradient>
			</Pressable>
		</Link>
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
