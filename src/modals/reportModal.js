import { EmbedBuilder } from 'discord.js';
import { Logger } from '../utils/logger.js';
import { getDatabase } from '../database/connection.js';
import { v4 as uuidv4 } from 'uuid';

const modal = {
  customId: 'report_modal',
  async execute(interaction) {
    try {
      const reason = interaction.fields.getTextInputValue('report_reason');
      const evidence = interaction.fields.getTextInputValue('report_evidence') || 'لا توجد';
      const db = getDatabase();

      const report = {
        _id: uuidv4(),
        guildId: interaction.guildId,
        userId: interaction.user.id,
        reason,
        evidence,
        createdAt: new Date(),
        status: 'pending',
      };

      await db.collection('reports').insertOne(report);

      const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('✅ تم تقديم الشكوى')
        .setDescription(`شكراً لك! تم استقبال شكواك بنجاح.\n\nمعرف الشكوى: \`${report._id.slice(0, 8)}\``)
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });

      // إرسال إشعار للمسؤولين
      const guildSettings = await db.collection('guilds').findOne({ _id: interaction.guildId });
      if (guildSettings?.logChannels?.moderation) {
        const logChannel = interaction.guild.channels.cache.get(guildSettings.logChannels.moderation);
        if (logChannel) {
          const adminEmbed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('📋 شكوى جديدة')
            .addFields(
              { name: 'المستخدم', value: `<@${interaction.user.id}>`, inline: true },
              { name: 'المعرف', value: report._id.slice(0, 8), inline: true },
              { name: 'التفاصيل', value: reason, inline: false },
              { name: 'الأدلة', value: evidence, inline: false }
            )
            .setTimestamp();

          await logChannel.send({ embeds: [adminEmbed] });
        }
      }

      Logger.info(`📋 شكوى جديدة من ${interaction.user.tag}`);
    } catch (error) {
      Logger.error('خطأ في معالج الشكوى:', error);
      await interaction.reply({
        content: '❌ فشل تقديم الشكوى',
        ephemeral: true,
      });
    }
  },
};

export default modal;