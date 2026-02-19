export class Aggregator {
  aggregate(tournaments) {
    const heroStats = {};
    const playerStats = {};

    tournaments.forEach(t => {
      // HEROES: ignora linhas vazias e herói ausente
      (t.heroes || []).forEach(h => {
        const hero = (h.hero ?? "").toString().trim();
        if (!hero) return; // <- mata o "undefined"
        heroStats[hero] = heroStats[hero] || { count: 0, wins: 0 };
        heroStats[hero].count++;
      });

      // STANDINGS: fonte de verdade
      (t.standings || []).forEach(s => {
        const name = (s.name ?? "").toString().trim();
        const wins = Number(s.wins);

        if (!name) return;
        if (!Number.isFinite(wins)) return; // evita NaN

        playerStats[name] = playerStats[name] || { totalWins: 0, appearances: 0 };
        playerStats[name].totalWins += wins;
        playerStats[name].appearances++;
      });
    });

    return { heroStats, playerStats };
  }
}
