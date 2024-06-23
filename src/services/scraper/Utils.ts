import {chromium, Page} from 'playwright';

export class Utils {
  public static async navigateTo(url: string): Promise<Page> {
    const browser = await chromium.launch();

    const page = await browser.newPage();

    await page.goto(url);

    return page;
  }
}
