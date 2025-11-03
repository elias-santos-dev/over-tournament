import { uuid } from "../../utils/uuid";
import type { Match } from "./types";

/**
 * Gera partidas no estilo Super 8 Round Robin
 * players deve ter 8 jogadores (ou múltiplo de 2)
 */
export function generateSuper8Matches(players: string[]): Match[][] {
	if (players.length % 2 !== 0) {
		throw new Error("Número de jogadores deve ser par.");
	}

	const totalRounds = players.length - 1; // número de rounds
	const half = players.length / 2;

	const rounds: Match[][] = [];

	// Clonar array para manipulação
	const p = [...players];

	for (let round = 0; round < totalRounds; round++) {
		const matches: Match[] = [];

		for (let i = 0; i < half; i += 2) {
			const playerA1 = p[i];
			const playerA2 = p[i + 1];
			const playerB1 = p[players.length - 1 - i];
			const playerB2 = p[players.length - 2 - i];

			matches.push({
				id: uuid(),
				player1: playerA1,
				player2: playerA2,
				player3: playerB1,
				player4: playerB2,
				scoreA: 0,
				scoreB: 0,
				status: "pending",
				groupId: "",
			});
		}

		// Girar jogadores exceto o primeiro para gerar próximo round
		const fixed = p[0];
		const rest = p.slice(1);
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		rest.unshift(rest.pop()!); // rotação
		p[0] = fixed;
		p.splice(1, rest.length, ...rest);

		rounds.push(matches);
	}

	return rounds;
}
