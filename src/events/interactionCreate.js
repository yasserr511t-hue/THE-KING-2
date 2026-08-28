import { Events, ChannelType } from 'discord.js';
import { Logger } from '../utils/logger.js';
import { loadButtonHandlers, loadSelectMenuHandlers, loadModalHandlers } from '../handlers/eventHandler.js';

const event = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    // Load handlers on first interaction
    if (!interaction.client.handlersLoaded) {
      await loadButtonHandlers(interaction.client);
      await loadSelectMenuHandlers(interaction.client);
      await loadModalHandlers(interaction.client);
      interaction.client.handlersLoaded = true;
    }

    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        Logger.warn(`⚠️ أمر غير موجود: ${interaction.commandName}`);
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        Logger.error(`خطأ في تنفيذ الأمر ${interaction.commandName}:`, error);
        await interaction.reply({
          content: '❌ حدث خطأ أثناء تنفيذ الأمر',
          ephemeral: true,
        });
      }
    } else if (interaction.isButton()) {
      const button = interaction.client.buttons.get(interaction.customId);

      if (!button) {
        return;
      }

      try {
        await button.execute(interaction);
      } catch (error) {
        Logger.error(`خطأ في زر ${interaction.customId}:`, error);
      }
    } else if (interaction.isStringSelectMenu()) {
      const menu = interaction.client.selectMenus.get(interaction.customId);

      if (!menu) {
        return;
      }

      try {
        await menu.execute(interaction);
      } catch (error) {
        Logger.error(`خطأ في القائمة ${interaction.customId}:`, error);
      }
    } else if (interaction.isModalSubmit()) {
      const modal = interaction.client.modals.get(interaction.customId);

      if (!modal) {
        return;
      }

      try {
        await modal.execute(interaction);
      } catch (error) {
        Logger.error(`خطأ في النموذج ${interaction.customId}:`, error);
      }
    }
  },
};

export default event;