import { Logger } from '../utils/logger.js';

const event = {
  name: 'ready',
  once: true,
  async execute(client) {
    Logger.info(`✅ البوت جاهز! تم تسجيل الدخول باسم ${client.user.tag}`);
    client.user.setActivity('THE KING 2 👑', { type: 'WATCHING' });
  },
};

export default event;