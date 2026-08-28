import { Events, EmbedBuilder } from 'discord.js';
import { Logger } from '../utils/logger.js';
import GuildService from '../database/services/guildService.js';

const event = {
  name: Events.MessageDelete,
  async execute(message) {
    if (message.author?.bot) return;

    try {
      const guildSettings = await GuildService.getGuildSettings(message.guildId);

      if (guildSettings && guildSettings.logChannels?.messages) {
        const logChannel = message.guild.channels.cache.get(guildSettings.logChannels.messages);
        if (logChannel) {
          const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('🗑️ رسالة محذوفة')
            .addFields(
              { name: 'المؤلف', value: message.author?.tag || 'غير معروف', inline: true },
              { name: 'القناة', value: `<#${message.channelId}>`, inline: true },
              { name: 'المحتوى', value: message.content.slice(0, 1024) || 'بدون محتوى', inline: false }
            )
            .setTimestamp();

          await logChannel.send({ embeds: [embed] });
        }
      }
    } catch (error) {
      Logger.error('خطأ في معالج حذف الرسالة:', error);
    }
  },
};

export default event;