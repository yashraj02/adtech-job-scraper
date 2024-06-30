import { injectable } from 'inversify';
import { PartnerInfo } from './models/PartnerInfo';
import { constants } from './constants';
import { BrowserAutomation } from '../BrowserAutomation';
import { DataStorageFactory } from '../../../storage/DataStorageFactory';
import { STORAGE_TYPE } from '../../../storage/constants';
import { google } from 'googleapis';
import { Logger } from '../../../../utils/logger';

@injectable()
export class GcppScraper {
  public async init(): Promise<void> {
    const partnerData = await this.scrapeData(constants.GCPP_URL);

    const isDataStored = await this.storeData(partnerData);

    const status = isDataStored ? 'success' : 'failure';

    Logger.consoleLog('GcppScraper data store ' + status);
  }

  private async scrapeData(url: string): Promise<PartnerInfo[]> {
    try {
      const page = await BrowserAutomation.navigateTo(url);

      const dataForAllPartners = await page.evaluate((constants) => {
        const allGcppPartnerInfo: PartnerInfo[] = [];

        const allGcppPartners = document.querySelectorAll(constants.SELECTORS.ALL_PARTNER_SELECTOR);

        allGcppPartners.forEach((gcppPartner) => {
          const partnerLinks = gcppPartner.querySelectorAll(constants.SELECTORS.PARTNER_LINK_SELECTOR);

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

      await BrowserAutomation.closePage(page);

      return dataForAllPartners;
    } catch (error) {
      Logger.consoleError('Error while scraping data from ' + url, error as Error);

      return [];
    }
  }

  private async storeData(partnerData: PartnerInfo[]): Promise<boolean> {
    const auth = new google.auth.GoogleAuth({
      keyFile: constants.GOOGLE_SHEET_CONFIG.PATH_TO_CREDS,
      scopes: [constants.GOOGLE_SHEET_CONFIG.SPREAD_SHEET_URL],
    });

    const spreadSheetId = constants.PARTNER_CONTACTS.SPREADSHEET_ID;

    const dataStorageFactory = DataStorageFactory.getStorageService(STORAGE_TYPE.GOOGLE_SHEETS, {
      auth,
      spreadSheetId,
    });

    const headers = constants.PARTNER_CONTACTS.HEADERS;

    const values = partnerData.map((partner) => [partner.url, partner.phone, partner.email]);

    const data = [...headers, ...values];

    await dataStorageFactory.create(data, constants.PARTNER_CONTACTS.SUB_SHEET_NAME);

    return true;
  }
}
