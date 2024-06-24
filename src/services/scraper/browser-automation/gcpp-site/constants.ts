export const constants = {
  GCPP_URL: 'https://www.google.com/ads/publisher/partners/find-a-partner/#!?modal_active=none',

  GOOGLE_SHEET_CONFIG: {
    PATH_TO_CREDS: 'src/services/storage/google-sheets/secrets/google-sheets-creds.json',

    SPREAD_SHEET_URL: 'https://www.googleapis.com/auth/spreadsheets',
  },

  SELECTORS: {
    ALL_PARTNER_SELECTOR: '.cpp-partner__contact',

    PARTNER_LINK_SELECTOR: 'a',
  },

  // sub-sheet
  PARTNER_CONTACTS: {
    VALUE_INPUT_OPTION: 'RAW',

    SHEET_NAME: 'Partner Contacts',

    HEADERS: [['URL', 'Phone', 'Email']],

    SPREADSHEET_ID: '1Jd2TghMmQ0gjsuWiA3zS9ncmY6sY6w5b7uv5LB8tSJ8',
  },
};
