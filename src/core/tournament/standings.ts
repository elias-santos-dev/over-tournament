import { Match, PlayerStats } from "./types";

export function calculateStandings(playerIds: string[], matches: Match[]): PlayerStats[] {
  const statsMap: Record<string, PlayerStats> = {};

  // inicializa cada jogador
  playerIds.forEach((id) => {
    statsMap[id] = {
      playerId: id,
      wins: 0,
      losses: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      pointsDiff: 0,
    };
  });

  // percorre partidas finalizadas
  matches.forEach((match) => {
    if (match.status !== "finished" || match.scoreA == null || match.scoreB == null) return;

    const a = statsMap[match.playerAId];
    const b = statsMap[match.playerBId];

    a.pointsFor += match.scoreA;
    a.pointsAgainst += match.scoreB;
    b.pointsFor += match.scoreB;
    b.pointsAgainst += match.scoreA;

    a.pointsDiff = a.pointsFor - a.pointsAgainst;
    b.pointsDiff = b.pointsFor - b.pointsAgainst;

    if (match.scoreA > match.scoreB) {
      a.wins += 1;
      b.losses += 1;
    } else if (match.scoreB > match.scoreA) {
      b.wins += 1;
      a.losses += 1;
    }
  });

  // converte para array e ordena
  return Object.values(statsMap).sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.pointsDiff !== a.pointsDiff) return b.pointsDiff - a.pointsDiff;
    return b.pointsFor - a.pointsFor;
  });
}
