import { DataLoader } from './dataLoader.js';
import { TournamentParser } from './tournamentParser.js';
import { Aggregator } from './aggregator.js';
import { UIRenderer } from './uiRenderer.js';

(async function init() {
  const loader = new DataLoader();
  const parser = new TournamentParser();
  const aggregator = new Aggregator();
  const ui = new UIRenderer();

  const rawTournaments = await loader.loadTournaments();
  const tournaments = rawTournaments.map(t => parser.parseTournament(t));
  const aggregated = aggregator.aggregate(tournaments);

  ui.renderTournamentList(tournaments);
  ui.renderAggregatedStats(aggregated);
})();
