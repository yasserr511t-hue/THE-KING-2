import { EmbedBuilder } from 'discord.js';

function createSuccessEmbed(title, description) {
  return new EmbedBuilder()
    .setColor('#00FF00')
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
}

function createErrorEmbed(title, description) {
  return new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
}

function createInfoEmbed(title, description) {
  return new EmbedBuilder()
    .setColor('#0099FF')
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
}

function createWarningEmbed(title, description) {
  return new EmbedBuilder()
    .setColor('#FFFF00')
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
}

export { createSuccessEmbed, createErrorEmbed, createInfoEmbed, createWarningEmbed };
