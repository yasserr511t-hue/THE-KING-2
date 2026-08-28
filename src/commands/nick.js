import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { createSuccessEmbed, createErrorEmbed } from '../utils/embeds.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('nick')
    .setDescription('تغيير اسم عضو')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .addUserOption(option =>
      option.setName('user')
        .setDescription('العضو')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('nickname')
        .setDescription('الاسم الجديد')
        .setRequired(true)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('user');
    const nickname = interaction.options.getString('nickname');
    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    if (!targetMember) {
      return interaction.reply({
        embeds: [createErrorEmbed('خطأ', 'لم أتمكن من العثور على هذا العضو')],
        ephemeral: true,
      });
    }

    try {
      await targetMember.setNickname(nickname);
      await interaction.reply({
        embeds: [createSuccessEmbed('✅ تم بنجاح', `تم تغيير اسم ${targetUser} إلى ${nickname}`)],
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        embeds: [createErrorEmbed('خطأ', 'فشل تغيير الاسم')],
        ephemeral: true,
      });
    }
  },
};

export default command;