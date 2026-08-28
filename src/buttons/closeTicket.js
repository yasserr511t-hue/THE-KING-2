import { Logger } from '../utils/logger.js';
import { getDatabase } from '../database/connection.js';

const button = {
  customId: 'close_ticket',
  async execute(interaction) {
    try {
      const db = getDatabase();
      const ticket = await db.collection('tickets').findOne({
        channelId: interaction.channelId,
        closed: false,
      });

      if (!ticket) {
        return interaction.reply({
          content: '❌ هذه ليست قناة تذكرة',
          ephemeral: true,
        });
      }

      await db.collection('tickets').updateOne(
        { _id: ticket._id },
        { $set: { closed: true, closedAt: new Date(), closedBy: interaction.user.id } }
      );

      await interaction.reply({
        content: '⏳ سيتم حذف هذه القناة بعد 5 ثوان...',
      });

      setTimeout(async () => {
        await interaction.channel.delete();
      }, 5000);

      Logger.info(`🔒 تم إغلاق التذكرة: ${ticket.ticketId}`);
    } catch (error) {
      Logger.error('خطأ في إغلاق التذكرة:', error);
      await interaction.reply({
        content: '❌ فشل إغلاق التذكرة',
        ephemeral: true,
      });
    }
  },
};

export default button;