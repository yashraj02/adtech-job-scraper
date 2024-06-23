import { PartnerInfo } from '../../../models/PartnerInfo';

export class PartnerScraper {
  private partnerUrl: string;

  constructor(partnerUrl: string) {
    this.partnerUrl = partnerUrl;
  }

  public async scrapePartnerData(): Promise<PartnerInfo> {}
}
