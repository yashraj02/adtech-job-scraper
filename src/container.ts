import { Container } from 'inversify';
import { GcppScraper } from './services/scraper/browser-automation/gcpp-site/GcppScraper';
import { WebCrawler } from './services/scraper/browser-automation/gcpp-partner-sites/scraperType/standard/web-crawler/WebCrawler';
import { GoogleSheetsService } from './services/storage/google-sheets/GoogleSheetsService';

const container = new Container();

container.bind<GoogleSheetsService>(GoogleSheetsService).toSelf();

container.bind<GcppScraper>(GcppScraper).toSelf();

container.bind<WebCrawler>(WebCrawler).toSelf();

export { container };
