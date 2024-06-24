import { chromium, Page, ConsoleMessage } from 'playwright';
import dotenv from 'dotenv';
dotenv.config();

export class Utils {
  public static async navigateTo(url: string): Promise<Page> {
    const browser = await chromium.launch();

    const page = await browser.newPage();

    await page.goto(url);

    if (process.env.ENABLE_DEBUG_MODE) {
      page.on('console', (msg: ConsoleMessage) => console.log('BROWSER LOG: ', msg.text()));
    }

    return page;
  }
}
