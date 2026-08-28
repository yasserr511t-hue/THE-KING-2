import { Events, EmbedBuilder } from 'discord.js';
import { Logger } from '../utils/logger.js';
import { applyCooldown, getCooldownRemaining } from '../utils/cooldown.js';
import GuildService from '../database/services/guildService.js';
import UserService from '../database/services/userService.js';

const event = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;

    try {
      // Get guild settings
      const guildSettings = await GuildService.getGuildSettings(message.guildId);
      if (!guildSettings) return;

      // Add XP
      const remaining = getCooldownRemaining(message.author.id, `xp-${message.guildId}`, message.client.cooldowns);
      if (remaining <= 0) {
        let userData = await UserService.getUserData(message.author.id, message.guildId);
        if (!userData) {
          userData = await UserService.createUserData(message.author.id, message.guildId);
        }

        const xpGain = guildSettings.levels?.xpPerMessage || 10;
        const xpForLevel = (userData.level + 1) * 100;

        await UserService.addXP(message.author.id, message.guildId, xpGain);

        if (userData.xp + xpGain >= xpForLevel) {
          const newLevel = userData.level + 1;
          await UserService.updateUserData(message.author.id, message.guildId, { level: newLevel, xp: 0 });

          const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('🎉 مستوى جديد!')
            .setDescription(`تهانينا ${message.author}، وصلت إلى المستوى **${newLevel}**!`)
            .setTimestamp();

          await message.reply({ embeds: [embed] }).catch(() => {});
        }

        applyCooldown(message.author.id, `xp-${message.guildId}`, guildSettings.levels?.cooldown || 60, message.client.cooldowns);
      }
    } catch (error) {
      Logger.error('خطأ في معالج MessageCreate:', error);
    }
  },
};

export default event;