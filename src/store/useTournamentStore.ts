import { create } from "zustand";
import { persist } from "zustand/middleware";
import { zustandStorage } from "./storage";
import type { Tournament } from "../core/tournament/types";
import { generateGroups } from "../core/tournament/groupGenerator";
import { calculateStandings } from "../core/tournament/standings";
import { uuid } from "../utils/uuid";

type TournamentState = {
	tournaments: Tournament[];

	createTournament: (
		name: string,
		sport: Tournament["sport"],
		playerIds: string[],
		numGroups: number,
	) => void;

	updateMatchResult: (
		tournamentId: string,
		groupId: string,
		matchId: string,
		scoreA: number,
		scoreB: number,
	) => void;

	deleteTournament: (id: string) => void;
	clearTournaments: () => void;
};

export const useTournamentStore = create<TournamentState>()(
	persist(
		(set, get) => ({
			tournaments: [],

			createTournament: (name, sport, playerIds, numGroups) => {
				const groups = generateGroups(playerIds, numGroups);
				const newTournament: Tournament = {
					id: uuid(),
					name,
					sport,
					groups,
					createdAt: new Date().toISOString(),
				};

				set((state) => ({
					tournaments: [...state.tournaments, newTournament],
				}));
			},

			updateMatchResult: (tournamentId, groupId, matchId, scoreA, scoreB) => {
				set((state: any) => {
					const tournaments = state.tournaments.map((t: any) => {
						if (t.id !== tournamentId) return t;

						const groups = t.groups.map((g: any) => {
							if (g.id !== groupId) return g;

							const matches = g.matches.map((m: any) =>
								m.id === matchId
									? {
											...m,
											scoreA,
											scoreB,
											status: "finished",
										}
									: m,
							);

							const standings = calculateStandings(g.playerIds, matches);
							return { ...g, matches, standings };
						});

						return { ...t, groups };
					});

					return { tournaments };
				});
			},

			deleteTournament: (id) =>
				set((state) => ({
					tournaments: state.tournaments.filter((t) => t.id !== id),
				})),

			clearTournaments: () => set({ tournaments: [] }),
		}),
		{
			name: "tournaments-storage",
			storage: zustandStorage,
		},
	),
);
