import {
  ARC_STROKE_WIDTH,
  ARC_TRANSITION_DURATION,
  GLOBE_TEXTURE_PATH,
  POLYGON_ALTITUDE,
  POLYGON_COLOR_CAP_ORIGIN_COUNTRY,
  POLYGON_COLOR_SIDE,
  POLYGON_COLOR_STROKE,
  RING_ALTITUDE,
} from './constants.ts';
import { TextureLoader, Color } from 'three';
import { GlobeInstance } from 'globe.gl';
import {
  IArc,
  IGeoCoords2,
  IGeoCoords3,
  IGeoJSON,
  IGeoJSONFeature,
} from './interfaces.ts';
import { GLOBE_DATA_ARCS } from './data.ts';
import {
  DICT_GLOBE_ORIGINS,
  DICT_GLOBE_AFG,
  DICT_GLOBE_COD,
  DICT_GLOBE_MMR,
  DICT_GLOBE_SSD,
  DICT_GLOBE_SYR,
} from './dictionary.ts';
import { EWikiData } from './enum.ts';
import { Earth } from './classes/Earth.ts';

// General #################################################################################

function $(selectors: string): Element | null {
  return document.querySelector(selectors);
}

function $$(selectors: string): NodeListOf<Element> {
  return document.querySelectorAll(selectors);
}

// Earth.ts #################################################################################
function Earth_OnResize(world: GlobeInstance) {
  if (!world) return;
  world!.width(window.innerWidth);
  world!.height(window.innerHeight);
}

function Earth_SetMaterial(
  world: GlobeInstance,
  color: string | number = 'grey',
  shininess: number = 10
) {
  const globeMaterial = world.globeMaterial();
  // @ts-ignore
  globeMaterial.bumpScale = 4;
  // @ts-ignore
  new TextureLoader().load(GLOBE_TEXTURE_PATH, (texture) => {
    // @ts-ignore
    globeMaterial.specularMap = texture;
    // @ts-ignore
    globeMaterial.specular = new Color(color);
    // @ts-ignore
    globeMaterial.shininess = shininess;
  });
}

function Earth_SetLight(world: GlobeInstance, vec3 = { x: 2, y: 1, z: 1 }) {
  setTimeout(() => {
    const directionalLight = world
      .scene()
      .children.find((obj3d) => obj3d.type === 'DirectionalLight');
    directionalLight && directionalLight.position.set(vec3.x, vec3.y, vec3.z);
  });
}

function Earth_ConfigurePolygons(world: GlobeInstance) {
  world
    .polygonAltitude(POLYGON_ALTITUDE)
    .polygonStrokeColor(() => POLYGON_COLOR_STROKE)
    .polygonSideColor(() => POLYGON_COLOR_SIDE)
    .polygonsTransitionDuration(0)
    // @ts-ignore
    .polygonCapColor((_: IGeoJSONFeature) => {
      return POLYGON_COLOR_CAP_ORIGIN_COUNTRY;
    });
}

function Earth_ConfigureArcs(world: GlobeInstance) {
  world
    .lineHoverPrecision(0)
    .arcColor('color')
    .arcStroke(ARC_STROKE_WIDTH)
    .arcLabel(() => '')
    // @ts-ignore
    .arcAltitude((d: IArc) => 0.275) // 0.075, 0.275 for USA
    .arcsTransitionDuration(ARC_TRANSITION_DURATION);
}

function Earth_ConfigurePaths(world: GlobeInstance) {
  world
    .pathStroke(5.5)
    .pathPointAlt(0)
    .pathColor(() => ['#a4161a', '#bf0603'])
    .pathTransitionDuration(2500);
}

function Earth_ConfigureRings(world: GlobeInstance) {
  world
    .ringColor(() => (t: number) => `rgba(255,255,255,${Math.sqrt(1 - t)})`)
    .ringMaxRadius('maxRadius')
    .ringPropagationSpeed('propagationSpeed')
    .ringAltitude(RING_ALTITUDE)
    .ringRepeatPeriod('repeatPeriod');
}

function Earth_ConfigurePoints(world: GlobeInstance) {
  world.pointAltitude('size').pointsTransitionDuration(1000);
}

function Earth_Customize(world: GlobeInstance) {
  world.controls().autoRotate = true;
  world.controls().autoRotateSpeed = 0.035;
  Earth_SetMaterial(world);
  Earth_SetLight(world);
}

