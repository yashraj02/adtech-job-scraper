import 'reflect-metadata';
import { container } from './container';
import { GcppScraper } from './services/scraper/browser-automation/gcpp-site/GcppScraper';
import { WebCrawler } from './services/scraper/browser-automation/gcpp-partner-sites/scraperType/standard/types/web-crawler/WebCrawler';

export class App {
  private gcppScraper: GcppScraper;

  private webCrawler: WebCrawler;

  constructor() {
    this.gcppScraper = container.get<GcppScraper>(GcppScraper);

    this.webCrawler = container.get<WebCrawler>(WebCrawler);
  }

  public async run() {
    // await this.gcppScraper.init();

    await this.webCrawler.crawl();
  }
}
