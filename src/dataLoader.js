export class DataLoader {
  constructor(basePath = './src/data') {
    this.basePath = basePath;
  }

  async loadCSV(path) {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Erro ao carregar arquivo: ${path} (${response.status})`);
    }
    const text = await response.text();
    return Papa.parse(text, { header: true }).data;
  }

  async loadTournaments() {
    const collections = ['SUP']; // depois podemos automatizar isso
    const tournaments = [];

    for (const collection of collections) {
      const folder = `${this.basePath}/${collection}`;

      const files = [
        '28.09.2025-SUP-heroes.csv',
        '28.09.2025-SUP-Pairings.csv',
        '28.09.2025-SUP-Standings.csv'
      ];

      const [heroes, pairings, standings] = await Promise.all(
        files.map(f => this.loadCSV(`${folder}/${f}`))
      );

      tournaments.push({ collection, heroes, pairings, standings });
    }

    return tournaments;
  }
}
