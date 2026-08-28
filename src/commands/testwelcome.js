import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import GuildService from '../database/services/guildService.js';
import { createErrorEmbed } from '../utils/embeds.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('testwelcome')
    .setDescription('اختبار رسالة الترحيب'),

  async execute(interaction) {
    try {
      let guildSettings = await GuildService.getGuildSettings(interaction.guildId);
      if (!guildSettings || !guildSettings.welcomeChannel) {
        return interaction.reply({
          embeds: [createErrorEmbed('خطأ', 'لم يتم تعيين قناة الترحيب بعد')],
          ephemeral: true,
        });
      }

      const welcomeChannel = await interaction.guild.channels.fetch(guildSettings.welcomeChannel);

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle(`👋 أهلا بك في ${interaction.guild.name}`)
        .setDescription(`مرحبا ${interaction.user}!\n\nشكرا لانضمامك إلينا، نتمنى لك وقتا ممتعا معنا!`)
        .setThumbnail(interaction.guild.iconURL())
        .setTimestamp();

      await welcomeChannel.send({ embeds: [embed] });

      await interaction.reply({
        embeds: [new EmbedBuilder()
          .setColor('#00FF00')
          .setTitle('✅ تم الإرسال')
          .setDescription(`تم إرسال رسالة الترحيب إلى ${welcomeChannel}`)
        ],
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        embeds: [createErrorEmbed('خطأ', 'فشل إرسال رسالة الترحيب')],
        ephemeral: true,
      });
    }
  },
};

export default command;