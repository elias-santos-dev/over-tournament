import type React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Colors } from "../theme/tokens/colorsV2";
import { Font } from "../theme/tokens/font"; // ✅ tokens de tipografia aplicáveis no header

const Layout: React.FC = () => {
	return (
		<SafeAreaProvider>
			<Stack
				screenOptions={{
					headerStyle: {
						backgroundColor: Colors.surface.allwaysWhite, // ✅ token atualizado
					},
					headerShadowVisible: false,
					headerTitleAlign: "center",
					headerTitleStyle: {
						fontFamily: Font.family.primary, // ✅ tipografia via token
						fontSize: Font.size.lg, // ✅ tamanho de fonte padronizado
						fontWeight: Font.weight.medium as any, // ✅ peso de fonte via token
						color: Colors.text.primary, // ✅ cor padronizada do texto
					},
					headerTintColor: Colors.text.primary, // ✅ cor dos ícones e botões
					contentStyle: {
						backgroundColor: Colors.surface.background, // ✅ fundo consistente em todas as telas
					},
				}}
			>
				<Stack.Screen name="index" options={{ title: "Over Tournament" }} />
				<Stack.Screen name="players/index" options={{ title: "Jogadores" }} />
				<Stack.Screen
					name="groups/GroupDetailsScreen"
					options={{ title: "Detalhes do Grupo" }}
				/>
				<Stack.Screen
					name="groups/StandingsScreen"
					options={{ title: "Resultados" }}
				/>
				<Stack.Screen
					name="tournament/create"
					options={{ title: "Criar Torneio" }}
				/>
				<Stack.Screen name="groups/index" options={{ title: "Grupos" }} />
			</Stack>
		</SafeAreaProvider>
	);
};

export default Layout;
