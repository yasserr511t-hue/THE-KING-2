import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.join(__dirname, '../../logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

class Logger {
  static getTimestamp() {
    return new Date().toISOString();
  }

  static getLogFile() {
    const date = new Date().toISOString().split('T')[0];
    return path.join(logsDir, `${date}.log`);
  }

  static write(level, message, error = null) {
    const timestamp = this.getTimestamp();
    const logMessage = `[${timestamp}] [${level}] ${message}${error ? '\n' + error.stack : ''}`;
    
    console.log(logMessage);
    
    try {
      fs.appendFileSync(this.getLogFile(), logMessage + '\n');
    } catch (err) {
      console.error('Failed to write to log file:', err);
    }
  }

  static info(message) {
    this.write('INFO', message);
  }

  static error(message, error = null) {
    this.write('ERROR', message, error);
  }

  static warn(message) {
    this.write('WARN', message);
  }

  static debug(message) {
    if (process.env.NODE_ENV === 'development') {
      this.write('DEBUG', message);
    }
  }
}

export { Logger };
