import 'reflect-metadata';
import { container } from './container';
import { GcppScraper } from './services/scraper/gcpp-site/GcppScraper';
import { GoogleSheetsService } from './services/storage/google-sheets/GoogleSheetsService';

export class App {
  private gcppScraper: GcppScraper;

  private googleSheetsService: GoogleSheetsService;

  constructor() {
    this.gcppScraper = container.get<GcppScraper>(GcppScraper);

    this.googleSheetsService = container.get<GoogleSheetsService>(GoogleSheetsService);
  }

  public async run() {
    const partnerData = await this.gcppScraper.scrapeData();

    await this.googleSheetsService.addAllPartnersDataToSheet(partnerData);
  }
}
