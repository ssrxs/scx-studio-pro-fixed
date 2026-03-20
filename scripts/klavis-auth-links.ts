import { KlavisClient, McpServerName } from 'klavis';
import * as dotenv from 'dotenv';

dotenv.config();

const klavis = new KlavisClient({ apiKey: process.env.KLAVIS_API_KEY });

async function generateAuthLinks() {
  const userId = "scx-studio-user"; // Sizin için özel ID
  const serversToAuth = [
    McpServerName.GMAIL,
    McpServerName.GOOGLE_DRIVE,
    McpServerName.GOOGLE_CALENDAR,
    McpServerName.SLACK,
    McpServerName.GITHUB,
    McpServerName.NOTION
  ];

  
  

  for (const server of serversToAuth) {
    try {
      const authResponse = await klavis.mcpServer.createStrataServer({
        userId,
        servers: [server]
      });
      
    } catch (error) {
      console.error(`[${server}] Link üretilemedi:`, error.message);
    }
  }
}

generateAuthLinks();


