import { EWikiData } from './enum.ts';

const DICT_COUNTRIES = {
  [EWikiData.SYRIA]: 'Syria',
  [EWikiData.AFGHANISTAN]: 'Afghanistan',
  [EWikiData.SOUTH_SUDAN]: 'South Sudan',
  [EWikiData.MYANMAR]: 'Myanmar',
  [EWikiData.DR_CONGO]: 'Democratic Republic of the Congo',
  [EWikiData.LEBANON]: 'Lebanon',
  [EWikiData.JORDAN]: 'Jordan',
  [EWikiData.GERMANY]: 'Germany',
  [EWikiData.IRAQ]: 'Iraq',
  [EWikiData.EGYPT]: 'Egypt',
  [EWikiData.PAKISTAN]: 'Pakistan',
  [EWikiData.IRAN]: 'Iran',
  [EWikiData.FRANCE]: 'France',
  // [EWikiData.GERMANY]: 'Germany',
  [EWikiData.AUSTRIA]: 'Austria',
  [EWikiData.UGANDA]: 'Uganda',
  [EWikiData.SUDAN]: 'Sudan',
  [EWikiData.ETHIOPIA]: 'Ethiopia',
  [EWikiData.KENYA]: 'Kenya',
  // [EWikiData.DR_CONGO]: 'Democratic Republic of the Congo',
  [EWikiData.BANGLADESH]: 'Bangladesh',
  [EWikiData.MALAYSIA]: 'Malaysia',
  [EWikiData.THAILAND]: 'Thailand',
  [EWikiData.INDIA]: 'India',
  [EWikiData.USA]: 'United States of America',
  // [EWikiData.UGANDA]: 'Uganda',
  [EWikiData.BURUNDI]: 'Burundi',
  [EWikiData.RWANDA]: 'Rwanda',
  [EWikiData.ZAMBIA]: 'Zambia',
  [EWikiData.TANZANIA]: 'Tanzania',
};

const DICT_GLOBE_SYR = {
  [EWikiData.LEBANON]: 'Lebanon',
  [EWikiData.JORDAN]: 'Jordan',
  [EWikiData.GERMANY]: 'Germany',
  [EWikiData.IRAQ]: 'Iraq',
  [EWikiData.EGYPT]: 'Egypt',
};

const DICT_GLOBE_AFG = {
  [EWikiData.PAKISTAN]: 'Pakistan',
  [EWikiData.IRAN]: 'Iran',
  [EWikiData.FRANCE]: 'France',
  [EWikiData.GERMANY]: 'Germany',
  [EWikiData.AUSTRIA]: 'Austria',
};

const DICT_GLOBE_SSD = {
  [EWikiData.UGANDA]: 'Uganda',
  [EWikiData.SUDAN]: 'Sudan',
  [EWikiData.ETHIOPIA]: 'Ethiopia',
  [EWikiData.KENYA]: 'Kenya',
  [EWikiData.DR_CONGO]: 'Democratic Republic of the Congo',
};

const DICT_GLOBE_MMR = {
  [EWikiData.BANGLADESH]: 'Bangladesh',
  [EWikiData.MALAYSIA]: 'Malaysia',
  [EWikiData.THAILAND]: 'Thailand',
  [EWikiData.INDIA]: 'India',
  [EWikiData.USA]: 'United States of America',
};

const DICT_GLOBE_COD = {
  [EWikiData.UGANDA]: 'Uganda',
  [EWikiData.BURUNDI]: 'Burundi',
  [EWikiData.RWANDA]: 'Rwanda',
  [EWikiData.ZAMBIA]: 'Zambia',
  [EWikiData.TANZANIA]: 'Tanzania',
};

const DICT_GLOBE_ORIGINS = {
  // Data for Syria, Afghanistan, South Sudan, Myanmar and DR Congo
  [EWikiData.SYRIA]: {
    name: 'Syria',
    dict: DICT_GLOBE_SYR,
  },
  [EWikiData.AFGHANISTAN]: {
    name: 'Afghanistan',
    dict: DICT_GLOBE_AFG,
  },
  [EWikiData.SOUTH_SUDAN]: {
    name: 'South Sudan',
    dict: DICT_GLOBE_SSD,
  },
  [EWikiData.MYANMAR]: {
    name: 'Myanmar',
    dict: DICT_GLOBE_MMR,
  },
  [EWikiData.DR_CONGO]: {
    name: 'Democratic Republic of the Congo',
    dict: DICT_GLOBE_COD,
  },
};

export {
  DICT_COUNTRIES,
  DICT_GLOBE_ORIGINS,
  DICT_GLOBE_SYR,
  DICT_GLOBE_AFG,
  DICT_GLOBE_SSD,
  DICT_GLOBE_MMR,
  DICT_GLOBE_COD,
};
