import { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { createSuccessEmbed, createErrorEmbed } from '../utils/embeds.js';
import { getDatabase } from '../database/connection.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('إنشاء لوحة التذاكر')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
      subcommand
        .setName('setup')
        .setDescription('إعداد نظام التذاكر')
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('قناة إنشاء التذاكر')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('close')
        .setDescription('إغلاق التذكرة')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('reopen')
        .setDescription('إعادة فتح التذكرة')
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const db = getDatabase();

    if (subcommand === 'setup') {
      const channel = interaction.options.getChannel('channel');
      
      try {
        const embed = new EmbedBuilder()
          .setColor('#0099FF')
          .setTitle('🎫 نظام التذاكر')
          .setDescription('اضغط على الزر أدناه لإنشاء تذكرة')
          .addFields(
            { name: 'الأنواع', value: '`دعم` | `شكوى` | `إبلاغ` | `شراكة` | `أخرى`' }
          );

        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('create_ticket')
              .setLabel('إنشاء تذكرة')
              .setStyle(ButtonStyle.Primary)
          );

        await channel.send({ embeds: [embed], components: [row] });

        await db.collection('guilds').updateOne(
          { _id: interaction.guildId },
          { $set: { ticketChannel: channel.id } },
          { upsert: true }
        );

        await interaction.reply({
          embeds: [createSuccessEmbed('✅ تم بنجاح', `تم إعداد لوحة التذاكر في ${channel}`)],
          ephemeral: true,
        });
      } catch (error) {
        console.error(error);
        await interaction.reply({
          embeds: [createErrorEmbed('خطأ', 'فشل إعداد نظام التذاكر')],
          ephemeral: true,
        });
      }
    } else if (subcommand === 'close') {
      try {
        const ticket = await db.collection('tickets').findOne({
          channelId: interaction.channelId,
          closed: false,
        });

        if (!ticket) {
          return interaction.reply({
            embeds: [createErrorEmbed('خطأ', 'هذه ليست قناة تذكرة')],
            ephemeral: true,
          });
        }

        await db.collection('tickets').updateOne(
          { _id: ticket._id },
          { $set: { closed: true, closedAt: new Date(), closedBy: interaction.user.id } }
        );

        await interaction.channel.delete();
      } catch (error) {
        console.error(error);
        await interaction.reply({
          embeds: [createErrorEmbed('خطأ', 'فشل إغلاق التذكرة')],
          ephemeral: true,
        });
      }
    } else if (subcommand === 'reopen') {
      try {
        const ticket = await db.collection('tickets').findOne({
          channelId: interaction.channelId,
        });

        if (!ticket) {
          return interaction.reply({
            embeds: [createErrorEmbed('خطأ', 'هذه ليست قناة تذكرة')],
            ephemeral: true,
          });
        }

        await db.collection('tickets').updateOne(
          { _id: ticket._id },
          { $set: { closed: false } }
        );

        await interaction.reply({
          embeds: [createSuccessEmbed('✅ تم بنجاح', 'تم إعادة فتح التذكرة')],
        });
      } catch (error) {
        console.error(error);
        await interaction.reply({
          embeds: [createErrorEmbed('خطأ', 'فشل إعادة فتح التذكرة')],
          ephemeral: true,
        });
      }
    }
  },
};

export default command;