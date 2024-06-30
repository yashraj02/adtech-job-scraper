export const constants = {
  GOOGLE_SHEET_CONFIG: {
    PATH_TO_CREDS: 'src/services/storage/googleSheets/secrets/google_sheets_creds.json',

    SPREAD_SHEET_URL: 'https://www.googleapis.com/auth/spreadsheets',
  },

  REGEX_FOR_CAREER_PAGES: /career|job/,

  SELECTORS: {
    HTML_ANCHOR_EL: 'a',
  },

  // sub-sheet
  CAREER_PAGES: {
    SUB_SHEET_NAME: 'Career Pages',

    HEADERS: ['URL', 'Phone', 'Email', 'Career Page Links'],

    SPREADSHEET_ID: '1Jd2TghMmQ0gjsuWiA3zS9ncmY6sY6w5b7uv5LB8tSJ8',
  },
};
