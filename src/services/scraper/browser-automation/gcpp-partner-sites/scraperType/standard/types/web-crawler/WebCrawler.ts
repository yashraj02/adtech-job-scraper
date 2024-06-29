import { injectable } from 'inversify';
import { BrowserAutomation } from '../../../../../BrowserAutomation';
import { SiteList } from '../../data-source/google-sheets/SiteList';
import { Logger } from '../../../../../../../../utils/logger';

@injectable()
export class WebCrawler {
  private async findCareerPages(url: string): Promise<string[]> {
    try {
      const page = await BrowserAutomation.navigateTo(url);

      const links = await page.$$eval('a', (as: HTMLAnchorElement[]) => as.map((a) => a.href));

      const careerLinks = links.filter((link) => /career|job/.test(link));

      await BrowserAutomation.closePage(page);

      return careerLinks;
    } catch (error) {
      Logger.consoleError('Error while finding career pages for ' + url, error as Error);

      return [];
    }
  }

  public async crawl() {
    const crawler = new WebCrawler();

    const siteList = await SiteList.getSiteList();

    const scrapePromises = siteList.map(async (site) => crawler.findCareerPages(site));

    const results = await Promise.allSettled(scrapePromises);

    results.forEach((result) => {
      if (result.status === 'rejected') {
        Logger.consoleLog('WebCrawler failed: ' + result.reason);
      } else {
        Logger.consoleLog('WebCrawler success:' + result.value.join(', '));
      }
    });
  }
}
