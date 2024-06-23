import { injectable } from 'inversify';
import { google } from 'googleapis';
import { constants } from '..config/constants';
import { PartnerInfo } from '../../models/PartnerInfo';

@injectable()
export class GoogleSheetsService {
  private sheets: any;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'credentials.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth });
  }

  public async addAllPartnersDataToSheet(partnerData: PartnerInfo[]) {
    const spreadsheetId = constants.SPREADSHEET_ID;

    const range = 'Sheet1!A1:C1';

    await this.sheets.spreadsheets.values.clear({
      spreadsheetId,
      range,
    });

    const headers = [['URL', 'Phone', 'Email']];

    const values = partnerData.map((partner) => [partner.url, partner.phone, partner.email]);

    await this.sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values: [...headers, ...values],
      },
    });

    console.log('All Partners added to Google Sheet');
  }
}
