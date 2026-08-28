import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('عرض قائمة الأوامر'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle('📖 قائمة الأوامر')
      .setDescription('جميع أوامر البوت المتاحة')
      .addFields(
        { name: '🛡️ الإدارة', value: '`/warn` `/warnings` `/clearwarns` `/kick` `/ban` `/timeout` `/unmute` `/clear` `/slowmode` `/lock` `/unlock` `/nick` `/role` `/announce`', inline: false },
        { name: '🎫 التذاكر', value: '`/ticket setup` `/ticket close` `/ticket reopen`', inline: false },
        { name: '👋 الترحيب', value: '`/setwelcome` `/setautorole` `/testwelcome`', inline: false },
        { name: '💬 المجتمع', value: '`/ping` `/help` `/server` `/user` `/avatar` `/banner` `/roles` `/membercount` `/botinfo` `/uptime` `/stats`', inline: false },
        { name: '💰 الاقتصاد', value: '`/balance` `/daily` `/work` `/pay` `/leaderboard`', inline: false },
        { name: '⭐ المستويات', value: '`/rank` `/levels` `/xp-leaderboard`', inline: false },
        { name: '🎉 الجوائز', value: '`/giveaway start` `/giveaway end` `/giveaway reroll` `/giveaway cancel`', inline: false }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};

export default command;