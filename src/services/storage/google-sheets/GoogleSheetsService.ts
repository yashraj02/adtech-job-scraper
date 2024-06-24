import { injectable } from 'inversify';
import { google } from 'googleapis';
import { constants } from './constants';
import { PartnerInfo } from '../../scraper/gcpp-site/models/PartnerInfo';
import { Logger } from '../../../utils/logger';
import { Utils } from './Utils';
import { DecorateSheets } from './DecorateSheets';

@injectable()
export class GoogleSheetsService {
  private sheets: any;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      keyFile: constants.PATH_TO_CREDS,
      scopes: [constants.SPREAD_SHEET_URL],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
  }

  public async addAllPartnersDataToSheet(partnerData: PartnerInfo[]) {
    const valueInputOption = constants.PARTNER_CONTACTS.VALUE_INPUT_OPTION;

    const spreadsheetId = constants.PARTNER_CONTACTS.SPREADSHEET_ID;

    const subSheetName = constants.PARTNER_CONTACTS.SHEET_NAME;

    const headers = constants.PARTNER_CONTACTS.HEADERS;

    await Utils.createSheetIfNotExists(this.sheets, subSheetName, spreadsheetId);

    await this.sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: subSheetName,
    });

    const values = partnerData.map((partner) => [partner.url, partner.phone, partner.email]);

    await this.sheets.spreadsheets.values.append({
      range: subSheetName,
      spreadsheetId,
      valueInputOption,
      requestBody: {
        values: [...headers, ...values],
      },
    });

    const rangeOfData = Utils.getRangeOfData(values, true);

    await DecorateSheets.decorateSheet(this.sheets, subSheetName, spreadsheetId, rangeOfData);

    Logger.consoleLog('All Partners added to Google Sheet');
  }
}
