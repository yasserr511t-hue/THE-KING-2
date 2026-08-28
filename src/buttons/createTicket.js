import { ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { Logger } from '../utils/logger.js';
import { getDatabase } from '../database/connection.js';
import { v4 as uuidv4 } from 'uuid';

const button = {
  customId: 'create_ticket',
  async execute(interaction) {
    try {
      const db = getDatabase();
      const ticketId = uuidv4().slice(0, 8);
      const channelName = `ticket-${ticketId}`;

      // Create ticket channel
      const ticketChannel = await interaction.guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        topic: `تذكرة من ${interaction.user.tag}`,
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

      // Save ticket to database
      await db.collection('tickets').insertOne({
        _id: uuidv4(),
        ticketId,
        guildId: interaction.guildId,
        channelId: ticketChannel.id,
        userId: interaction.user.id,
        createdAt: new Date(),
        closed: false,
      });

      // Send ticket embed
      const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle('🎫 تذكرة جديدة')
        .setDescription(`مرحباً ${interaction.user}! شكراً لتواصلك معنا.\n\nسيقوم الفريق بالرد عليك قريباً.`)
        .addFields(
          { name: 'معرف التذكرة', value: ticketId, inline: true },
          { name: 'الحالة', value: 'مفتوحة ✅', inline: true }
        )
        .setTimestamp();

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('close_ticket')
            .setLabel('إغلاق التذكرة')
            .setStyle(ButtonStyle.Danger)
        );

      await ticketChannel.send({ embeds: [embed], components: [row] });

      await interaction.reply({
        content: `✅ تم إنشاء التذكرة! ${ticketChannel}`,
        ephemeral: true,
      });

      Logger.info(`📧 تذكرة جديدة من ${interaction.user.tag}`);
    } catch (error) {
      Logger.error('خطأ في إنشاء التذكرة:', error);
      await interaction.reply({
        content: '❌ فشل إنشاء التذكرة',
        ephemeral: true,
      });
    }
  },
};

export default button;