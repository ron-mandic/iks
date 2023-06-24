import {
  ARC_STROKE_WIDTH,
  ARC_TRANSITION_DURATION,
  EARTH_DEFAULT_ORIGIN_COUNTRIES_WIKI_ID,
  GLOBE_TEXTURE_PATH,
  objOriginCountries,
  POLYGON_ALTITUDE,
  POLYGON_COLOR_CAP_ORIGIN_COUNTRY,
  POLYGON_COLOR_SIDE,
  POLYGON_COLOR_STROKE,
  RING_ALTITUDE,
} from './constants.ts';
import { TextureLoader, Color } from 'three';
import { GlobeInstance } from 'globe.gl';
import { IArc, IGeoJSON, IGeoJSONFeature } from './interfaces.ts';

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
  const texture = new TextureLoader().load(GLOBE_TEXTURE_PATH, (texture) => {
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
    .polygonsTransitionDuration(0);
  // @ts-ignore
  /* .polygonCapColor((_: IGeoJSONFeature) => {
      return POLYGON_COLOR_CAP_ORIGIN_COUNTRY;
    }); */
}

function Earth_ConfigureArcs(world: GlobeInstance) {
  world
    .lineHoverPrecision(0)
    .arcColor('color')
    .arcStroke(ARC_STROKE_WIDTH)
    .arcLabel(() => '')
    // @ts-ignore
    .arcAltitude((d: IArc) => 0.0275) // 0.075
    .arcsTransitionDuration(ARC_TRANSITION_DURATION);
}

function Earth_ConfigurePaths(world: GlobeInstance) {
  world
    .pathStroke(5.5)
    .pathPointAlt(0)
    .pathColor(() => ['#ff401b', '#8a1f09'])
    .pathTransitionDuration(2500);
}

function Earth_ConfigureRings(world: GlobeInstance) {
  world
    .ringColor(() => (t: number) => `rgba(255,50,0,${Math.sqrt(1 - t)})`)
    .ringMaxRadius('maxRadius')
    .ringPropagationSpeed('propagationSpeed')
    .ringAltitude(RING_ALTITUDE)
    .ringRepeatPeriod('repeatPeriod');
}

function Earth_ConfigurePoints(world: GlobeInstance) {
  world.pointAltitude('size').pointsTransitionDuration(1000);
}

function Earth_Customize(world: GlobeInstance) {
  // world.controls().autoRotate = true;
  // world.controls().autoRotateSpeed = 0.035;
  Earth_SetMaterial(world);
  Earth_SetLight(world);
}

function Earth_FilterData(data: IGeoJSON, key: string) {
  switch (key) {
    case 'default': {
      return data.features.filter((d: IGeoJSONFeature) =>
        objOriginCountries.COD.asylumCountriesISO3.includes(
          d.properties?.iso_a3
        )
      );
    }
    default: {
      return data;
    }
  }
}

// Arcs #################################################################################

function funcGetArcsData(selectedCountry: string) {
  return objOriginCountries[selectedCountry as keyof typeof objOriginCountries]
    .asylumCountries;
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
  funcGetArcsData,
};
