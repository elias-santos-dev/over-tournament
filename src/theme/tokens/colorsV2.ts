export const Colors = {
	// 🌞 Paleta principal (60%)
	primary: {
		main: "#AFC5D2", // azul acinzentado principal
		light: "#C6D7E0", // versão mais clara
		dark: "#8CA9BB", // versão mais escura
		onPrimary: "#FFFFFF", // texto sobre a cor primária
		container: "#E7EFF4", // superfícies ou destaques leves
		hover: "#A3BAC9",
		pressed: "#7F9DAF",
		disabled: "#D3DEE5",
	},

	// 🌤️ Cor secundária (30%)
	secondary: {
		main: "#FFF7D1", // fundo claro principal
		light: "#FFFBE8", // quase branco
		dark: "#F2E5B0", // leve variação mais quente
		onSecondary: "#2C2C2C", // texto sobre fundos claros
		border: "#E8DFB8",
		hover: "#FFF1C0",
		pressed: "#F5E5A8",
		disabled: "#FAF3D9",
	},

	// 🌈 Cor de destaque (10%)
	accent: {
		main: "#FFE5B4", // pêssego pastel
		light: "#FFF0CE",
		dark: "#F5CF8A",
		onAccent: "#2C2C2C",
		hover: "#FFDDA0",
		pressed: "#EFC381",
	},

	// 🧩 Fundo e superfícies
	surface: {
		background: "#FFFBE8", // fundo base da interface
		allwaysDark: "#070707ff",
		allwaysWhite: "#ffffff",
		elevated: "#FFFFFF",
		overlay: "rgba(0,0,0,0.05)",
		border: "#E5E0C8",
	},

	// 🖋️ Tipografia
	text: {
		primary: "#2C2C2C",
		secondary: "#4E4E4E",
		disabled: "#A3A3A3",
		inverse: "#FFFFFF",
		onPrimary: "#FFFFFF",
	},

	// 🧭 Ações e interações
	action: {
		primary: "#AFC5D2",
		secondary: "#FFE5B4",
		success: "#BEE3B1",
		warning: "#FFD580",
		error: "#E8A5A5",
		info: "#A3D4D4",
	},

	// 🧱 Botões
	button: {
		primary: {
			background: "#AFC5D2",
			text: "#FFFFFF",
			hover: "#A3BAC9",
			pressed: "#7F9DAF",
			disabledBg: "#D3DEE5",
			disabledText: "#FFFFFFAA",
		},
		secondary: {
			background: "#FFE5B4",
			text: "#2C2C2C",
			hover: "#FFDDA0",
			pressed: "#EFC381",
			disabledBg: "#FAEAD1",
		},
		textButton: {
			text: "#2C2C2C",
			hover: "#4E4E4E",
			pressed: "#1C1C1C",
		},
	},

	// 📦 Componentes visuais
	card: {
		background: "#FFFFFF",
		border: "#E5E0C8",
		shadow: "rgba(0,0,0,0.06)",
	},

	input: {
		background: "#FFFFFF",
		border: "#D9D2A8",
		focused: "#AFC5D2",
		text: "#2C2C2C",
		placeholder: "#9E9E9E",
		disabled: "#FAF3D9",
	},

	modal: {
		background: "#FFFFFF",
		overlay: "rgba(0,0,0,0.4)",
		border: "#E5E0C8",
	},

	// ⚙️ Estados
	status: {
		success: {
			background: "#BEE3B1",
			text: "#1E4620",
		},
		warning: {
			background: "#FFD580",
			text: "#4E3B00",
		},
		error: {
			background: "#E8A5A5",
			text: "#5E111E",
		},
		info: {
			background: "#A3D4D4",
			text: "#00333A",
		},
	},
	ranking: {
		gold: "#FFD700",
		silver: "#C0C0C0",
		bronze: "#CD7F32",
		highlightOpacity: "22", // transparência leve para usar em fundos
	},
};
