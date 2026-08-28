import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { createSuccessEmbed, createErrorEmbed } from '../utils/embeds.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('فتح القناة')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    try {
      await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SendMessages: null,
      });
      await interaction.reply({
        embeds: [createSuccessEmbed('✅ تم الفتح', 'تم فتح القناة بنجاح')],
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        embeds: [createErrorEmbed('خطأ', 'فشل فتح القناة')],
        ephemeral: true,
      });
    }
  },
};

export default command;