export class UIRenderer {
  renderTournamentList(tournaments) {
    const container = document.getElementById('tournament-list');
    container.innerHTML = '<h2>Torneios</h2>' + tournaments.map(t => `
      <button class="tournament-btn" data-collection="${t.collection}">
        ${t.collection}
      </button>
    `).join('');
  }

  renderAggregatedStats(stats) {
    const container = document.getElementById('aggregated-stats');
    const { heroStats, playerStats } = stats;

    const heroesTable = Object.entries(heroStats).map(([hero, data]) =>
      `<tr><td>${hero}</td><td>${data.count}</td></tr>`
    ).join('');

    const playersTable = Object.entries(playerStats).map(([name, data]) =>
      `<tr><td>${name}</td><td>${data.totalWins}</td><td>${data.appearances}</td></tr>`
    ).join('');

    container.innerHTML = `
      <h2>Estatísticas Globais</h2>
      <h3>Heróis</h3>
      <table><tr><th>Herói</th><th>Participações</th></tr>${heroesTable}</table>
      <h3>Jogadores</h3>
      <table><tr><th>Nome</th><th>Vitórias</th><th>Torneios</th></tr>${playersTable}</table>
    `;
  }
}
