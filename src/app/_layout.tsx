import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Colors } from "../theme/tokens/colors";

export default function Layout() {
	return (
		<SafeAreaProvider>
			<Stack
				screenOptions={{
					headerStyle: { backgroundColor: Colors.base.background },

					headerShadowVisible: false,
					headerTitleAlign: "center",
				}}
			>
				<Stack.Screen name="index" options={{ title: "Over Tournament" }} />
				<Stack.Screen name="players/index" options={{ title: "Jogadores" }} />
				<Stack.Screen
					name="groups/GroupDetailsScreen"
					options={{ title: "Detalhes do Grupo" }}
				/>
				<Stack.Screen
					name="tournament/create"
					options={{ title: "Criar torneio" }}
				/>
				<Stack.Screen name="groups/index" options={{ title: "Grupos" }} />
			</Stack>
		</SafeAreaProvider>
	);
}
