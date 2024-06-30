import { Container } from 'inversify';
import { GcppScraper } from './services/scraper/browserAutomation/gcppSite/GcppScraper';
import { WebCrawler } from './services/scraper/browserAutomation/gcppPartnerSites/scraperType/standard/types/webCrawler/WebCrawler';
import { GoogleSheetsService } from './services/storage/googleSheets/GoogleSheetsService';

const container = new Container();

container.bind<GoogleSheetsService>(GoogleSheetsService).toSelf();

container.bind<GcppScraper>(GcppScraper).toSelf();

container.bind<WebCrawler>(WebCrawler).toSelf();

export { container };
