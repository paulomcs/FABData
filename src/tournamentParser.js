export class TournamentParser {
  parseTournament(raw) {
    const { collection, heroes, pairings, standings } = raw;

    return {
      collection,
      heroes: heroes.map(h => ({
        name: h['Player Name'],
        id: h['Player ID'],
        hero: h['Hero']
      })),
      pairings: pairings.map(p => ({
        round: p.Round,
        player1: p['Player 1 Name'],
        player2: p['Player 2 Name'],
        result: p.Result
      })),
      standings: standings.map(s => ({
        rank: Number(s.Rank),
        name: s.Name,
        wins: Number(s.Wins)
      }))
    };
  }
}
