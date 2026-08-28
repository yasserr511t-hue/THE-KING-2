import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getDatabase } from '../database/connection.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('xp-leaderboard')
    .setDescription('لائحة أعلى المستويات'),

  async execute(interaction) {
    try {
      const db = getDatabase();
      const topUsers = await db.collection('users')
        .find({ guildId: interaction.guildId })
        .sort({ level: -1, xp: -1 })
        .limit(10)
        .toArray();

      if (topUsers.length === 0) {
        return interaction.reply({
          embeds: [new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('⭐ لائحة المستويات')
            .setDescription('لا توجد بيانات بعد')
          ],
          ephemeral: true,
        });
      }

      const leaderboard = topUsers
        .map((user, index) => `**${index + 1}.** <@${user.userId}> - المستوى: ${user.level} (${user.xp} XP)`)
        .join('\n');

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('⭐ أعلى المستويات')
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