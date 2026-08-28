const PERMISSIONS = {
  ADMINISTRATOR: 'Administrator',
  MANAGE_GUILD: 'ManageGuild',
  KICK_MEMBERS: 'KickMembers',
  BAN_MEMBERS: 'BanMembers',
  MANAGE_MESSAGES: 'ManageMessages',
  MANAGE_ROLES: 'ManageRoles',
  MANAGE_CHANNELS: 'ManageChannels',
  MODERATE_MEMBERS: 'ModerateMembers',
};

function hasPermission(member, permission) {
  if (!member) return false;
  return member.permissions.has(permission);
}

function canInteractWith(executor, target) {
  if (!executor || !target) return false;
  if (executor.guild.ownerId === executor.id) return true;
  if (executor.roles.highest.position <= target.roles.highest.position) return false;
  return true;
}

function canBotInteractWith(bot, target) {
  if (!bot || !target) return false;
  if (bot.roles.highest.position <= target.roles.highest.position) return false;
  return true;
}

export { PERMISSIONS, hasPermission, canInteractWith, canBotInteractWith };
