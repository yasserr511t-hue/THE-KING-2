import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { createSuccessEmbed, createErrorEmbed } from '../utils/embeds.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('إضافة أو إزالة دور')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('إضافة دور')
        .addUserOption(option =>
          option.setName('user')
            .setDescription('العضو')
            .setRequired(true)
        )
        .addRoleOption(option =>
          option.setName('role')
            .setDescription('الدور')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('إزالة دور')
        .addUserOption(option =>
          option.setName('user')
            .setDescription('العضو')
            .setRequired(true)
        )
        .addRoleOption(option =>
          option.setName('role')
            .setDescription('الدور')
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const targetUser = interaction.options.getUser('user');
    const role = interaction.options.getRole('role');
    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

    if (!targetMember) {
      return interaction.reply({
        embeds: [createErrorEmbed('خطأ', 'لم أتمكن من العثور على هذا العضو')],
        ephemeral: true,
      });
    }

    try {
      if (subcommand === 'add') {
        await targetMember.roles.add(role);
        await interaction.reply({
          embeds: [createSuccessEmbed('✅ تم بنجاح', `تمت إضافة الدور ${role} للعضو ${targetUser}`)],
        });
      } else if (subcommand === 'remove') {
        await targetMember.roles.remove(role);
        await interaction.reply({
          embeds: [createSuccessEmbed('✅ تم بنجاح', `تمت إزالة الدور ${role} من العضو ${targetUser}`)],
        });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({
        embeds: [createErrorEmbed('خطأ', 'فشل تنفيذ العملية')],
        ephemeral: true,
      });
    }
  },
};

export default command;