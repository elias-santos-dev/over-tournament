import type { Player, Tournament } from "../core/tournament/types";

export type { Player, Tournament };

export type GlobalState = {
	players: Player[];
	tournaments: Tournament[];
};
