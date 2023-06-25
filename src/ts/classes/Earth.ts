import Globe, { ConfigOptions, GlobeInstance } from 'globe.gl';
import * as THREE from 'three';
import {
  GLOBE_BACKGROUND_IMAGE_PATH,
  GLOBE_BUMP_IMAGE_PATH,
  GLOBE_CAP_MATERIAL_PATH,
  GLOBE_GEO_MEDIUM_JSON_PATH,
  GLOBE_IMAGE_8K_PATH,
  ZOOM_POV_MAX,
} from '../constants.ts';
import { IGeoCoords3, IGeoJSON, IGeoJSONFeature } from '../interfaces.ts';
import {
  $,
  Earth_ConfigureArcs,
  Earth_ConfigurePaths,
  Earth_ConfigurePoints,
  Earth_ConfigurePolygons,
  Earth_ConfigureRings,
  Earth_Customize,
  Earth_FilterData,
  Earth_OnClick,
  Earth_OnResize,
  Earth_ResetState,
  Earth_TurnOffColors,
  Earth_TurnOnColors,
} from '../functions.ts';

export class Earth {
  world: GlobeInstance | null;
  THREE: THREE.WebGLRenderer | null;

  data: IGeoJSON | null;
  selectedCountry: string | null;

  capTexture: THREE.Texture | null;
  uiRevealed: boolean;
  zoomedOut: boolean;

  ui: HTMLElement | null;

  constructor(selector: string, configOptions?: ConfigOptions) {
    this.world = Globe(configOptions)(document.querySelector(selector)!)
      .globeImageUrl(GLOBE_IMAGE_8K_PATH)
      .bumpImageUrl(GLOBE_BUMP_IMAGE_PATH)
      .backgroundImageUrl(GLOBE_BACKGROUND_IMAGE_PATH);

    this.THREE = this.world!.renderer();
    this.capTexture = new THREE.TextureLoader().load(GLOBE_CAP_MATERIAL_PATH);

    this.data = null;
    this.selectedCountry = null;

    this.uiRevealed = false;
    this.zoomedOut = false;

    this.ui = $('#ui') as HTMLElement;

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

    this.world!.polygonsData(
      Earth_FilterData(this.data!, 'default') as object[]
    );

    // ########################################
    this.initEvents();
    window.addEventListener('resize', () => Earth_OnResize(this.world!));
    this.onZoom();

    // ########################################
    console.log(this);
  }

  initEvents() {
    this.world?.onPolygonClick(
      // @ts-ignore
      (polygon: IGeoJSONFeature, event, coords: IGeoCoords3) => {
        Earth_OnClick(this, polygon as IGeoJSONFeature, event, coords);
      }
    );

    this.world?.onGlobeClick((coords, event) =>
      Earth_ResetState(this, coords, event)
    );
  }

  // Customization #################################################################################
  preconfigure() {
    Earth_ConfigurePolygons(this.world!);
    Earth_ConfigureArcs(this.world!);
    Earth_ConfigurePaths(this.world!);
    Earth_ConfigureRings(this.world!);
    Earth_ConfigurePoints(this.world!);

    Earth_Customize(this.world!);

    // Hint: Any altitude above ZOOM_POV_MAX will trigger this.world!.onZoom()
    // Hint: Only then will the colors specified for the states be activated at the following click event
    this.world!.pointOfView({ lat: 0, lng: 20, altitude: 8 }, 5500);
  }

  // Setter #################################################################################

  // Events #################################################################################
  onZoom() {
    this.world!.onZoom((pov) => {
      if (pov.altitude > ZOOM_POV_MAX) {
        Earth_TurnOffColors(this);
      } else {
        Earth_TurnOnColors(this);
      }
    });
  }
}
