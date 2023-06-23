import { ConfigOptions, GlobeInstance } from 'globe.gl';
import * as Three from 'three';
import { $, funcGetArcsData } from '../functions.ts';
import {
  ARC_COLOR,
  ARC_STROKE_WIDTH,
  ARC_TRANSITION_DURATION,
  EARTH_DEFAULT_ASYLUM_COUNTRIES_ISO3,
  EARTH_DEFAULT_ORIGIN_COUNTRIES_ISO3,
  GLOBE_BACKGROUND_IMAGE_PATH,
  GLOBE_BUMP_IMAGE_PATH,
  GLOBE_GEO_JSON_PATH,
  GLOBE_IMAGE_8K_PATH,
  GLOBE_TEXTURE_PATH,
  objOriginCountries,
  POLYGON_ALTITUDE,
  POLYGON_COLOR_CAP_ASYLUM_COUNTRY,
  POLYGON_COLOR_CAP_ORIGIN_COUNTRY,
  POLYGON_COLOR_SIDE,
  POLYGON_COLOR_STROKE,
  RING_ALTITUDE,
  ZOOM_POV_MAX,
} from '../constants.ts';
import { IGeoJSON, IGeoJSONFeature, IArc } from '../interfaces.ts';

export class Earth {
  world: GlobeInstance | null;
  Three: Three.WebGLRenderer | null;
  objConfigOptions: ConfigOptions | undefined;
  objCountriesJSON: IGeoJSON | null;
  arrDefaultCountriesISO3: string[];

  selectedCountry: string | null;

  constructor(
    selector: string,
    arrDefaultCountriesISO3: string[],
    configOptions?: ConfigOptions
  ) {
    this.world = null;
    this.Three = null;
    this.objConfigOptions = configOptions;
    this.objCountriesJSON = null;
    this.arrDefaultCountriesISO3 = arrDefaultCountriesISO3;

    this.selectedCountry = null;

    (async () => {
      try {
        await this.render(selector);
      } catch (error) {
        console.error(error);
      }
    })();
  }

  // Initialization #################################################################################
  preconfigure() {
    this.preconfigurePolygons();
    this.preconfigureArcs();
    this.preconfigureRings();

    this.customize();

    this.world!.pointOfView({ altitude: 4 }, 5500);
  }

  preconfigurePolygons() {
    this.world!.polygonsData(
      this.objCountriesJSON!.features.filter((d: IGeoJSONFeature) =>
        this.arrDefaultCountriesISO3.includes(d.properties!.iso_a3)
      )
    )
      .polygonAltitude(POLYGON_ALTITUDE)
      .polygonStrokeColor(() => POLYGON_COLOR_STROKE)
      .polygonSideColor(() => POLYGON_COLOR_SIDE)
      .polygonsTransitionDuration(0)
      // @ts-ignore
      .polygonCapColor((d: IGeoJSONFeature) => {
        if (
          EARTH_DEFAULT_ASYLUM_COUNTRIES_ISO3.includes(d.properties!.iso_a3)
        ) {
          return POLYGON_COLOR_CAP_ASYLUM_COUNTRY;
        }

        return POLYGON_COLOR_CAP_ORIGIN_COUNTRY;
      })
      // @ts-ignore
      .onPolygonClick((d: IGeoJSONFeature, _, { lng, lat }) => {
        if (EARTH_DEFAULT_ORIGIN_COUNTRIES_ISO3.includes(d.properties.iso_a3)) {
          this.world?.pointOfView({ lat, lng, altitude: 1 }, 2000);
          if (
            EARTH_DEFAULT_ORIGIN_COUNTRIES_ISO3.includes(d.properties!.iso_a3)
          )
            this.selectedCountry = d.properties!.iso_a3;

          let modal = $('div.block');
          modal.style.translate = '0 0';

          let headingElement = $('h1');
          // @ts-ignore
          headingElement.style.visibility = 'visible';
          headingElement!.innerHTML = d.properties!.admin;

          this.world!.arcsData(funcGetArcsData(this.selectedCountry as string));
          this.world!.polygonsData(
            this.objCountriesJSON!.features.filter(
              (d: IGeoJSONFeature) =>
                this.arrDefaultCountriesISO3.includes(d.properties!.iso_a3) ||
                objOriginCountries[
                  this.selectedCountry as keyof typeof objOriginCountries
                ].asylumCountriesISO3.includes(d.properties!.iso_a3)
            )
          );
        }
      });
  }

