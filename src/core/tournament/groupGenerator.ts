import type { Group, Player } from "./types";
import { shuffle } from "../../utils/shuffle";
import { generateSuper8Matches } from "./matchGenerator";
import { uuid } from "../../utils/uuid";

export function generateGroups(
	name: string,
	players: string[], // agora recebemos Player[] ao invés de string[]
	numGroups: number,
): Group[] {
	const shuffled = shuffle([...players]);
	const groups: Group[] = [];
	const groupSize = Math.ceil(players.length / numGroups);

	for (let i = 0; i < numGroups; i++) {
		const groupPlayers = shuffled.slice(i * groupSize, (i + 1) * groupSize);
		const groupId = uuid();

		const matches = generateSuper8Matches(groupPlayers);

		groups.push({
			id: groupId,
			name: name,
			playerIds: groupPlayers,
			matches,
			standings: [],
		});
	}

	return groups;
}
