import { Utils } from './Utils';
import { sheets_v4 } from 'googleapis';
import { BoldHeader, AddBorder, RangeOfData, AutoResizeCells, CenterTextInCells } from './models/google-sheet-models';

export class SheetDecorator {
  public static async init(sheets: sheets_v4.Sheets, subSheetName: string, spreadsheetId: string, data: string[][]) {
    const subSheetId = await Utils.getSubSheetIdByName(sheets, subSheetName, spreadsheetId);

    if (subSheetId === null || subSheetId === undefined) {
      return;
    }

    const rangeOfData = Utils.getRangeOfData(data, subSheetId, true);

    if (subSheetId === null || subSheetId === undefined) {
      return;
    }

    const boldHeadersConfig = this.getConfigForBoldHeaders(subSheetId);

    const autoResizeConfig = this.getConfigForAutoResize(subSheetId);

    const centerTextConfig = this.getConfigForCenterTextInCells(rangeOfData);

    const addBorderConfig = this.getConfigForAddingBorderToCells(rangeOfData);

    const requests = [boldHeadersConfig, autoResizeConfig, centerTextConfig, addBorderConfig];

    await Utils.createSpreadSheet(sheets, spreadsheetId, requests);
  }

  private static getConfigForBoldHeaders(subSheetId: number): BoldHeader {
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

  private static getConfigForAutoResize(subSheetId: number): AutoResizeCells {
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

  private static getConfigForCenterTextInCells(rangeOfData: RangeOfData): CenterTextInCells {
    // Center text in cells A1 to C3
    return {
      repeatCell: {
        range: {
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

  private static getConfigForAddingBorderToCells(rangeOfData: RangeOfData): AddBorder {
    // Add border to cells A1 to C3
    return {
      updateBorders: {
        range: rangeOfData,
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
}
