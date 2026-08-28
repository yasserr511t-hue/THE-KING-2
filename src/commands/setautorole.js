import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { createSuccessEmbed, createErrorEmbed } from '../utils/embeds.js';
import GuildService from '../database/services/guildService.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('setautorole')
    .setDescription('تعيين دور تلقائي')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('الدور')
        .setRequired(true)
    ),

  async execute(interaction) {
    const role = interaction.options.getRole('role');

    try {
      let guildSettings = await GuildService.getGuildSettings(interaction.guildId);
      if (!guildSettings) {
        guildSettings = await GuildService.createGuildSettings(interaction.guildId);
      }

      await GuildService.updateGuildSettings(interaction.guildId, {
        autoRole: role.id,
      });

      await interaction.reply({
        embeds: [createSuccessEmbed('✅ تم بنجاح', `تم تعيين الدور التلقائي إلى ${role}`)],
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        embeds: [createErrorEmbed('خطأ', 'فشل تعيين الدور التلقائي')],
        ephemeral: true,
      });
    }
  },
};

export default command;