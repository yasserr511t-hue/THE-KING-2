import { Client, GatewayIntentBits, ChannelType } from 'discord.js';
import dotenv from 'dotenv';
import { connectDatabase } from './database/connection.js';
import { loadEvents } from './handlers/eventHandler.js';
import { loadCommands } from './handlers/commandHandler.js';
import { Logger } from './utils/logger.js';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
  ],
});

client.commands = new Map();
client.buttons = new Map();
client.selectMenus = new Map();
client.modals = new Map();
client.cooldowns = new Map();

async function start() {
  try {
    Logger.info('🔌 Connecting to database...');
    await connectDatabase();
    Logger.info('✅ Database connected');

    Logger.info('📂 Loading commands...');
    await loadCommands(client);
    Logger.info(`✅ Loaded ${client.commands.size} commands`);

    Logger.info('📂 Loading events...');
    await loadEvents(client);
    Logger.info('✅ Events loaded');

    await client.login(process.env.BOT_TOKEN);
  } catch (error) {
    Logger.error('Failed to start bot:', error);
    process.exit(1);
  }
}

start();

process.on('unhandledRejection', (error) => {
  Logger.error('Unhandled Rejection:', error);
});

process.on('uncaughtException', (error) => {
  Logger.error('Uncaught Exception:', error);
  process.exit(1);
});

export default client;
