import { google, sheets_v4 } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import { constants } from './constants';
import { Logger } from '../../../utils/logger';
import { IDataStorage } from '../IDataStorage';
import { Utils } from './Utils';
import { SheetDecorator } from './SheetDecorator';

export class GoogleSheetsService implements IDataStorage {
  private spreadSheetId: string;
  private sheetsApi: sheets_v4.Sheets;

  constructor(spreadSheetId: string, auth: GoogleAuth) {
    this.spreadSheetId = spreadSheetId;

    this.sheetsApi = google.sheets({ version: 'v4', auth });
  }

  public async create(data: string[][], subSheetName: string): Promise<boolean> {
    try {
      Utils.createSheetIfNotExists(this.sheetsApi, subSheetName, this.spreadSheetId);

      // If data already exists in sheet then clear it
      this.delete(subSheetName);

      const payload = {
        requestBody: { values: data },

        range: `${subSheetName}!A1`,

        spreadsheetId: this.spreadSheetId,

        valueInputOption: constants.VALUE_INPUT_OPTION,
      };

      await this.sheetsApi.spreadsheets.values.append(payload);

      await SheetDecorator.init(this.sheetsApi, subSheetName, this.spreadSheetId, data);

      return true;
    } catch (error) {
      Logger.consoleError('Error while adding data to sheet: ' + subSheetName, error as Error);

      return false;
    }
  }

  public async read<T>(subSheetName: string, range?: string): Promise<T[]> {
    try {
      const payload = {
        spreadsheetId: this.spreadSheetId,

        range: range ? `${subSheetName}!${range}` : `${subSheetName}!A1:Z`,
      };

      const response = await this.sheetsApi.spreadsheets.values.get(payload);

      return response.data.values as T[];
    } catch (error) {
      Logger.consoleError('Error while reading data from sheet: ' + subSheetName, error as Error);

      return [];
    }
  }

  public async update<T>(data: T[], subSheetName: string, range: string): Promise<boolean> {
    try {
      const payload = {
        range: `${subSheetName}!${range}`,

        spreadsheetId: this.spreadSheetId,

        requestBody: { values: data.map((item) => [item]) },

        valueInputOption: constants.VALUE_INPUT_OPTION,
      };

      await this.sheetsApi.spreadsheets.values.update(payload);
      return true;
    } catch (error) {
      Logger.consoleError('Error while updating data to sheet: ' + subSheetName, error as Error);

      return false;
    }
  }

  public async delete(subSheetName: string, range?: string): Promise<boolean> {
    try {
      if (range) {
        await this.deleteSpecificData(subSheetName, range);
      } else {
        await this.deleteWholeData(subSheetName);
      }

      return true;
    } catch (error) {
      Logger.consoleError('Error while deleting data from sheet: ' + subSheetName, error as Error);

      return false;
    }
  }

  public async deleteWholeData(subSheetName: string): Promise<void> {
    const payload = { range: subSheetName, spreadsheetId: this.spreadSheetId };

    await this.sheetsApi.spreadsheets.values.clear(payload);
  }

  public async deleteSpecificData(subSheetName: string, range: string): Promise<void> {
    const payload = {
      requestBody: { values: [] },

      spreadsheetId: this.spreadSheetId,

      valueInputOption: constants.VALUE_INPUT_OPTION,

      range: `${subSheetName}!${range}`,
    };

    await this.sheetsApi.spreadsheets.values.update(payload);
  }
}
