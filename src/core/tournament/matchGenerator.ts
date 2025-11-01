import { uuid } from "../../utils/uuid";
import type { Match } from "./types";
export function generateRoundRobinMatches(
	playerIds: string[],
	groupId: string,
): Match[] {
	const matches: Match[] = [];

	for (let i = 0; i < playerIds.length; i++) {
		for (let j = i + 1; j < playerIds.length; j++) {
			matches.push({
				id: uuid(),
				groupId,
				playerAId: playerIds[i],
				playerBId: playerIds[j],
				status: "pending",
			});
		}
	}

	return matches;
}