  preconfigureArcs() {
    this.world!.lineHoverPrecision(0)
      .arcColor('color')
      .arcStroke(ARC_STROKE_WIDTH)
      .arcLabel(() => '')
      // @ts-ignore
      .arcAltitude((d: IArc) => {
        if (
          d.name === 'Jordan' ||
          d.name === 'Iraq' ||
          d.name === 'Lebanon' ||
          d.name === 'Egypt'
        )
          return 0.025;

        if (d.name === 'United States of America') {
          return 0.25;
        }

        return 0.075;
      })
      .arcsTransitionDuration(ARC_TRANSITION_DURATION);
  }

  preconfigureRings() {
    const colorInterpolator = (t: number) =>
      `rgba(255,115,115,${Math.sqrt(1 - t)})`;
    this.world!.ringColor(() => colorInterpolator)
      .ringMaxRadius('maxRadius')
      .ringPropagationSpeed('propagationSpeed')
      .ringAltitude(RING_ALTITUDE)
      .ringRepeatPeriod('repeatPeriod');
  }

  async render(selector: string) {
    try {
      this.onContentLoaded(selector);
    } catch (error) {
      console.error(error);
    }
  }

  assign() {
    this.Three = this.world!.renderer();
  }

  customize() {
    this.world!.controls().autoRotate = true;
    this.world!.controls().autoRotateSpeed = 0.035;

    const globeMaterial = this.world!.globeMaterial();
    // @ts-ignore
    globeMaterial.bumpScale = 4;
    // @ts-ignore
    const texture = new Three.TextureLoader().load(
      GLOBE_TEXTURE_PATH,
      (texture) => {
        // @ts-ignore
        globeMaterial.specularMap = texture;
        // @ts-ignore
        globeMaterial.specular = new Three.Color('grey');
        // @ts-ignore
        globeMaterial.shininess = 10;
      }
    );

    setTimeout(() => {
      // wait for scene to be populated (asynchronously)
      const directionalLight = this.world!.scene().children.find(
        (obj3d) => obj3d.type === 'DirectionalLight'
      );
      directionalLight && directionalLight.position.set(2, 1, 1);
    });
  }

  // Events #################################################################################

  onContentLoaded(selector: string) {
    window.addEventListener('DOMContentLoaded', async () => {
      await import('globe.gl').then(async (module) => {
        this.world = module.default(this.objConfigOptions)(
          document.querySelector(selector)!
        );
        this.world
          .globeImageUrl(GLOBE_IMAGE_8K_PATH)
          .bumpImageUrl(GLOBE_BUMP_IMAGE_PATH)
          .backgroundImageUrl(GLOBE_BACKGROUND_IMAGE_PATH);

        this.onReady();
      });

      this.objCountriesJSON = await fetch(GLOBE_GEO_JSON_PATH).then((res) =>
        res.json()
      );
    });
  }

  onReady() {
    this.world!.onGlobeReady(async () => {
      this.preconfigure();
      this.assign();

      this.onResize();
      this.onZoom();
    });
  }

  onResize() {
    window.addEventListener('resize', () => {
      if (!this.world) return;
      this.world!.width(window.innerWidth);
      this.world!.height(window.innerHeight);
    });
  }

  onZoom() {
    this.world!.onZoom((pov) => {
      if (pov.altitude > ZOOM_POV_MAX) {
        this.world!.polygonCapColor((_) => 'transparent').polygonStrokeColor(
          () => false
        );
        return;
      }

      // @ts-ignore
      this.world!.polygonCapColor((d: IGeoJSONFeature) => {
        if (this.selectedCountry === d.properties!.iso_a3) {
          return '#26261e';
        }

        if (
          EARTH_DEFAULT_ASYLUM_COUNTRIES_ISO3.includes(d.properties!.iso_a3)
        ) {
          return POLYGON_COLOR_CAP_ASYLUM_COUNTRY;
        }

        return POLYGON_COLOR_CAP_ORIGIN_COUNTRY;
      }).polygonStrokeColor(() => '#999776');
    });
  }
}
