import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { createSuccessEmbed, createErrorEmbed } from '../utils/embeds.js';
import GuildService from '../database/services/guildService.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('setwelcome')
    .setDescription('تعيين قناة الترحيب')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('قناة الترحيب')
        .setRequired(true)
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');

    try {
      let guildSettings = await GuildService.getGuildSettings(interaction.guildId);
      if (!guildSettings) {
        guildSettings = await GuildService.createGuildSettings(interaction.guildId);
      }

      await GuildService.updateGuildSettings(interaction.guildId, {
        welcomeChannel: channel.id,
      });

      await interaction.reply({
        embeds: [createSuccessEmbed('✅ تم بنجاح', `تم تعيين قناة الترحيب إلى ${channel}`)],
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        embeds: [createErrorEmbed('خطأ', 'فشل تعيين قناة الترحيب')],
        ephemeral: true,
      });
    }
  },
};

export default command;