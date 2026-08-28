import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { createSuccessEmbed, createErrorEmbed } from '../utils/embeds.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('تعيين وضع بطيء للقناة')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('المدة بالثواني (0 لتعطيل)')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(21600)
    ),

  async execute(interaction) {
    const duration = interaction.options.getInteger('duration');
    try {
      await interaction.channel.setRateLimitPerUser(duration);
      const message = duration === 0 ? 'تم تعطيل الوضع البطيء' : `تم تعيين الوضع البطيء إلى ${duration} ثانية`;
      await interaction.reply({
        embeds: [createSuccessEmbed('✅ تم بنجاح', message)],
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        embeds: [createErrorEmbed('خطأ', 'فشل تعيين الوضع البطيء')],
        ephemeral: true,
      });
    }
  },
};

export default command;