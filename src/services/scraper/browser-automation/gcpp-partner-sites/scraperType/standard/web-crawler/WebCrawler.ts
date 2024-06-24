import { injectable } from 'inversify';
import { BrowserAutomation } from '../../../../BrowserAutomation';

@injectable()
export class WebCrawler {
  private async findCareerPages(url: string): Promise<string[]> {
    const { page, browser } = await BrowserAutomation.navigateTo(url);

    const links = await page.$$eval('a', (as: HTMLAnchorElement[]) => as.map((a) => a.href));

    const careerLinks = links.filter((link) => /career|job/.test(link));

    await BrowserAutomation.closePage(page);

    await BrowserAutomation.closeBrowser(browser);

    return careerLinks;
  }

  public async crawl() {
    const crawler = new WebCrawler();

    const url = 'https://www.adpushup.com';

    const careerPages = await crawler.findCareerPages(url);

    console.log(careerPages);
  }
}
