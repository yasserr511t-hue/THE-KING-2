import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { createErrorEmbed, createSuccessEmbed } from '../utils/embeds.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('حذف الرسائل من القناة')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('عدد الرسائل')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    ),

  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    try {
      await interaction.channel.bulkDelete(amount, true);
      await interaction.reply({
        embeds: [createSuccessEmbed('✅ تم الحذف بنجاح', `تم حذف ${amount} رسالة`)],
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        embeds: [createErrorEmbed('خطأ', 'فشل حذف الرسائل')],
        ephemeral: true,
      });
    }
  },
};

export default command;