function applyCooldown(userId, commandName, cooldownSeconds, cooldowns) {
  if (!cooldowns.has(commandName)) {
    cooldowns.set(commandName, new Map());
  }

  const commandCooldowns = cooldowns.get(commandName);
  const now = Date.now();
  const expirationTime = now + cooldownSeconds * 1000;

  commandCooldowns.set(userId, expirationTime);
}

function getCooldownRemaining(userId, commandName, cooldowns) {
  if (!cooldowns.has(commandName)) {
    return 0;
  }

  const commandCooldowns = cooldowns.get(commandName);
  if (!commandCooldowns.has(userId)) {
    return 0;
  }

  const expirationTime = commandCooldowns.get(userId);
  const remaining = (expirationTime - Date.now()) / 1000;

  if (remaining <= 0) {
    commandCooldowns.delete(userId);
    return 0;
  }

  return remaining;
}

export { applyCooldown, getCooldownRemaining };
