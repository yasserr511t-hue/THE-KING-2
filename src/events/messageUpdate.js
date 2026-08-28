import { Events, EmbedBuilder } from 'discord.js';
import { Logger } from '../utils/logger.js';
import GuildService from '../database/services/guildService.js';

const event = {
  name: Events.MessageUpdate,
  async execute(oldMessage, newMessage) {
    if (oldMessage.author?.bot || oldMessage.content === newMessage.content) return;

    try {
      const guildSettings = await GuildService.getGuildSettings(newMessage.guildId);

      if (guildSettings && guildSettings.logChannels?.messages) {
        const logChannel = newMessage.guild.channels.cache.get(guildSettings.logChannels.messages);
        if (logChannel) {
          const embed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('✏️ رسالة معدلة')
            .addFields(
              { name: 'المؤلف', value: oldMessage.author?.tag || 'غير معروف', inline: true },
              { name: 'القناة', value: `<#${oldMessage.channelId}>`, inline: true },
              { name: 'الرسالة القديمة', value: oldMessage.content.slice(0, 1024) || 'بدون محتوى', inline: false },
              { name: 'الرسالة الجديدة', value: newMessage.content.slice(0, 1024) || 'بدون محتوى', inline: false }
            )
            .setTimestamp();

          await logChannel.send({ embeds: [embed] });
        }
      }
    } catch (error) {
      Logger.error('خطأ في معالج تعديل الرسالة:', error);
    }
  },
};

export default event;