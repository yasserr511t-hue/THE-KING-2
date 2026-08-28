import { SlashCommandBuilder } from 'discord.js';
import { createInfoEmbed, createErrorEmbed } from '../utils/embeds.js';
import UserService from '../database/services/userService.js';
import { applyCooldown, getCooldownRemaining } from '../utils/cooldown.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('احصل على مكافأة يومية'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const remaining = getCooldownRemaining(userId, 'daily', interaction.client.cooldowns);

    if (remaining > 0) {
      return interaction.reply({
        embeds: [createErrorEmbed(
          'انتظر',
          `يمكنك استخدام هذا الأمر بعد ${Math.ceil(remaining)} ثواني`
        )],
        ephemeral: true,
      });
    }

    try {
      let userData = await UserService.getUserData(userId, interaction.guildId);
      if (!userData) {
        userData = await UserService.createUserData(userId, interaction.guildId);
      }

      const reward = 100;
      await UserService.addBalance(userId, interaction.guildId, reward);
      applyCooldown(userId, 'daily', 86400, interaction.client.cooldowns);

      await interaction.reply({
        embeds: [createInfoEmbed(
          '✅ تم بنجاح',
          `حصلت على ${reward} 🪙 مكافأة يومية!`
        )],
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        embeds: [createErrorEmbed('خطأ', 'فشل الحصول على المكافأة')],
        ephemeral: true,
      });
    }
  },
};

export default command;