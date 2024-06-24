import { injectable } from 'inversify';
import { PartnerInfo } from './models/PartnerInfo';
import { constants } from './constants';
import { Utils } from '../Utils';

@injectable()
export class GcppScraper {
  public async scrapeData(): Promise<PartnerInfo[]> {
    const partnerData = await this.getGcppData();

    return partnerData;
  }

  private async getGcppData(): Promise<PartnerInfo[]> {
    const page = await Utils.navigateTo(constants.GCPP_PARTNERS_URL);

    const dataForAllPartners = await page.evaluate((constants) => {
      const allGcppPartnerInfo: PartnerInfo[] = [];

      const allGcppPartners = document.querySelectorAll(constants.ALL_PARTNER_SELECTOR);

      allGcppPartners.forEach((gcppPartner) => {
        const partnerLinks = gcppPartner.querySelectorAll(constants.PARTNER_LINK_SELECTOR);

        const url = (partnerLinks[0] as HTMLAnchorElement)?.href;

        let phone = partnerLinks[1]?.textContent?.trim().replace('/s+/g', '') ?? '';

        // Fix-me: one email is coming as "globalpublisherbusines..."
        let email = partnerLinks[2]?.textContent?.trim().replace('/s+/g', '') ?? '';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        /** sometimes email is not available hence the order get's swapped i.e email comes in 1st position in partnerLinks array. So its better to check & add 'email' & 'phone' in correct properties */
        if (emailRegex.test(phone)) {
          email = phone;

          phone = '';
        }

        const partnerInfo = {
          url,
          phone,
          email,
        };

        allGcppPartnerInfo.push(partnerInfo);
      });

      return allGcppPartnerInfo;
    }, constants);

    await page.close();

    return dataForAllPartners;
  }
}
