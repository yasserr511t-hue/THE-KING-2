import { TextInputBuilder, TextInputStyle, ModalBuilder, ActionRowBuilder } from 'discord.js';

const button = {
  customId: 'report_button',
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('report_modal')
      .setTitle('تقديم شكوى');

    const reasonInput = new TextInputBuilder()
      .setCustomId('report_reason')
      .setLabel('تفاصيل الشكوى')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setMinLength(10)
      .setMaxLength(500);

    const evidenceInput = new TextInputBuilder()
      .setCustomId('report_evidence')
      .setLabel('الأدلة (اختياري)')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false)
      .setMaxLength(500);

    const row1 = new ActionRowBuilder().addComponents(reasonInput);
    const row2 = new ActionRowBuilder().addComponents(evidenceInput);

    modal.addComponents(row1, row2);

    await interaction.showModal(modal);
  },
};

export default button;