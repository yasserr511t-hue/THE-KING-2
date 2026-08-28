import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('roles')
    .setDescription('قائمة الأدوار'),

  async execute(interaction) {
    const roles = interaction.guild.roles.cache
      .filter(r => r.name !== '@everyone')
      .sort((a, b) => b.position - a.position)
      .first(25);

    const embed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle('🏆 الأدوار')
      .setDescription(roles.map(r => `${r} - ${r.members.size} عضو`).join('\n') || 'لا توجد أدوار')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default command;