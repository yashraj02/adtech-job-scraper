import { sheets_v4 } from 'googleapis';
import { Utils } from './Utils';
import { BoldHeader, AddBorder, RangeOfData, AutoResizeCells, CenterTextInCells } from './models/google-sheet-models';

export class DecorateSheets {
  public static getConfigForBoldHeaders(subSheetId: number): BoldHeader {
    return {
      repeatCell: {
        range: {
          sheetId: subSheetId,
          startRowIndex: 0,
          endRowIndex: 1,
        },
        cell: {
          userEnteredFormat: {
            textFormat: {
              bold: true,
            },
          },
        },
        fields: 'userEnteredFormat.textFormat.bold',
      },
    };
  }

  public static getConfigForAutoResize(subSheetId: number): AutoResizeCells {
    return {
      // Auto-resize columns
      autoResizeDimensions: {
        dimensions: {
          sheetId: subSheetId,
          dimension: 'COLUMNS',
          startIndex: 0, // Adjust as needed
          // endIndex not specified, assuming auto-resize all columns
        },
      },
    };
  }

  public static getConfigForCenterTextInCells(subSheetId: number, rangeOfData: RangeOfData): CenterTextInCells {
    // Center text in cells A1 to C3
    return {
      repeatCell: {
        range: {
          sheetId: subSheetId, // Adjust as necessary
          ...rangeOfData,
        },
        cell: {
          userEnteredFormat: {
            horizontalAlignment: 'CENTER',
            verticalAlignment: 'MIDDLE',
          },
        },
        fields: 'userEnteredFormat(horizontalAlignment,verticalAlignment)',
      },
    };
  }

  public static getConfigForAddingBorderToCells(subSheetId: number, rangeOfData: RangeOfData): AddBorder {
    // Add border to cells A1 to C3
    return {
      updateBorders: {
        range: {
          sheetId: subSheetId,
          ...rangeOfData,
        },
        top: {
          style: 'SOLID',
          width: 1,
          color: { red: 0, green: 0, blue: 0 },
        },
        bottom: {
          style: 'SOLID',
          width: 1,
          color: { red: 0, green: 0, blue: 0 },
        },
        left: {
          style: 'SOLID',
          width: 1,
          color: { red: 0, green: 0, blue: 0 },
        },
        right: {
          style: 'SOLID',
          width: 1,
          color: { red: 0, green: 0, blue: 0 },
        },
        innerHorizontal: {
          style: 'SOLID',
          width: 1,
          color: { red: 0, green: 0, blue: 0 },
        },
        innerVertical: {
          style: 'SOLID',
          width: 1,
          color: { red: 0, green: 0, blue: 0 },
        },
      },
    };
  }

  public static async decorateSheet(
    sheets: sheets_v4.Sheets,
    subSheetName: string,
    spreadsheetId: string,
    rangeOfData: RangeOfData,
  ) {
    const subSheetId = await Utils.getSubSheetIdByName(sheets, subSheetName, spreadsheetId);

    if (subSheetId === null || subSheetId === undefined) {
      return;
    }

    const boldHeadersConfig = this.getConfigForBoldHeaders(subSheetId);

    const autoResizeConfig = this.getConfigForAutoResize(subSheetId);

    const centerTextConfig = this.getConfigForCenterTextInCells(subSheetId, rangeOfData);

    const addBorderConfig = this.getConfigForAddingBorderToCells(subSheetId, rangeOfData);

    const requests = [boldHeadersConfig, autoResizeConfig, centerTextConfig, addBorderConfig];

    // Send the batchUpdate request
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests,
      },
    });
  }
}
