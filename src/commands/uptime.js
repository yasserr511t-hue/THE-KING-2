import { SlashCommandBuilder } from 'discord.js';
import { createInfoEmbed } from '../utils/embeds.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('وقت تشغيل البوت'),

  async execute(interaction) {
    const uptime = interaction.client.uptime;
    const days = Math.floor(uptime / 86400000);
    const hours = Math.floor((uptime % 86400000) / 3600000);
    const minutes = Math.floor((uptime % 3600000) / 60000);
    const seconds = Math.floor((uptime % 60000) / 1000);

    const embed = createInfoEmbed(
      '⏱️ وقت التشغيل',
      `${days}د ${hours}س ${minutes}د ${seconds}ث`
    );

    await interaction.reply({ embeds: [embed] });
  },
};

export default command;