import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { createSuccessEmbed, createErrorEmbed } from '../utils/embeds.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('إرسال إعلا��')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('القناة')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('message')
        .setDescription('الرسالة')
        .setRequired(true)
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const message = interaction.options.getString('message');

    try {
      await channel.send({ content: message });
      await interaction.reply({
        embeds: [createSuccessEmbed('✅ تم بنجاح', `تم إرسال الإعلان في ${channel}`)],
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        embeds: [createErrorEmbed('خطأ', 'فشل إرسال الإعلان')],
        ephemeral: true,
      });
    }
  },
};

export default command;