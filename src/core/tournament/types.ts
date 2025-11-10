// ====================
// 👤 Jogador
// ====================
export type Player = {
	id: string;
	name: string;
};

// ====================
// 🎾 Partida
// ====================
export type MatchStatus = "pending" | "finished";

export type MatchResult = {
	playerA: string; // id do Player
	playerB: string; // id do Player
	scoreA: number;
	scoreB: number;
	winnerId?: string;
};

export type Match = {
	id: string;
	groupId: string;
	player1: string;
	player2: string;
	player3: string;
	player4: string;
	scoreA: number;
	scoreB: number;
	status: MatchStatus;
};

// ====================
// 🧮 Estatísticas do Jogador no Grupo
// ====================
export type PlayerStats = {
	playerId: string;
	wins: number;
	losses: number;
	pointsFor?: number; // pontos feitos
	pointsAgainst?: number; // pontos sofridos
	pointsDiff?: number; // saldo
};

// ====================
// 👥 Grupo
// ====================
export type Group = {
	id: string;
	name: string;
	playerIds: string[];
	matches: Match[][];
	standings: PlayerStats[]; // classificação atualizada
};

export type TieBreakCriterion =
	| "wins"
	| "gamesFor"
	| "gameDifference"
	| "headToHead";

export interface TournamentRules {
	setsToWin: number;
	gamesPerSet: number;
	tieBreak: "sempre" | "apenas_decisivo" | "nenhum";
	tieBreakCriteria: TieBreakCriterion[];
}

// ====================
// 🏆 Torneio
// ====================
export interface Tournament {
	id: string;
	name: string;
	sport: "beach_tennis" | "padel" | "tennis" | "generic";
	groups: Group[];
	createdAt: string;
	rules: TournamentRules;
}
