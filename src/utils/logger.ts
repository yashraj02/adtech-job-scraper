import dotenv from 'dotenv';
dotenv.config();

export class Logger {
  public static consoleLog(message: string) {
    if (process.env.ENABLE_DEBUG_MODE) {
      console.log(message);
    }
  }

  public static consoleError(message: string, error?: Error) {
    if (process.env.ENABLE_DEBUG_MODE) {
      error ? console.error(message, error) : console.error(message);
    }
  }
}
