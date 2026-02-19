export class UIRenderer {
  constructor() {
    this._seasonChangeCb = null;
    this._activeSeason = '__ALL__';
  }

  renderSeasonButtons(seasons, defaultSeason = '__ALL__') {
    this._activeSeason = defaultSeason;

    // cria/garante um container para temporadas acima da lista de torneios
    let container = document.getElementById('season-selector');
    if (!container) {
      container = document.createElement('div');
      container.id = 'season-selector';

      const target = document.getElementById('tournament-list');
      target.parentNode.insertBefore(container, target);
    }

    const buttonsHtml = [
      `<button class="season-btn" data-season="__ALL__">Todas</button>`,
      ...seasons.map(s => `<button class="season-btn" data-season="${s}">${s}</button>`)
    ].join('');

    container.innerHTML = `<h2>Temporadas</h2>${buttonsHtml}`;

    // eventos
    container.querySelectorAll('.season-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const season = btn.getAttribute('data-season');
        if (this._seasonChangeCb) this._seasonChangeCb(season);
      });
    });

    this.setActiveSeason(defaultSeason);
  }

  onSeasonChange(cb) {
    this._seasonChangeCb = cb;
  }

  setActiveSeason(season) {
    this._activeSeason = season;
    const container = document.getElementById('season-selector');
    if (!container) return;

    container.querySelectorAll('.season-btn').forEach(btn => {
      const s = btn.getAttribute('data-season');
      btn.classList.toggle('active', s === season);
    });
  }

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
