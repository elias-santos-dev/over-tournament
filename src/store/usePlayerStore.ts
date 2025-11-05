import { create } from "zustand";
import { persist } from "zustand/middleware";
import { zustandStorage } from "./storage";
import type { Player } from "../core/tournament/types";
import { uuid } from "../utils/uuid";

type PlayerState = {
	players: Player[];
	addPlayer: (name: string, avatar?: string) => void;
	editPlayer: (id: string, name: string, avatar?: string) => void;
	removePlayer: (id: string) => void;
	getPlayer: (id: string) => Player | undefined;
	clearPlayers: () => void;
};

export const usePlayerStore = create<PlayerState>()(
	persist(
		(set, get) => ({
			players: [],

			addPlayer: (name, avatar) =>
				set((state) => ({
					players: [...state.players, { id: uuid(), name, avatar }],
				})),

			editPlayer: (id, name, avatar) =>
				set((state) => ({
					players: state.players.map((p) =>
						p.id === id ? { ...p, name, avatar } : p,
					),
				})),

			removePlayer: (id) =>
				set((state) => ({
					players: state.players.filter((p) => p.id !== id),
				})),

			getPlayer: (id: string) => {
				const state = get();
				return state.players.find((p: Player) => p.id === id);
			},

			clearPlayers: () => set({ players: [] }),
		}),
		{
			name: "players-storage",
			storage: zustandStorage,
		},
	),
);
