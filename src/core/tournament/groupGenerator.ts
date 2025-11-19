import type { Group, Player } from "./types";
import { shuffle } from "../../utils/shuffle";
import { generateSuper8Matches } from "./matchGenerator";
import { uuid } from "../../utils/uuid";

export function generateGroups(
	name: string,
	players: string[]
): Group[] {
	const groups: Group[] = [];
	const groupId = uuid();
	const matches = generateSuper8Matches(players);
	groups.push({
		id: groupId,
		name: name,
		playerIds: players,
		matches,
		standings: [],
	});
	return groups;
}
