const { KlavisClient } = require('klavis');
require('dotenv').config();

const klavis = new KlavisClient({ apiKey: process.env.KLAVIS_API_KEY });

async function generateAuthLinks() {
  const userId = "scx-studio-user"; 
  const serversToAuth = ['gmail', 'google_drive', 'slack', 'github'];

  console.log("--- SCX Klavis Yetkilendirme Köprüsü ---");

  for (const server of serversToAuth) {
    try {
      const response = await klavis.mcpServer.createStrataServer({
        userId,
        servers: [server]
      });
      // Response objesinin tamamını inceleyerek doğru URL'i bulalım
      const authUrl = response.url || `https://strata.klavis.ai/mcp/?strata_id=${response.id || response.strataId}`;
      console.log(`[${server.toUpperCase()}] Link: ${authUrl}`);
    } catch (error) {
      console.log(`[${server.toUpperCase()}] Hata: ${error.message}`);
    }
  }
}

generateAuthLinks();
