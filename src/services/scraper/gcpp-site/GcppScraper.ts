import { injectable } from 'inversify';
import { PartnerInfo } from '../../models/PartnerInfo';
import { constants } from '../../config/constants';
import { Utils } from './Utils';

@injectable()
export class GcppScraper {
  public async scrapeData(): Promise<PartnerInfo[]> {
    const partnerData = await this.getGcppData();

    return partnerData;
  }

  private async getGcppData(): Promise<PartnerInfo[]> {
    const page = await Utils.navigateTo(constants.GCPP_PARTNERS_URL);

    const dataForAllPartners = await page.evaluate(() => {
      const allGcppPartnerInfo: PartnerInfo[] = [];

      const allGcppPartners = document.querySelectorAll(constants.ALL_PARTNER_SELECTOR);

      allGcppPartners.forEach((gcppPartner) => {
        const partnerLinks = gcppPartner.querySelectorAll(constants.PARTNER_LINK_SELECTOR);

        allGcppPartnerInfo.push({
          url: (partnerLinks[0] as HTMLAnchorElement).href,
          phone: partnerLinks[1].textContent ?? '',
          email: partnerLinks[2].textContent ?? '',
        });
      });

      return allGcppPartnerInfo;
    });

    await page.close();

    return dataForAllPartners;
  }
}
