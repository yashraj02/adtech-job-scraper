import { chromium, Page, ConsoleMessage, Browser } from 'playwright';
import dotenv from 'dotenv';
import { Logger } from '../../../utils/logger';
import { QueueBrowserAutomation } from './QueueBrowserAutomation';
dotenv.config();

export class BrowserAutomation {
  private static sharedInstance: Browser | null = null;

  // Private constructor to prevent instantiation of singleton class
  private constructor() {}

  public static async navigateTo(url: string, useSharedBrowserInstance: boolean = true): Promise<Page> {
    let page;
    try {
      await QueueBrowserAutomation.waitInQueue();

      const browser = await this.getInstanceOfBrowser(useSharedBrowserInstance);

      page = await browser.newPage();

      await page.goto(url, { timeout: 60000 });

      if (process.env.ENABLE_BROWSER_LOGS) {
        page.on('console', (msg: ConsoleMessage) => Logger.consoleLog('BROWSER LOG: ' + msg.text()));
      }

      return page;
    } catch (error) {
      if (page) this.closePage(page);

      throw new Error('Error while navigating to ' + url + ': ' + error);
    }
  }

  public static async closePage(page: Page) {
    await page.close();

    QueueBrowserAutomation.taskDone();
  }

  public static async closeBrowser(browser: Browser) {
    if (this.sharedInstance === browser) {
      Logger.consoleError('Cannot close shared browser instance as it is used by other services as well.');

      return;
    }

    await browser.close();
  }

  private static async getInstanceOfBrowser(useSharedBrowserInstance: boolean = true): Promise<Browser> {
    const browser = useSharedBrowserInstance ? await this.getSharedInstance() : await this.createNewInstance();

    return browser;
  }

  private static async getSharedInstance(): Promise<Browser> {
    if (!BrowserAutomation.sharedInstance) {
      this.sharedInstance = await chromium.launch();
    }

    return BrowserAutomation.sharedInstance as Browser;
  }

  private static async createNewInstance(): Promise<Browser> {
    return await chromium.launch();
  }
}
