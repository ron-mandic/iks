// Globe #################################################################################
const GLOBE_IMAGE_2K_PATH = './2k_earth_daymap.jpg';
const GLOBE_IMAGE_8K_PATH = './8k_earth_daymap.jpg';
const GLOBE_BUMP_IMAGE_PATH = './topology.min.png';
const GLOBE_CAP_MATERIAL_PATH = './mymind-XUlsF9LYeVk-unsplash.jpg';
const GLOBE_BACKGROUND_IMAGE_PATH = './night-sky.max.darker.png';
const GLOBE_GEO_LOW_JSON_PATH = './data/custom.geo.low.json';
const GLOBE_GEO_MEDIUM_JSON_PATH = './data/custom.geo.medium.json';
const GLOBE_TEXTURE_PATH = './earth-water.low.png';

// Polygon #################################################################################
const POLYGON_COLOR_CAP_ORIGIN_COUNTRY = '#fffcc4';
const POLYGON_COLOR_CAP_ORIGIN_COUNTRY_ALPHA = '#fffcc444';
const POLYGON_COLOR_CAP_ASYLUM_COUNTRY = '#FFFFFF';
const POLYGON_ALTITUDE = 0.0075;
const POLYGON_COLOR_STROKE = '#999776';
const POLYGON_COLOR_SIDE = 'rgba(0, 100, 0, 0.15)';

// Arc #################################################################################
const ARC_COLOR = '#e56767';
const ARC_STROKE_WIDTH = 0.45;
const ARC_TRANSITION_DURATION = 2000;

// Ring #################################################################################
const RING_N_DEFAULT = 6;
const RING_MAX_RADIUS = 5;
const RING_PROPAGATION_SPEED = 1.25;
const RING_REPEAT_PERIOD = 800;
const RING_ALTITUDE = 0.0015;

// Points #################################################################################
const POINT_ALTITUDE = 0.25;

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

export {
  GLOBE_IMAGE_2K_PATH,
  GLOBE_IMAGE_8K_PATH,
  GLOBE_CAP_MATERIAL_PATH,
  GLOBE_BUMP_IMAGE_PATH,
  GLOBE_BACKGROUND_IMAGE_PATH,
  GLOBE_GEO_LOW_JSON_PATH,
  GLOBE_GEO_MEDIUM_JSON_PATH,
  GLOBE_TEXTURE_PATH,
  POLYGON_COLOR_CAP_ORIGIN_COUNTRY,
  POLYGON_COLOR_CAP_ORIGIN_COUNTRY_ALPHA,
  POLYGON_COLOR_CAP_ASYLUM_COUNTRY,
  POLYGON_ALTITUDE,
  POLYGON_COLOR_STROKE,
  POLYGON_COLOR_SIDE,
  ARC_COLOR,
  ARC_STROKE_WIDTH,
  ARC_TRANSITION_DURATION,
  RING_N_DEFAULT,
  RING_MAX_RADIUS,
  RING_PROPAGATION_SPEED,
  RING_REPEAT_PERIOD,
  RING_ALTITUDE,
  POINT_ALTITUDE,
  ZOOM_POV_MIN,
  ZOOM_POV_MAX,
  EARTH_CONFIG_OPTIONS,
};
