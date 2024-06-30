import { STORAGE_TYPE } from './constants';
import { GoogleSheetsService } from './googleSheets/GoogleSheetsService';
import { DataStorageFactoryModel } from './models/data-storage-factory-model';

export class DataStorageFactory {
  static getStorageService(type: string, config: DataStorageFactoryModel) {
    switch (type) {
      case STORAGE_TYPE.GOOGLE_SHEETS: {
        const { spreadSheetId, auth } = config;

        return new GoogleSheetsService(spreadSheetId, auth);
      }

      // case 'db-service':
      //   return new DbService();

      default:
        throw new Error('Invalid storage service type provided.');
    }
  }
}
