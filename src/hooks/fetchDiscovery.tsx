import { Client, IntentsBitField, TextChannel } from 'discord.js';
import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';


// Discord bot token

const token = process.env.DISCORD_BOT_TOKEN;


const serverId = '944370728675991584';
const channelId = '946913692954525736';


const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.once('ready', async () => {
  console.log('Bot is ready!');

  // Fetch the channel
  const channel = client.channels.cache.get(channelId) as TextChannel;
  if (!channel) {
    console.error('Channel not found!');
    return;
  }

  // Schedule the export function
  scheduleExport(channel);
});

/**
 * Fetches and exports messages from a channel to a file.
 * @param channel The Discord channel to export messages from.
 */
async function exportChannelMessages(channel: TextChannel) {
  try {
    const messages = await fetchAllMessages(channel);

    // Format the messages
    const formattedMessages = messages.map((msg) => ({
      author: msg.author.username,
      content: msg.content,
      timestamp: msg.createdAt.toISOString(),
    }));

    // Create a filename with the channel name and current date
    const filename = `${channel.name}-${new Date().toISOString().slice(0, 10)}.json`;
    const filePath = path.join(__dirname, '..', 'src', 'exports', filename);
      await fs.promises.mkdir(path.join(__dirname, '..', 'src', 'exports'), { recursive: true });

    // Write the messages to a JSON file
    fs.writeFileSync(filePath, JSON.stringify(formattedMessages, null, 2));
    console.log(`Messages exported to ${filePath}`);
  } catch (error) {
    console.error('Error exporting messages:', error);
  }
}

/**
 * Fetches all messages from a channel.
 * @param channel The Discord channel to fetch messages from.
 * @returns An array of messages.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchAllMessages(channel: TextChannel): Promise<any[]> {
  let messages = [];
  let lastId;

  while (true) {
    const fetchedMessages = await channel.messages.fetch({
      limit: 100,
      ...(lastId && { before: lastId }),
    });

    if (fetchedMessages.size === 0) {
      break;
    }

    messages = messages.concat(Array.from(fetchedMessages.values()));
    lastId = fetchedMessages.lastKey();
  }

  return messages;
}

/**
 * Schedules the export function to run at a specified interval.
 * @param channel The Discord channel to export.
 */
function scheduleExport(channel: TextChannel) {
  // Schedule the export to run daily at midnight (0 0 * * *)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const cron = require('node-cron');
  cron.schedule('0 0 * * *', () => {
    exportChannelMessages(channel);
  });
}

client.login(token);