function Earth_FilterData(data: IGeoJSON, key: string, includeOrigins = true) {
  switch (key) {
    case 'default': {
      return data.features.filter(
        (d: IGeoJSONFeature) => d.properties?.wikidataid in DICT_GLOBE_ORIGINS
      );
    }
    case EWikiData.SYRIA: {
      return !includeOrigins
        ? data.features.filter(
            (d: IGeoJSONFeature) => d.properties?.wikidataid in DICT_GLOBE_SYR
          )
        : data.features.filter(
            (d: IGeoJSONFeature) =>
              d.properties?.wikidataid in DICT_GLOBE_SYR ||
              d.properties?.wikidataid in DICT_GLOBE_ORIGINS
          );
    }
    case EWikiData.AFGHANISTAN: {
      return !includeOrigins
        ? data.features.filter(
            (d: IGeoJSONFeature) => d.properties?.wikidataid in DICT_GLOBE_AFG
          )
        : data.features.filter(
            (d: IGeoJSONFeature) =>
              d.properties?.wikidataid in DICT_GLOBE_AFG ||
              d.properties?.wikidataid in DICT_GLOBE_ORIGINS
          );
    }
    case EWikiData.SOUTH_SUDAN: {
      return !includeOrigins
        ? data.features.filter(
            (d: IGeoJSONFeature) => d.properties?.wikidataid in DICT_GLOBE_SSD
          )
        : data.features.filter(
            (d: IGeoJSONFeature) =>
              d.properties?.wikidataid in DICT_GLOBE_SSD ||
              d.properties?.wikidataid in DICT_GLOBE_ORIGINS
          );
    }
    case EWikiData.MYANMAR: {
      return !includeOrigins
        ? data.features.filter(
            (d: IGeoJSONFeature) => d.properties?.wikidataid in DICT_GLOBE_MMR
          )
        : data.features.filter(
            (d: IGeoJSONFeature) =>
              d.properties?.wikidataid in DICT_GLOBE_MMR ||
              d.properties?.wikidataid in DICT_GLOBE_ORIGINS
          );
    }
    case EWikiData.DR_CONGO: {
      return !includeOrigins
        ? data.features.filter(
            (d: IGeoJSONFeature) => d.properties?.wikidataid in DICT_GLOBE_COD
          )
        : data.features.filter(
            (d: IGeoJSONFeature) =>
              d.properties?.wikidataid in DICT_GLOBE_COD ||
              d.properties?.wikidataid in DICT_GLOBE_ORIGINS
          );
    }
    default: {
      return [];
    }
  }
}

// Arcs #################################################################################

function Earth_FilterArcs(key: string, callback?: (arc: IArc) => boolean) {
  return !callback
    ? GLOBE_DATA_ARCS[key as keyof typeof GLOBE_DATA_ARCS].asylumCountries
    : GLOBE_DATA_ARCS[
        key as keyof typeof GLOBE_DATA_ARCS
      ].asylumCountries.filter(callback);
}

// Events #################################################################################
function Earth_OnClick(
  earth: Earth,
  polygon: IGeoJSONFeature,
  event: MouseEvent,
  coords: IGeoCoords3
) {
  if (earth.selectedCountry !== polygon.properties.wikidataid) {
    earth.selectedCountry = polygon.properties.wikidataid;
  }

  Earth_OnSelect(earth, polygon /* event, coords */);

  const { lat, lng } = coords;
  if (earth.selectedCountry in DICT_GLOBE_ORIGINS)
    earth.world!.pointOfView({ lat, lng, altitude: 0.75 }, 1750);

  // console.log(
  //   DICT_COUNTRIES[earth.selectedCountry! as keyof typeof DICT_COUNTRIES]
  // );
}

function Earth_OnSelect(
  earth: Earth,
  polygon: IGeoJSONFeature
  // event: MouseEvent,
  // coords: IGeoCoords3
) {
  const key = earth.selectedCountry ?? polygon.properties.wikidataid;

  // Polygons
  if (key in DICT_GLOBE_ORIGINS) {
    earth
      .world!.polygonsData(Earth_FilterData(earth.data!, key) as object[])
      .polygonCapColor(
        // @ts-ignore
        (polygon: IGeoJSONFeature) =>
          Earth_GetCapColor(earth, polygon) || POLYGON_COLOR_CAP_ORIGIN_COUNTRY
      )
      .polygonStrokeColor(() => '#999776');
  }
}

function Earth_GetCapColor(
  earth: Earth,
  polygon: IGeoJSONFeature
): string | undefined {
  const key = earth.selectedCountry;

  if (!key) return;

  if (key === polygon.properties.wikidataid) {
    return '#3a86ff';
  }

  const dictKey =
    DICT_GLOBE_ORIGINS[key as keyof typeof DICT_GLOBE_ORIGINS]?.dict;
  if (dictKey && polygon.properties.wikidataid in dictKey) {
    return 'white';
  }

  if (key !== polygon.properties.wikidataid && key in DICT_GLOBE_ORIGINS) {
    return '3a86ff44';
  }
}

function Earth_TurnOnColors(earth: Earth) {
  if (earth.zoomedOut) {
    earth.world!.polygonStrokeColor(() => '#999776');
    earth.world!.polygonCapColor(
      // @ts-ignore
      (polygon: IGeoJSONFeature) =>
        Earth_GetCapColor(earth, polygon) || POLYGON_COLOR_CAP_ORIGIN_COUNTRY
    );

    earth.zoomedOut = false;
  }
}

function Earth_TurnOffColors(earth: Earth) {
  if (!earth.zoomedOut) {
    earth
      .world!.polygonCapColor((_) => 'transparent')
      .polygonStrokeColor(() => false);
    // @ts-ignore
    earth.world?.polygonCapMaterial(() => false);
    earth.zoomedOut = true;
  }
}

function Earth_ResetState(
  earth: Earth,
  coords?: IGeoCoords2,
  event?: MouseEvent
) {
  console.log(coords, event);

  earth.selectedCountry = null;

  earth.world!.polygonsData(
    Earth_FilterData(earth.data!, 'default') as object[]
  );

  if (!earth.zoomedOut) {
    earth.world!.polygonCapColor(() => POLYGON_COLOR_CAP_ORIGIN_COUNTRY);
  }
}

export {
  $,
  $$,
  Earth_OnResize,
  Earth_SetMaterial,
  Earth_SetLight,
  Earth_ConfigurePolygons,
  Earth_ConfigureArcs,
  Earth_ConfigurePaths,
  Earth_ConfigureRings,
  Earth_ConfigurePoints,
  Earth_Customize,
  Earth_FilterData,
  Earth_FilterArcs,
  Earth_OnClick,
  Earth_OnSelect,
  Earth_GetCapColor,
  Earth_TurnOnColors,
  Earth_TurnOffColors,
  Earth_ResetState,
};
