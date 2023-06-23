// Globe #################################################################################
const GLOBE_IMAGE_2K_PATH = './2k_earth_daymap.jpg';
const GLOBE_IMAGE_8K_PATH = './8k_earth_daymap.jpg';
const GLOBE_BUMP_IMAGE_PATH = './topology.min.png';
const GLOBE_BACKGROUND_IMAGE_PATH = './night-sky.max.darker.png';
const GLOBE_GEO_LOW_JSON_PATH = './data/custom.geo.low.json';
const GLOBE_GEO_MEDIUM_JSON_PATH = './data/custom.geo.medium.json';
const GLOBE_TEXTURE_PATH = './earth-water.low.png';

// Polygon #################################################################################
const POLYGON_COLOR_CAP_ORIGIN_COUNTRY = '#fffcc4';
const POLYGON_COLOR_CAP_ASYLUM_COUNTRY = '#FFFFFF';
const POLYGON_ALTITUDE = 0.01;
const POLYGON_COLOR_STROKE = '#999776';
const POLYGON_COLOR_SIDE = 'rgba(0, 100, 0, 0.15)';

// Arc #################################################################################
const ARC_COLOR = '#e56767';
const ARC_STROKE_WIDTH = 0.45;
const ARC_TRANSITION_DURATION = 2000;

// Ring #################################################################################
const RING_ALTITUDE = 0.015;

// Zoom #################################################################################
const ZOOM_POV_MIN = 0.1;
const ZOOM_POV_MAX = 5;

// Other #################################################################################
const EARTH_CONFIG_OPTIONS = {
  animateIn: false,
  waitForGlobeReady: true,
  rendererConfig: {
    antialias: true,
    alpha: true,
  },
};
const EARTH_DEFAULT_ORIGIN_COUNTRIES_ISO3 = ['AFG'];
const EARTH_DEFAULT_ASYLUM_COUNTRIES_ISO3 = [
  'LBN',
  'JOR',
  'DEU',
  'IRQ',
  'EGY',
  'PAK',
  'IRN',
  'FRA',
  'AUT',
  'UGA',
  'SDN',
  'ETH',
  'KEN',
  'COD',
  'BGD',
  'MYS',
  'THA',
  'IND',
  'USA',
  'BDI',
  'RWA',
  'ZMB',
  'TZA',
];

