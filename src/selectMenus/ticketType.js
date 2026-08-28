import { ChannelType, EmbedBuilder } from 'discord.js';
import { Logger } from '../utils/logger.js';
import { getDatabase } from '../database/connection.js';

const selectMenu = {
  customId: 'ticket_type',
  async execute(interaction) {
    try {
      const ticketType = interaction.values[0];
      const db = getDatabase();
      const channelName = `${ticketType}-${interaction.user.id.slice(-4)}`;

      const ticketChannel = await interaction.guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        topic: `تذكرة ${ticketType} من ${interaction.user.tag}`,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: ['ViewChannel'],
          },
          {
            id: interaction.user.id,
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
          },
        ],
      });

      const ticketId = Math.random().toString(36).substring(2, 8).toUpperCase();

      await db.collection('tickets').insertOne({
        ticketId,
        guildId: interaction.guildId,
        channelId: ticketChannel.id,
        userId: interaction.user.id,
        type: ticketType,
        createdAt: new Date(),
        closed: false,
      });

      const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle('🎫 تذكرة جديدة')
        .setDescription(`مرحباً ${interaction.user}! شكراً لتواصلك معنا.\n\nسيقوم الفريق بالرد عليك قريباً.`)
        .addFields(
          { name: 'النوع', value: ticketType, inline: true },
          { name: 'معرف التذكرة', value: ticketId, inline: true }
        )
        .setTimestamp();

      await ticketChannel.send({ embeds: [embed] });

      await interaction.reply({
        content: `✅ تم إنشاء التذكرة! ${ticketChannel}`,
        ephemeral: true,
      });

      Logger.info(`📧 تذكرة جديدة: ${ticketId} من ${interaction.user.tag}`);
    } catch (error) {
      Logger.error('خطأ في قائمة التذاكر:', error);
      await interaction.reply({
        content: '❌ فشل إنشاء التذكرة',
        ephemeral: true,
      });
    }
  },
};

export default selectMenu;