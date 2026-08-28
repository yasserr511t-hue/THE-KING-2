import { Events, EmbedBuilder } from 'discord.js';
import { Logger } from '../utils/logger.js';
import GuildService from '../database/services/guildService.js';

const event = {
  name: Events.GuildMemberRemove,
  async execute(member) {
    try {
      // Get guild settings
      const guildSettings = await GuildService.getGuildSettings(member.guild.id);

      if (guildSettings && guildSettings.logChannels?.members) {
        const logChannel = member.guild.channels.cache.get(guildSettings.logChannels.members);
        if (logChannel) {
          const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('👤 عضو غادر')
            .addFields(
              { name: 'الاسم', value: member.user.tag, inline: true },
              { name: 'المعرف', value: member.id, inline: true },
              { name: 'كان العضو #', value: member.guild.memberCount.toString(), inline: true }
            )
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp();

          await logChannel.send({ embeds: [embed] });
        }
      }

      Logger.info(`❌ غادر عضو: ${member.user.tag}`);
    } catch (error) {
      Logger.error('خطأ في معالج GuildMemberRemove:', error);
    }
  },
};

export default event;