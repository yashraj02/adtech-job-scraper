import { google } from 'googleapis';
import { constants } from './constants';
import { DataStorageFactory } from '../../../../../../../storage/DataStorageFactory';
import { STORAGE_TYPE } from '../../../../../../../storage/constants';
import { PartnerContactsGSheetDataSet } from '../../../../../../../storage/googleSheets/models/google-sheet-models';

export class PartnerContacts {
  public static async getUrlAsDimension(): Promise<string[]> {
    const data = await this.getDataWithAllDimensions();

    const siteList = this.removeJunkAndFilterOnlyArrayOfSites(data);

    return siteList;
  }

  public static async getDataWithAllDimensions(): Promise<PartnerContactsGSheetDataSet> {
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

    const data: PartnerContactsGSheetDataSet = (await dataStorageFactory.read(
      subSheetName,
    )) as PartnerContactsGSheetDataSet;

    if (data === null || data === undefined) {
      throw new Error('No data found in the Partner Contacts sheet');
    }

    return data;
  }

  private static removeJunkAndFilterOnlyArrayOfSites(siteList: PartnerContactsGSheetDataSet): string[] {
    return siteList.map((site) => site[0]);
  }
}
