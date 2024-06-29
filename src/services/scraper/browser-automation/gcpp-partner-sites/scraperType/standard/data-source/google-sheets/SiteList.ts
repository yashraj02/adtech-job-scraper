import { google } from 'googleapis';
import { constants } from './constants';
import { DataStorageFactory } from '../../../../../../../storage/DataStorageFactory';
import { STORAGE_TYPE } from '../../../../../../../storage/constants';

export class SiteList {
  public static async getSiteList(): Promise<string[]> {
    const auth = new google.auth.GoogleAuth({
      keyFile: constants.GOOGLE_SHEET_CONFIG.PATH_TO_CREDS,
      scopes: [constants.GOOGLE_SHEET_CONFIG.SPREAD_SHEET_URL],
    });

    const subSheetName = constants.PARTNER_CONTACTS.SUB_SHEET_NAME;

    const spreadSheetId = constants.PARTNER_CONTACTS.SPREADSHEET_ID;

    const dataStorageFactory = DataStorageFactory.getStorageService(STORAGE_TYPE.GOOGLE_SHEETS, {
      auth,
      spreadSheetId,
    });

    const data = await dataStorageFactory.read(subSheetName);

    if (data === null || data === undefined) {
      return [];
    }

    const siteList = SiteList.removeJunkAndFilterOnlyArrayOfSites(data);

    return siteList;
  }

  private static removeJunkAndFilterOnlyArrayOfSites(siteList: string[][]): string[] {
    return siteList.map((site) => site[0]);
  }
}
