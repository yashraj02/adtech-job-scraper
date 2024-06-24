import { sheets_v4 } from 'googleapis';
import { RangeOfData } from './models/google-sheet-models';

export class Utils {
  public static async createSheetIfNotExists(sheets: sheets_v4.Sheets, subSheetName: string, spreadsheetId: string) {
    // Retrieve the spreadsheet details, including its sheets
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId,
      fields: 'sheets(properties(title))',
    });

    const sheetExists = spreadsheet.data.sheets?.some((sheet) => sheet.properties?.title === subSheetName);

    // If the sheet does not exist, create it
    if (!sheetExists) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: subSheetName,
                },
              },
            },
          ],
        },
      });
    }
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
      console.error('Failed to get sheet ID by name:', error);
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
}
