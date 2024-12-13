// server/index.ts
import cors from 'cors';
import { Client, IntentsBitField, TextChannel } from 'discord.js';
import 'dotenv/config';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const app = express();
app.use(cors());

// Discord bot setup
const token = process.env.DISCORD_BOT_TOKEN;
const serverId = '944370728675991584';
const channelId = '946913692954525736';

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.MessageContent,
  ],
});

// Discord bot functions
async function fetchAllMessages(channel: TextChannel) {
  let messages = [];
  let lastId;

  while (true) {
    const fetchedMessages = await channel.messages.fetch({
      limit: 100,
      ...(lastId && { before: lastId }),
    });

    if (fetchedMessages.size === 0) break;

    messages = messages.concat(Array.from(fetchedMessages.values()));
    lastId = fetchedMessages.lastKey();
  }

  return messages;
}

async function exportChannelMessages(channel: TextChannel) {
  try {
    const messages = await fetchAllMessages(channel);
    const formattedMessages = messages.map((msg) => ({
      author: msg.author.username,
      content: msg.content,
      timestamp: msg.createdAt.toISOString(),
    }));

    const filename = `${channel.name}-${new Date().toISOString().slice(0, 10)}.json`;
    const exportsDir = path.join(__dirname, '..', 'src', 'exports');
    await fs.mkdir(exportsDir, { recursive: true });
    
    const filePath = path.join(exportsDir, filename);
    await fs.writeFile(filePath, JSON.stringify(formattedMessages, null, 2));
    console.log(`Messages exported to ${filePath}`);
  } catch (error) {
    console.error('Error exporting messages:', error);
  }
}

// Initialize Discord bot
client.once('ready', async () => {
  console.log('Discord bot is ready!');
  const channel = client.channels.cache.get(channelId) as TextChannel;
  
  if (!channel) {
    console.error('Channel not found!');
    return;
  }

  // Initial export
  await exportChannelMessages(channel);

  // Schedule daily exports
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const cron = require('node-cron');
  cron.schedule('0 0 * * *', () => {
    exportChannelMessages(channel);
  });
});

// API Endpoints
app.get('/api/discovery-data', async (_req, res) => {
  try {
    const exportsDir = path.join(__dirname, '..', 'src', 'exports');
    await fs.mkdir(exportsDir, { recursive: true });
    
    const files = await fs.readdir(exportsDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    if (jsonFiles.length === 0) {
      return res.status(404).json({ error: 'No data available' });
    }

    const latestFile = jsonFiles.sort().reverse()[0];
    const data = await fs.readFile(
      path.join(exportsDir, latestFile),
      'utf-8'
    );
    
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error serving discovery data:', error);
    res.status(500).json({ error: 'Failed to fetch discovery data' });
  }
});

// Start both the Express server and Discord bot
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
  // Login Discord bot after server is running
  client.login(token)
    .then(() => console.log('Discord bot logged in'))
    .catch(err => console.error('Discord bot login failed:', err));
});
