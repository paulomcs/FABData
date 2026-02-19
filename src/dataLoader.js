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

  async getSubfolders() {
    // Usa a API do servidor HTTP para listar diretórios (fetch index)
    // Isso só funciona se houver um "index" visível no http.server.
    // Alternativa: manter uma lista estática ou gerar JSON de estrutura.
    const response = await fetch(this.basePath);
    const html = await response.text();

    // Extrai nomes de pastas do index HTML (gerado por python -m http.server)
    const regex = /<a href="([^"]+)\/">/g;
    const folders = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      if (!match[1].startsWith('.')) folders.push(match[1].replace('/', ''));
    }

    return folders;
  }

  async getCSVFiles(collection) {
    const folderPath = `${this.basePath}/${collection}/`;
    const response = await fetch(folderPath);
    const html = await response.text();

    // Extrai apenas arquivos CSV
    const regex = /<a href="([^"]+\.csv)">/g;
    const files = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      files.push(match[1]);
    }

    return files;
  }

  async loadTournaments() {
    const collections = await this.getSubfolders();
    const tournaments = [];

    for (const collection of collections) {
      const files = await this.getCSVFiles(collection);

      // Agrupa por "id do torneio" = nome do arquivo sem o sufixo -Heroes/-Pairings/-Standings
      // Ex: 05.10.2025-SUP-Heroes.csv -> 05.10.2025-SUP
      const groups = {};
      for (const file of files) {
        const tournamentId = file.replace(/-(Heroes|Pairings|Standings)\.csv$/i, '');
        groups[tournamentId] = groups[tournamentId] || [];
        groups[tournamentId].push(file);
      }

      for (const tournamentId of Object.keys(groups)) {
        const data = { collection, tournamentId };

        for (const file of groups[tournamentId]) {
          const key = file
            .replace('.csv', '')
            .split('-')
            .pop()
            .toLowerCase(); // heroes, pairings, standings

          data[key] = await this.loadCSV(`${this.basePath}/${collection}/${file}`);
        }

        tournaments.push(data);
      }
    }

    return tournaments;
  }

}
