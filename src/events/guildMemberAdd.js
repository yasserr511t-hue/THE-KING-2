import { Events, EmbedBuilder } from 'discord.js';
import { Logger } from '../utils/logger.js';
import GuildService from '../database/services/guildService.js';
import UserService from '../database/services/userService.js';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/connection.js';

const event = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    try {
      // Create user data
      let userData = await UserService.getUserData(member.id, member.guild.id);
      if (!userData) {
        userData = await UserService.createUserData(member.id, member.guild.id);
      }

      // Get guild settings
      let guildSettings = await GuildService.getGuildSettings(member.guild.id);
      if (!guildSettings) {
        guildSettings = await GuildService.createGuildSettings(member.guild.id);
      }

      // Add auto role
      if (guildSettings.autoRole) {
        const role = member.guild.roles.cache.get(guildSettings.autoRole);
        if (role) {
          await member.roles.add(role).catch(() => {});
        }
      }

      // Send welcome message
      if (guildSettings.welcomeChannel) {
        const welcomeChannel = member.guild.channels.cache.get(guildSettings.welcomeChannel);
        if (welcomeChannel) {
          const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle(`👋 أهلا بك في ${member.guild.name}`)
            .setDescription(`مرحبا ${member}!\n\nشكرا لانضمامك إلينا، نتمنى لك وقتا ممتعا معنا!`)
            .setThumbnail(member.user.displayAvatarURL())
            .setFooter({ text: `العضو #${member.guild.memberCount}` })
            .setTimestamp();

          await welcomeChannel.send({ embeds: [embed] });
        }
      }

      // Log member join
      if (guildSettings.logChannels?.members) {
        const logChannel = member.guild.channels.cache.get(guildSettings.logChannels.members);
        if (logChannel) {
          const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('👤 عضو جديد')
            .addFields(
              { name: 'الاسم', value: member.user.tag, inline: true },
              { name: 'المعرف', value: member.id, inline: true },
              { name: 'الحساب منذ', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:d>`, inline: true }
            )
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp();

          await logChannel.send({ embeds: [embed] });
        }
      }

      Logger.info(`✅ انضم عضو جديد: ${member.user.tag}`);
    } catch (error) {
      Logger.error('خطأ في معالج GuildMemberAdd:', error);
    }
  },
};

export default event;