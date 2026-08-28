import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getDatabase } from '../database/connection.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('لائحة أغنى الأعضاء'),

  async execute(interaction) {
    try {
      const db = getDatabase();
      const topUsers = await db.collection('users')
        .find({ guildId: interaction.guildId })
        .sort({ balance: -1 })
        .limit(10)
        .toArray();

      if (topUsers.length === 0) {
        return interaction.reply({
          embeds: [new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('💰 لائحة الترتيب')
            .setDescription('لا توجد بيانات بعد')
          ],
          ephemeral: true,
        });
      }

      const leaderboard = topUsers
        .map((user, index) => `**${index + 1}.** <@${user.userId}> - ${user.balance} 🪙`)
        .join('\n');

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('💰 لائحة أغنى الأعضاء')
        .setDescription(leaderboard)
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        embeds: [new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('خطأ')
          .setDescription('فشل جلب لائحة الترتيب')
        ],
        ephemeral: true,
      });
    }
  },
};

export default command;