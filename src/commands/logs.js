import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { createErrorEmbed } from '../utils/embeds.js';
import { getDatabase } from '../database/connection.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('logs')
    .setDescription('إعداد قنوات السجلات')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
      subcommand
        .setName('setmod')
        .setDescription('تعيين قناة سجل الإدارة')
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('القناة')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('setmembers')
        .setDescription('تعيين قناة سجل الأعضاء')
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('القناة')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('setmessages')
        .setDescription('تعيين قناة سجل الرسائل')
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('القناة')
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const channel = interaction.options.getChannel('channel');
    const db = getDatabase();

    try {
      const updates = {};
      
      if (subcommand === 'setmod') {
        updates['logChannels.moderation'] = channel.id;
      } else if (subcommand === 'setmembers') {
        updates['logChannels.members'] = channel.id;
      } else if (subcommand === 'setmessages') {
        updates['logChannels.messages'] = channel.id;
      }

      await db.collection('guilds').updateOne(
        { _id: interaction.guildId },
        { $set: updates },
        { upsert: true }
      );

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('✅ تم التعيين')
        .setDescription(`تم تعيين قناة السجل إلى ${channel}`);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        embeds: [createErrorEmbed('خطأ', 'فشل تعيين قناة السجل')],
        ephemeral: true,
      });
    }
  },
};

export default command;