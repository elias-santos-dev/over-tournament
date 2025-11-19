import { uuid } from "./uuid";

export type Match = {
	id: string;
	player1: string;
	player2: string;
	player3: string;
	player4: string;
	scoreA: number;
	scoreB: number;
	status: "pending" | "finished";
	groupId: string;
};

/**
 * Gera partidas no estilo Super 8 Round Robin para duplas.
 * O número de jogadores deve ser par e pelo menos 4.
 * Assume que cada partida envolve 4 jogadores (2 duplas).
 */
export function generateSuper8Matches(
	players: string[],
	groupId: string,
): Match[][] {
	if (players.length < 4 || players.length % 2 !== 0) {
		// Para o formato de duplas, idealmente, o número de jogadores deveria ser um múltiplo de 4
		// para que todos os jogadores possam formar duplas completas em cada rodada.
		// No entanto, a lógica de rotação pode funcionar para outros números pares >= 4,
		// mas pode resultar em jogadores "sentados" ou duplas incompletas dependendo da interpretação exata do "Super 8".
		// Mantendo a validação original do frontend de "múltiplo de 2" e ">= 4".
		return []; // Retorna vazio se não for válido para evitar erros.
	}

	const totalRounds = players.length - 1; // Número de rodadas em um round-robin simples
	const half = players.length / 2;

	const rounds: Match[][] = [];

	const p = [...players]; // Cópia mutável para rotação

	for (let round = 0; round < totalRounds; round++) {
		const matches: Match[] = [];

		// Gera partidas para a rodada atual
		for (let i = 0; i < half; i += 2) {
			// Esta lógica de emparelhamento é específica para o formato "Super 8" de duplas.
			// Assume que p[i] e p[i+1] formam uma dupla, e p[players.length - 1 - i] e p[players.length - 2 - i] formam outra.
			matches.push({
				id: uuid(),
				player1: p[i],
				player2: p[i + 1],
				player3: p[players.length - 1 - i],
				player4: p[players.length - 2 - i],
				scoreA: 0,
				scoreB: 0,
				status: "pending",
				groupId: groupId,
			});
		}

		// Rotaciona os jogadores para a próxima rodada, mantendo o primeiro jogador fixo
		const fixed = p[0];
		const rest = p.slice(1);
		rest.unshift(rest.pop()!); // Rotação: move o último para o início do 'rest'
		p[0] = fixed;
		p.splice(1, rest.length, ...rest); // Atualiza 'p' com os jogadores rotacionados

		rounds.push(matches);
	}

	return rounds;
}
