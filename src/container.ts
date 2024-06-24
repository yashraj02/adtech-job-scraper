import { Container } from 'inversify';
import { GoogleSheetsService } from './services/storage/google-sheets/GoogleSheetsService';
import { GcppScraper } from './services/scraper/gcpp-site/GcppScraper';

const container = new Container();

container.bind<GoogleSheetsService>(GoogleSheetsService).toSelf();

container.bind<GcppScraper>(GcppScraper).toSelf();

export { container };