const objOriginCountries = {
  SYR: {
    name: 'Syria',
    population: 17_637_075,
    year: 2021,
    refugees: 3_110_908,
    asylumCountriesISO3: ['LBN', 'JOR', 'DEU', 'IRQ', 'EGY'],
    asylumCountries: [
      {
        name: 'Lebanon',
        asylumSeekers: 840_929,
        startLat: 35.2721,
        startLng: 38.648549,
        endLat: 33.940181,
        endLng: 35.932404,
        color: ARC_COLOR,
      },
      {
        name: 'Jordan',
        asylumSeekers: 672_952,
        startLat: 35.2721,
        startLng: 38.648549,
        endLat: 31.665143,
        endLng: 36.537722,
        color: ARC_COLOR,
      },
      {
        name: 'Germany',
        asylumSeekers: 621_740,
        startLat: 35.2721,
        startLng: 38.648549,
        endLat: 50.890472,
        endLng: 10.320835,
        color: ARC_COLOR,
      },
      {
        name: 'Iraq',
        asylumSeekers: 254_561,
        startLat: 35.2721,
        startLng: 38.648549,
        endLat: 33.085227,
        endLng: 43.88501,
        color: ARC_COLOR,
      },
      {
        name: 'Egypt',
        asylumSeekers: 136_727,
        startLat: 35.2721,
        startLng: 38.648549,
        endLat: 26.836687,
        endLng: 29.226787,
        color: ARC_COLOR,
      },
    ],
  },
  AFG: {
    name: 'Afghanistan',
    population: 39_540_689,
    year: 2021,
    refugees: 2_705_026,
    asylumCountriesISO3: ['PAK', 'IRN', 'DEU', 'FRA', 'AUT'],
    asylumCountries: [
      {
        name: 'Pakistan',
        asylumSeekers: 1_490_562,
        startLat: 34.003034,
        startLng: 66.221166,
        endLat: 29.630207,
        endLng: 69.219838,
        color: ARC_COLOR,
      },
      {
        name: 'Iran',
        asylumSeekers: 778_054,
        startLat: 34.003034,
        startLng: 66.221166,
        endLat: 32.50021,
        endLng: 54.471369,
        color: ARC_COLOR,
      },
      {
        name: 'Germany',
        asylumSeekers: 159_409,
        startLat: 34.003034,
        startLng: 66.221166,
        endLat: 50.890472,
        endLng: 10.320835,
        color: ARC_COLOR,
      },
      {
        name: 'France',
        asylumSeekers: 49_990,
        startLat: 34.003034,
        startLng: 66.221166,
        endLat: 46.8631,
        endLng: 2.452007,
        color: ARC_COLOR,
      },
      {
        name: 'Austria',
        asylumSeekers: 42_685,
        startLat: 34.003034,
        startLng: 66.221166,
        endLat: 47.506048,
        endLng: 14.593212,
        color: ARC_COLOR,
      },
    ],
  },
  SSD: {
    name: 'South Sudan',
    population: 11_289_110,
    year: 2021,
    refugees: 2_362_759,
    asylumCountriesISO3: ['UGA', 'SDN', 'ETH', 'KEN', 'COD'],
    asylumCountries: [
      {
        name: 'Uganda',
        asylumSeekers: 958_927,
        startLat: 7.074598,
        startLng: 30.400969,
        endLat: 1.225802,
        endLng: 32.445071,
        color: ARC_COLOR,
      },
      {
        name: 'Sudan',
        asylumSeekers: 803_634,
        startLat: 7.074598,
        startLng: 30.400969,
        endLat: 16.136582,
        endLng: 29.911939,
        color: ARC_COLOR,
      },
      {
        name: 'Ethiopia',
        asylumSeekers: 386_750,
        startLat: 7.074598,
        startLng: 30.400969,
        endLat: 8.420387,
        endLng: 40.178573,
        color: ARC_COLOR,
      },
      {
        name: 'Kenya',
        asylumSeekers: 135_255,
        startLat: 7.074598,
        startLng: 30.400969,
        endLat: 0.666511,
        endLng: 38.006983,
        color: ARC_COLOR,
      },
      {
        name: 'DR Congo',
        asylumSeekers: 56_341,
        startLat: 7.074598,
        startLng: 30.400969,
        endLat: -3.161418,
        endLng: 23.498711,
        color: ARC_COLOR,
      },
    ],
  },
  MMR: {
    name: 'Myanmar',
    population: 54_848_705,
    year: 2021,
    refugees: 1_176_880,
    asylumCountriesISO3: ['BGD', 'MYS', 'THA', 'IND', 'USA'],
    asylumCountries: [
      {
        name: 'Bangladesh',
        asylumSeekers: 918_898,
        startLat: 21.968437,
        startLng: 96.552188,
        endLat: 24.358492,
        endLng: 90.08321,
        color: ARC_COLOR,
      },
      {
        name: 'Malaysia',
        asylumSeekers: 120_598,
        startLat: 21.968437,
        startLng: 96.552188,
        endLat: 4.146678,
        endLng: 102.073272,
        color: ARC_COLOR,
      },
      {
        name: 'Thailand',
        asylumSeekers: 96_086,
        startLat: 21.968437,
        startLng: 96.552188,
        endLat: 15.758767,
        endLng: 101.615135,
        color: ARC_COLOR,
      },
      {
        name: 'India',
        asylumSeekers: 35_832,
        startLat: 21.968437,
        startLng: 96.552188,
        endLat: 23.423494,
        endLng: 78.597495,
        color: ARC_COLOR,
      },
      {
        name: 'United States of America',
        asylumSeekers: 1_223,
        startLat: 21.968437,
        startLng: 96.552188,
        endLat: 39.703568,
        endLng: -99.370162,
        color: ARC_COLOR,
      },
    ],
  },
  COD: {
    name: 'DR Congo',
    population: 'N/A',
    year: 2021,
    refugees: 907_847,
    asylumCountriesISO3: ['UGA', 'BDI', 'RWA', 'ZMB', 'TZA'],
    asylumCountries: [
      {
        name: 'Uganda',
        asylumSeekers: 447_540,
        startLat: -3.161418,
        startLng: 23.498711,
        endLat: 1.225802,
        endLng: 32.445071,
        color: ARC_COLOR,
      },
      {
        name: 'Burundi',
        asylumSeekers: 80_817,
        startLat: -3.161418,
        startLng: 23.498711,
        endLat: -3.366694,
        endLng: 29.916226,
        color: ARC_COLOR,
      },
      {
        name: 'Rwanda',
        asylumSeekers: 73_763,
        startLat: -3.161418,
        startLng: 23.498711,
        endLat: -1.946994,
        endLng: 29.972574,
        color: ARC_COLOR,
      },
      {
        name: 'Zambia',
        asylumSeekers: 62_039,
        startLat: -3.161418,
        startLng: 23.498711,
        endLat: -14.040237,
        endLng: 28.525552,
        color: ARC_COLOR,
      },
      {
        name: 'Tanzania',
        asylumSeekers: 51_647,
        startLat: -3.161418,
        startLng: 23.498711,
        endLat: -6.22622,
        endLng: 35.065655,
        color: ARC_COLOR,
      },
    ],
  },
};

export {
  GLOBE_IMAGE_2K_PATH,
  GLOBE_IMAGE_8K_PATH,
  GLOBE_BUMP_IMAGE_PATH,
  GLOBE_BACKGROUND_IMAGE_PATH,
  GLOBE_GEO_LOW_JSON_PATH,
  GLOBE_GEO_MEDIUM_JSON_PATH,
  GLOBE_TEXTURE_PATH,
  POLYGON_COLOR_CAP_ORIGIN_COUNTRY,
  POLYGON_COLOR_CAP_ASYLUM_COUNTRY,
  POLYGON_ALTITUDE,
  POLYGON_COLOR_STROKE,
  POLYGON_COLOR_SIDE,
  ARC_COLOR,
  ARC_STROKE_WIDTH,
  ARC_TRANSITION_DURATION,
  RING_ALTITUDE,
  ZOOM_POV_MIN,
  ZOOM_POV_MAX,
  objOriginCountries,
  EARTH_CONFIG_OPTIONS,
  EARTH_DEFAULT_ORIGIN_COUNTRIES_ISO3,
  EARTH_DEFAULT_ASYLUM_COUNTRIES_ISO3,
};
