import Globe, { ConfigOptions, GlobeInstance } from 'globe.gl';
import * as THREE from 'three';
import {
  GLOBE_BACKGROUND_IMAGE_PATH,
  GLOBE_BUMP_IMAGE_PATH,
  GLOBE_CAP_MATERIAL_PATH,
  GLOBE_GEO_MEDIUM_JSON_PATH,
  GLOBE_IMAGE_8K_PATH,
  POLYGON_COLOR_CAP_ORIGIN_COUNTRY,
  ZOOM_POV_MAX,
} from '../constants.ts';
import { IArc, IGeoJSON } from '../interfaces.ts';
import {
  Earth_ConfigureArcs,
  Earth_ConfigurePaths,
  Earth_ConfigurePoints,
  Earth_ConfigurePolygons,
  Earth_ConfigureRings,
  Earth_Customize,
  Earth_FilterArcs,
  Earth_OnResize,
} from '../functions.ts';
import { EISO_A3, EWikiData } from '../enum.ts';
import {
  GLOBE_DATA_PATHS,
  GLOBE_DATA_POINTS,
  GLOBE_DATA_RINGS,
} from '../data.ts';

export class Earth {
  world: GlobeInstance | null;
  THREE: THREE.WebGLRenderer | null;

  data: IGeoJSON | null;
  selectedCountry: string | null;

  capTexture: THREE.Texture | null;
  zoomedOut: boolean;

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

    this.world!.onGlobeReady(async () => {
      fetch(GLOBE_GEO_MEDIUM_JSON_PATH)
        .then((response) => response.json())
        .then((data: IGeoJSON) => this.render(data))
        .catch((error) => console.error('onGlobeReady: ', error));
    });
  }

  // Initialization #################################################################################
  render(data: IGeoJSON) {
    this.data = data;
    this.preconfigure();

    let key = EISO_A3.DR_CONGO;
    // this.world!.polygonsData(Earth_FilterData(this.data!, key) as object[]);
    this.world?.arcsData(
      Earth_FilterArcs(key, (arc: IArc) => {
        return arc.wikidataid === EWikiData.USA;
      }) as object[]
    );

    // ########################################
    this.world?.pointsData(GLOBE_DATA_POINTS[key].points);
    this.world?.pathsData(GLOBE_DATA_PATHS[key].paths);
    this.world?.ringsData(GLOBE_DATA_RINGS[key].rings);

    console.log(this);

    // ########################################
    this.initEvents();

    window.addEventListener('resize', () => Earth_OnResize(this.world!));
    this.onZoom();
  }

  initEvents() {
    // this.world?.onPolygonClick();
    // this.world?.onGlobeClick();
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

  // Events #################################################################################
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
          this.world!()
            .polygonStrokeColor(() => '#999776')
            // @ts-ignore
            .polygonCapColor((d: IGeoJSONFeature) => {
              return POLYGON_COLOR_CAP_ORIGIN_COUNTRY;
            });
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
