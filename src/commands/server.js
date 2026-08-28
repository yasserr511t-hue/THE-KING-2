import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { createInfoEmbed } from '../utils/embeds.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('معلومات السيرفر'),

  async execute(interaction) {
    const guild = interaction.guild;
    const embed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle('🏢 معلومات السيرفر')
      .setThumbnail(guild.iconURL())
      .addFields(
        { name: 'الاسم', value: guild.name, inline: true },
        { name: 'المعرف', value: guild.id, inline: true },
        { name: 'المالك', value: `<@${guild.ownerId}>`, inline: true },
        { name: 'عدد الأعضاء', value: guild.memberCount.toString(), inline: true },
        { name: 'عدد القنوات', value: guild.channels.cache.size.toString(), inline: true },
        { name: 'عدد الأدوار', value: guild.roles.cache.size.toString(), inline: true },
        { name: 'تاريخ الإنشاء', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:d>`, inline: true },
        { name: 'مستوى التحقق', value: guild.verificationLevel, inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default command;