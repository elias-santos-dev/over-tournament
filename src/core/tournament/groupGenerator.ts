import type { Group } from "./types";
import { shuffle } from "../../utils/shuffle";
import { generateRoundRobinMatches } from "./matchGenerator";
import { uuid } from "../../utils/uuid";

export function generateGroups(
	playerIds: string[],
	numGroups: number,
): Group[] {
	const shuffled = shuffle([...playerIds]);
	const groups: Group[] = [];
	const groupSize = Math.ceil(playerIds.length / numGroups);

	for (let i = 0; i < numGroups; i++) {
		const groupPlayerIds = shuffled.slice(i * groupSize, (i + 1) * groupSize);
		const groupId = uuid();

		groups.push({
			id: groupId,
			name: `Grupo ${i + 1}`,
			playerIds: groupPlayerIds,
			matches: generateRoundRobinMatches(groupPlayerIds, groupId),
			standings: [],
		});
	}

	return groups;
}
