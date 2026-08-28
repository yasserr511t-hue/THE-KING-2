import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('معلومات البوت'),

  async execute(interaction) {
    const client = interaction.client;
    const embed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle('🤖 معلومات البوت')
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        { name: 'الاسم', value: client.user.username, inline: true },
        { name: 'المعرف', value: client.user.id, inline: true },
        { name: 'عدد السيرفرات', value: client.guilds.cache.size.toString(), inline: true },
        { name: 'عدد الأعضاء', value: client.users.cache.size.toString(), inline: true },
        { name: 'الإصدار', value: '1.0.0', inline: true },
        { name: 'المكتبة', value: 'discord.js v14', inline: true },
        { name: 'تاريخ التسجيل', value: `<t:${Math.floor(client.user.createdTimestamp / 1000)}:d>`, inline: false }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default command;