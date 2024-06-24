import { App } from './App';
import { Logger } from './utils/logger';

async function main() {
  const app = new App();

  await app.run();
}

main().catch((error) => Logger.consoleError('Error in main(): ', error));
