import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { createErrorEmbed, createSuccessEmbed } from '../utils/embeds.js';
import { getDatabase } from '../database/connection.js';
import { v4 as uuidv4 } from 'uuid';

const command = {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('إدارة الجوائز')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
      subcommand
        .setName('start')
        .setDescription('بدء جائزة')
        .addStringOption(option =>
          option.setName('prize')
            .setDescription('الجائزة')
            .setRequired(true)
        )
        .addIntegerOption(option =>
          option.setName('duration')
            .setDescription('المدة بالثواني')
            .setRequired(true)
            .setMinValue(60)
        )
        .addIntegerOption(option =>
          option.setName('winners')
            .setDescription('عدد الفائزين')
            .setRequired(true)
            .setMinValue(1)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('end')
        .setDescription('إنهاء جائزة')
        .addStringOption(option =>
          option.setName('giveaway-id')
            .setDescription('معرف الجائزة')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('reroll')
        .setDescription('إعادة اختيار الفائزين')
        .addStringOption(option =>
          option.setName('giveaway-id')
            .setDescription('معرف الجائزة')
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const db = getDatabase();

    if (subcommand === 'start') {
      const prize = interaction.options.getString('prize');
      const duration = interaction.options.getInteger('duration');
      const winners = interaction.options.getInteger('winners');
      const giveawayId = uuidv4().slice(0, 8);

      try {
        const embed = new EmbedBuilder()
          .setColor('#FFD700')
          .setTitle('🎉 جائزة جديدة!')
          .setDescription(`**الجائزة:** ${prize}\n**الفائزين:** ${winners}\n**الوقت المتبقي:** <t:${Math.floor((Date.now() + duration * 1000) / 1000)}:R>`)
          .addFields(
            { name: 'معرف الجائزة', value: giveawayId, inline: false }
          )
          .setTimestamp();

        const msg = await interaction.channel.send({ embeds: [embed] });

        await db.collection('giveaways').insertOne({
          _id: uuidv4(),
          giveawayId,
          guildId: interaction.guildId,
          channelId: interaction.channelId,
          messageId: msg.id,
          prize,
          duration,
          winners: winners,
          participants: [],
          createdAt: new Date(),
          endsAt: new Date(Date.now() + duration * 1000),
          ended: false,
        });

        await interaction.reply({
          embeds: [createSuccessEmbed('✅ تم البدء', `تم بدء الجائزة: ${prize}`)],
          ephemeral: true,
        });

        // Schedule end
        setTimeout(async () => {
          await endGiveaway(giveawayId, db, interaction.client);
        }, duration * 1000);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          embeds: [createErrorEmbed('خطأ', 'فشل بدء الجائزة')],
          ephemeral: true,
        });
      }
    } else if (subcommand === 'end') {
      const giveawayId = interaction.options.getString('giveaway-id');

      try {
        await endGiveaway(giveawayId, db, interaction.client);
        await interaction.reply({
          embeds: [createSuccessEmbed('✅ تم الإنهاء', 'تم إنهاء الجائزة')],
          ephemeral: true,
        });
      } catch (error) {
        console.error(error);
        await interaction.reply({
          embeds: [createErrorEmbed('خطأ', 'فشل إنهاء الجائزة')],
          ephemeral: true,
        });
      }
    } else if (subcommand === 'reroll') {
      const giveawayId = interaction.options.getString('giveaway-id');

      try {
        const giveaway = await db.collection('giveaways').findOne({ giveawayId });

        if (!giveaway) {
          return interaction.reply({
            embeds: [createErrorEmbed('خطأ', 'لم أجد هذه الجائزة')],
            ephemeral: true,
          });
        }

        const newWinners = selectWinners(giveaway.participants, giveaway.winners);
        const winnersText = newWinners.map(id => `<@${id}>`).join(', ');

        const embed = new EmbedBuilder()
          .setColor('#FFD700')
          .setTitle('🎉 إعادة اختيار الفائزين')
          .setDescription(`الفائزون الجدد: ${winnersText}\n**الجائزة:** ${giveaway.prize}`)
          .setTimestamp();

        const channel = interaction.guild.channels.cache.get(giveaway.channelId);
        const message = await channel.messages.fetch(giveaway.messageId);
        await message.reply({ embeds: [embed] });

        await interaction.reply({
          embeds: [createSuccessEmbed('✅ تم الاختيار', `الفائزون الجدد: ${winnersText}`)],
        });
      } catch (error) {
        console.error(error);
        await interaction.reply({
          embeds: [createErrorEmbed('خطأ', 'فشلت إعادة الاختيار')],
          ephemeral: true,
        });
      }
    }
  },
};

function selectWinners(participants, count) {
  const winners = [];
  const shuffled = [...new Set(participants)].sort(() => Math.random() - 0.5);
  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    winners.push(shuffled[i]);
  }
  return winners;
}

async function endGiveaway(giveawayId, db, client) {
  const giveaway = await db.collection('giveaways').findOne({ giveawayId });

  if (!giveaway || giveaway.ended) return;

  const winners = selectWinners(giveaway.participants, giveaway.winners);
  const winnersText = winners.map(id => `<@${id}>`).join(', ') || 'لا أحد';

  const embed = new EmbedBuilder()
    .setColor('#FFD700')
    .setTitle('🎉 انتهت الجائزة!')
    .setDescription(`**الجائزة:** ${giveaway.prize}\n**الفائزون:** ${winnersText}`)
    .setTimestamp();

  try {
    const guild = client.guilds.cache.get(giveaway.guildId);
    const channel = guild.channels.cache.get(giveaway.channelId);
    const message = await channel.messages.fetch(giveaway.messageId);
    await message.reply({ embeds: [embed] });
  } catch (error) {
    console.error(error);
  }

  await db.collection('giveaways').updateOne(
    { _id: giveaway._id },
    { $set: { ended: true, winners, endedAt: new Date() } }
  );
}

export default command;