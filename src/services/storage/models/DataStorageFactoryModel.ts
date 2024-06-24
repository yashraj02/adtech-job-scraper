import { GoogleAuth } from 'google-auth-library';

export interface DataStorageFactoryModel {
  spreadSheetId: string;
  auth: GoogleAuth;
}
