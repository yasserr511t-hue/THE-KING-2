import { SlashCommandBuilder } from 'discord.js';
import { createInfoEmbed } from '../utils/embeds.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('صورة ملف العضو')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('العضو')
        .setRequired(false)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('user') || interaction.user;
    const avatarURL = targetUser.displayAvatarURL({ size: 1024 });

    const embed = createInfoEmbed(
      '🖼️ الصورة الشخصية',
      `[اضغط هنا للتحميل](${avatarURL})`
    ).setImage(avatarURL);

    await interaction.reply({ embeds: [embed] });
  },
};

export default command;