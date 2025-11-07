import { create } from "zustand";
import { persist } from "zustand/middleware";
import { zustandStorage } from "./storage";
import type {
	Group,
	Match,
	PlayerStats,
	Tournament,
} from "../core/tournament/types";
import { uuid } from "../utils/uuid";

export type TournamentState = {
	tournaments: Tournament[];

	createTournament: (
		name: string,
		sport: Tournament["sport"],
		groups: Group[],
	) => void;

	updateMatchResult: (
		tournamentId: string,
		groupId: string,
		matchId: string,
		scoreA: number,
		scoreB: number,
	) => void;

	updateStandings: (groupId: string, tournamentId: string) => void;

	deleteTournament: (id: string) => void;
	clearTournaments: () => void;
};

export const useTournamentStore = create<TournamentState>()(
	persist(
		(set, _get) => ({
			tournaments: [],

			createTournament: (name, sport, groups) => {
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

			updateStandings: (groupId, tournamentId) =>
				set((state) => {
					const tournament = state.tournaments.find(
						(t) => t.id === tournamentId,
					);
					if (!tournament) return state;

					const group = tournament.groups.find((g) => g.id === groupId);
					if (!group) return state;

					// Inicializa estatísticas
					const standings: PlayerStats[] = group.playerIds.map((id) => ({
						playerId: id,
						wins: 0,
						losses: 0,
						pointsFor: 0,
						pointsAgainst: 0,
						pointsDiff: 0,
					}));

					// Função auxiliar segura
					const updateStats = (
						playerId: string,
						updater: (s: PlayerStats) => void,
					) => {
						const stats = standings.find((s) => s.playerId === playerId);
						if (stats) updater(stats);
					};

					// Percorre as rodadas
					for (const round of group.matches) {
						for (const match of round) {
							if (match.status !== "finished") continue;

							const teamA = [match.player1, match.player2];
							const teamB = [match.player3, match.player4];

							const winner =
								match.scoreA > match.scoreB
									? teamA
									: match.scoreB > match.scoreA
										? teamB
										: null;

							for (const playerId of teamA) {
								updateStats(playerId, (s) => {
									s.pointsFor = (s.pointsFor ?? 0) + match.scoreA;
									s.pointsAgainst = (s.pointsAgainst ?? 0) + match.scoreB;
									if (winner?.includes(playerId)) s.wins += 1;
									else s.losses += 1;
								});
							}

							for (const playerId of teamB) {
								updateStats(playerId, (s) => {
									s.pointsFor = (s.pointsFor ?? 0) + match.scoreB;
									s.pointsAgainst = (s.pointsAgainst ?? 0) + match.scoreA;
									if (winner?.includes(playerId)) s.wins += 1;
									else s.losses += 1;
								});
							}
						}
					}

					// Calcula saldo
					for (const s of standings) {
						s.pointsDiff = (s.pointsFor ?? 0) - (s.pointsAgainst ?? 0);
					}

					// Ordena
					const ordered = [...standings].sort((a, b) => {
						if (b.wins !== a.wins) return b.wins - a.wins;
						if ((b.pointsDiff ?? 0) !== (a.pointsDiff ?? 0))
							return (b.pointsDiff ?? 0) - (a.pointsDiff ?? 0);
						return (b.pointsFor ?? 0) - (a.pointsFor ?? 0);
					});

					// Atualiza o grupo
					const updatedTournaments = state.tournaments.map((t) =>
						t.id === tournamentId
							? {
									...t,
									groups: t.groups.map((g) =>
										g.id === groupId ? { ...g, standings: ordered } : g,
									),
								}
							: t,
					);

					return { tournaments: updatedTournaments };
				}),

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
