// export type CareerPageSheetDimensions = [url: string, phone: string, email: string, careerPageLinks: string[]];

export type CareerPageGSheetHeaderRow = ['URL', 'Phone', 'Email', 'Career Page Links'];

export type CareerPageGSheetValues = [url: string, phone: string, email: string, careerPageLinks: string[]];

export type CareerPageGSheetDataSet = [CareerPageGSheetHeaderRow, ...CareerPageGSheetValues[]];
