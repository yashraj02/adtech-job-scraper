import { chromium, Page, ConsoleMessage, Browser } from 'playwright';
import dotenv from 'dotenv';
dotenv.config();

export class BrowserAutomation {
  public static async navigateTo(url: string): Promise<{ page: Page; browser: Browser }> {
    const browser = await chromium.launch();

    const page = await browser.newPage();

    await page.goto(url);

    if (process.env.ENABLE_DEBUG_MODE) {
      page.on('console', (msg: ConsoleMessage) => console.log('BROWSER LOG: ', msg.text()));
    }

    return { page, browser };
  }

  public static async closePage(page: Page) {
    await page.close();
  }

  public static async closeBrowser(browser: Browser) {
    await browser.close();
  }
}
