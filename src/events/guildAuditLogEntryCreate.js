import { Events, AuditLogEvent } from 'discord.js';
import { Logger } from '../utils/logger.js';
import GuildService from '../database/services/guildService.js';

const event = {
  name: Events.GuildAuditLogEntryCreate,
  async execute(auditLogEntry, guild) {
    try {
      const guildSettings = await GuildService.getGuildSettings(guild.id);

      if (!guildSettings || !guildSettings.logChannels?.server) return;

      const logChannel = guild.channels.cache.get(guildSettings.logChannels.server);
      if (!logChannel) return;

      const { executor, targetType, action } = auditLogEntry;

      let message = '';
      
      switch (action) {
        case AuditLogEvent.MemberRoleUpdate:
          message = `تم تحديث دور العضو <@${auditLogEntry.target.id}>`;
          break;
        case AuditLogEvent.ChannelCreate:
          message = `تم إنشاء قناة: ${auditLogEntry.target.name}`;
          break;
        case AuditLogEvent.ChannelDelete:
          message = `تم حذف قناة: ${auditLogEntry.target.name}`;
          break;
        case AuditLogEvent.RoleCreate:
          message = `تم إنشاء دور: ${auditLogEntry.target.name}`;
          break;
        case AuditLogEvent.RoleDelete:
          message = `تم حذف دور: ${auditLogEntry.target.name}`;
          break;
      }

      if (message) {
        await logChannel.send(`🔔 **${message}** بواسطة ${executor}`);
      }
    } catch (error) {
      Logger.error('خطأ في معالج سجل الإدارة:', error);
    }
  },
};

export default event;