/**
 * rangeOrQuery:
 * 'range' is range of google sheets row x columns
 * 'query' is in context of db
 */

export interface IDataStorage {
  create(data: string[][], target: string, rangeOrQuery?: string): Promise<boolean>;

  read(target: string, rangeOrQuery?: string): Promise<string[][]>;

  update(data: string[][], target: string, rangeOrQuery: string): Promise<boolean>;

  delete(target: string, rangeOrQuery?: string): Promise<boolean>;
}
