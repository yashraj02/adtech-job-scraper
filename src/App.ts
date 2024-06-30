import 'reflect-metadata';
import { container } from './container';
import { GcppScraper } from './services/scraper/browserAutomation/gcppSite/GcppScraper';
import { WebCrawler } from './services/scraper/browserAutomation/gcppPartnerSites/scraperType/standard/types/webCrawler/WebCrawler';

export class App {
  private gcppScraper: GcppScraper;

  private webCrawler: WebCrawler;

  constructor() {
    this.gcppScraper = container.get<GcppScraper>(GcppScraper);

    this.webCrawler = container.get<WebCrawler>(WebCrawler);
  }

  public async run() {
    await this.gcppScraper.init();

    await this.webCrawler.init();
  }
}
