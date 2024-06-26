export type PartnerContactsGSheetHeaderRow = ['URL', 'Phone', 'Email'];

export type PartnerContactsGSheetValues = [url: string, phone: string, email: string];

export type PartnerContactsGSheetDataSet = [PartnerContactsGSheetHeaderRow, ...PartnerContactsGSheetValues[]];

export interface RangeOfData {
  sheetId: number;
  startRowIndex?: number;
  endRowIndex?: number;
  startColumnIndex?: number;
  endColumnIndex?: number;
}

//------ SheetDecorator.ts ------
interface Range extends RangeOfData {}

interface color {
  red: number;
  green: number;
  blue: number;
}

export interface AddBorder {
  updateBorders: {
    range: Range;
    top: {
      style: string;
      width: number;
      color: color;
    };
    bottom: {
      style: string;
      width: number;
      color: color;
    };
    left: {
      style: string;
      width: number;
      color: color;
    };
    right: {
      style: string;
      width: number;
      color: color;
    };
    innerHorizontal: {
      style: string;
      width: number;
      color: color;
    };
    innerVertical: {
      style: string;
      width: number;
      color: color;
    };
  };
}

export interface BoldHeader {
  repeatCell: {
    range: Range;
    cell: {
      userEnteredFormat: {
        textFormat: {
          bold: boolean;
        };
      };
    };
    fields: string;
  };
}

export interface AutoResizeCells {
  autoResizeDimensions: {
    dimensions: {
      sheetId: number;
      dimension: string;
      startIndex: number;
    };
  };
}

export interface CenterTextInCells {
  repeatCell: {
    range: Range;
    cell: {
      userEnteredFormat: {
        horizontalAlignment: string;
        verticalAlignment: string;
      };
    };
    fields: string;
  };
}
