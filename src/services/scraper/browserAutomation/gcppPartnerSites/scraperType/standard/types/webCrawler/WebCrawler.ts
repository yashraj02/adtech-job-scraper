import { google } from 'googleapis';
import { injectable } from 'inversify';
import { constants } from './constants';
import { Logger } from '../../../../../../../../utils/logger';
import { STORAGE_TYPE } from '../../../../../../../storage/constants';
import { BrowserAutomation } from '../../../../../BrowserAutomation';
import {
  CareerPageGSheetDataSet,
  CareerPageGSheetHeaderRow,
  CareerPageGSheetValues,
} from './models/web-crawler-models';
import { PartnerContacts } from '../../dataSource/googleSheets/PartnerContacts';
import { DataStorageFactory } from '../../../../../../../storage/DataStorageFactory';
import { PartnerContactsGSheetDataSet } from '../../../../../../../storage/googleSheets/models/google-sheet-models';

@injectable()
export class WebCrawler {
  public async init() {
    let results: PromiseSettledResult<CareerPageGSheetValues | undefined>[];

    try {
      results = await this.scrapeData();
    } catch (error) {
      throw new Error('Error while scraping WebCrawler data');
    }

    await this.storeData(results);
  }

  private async scrapeData(): Promise<PromiseSettledResult<CareerPageGSheetValues | undefined>[]> {
    let partnerContacts: PartnerContactsGSheetDataSet;

    try {
      partnerContacts = await PartnerContacts.getDataWithAllDimensions();
    } catch (error) {
      throw new Error('Error while fetching partner contacts data');
    }

    const scrapePromises = partnerContacts.map(async (partnerContact) => {
      const url = partnerContact[0];

      try {
        const page = await BrowserAutomation.navigateTo(url);

        const links = await page.$$eval(constants.SELECTORS.HTML_ANCHOR_EL, (as: HTMLAnchorElement[]) =>
          as.map((a) => a.href),
        );

        const careerPageLinks = links.filter((link) => constants.REGEX_FOR_CAREER_PAGES.test(link));

        await BrowserAutomation.closePage(page);

        const copyOfPartnerContact: CareerPageGSheetValues = [...partnerContact, careerPageLinks];

        return copyOfPartnerContact;
      } catch (error) {
        Logger.consoleError('Error while finding career pages for ' + url, error as Error);
      }
    });

    const results = await Promise.allSettled(scrapePromises);

    return results;
  }

  private async storeData(
    careerPageLinks: PromiseSettledResult<CareerPageGSheetValues | undefined>[],
  ): Promise<boolean> {
    const auth = new google.auth.GoogleAuth({
      keyFile: constants.GOOGLE_SHEET_CONFIG.PATH_TO_CREDS,
      scopes: [constants.GOOGLE_SHEET_CONFIG.SPREAD_SHEET_URL],
    });

    const spreadSheetId = constants.CAREER_PAGES.SPREADSHEET_ID;

    const dataStorageFactory = DataStorageFactory.getStorageService(STORAGE_TYPE.GOOGLE_SHEETS, {
      auth,
      spreadSheetId,
    });

    const headers = constants.CAREER_PAGES.HEADERS as CareerPageGSheetHeaderRow;

    const values = careerPageLinks
      .map((data) => {
        if (data.status === 'fulfilled' && data.value) {
          try {
            const careerPageLinks = this.removeDuplicateUrls(data.value[3] as string[]).join(', ');

            return [data.value[0], data.value[1], data.value[2], careerPageLinks];
          } catch (error) {
            Logger.consoleError('Error while storing career page links', error as Error);
          }
        }
      })
      .filter((data) => data !== undefined) as CareerPageGSheetValues[];

    const data: CareerPageGSheetDataSet = [headers, ...values];

    await dataStorageFactory.create(data as string[][], constants.CAREER_PAGES.SUB_SHEET_NAME);

    return true;
  }

  private removeDuplicateUrls(urls: string[]): string[] {
    const uniqueUrls = new Set(urls.map(this.normalizeUrl));
    return Array.from(uniqueUrls);
  }

  private normalizeUrl(url: string): string {
    const normalizedUrl = new URL(url);
    // Remove the hash/fragment
    normalizedUrl.hash = '';
    // Remove the search/query parameters
    normalizedUrl.search = '';
    // Remove trailing slash
    let path = normalizedUrl.pathname;
    if (path.endsWith('/')) {
      path = path.slice(0, -1);
    }
    normalizedUrl.pathname = path;
    return normalizedUrl.toString().toLowerCase();
  }
}
