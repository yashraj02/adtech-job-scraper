import { PartnerAdapter } from './adapters';

export class PartnerScraperStrategy {
  public static async scrapeJobs(partnerHomePageUrl: string): Promise<PartnerAdapter[]> {
    return partnerAdapter.scrapeData();
  }
}
