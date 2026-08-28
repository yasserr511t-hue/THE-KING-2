import { SlashCommandBuilder } from 'discord.js';
import { createInfoEmbed, createErrorEmbed } from '../utils/embeds.js';
import UserService from '../database/services/userService.js';
import GuildService from '../database/services/guildService.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('عرض رصيد العملات')
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

      await interaction.reply({
        embeds: [createInfoEmbed(
          '💰 الرصيد',
          `**${targetUser.username}**: ${userData.balance} 🪙`
        )],
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        embeds: [createErrorEmbed('خطأ', 'فشل جلب الرصيد')],
        ephemeral: true,
      });
    }
  },
};

export default command;