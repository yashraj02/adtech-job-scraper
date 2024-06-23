import {App} from './App';

async function main() {
  const app = new App();

  await app.run();
}

main().catch((error) => console.error('Error: ', error));
