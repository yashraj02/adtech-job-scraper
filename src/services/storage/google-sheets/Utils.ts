import { sheets_v4 } from 'googleapis';
import { RangeOfData } from './models/google-sheet-models';
import { Logger } from '../../../utils/logger';

export class Utils {
  public static async getSpreadSheetExistsStatus(
    sheets: sheets_v4.Sheets,
    subSheetName: string,
    spreadsheetId: string,
  ): Promise<boolean> {
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId, fields: 'sheets(properties(title))' });

    const sheetExists = spreadsheet.data.sheets?.some((sheet) => sheet.properties?.title === subSheetName);

    return !!sheetExists;
  }

  public static async getSubSheetIdByName(
    sheets: sheets_v4.Sheets,
    subSheetName: string,
    spreadsheetId: string,
  ): Promise<number | undefined | null> {
    try {
      // Fetch the spreadsheet details
      const response = await sheets.spreadsheets.get({
        spreadsheetId,
        includeGridData: false, // We don't need grid data, only metadata
      });

      // Search for the sheet with the matching name
      const sheet = response.data.sheets?.find((s) => s.properties?.title === subSheetName);

      // Return the sheet ID if found
      return sheet?.properties?.sheetId;
    } catch (error) {
      Logger.consoleError('Failed to get sheet ID by name:', error as Error);

      return undefined;
    }
  }

  public static getRangeOfData(data: string[][], shouldAddHeaders: boolean = false): RangeOfData {
    const endRowIndex = shouldAddHeaders ? data.length + 1 : data.length;

    return {
      endRowIndex,
      startRowIndex: 0,
      startColumnIndex: 0,
      endColumnIndex: data[0].length,
    };
  }

  public static async createSpreadSheet(sheets: sheets_v4.Sheets, spreadsheetId: string, requests: any[]) {
    await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests } });
  }

  public static async createSheetIfNotExists(sheets: sheets_v4.Sheets, subSheetName: string, spreadsheetId: string) {
    const sheetExists = await this.getSpreadSheetExistsStatus(sheets, subSheetName, spreadsheetId);

    if (sheetExists) return;

    const requests = [{ addSheet: { properties: { title: subSheetName } } }];

    await this.createSpreadSheet(sheets, spreadsheetId, requests);
  }
}
