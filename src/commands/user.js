import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('معلومات عضو')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('العضو')
        .setRequired(false)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('user') || interaction.user;
    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    const embed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle('👤 معلومات العضو')
      .setThumbnail(targetUser.displayAvatarURL())
      .addFields(
        { name: 'الاسم', value: targetUser.username, inline: true },
        { name: 'المعرف', value: targetUser.id, inline: true },
        { name: 'البوت؟', value: targetUser.bot ? 'نعم ✅' : 'لا ❌', inline: true },
        { name: 'تاريخ التسجيل', value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:d>`, inline: true },
        targetMember ? { name: 'تاريخ الانضمام', value: `<t:${Math.floor(targetMember.joinedTimestamp / 1000)}:d>`, inline: true } : null,
        targetMember ? { name: 'الأدوار', value: targetMember.roles.cache.size > 1 ? targetMember.roles.cache.map(r => r.toString()).join(', ') : 'لا يمتلك أدوار', inline: false } : null
      )
      .setTimestamp()
      .filter(field => field !== null);

    await interaction.reply({ embeds: [embed] });
  },
};

export default command;