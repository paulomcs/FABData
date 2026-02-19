import { DataLoader } from './dataLoader.js';
import { TournamentParser } from './tournamentParser.js';
import { Aggregator } from './aggregator.js';
import { UIRenderer } from './uiRenderer.js';

(async function init() {
  try {
    const loader = new DataLoader();
    const parser = new TournamentParser();
    const aggregator = new Aggregator();
    const ui = new UIRenderer();

    const rawTournaments = await loader.loadTournaments();
    const allTournaments = rawTournaments.map(t => parser.parseTournament(t));

    const seasons = [...new Set(allTournaments.map(t => t.collection))].sort();

    function renderForSeason(season) {
      const filtered = season === '__ALL__'
        ? allTournaments
        : allTournaments.filter(t => t.collection === season);

      const aggregated = aggregator.aggregate(filtered);

      ui.renderTournamentList(filtered);
      ui.renderAggregatedStats(aggregated);
      ui.setActiveSeason(season);
    }

    ui.renderSeasonButtons(seasons, '__ALL__');

    ui.onSeasonChange((season) => {
      renderForSeason(season);
    });

    // padrão: tudo junto
    renderForSeason('__ALL__');

  } catch (err) {
    console.error(err);
    document.body.insertAdjacentHTML(
      'beforeend',
      `<pre style="white-space:pre-wrap;padding:12px;border:1px solid red;">${err?.stack || err}</pre>`
    );
  }
})();
