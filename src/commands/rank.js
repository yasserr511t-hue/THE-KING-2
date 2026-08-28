import { SlashCommandBuilder } from 'discord.js';
import { createInfoEmbed, createErrorEmbed } from '../utils/embeds.js';
import UserService from '../database/services/userService.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('عرض مستواك')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('العضو')
        .setRequired(false)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('user') || interaction.user;

    try {
      let userData = await UserService.getUserData(targetUser.id, interaction.guildId);
      if (!userData) {
        userData = await UserService.createUserData(targetUser.id, interaction.guildId);
      }

      const xpForNextLevel = userData.level * 100 + 100;
      const xpProgress = userData.xp % xpForNextLevel;

      await interaction.reply({
        embeds: [createInfoEmbed(
          '⭐ مستواك',
          `**${targetUser.username}**\n\nالمستوى: ${userData.level}\nالخبرة: ${userData.xp}\nالتقدم: ${xpProgress}/${xpForNextLevel}`
        )],
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        embeds: [createErrorEmbed('خطأ', 'فشل جلب البيانات')],
        ephemeral: true,
      });
    }
  },
};

export default command;