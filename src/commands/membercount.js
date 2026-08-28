import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('membercount')
    .setDescription('عدد أعضاء السيرفر'),

  async execute(interaction) {
    const guild = interaction.guild;
    const members = await guild.members.fetch();
    const bots = members.filter(m => m.user.bot).size;
    const humans = members.filter(m => !m.user.bot).size;

    const embed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle('👥 عدد الأعضاء')
      .addFields(
        { name: 'الإجمالي', value: guild.memberCount.toString(), inline: true },
        { name: 'أشخاص', value: humans.toString(), inline: true },
        { name: 'بوتات', value: bots.toString(), inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default command;