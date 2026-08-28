import { SlashCommandBuilder } from 'discord.js';
import { createInfoEmbed, createErrorEmbed, createSuccessEmbed } from '../utils/embeds.js';
import UserService from '../database/services/userService.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('pay')
    .setDescription('إرسال عملات لعضو آخر')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('المستقبل')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('المبلغ')
        .setRequired(true)
        .setMinValue(1)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    if (targetUser.id === interaction.user.id) {
      return interaction.reply({
        embeds: [createErrorEmbed('خطأ', 'لا يمكنك إرسال عملات لنفسك')],
        ephemeral: true,
      });
    }

    try {
      let senderData = await UserService.getUserData(interaction.user.id, interaction.guildId);
      if (!senderData) {
        senderData = await UserService.createUserData(interaction.user.id, interaction.guildId);
      }

      if (senderData.balance < amount) {
        return interaction.reply({
          embeds: [createErrorEmbed('خطأ', 'لا تملك عملات كافية')],
          ephemeral: true,
        });
      }

      let receiverData = await UserService.getUserData(targetUser.id, interaction.guildId);
      if (!receiverData) {
        receiverData = await UserService.createUserData(targetUser.id, interaction.guildId);
      }

      await UserService.addBalance(interaction.user.id, interaction.guildId, -amount);
      await UserService.addBalance(targetUser.id, interaction.guildId, amount);

      await interaction.reply({
        embeds: [createSuccessEmbed(
          '✅ تم بنجاح',
          `أرسلت ${amount} 🪙 إلى ${targetUser}`
        )],
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        embeds: [createErrorEmbed('خطأ', 'فشل الإرسال')],
        ephemeral: true,
      });
    }
  },
};

export default command;