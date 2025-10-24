export class Aggregator {
  aggregate(tournaments) {
    const heroStats = {};
    const playerStats = {};

    tournaments.forEach(t => {
      t.heroes.forEach(h => {
        heroStats[h.hero] = heroStats[h.hero] || { count: 0, wins: 0 };
        heroStats[h.hero].count++;
      });

      t.standings.forEach(s => {
        playerStats[s.name] = playerStats[s.name] || { totalWins: 0, appearances: 0 };
        playerStats[s.name].totalWins += s.wins;
        playerStats[s.name].appearances++;
      });
    });

    return { heroStats, playerStats };
  }
}
