import { SlashCommandBuilder } from 'discord.js';
import { createInfoEmbed, createErrorEmbed } from '../utils/embeds.js';
import UserService from '../database/services/userService.js';
import { applyCooldown, getCooldownRemaining } from '../utils/cooldown.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('اعمل واحصل على عملات'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const remaining = getCooldownRemaining(userId, 'work', interaction.client.cooldowns);

    if (remaining > 0) {
      return interaction.reply({
        embeds: [createErrorEmbed(
          'انتظر',
          `يمكنك العمل بعد ${Math.ceil(remaining)} ثواني`
        )],
        ephemeral: true,
      });
    }

    try {
      let userData = await UserService.getUserData(userId, interaction.guildId);
      if (!userData) {
        userData = await UserService.createUserData(userId, interaction.guildId);
      }

      const reward = Math.floor(Math.random() * (100 - 30 + 1)) + 30;
      await UserService.addBalance(userId, interaction.guildId, reward);
      applyCooldown(userId, 'work', 3600, interaction.client.cooldowns);

      await interaction.reply({
        embeds: [createInfoEmbed(
          '✅ عملت بجد!',
          `حصلت على ${reward} 🪙 من العمل!`
        )],
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        embeds: [createErrorEmbed('خطأ', 'فشل العمل')],
        ephemeral: true,
      });
    }
  },
};

export default command;