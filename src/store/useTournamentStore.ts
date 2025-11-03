import { create } from "zustand";
import { persist } from "zustand/middleware";
import { zustandStorage } from "./storage";
import type { Group, Match, Tournament } from "../core/tournament/types";
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
		(set, _get) => ({
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

			updateMatchResult: (
				tournamentId: string,
				groupId: string,
				matchId: string,
				scoreA: number,
				scoreB: number,
			) => {
				set((state: any) => {
					const tournaments = state.tournaments.map((t: Tournament) => {
						if (t.id !== tournamentId) return t;

						const groups = t.groups.map((g: Group) => {
							if (g.id !== groupId) return g;
							const matches = g.matches.map((round: Match[]) =>
								round.map((m: Match) =>
									m.id === matchId
										? { ...m, scoreA, scoreB, status: "finished" }
										: m,
								),
							);
							return { ...g, matches };
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
