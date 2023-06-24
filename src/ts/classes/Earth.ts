import Globe, { ConfigOptions, GlobeInstance } from 'globe.gl';
import * as THREE from 'three';
import {
  d0,
  d1,
  d2,
  d3,
  d4,
  GLOBE_BACKGROUND_IMAGE_PATH,
  GLOBE_BUMP_IMAGE_PATH,
  GLOBE_CAP_MATERIAL_PATH,
  GLOBE_GEO_LOW_JSON_PATH,
  GLOBE_IMAGE_8K_PATH,
  objOriginCountries,
  POLYGON_COLOR_CAP_ORIGIN_COUNTRY,
  RING_ALTITUDE,
  ZOOM_POV_MAX,
} from '../constants.ts';
import { IGeoCoords, IGeoJSON, IGeoJSONFeature } from '../interfaces.ts';
import {
  Earth_ConfigureArcs,
  Earth_ConfigurePaths,
  Earth_ConfigurePoints,
  Earth_ConfigurePolygons,
  Earth_ConfigureRings,
  Earth_Customize,
  Earth_FilterData,
  Earth_OnResize,
} from '../functions.ts';

export class Earth {
  world: GlobeInstance | null;
  THREE: THREE.WebGLRenderer | null;

  data: IGeoJSON | null;
  selectedCountry: string | null;

  capTexture: THREE.Texture | null;
  zoomedOut: boolean;

  arr;

  constructor(selector: string, configOptions?: ConfigOptions) {
    this.world = Globe(configOptions)(document.querySelector(selector)!)
      .globeImageUrl(GLOBE_IMAGE_8K_PATH)
      .bumpImageUrl(GLOBE_BUMP_IMAGE_PATH)
      .backgroundImageUrl(GLOBE_BACKGROUND_IMAGE_PATH);
    this.THREE = this.world!.renderer();
    this.capTexture = new THREE.TextureLoader().load(GLOBE_CAP_MATERIAL_PATH);

    this.data = null;
    this.selectedCountry = null;

    this.zoomedOut = false;

    this.arr = [];

    this.world!.onGlobeReady(async () => {
      fetch(GLOBE_GEO_LOW_JSON_PATH)
        .then((response) => response.json())
        .then((data: IGeoJSON) => this.render(data))
        .catch((error) => console.error('onGlobeReady: ', error));
    });
  }

  // Initialization #################################################################################
  render(data: IGeoJSON) {
    this.data = data;
    this.preconfigure();
    this.setPolygons();

    this.onResize();
    this.onZoom();

    this.initEvents();

    this.world?.pointsData([
      {
        lat: objOriginCountries.COD.asylumCountries[0].endLat,
        lng: objOriginCountries.COD.asylumCountries[0].endLng,
        color: 'red',
        size:
          (objOriginCountries.COD.asylumCountries[0].asylumSeekers /
            objOriginCountries.COD.refugees) *
          0.375,
      },
      {
        lat: objOriginCountries.COD.asylumCountries[1].endLat,
        lng: objOriginCountries.COD.asylumCountries[1].endLng,
        color: 'red',
        size:
          (objOriginCountries.COD.asylumCountries[1].asylumSeekers /
            objOriginCountries.COD.refugees) *
          0.375,
      },
      {
        lat: objOriginCountries.COD.asylumCountries[2].endLat,
        lng: objOriginCountries.COD.asylumCountries[2].endLng,
        color: 'red',
        size:
          (objOriginCountries.COD.asylumCountries[2].asylumSeekers /
            objOriginCountries.COD.refugees) *
          0.375,
      },
      {
        lat: objOriginCountries.COD.asylumCountries[3].endLat,
        lng: objOriginCountries.COD.asylumCountries[3].endLng,
        color: 'red',
        size:
          (objOriginCountries.COD.asylumCountries[3].asylumSeekers /
            objOriginCountries.COD.refugees) *
          0.375,
      },
      {
        lat: objOriginCountries.COD.asylumCountries[4].endLat,
        lng: objOriginCountries.COD.asylumCountries[4].endLng,
        color: 'red',
        size:
          (objOriginCountries.COD.asylumCountries[4].asylumSeekers /
            objOriginCountries.COD.refugees) *
          0.375,
      },
    ]);

    this.world?.pathsData(d4);

    const N = 8;
    const gData = [...Array(N).keys()].map(() => ({
      lat: objOriginCountries.COD.lat,
      lng: objOriginCountries.COD.lng,
      maxRadius: 4,
      propagationSpeed: 1.25,
      repeatPeriod: 800,
    }));

    this.world!.ringsData(gData);

    console.log(this);
  }

  initEvents() {
    // this.world?.onPolygonClick();
    // this.world?.onGlobeClick();

    this.world!.polygonCapColor(() => POLYGON_COLOR_CAP_ORIGIN_COUNTRY);
    /* .polygonCapMaterial((_) => {
      return new THREE.MeshPhongMaterial({
        map: this.capTexture,
        shininess: 10,
        specular: new THREE.Color(0xffffff),
      });
    }); */
  }

  // Customization #################################################################################
  preconfigure() {
    Earth_ConfigurePolygons(this.world!);
    Earth_ConfigureArcs(this.world!);
    Earth_ConfigurePaths(this.world!);
    Earth_ConfigureRings(this.world!);
    Earth_ConfigurePoints(this.world!);

    Earth_Customize(this.world!);

    this.world!.pointOfView({ altitude: 4 }, 5500);
  }

  // Setter #################################################################################
  setPolygons() {
    /* this.world!.polygonsData(
      Earth_FilterData(this.data!, 'default') as object[]
    ); */
  }

  // Events #################################################################################
  onResize() {
    window.addEventListener('resize', () => Earth_OnResize(this.world!));
  }

  onZoom() {
    this.world!.onZoom((pov) => {
      if (pov.altitude > ZOOM_POV_MAX) {
        this.world!.polygonCapColor((_) => 'transparent').polygonStrokeColor(
          () => false
        );
        // @ts-ignore
        if (!this.zoomedOut) this.world?.polygonCapMaterial(() => false);
        this.zoomedOut = true;
      } else {
        // @ts-ignore
        if (this.zoomedOut)
          // @ts-ignore
          this.world!().polygonStrokeColor(() => '#999776');
        /* .polygonCapColor((d: IGeoJSONFeature) => {
            return POLYGON_COLOR_CAP_ORIGIN_COUNTRY;
          }) */
        /* .polygonCapMaterial((_) => {
              return new THREE.MeshPhongMaterial({
                map: this.capTexture,
                shininess: 10,
                specular: new THREE.Color(0xffffff),
              });
            }); */
        this.zoomedOut = false;
      }
    });
  }
}
