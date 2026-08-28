import { SlashCommandBuilder } from 'discord.js';
import { createInfoEmbed } from '../utils/embeds.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('عرض سرعة البوت'),

  async execute(interaction) {
    const ping = interaction.client.ws.ping;
    await interaction.reply({
      embeds: [createInfoEmbed('🏓 البينج', `سرعة البوت: ${ping}ms`)],
    });
  },
};

export default command;