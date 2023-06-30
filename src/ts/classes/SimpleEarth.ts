import Globe, { ConfigOptions, GlobeInstance } from 'globe.gl';
import * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import {
  GLOBE_BACKGROUND_IMAGE_PATH,
  GLOBE_BUMP_IMAGE_PATH,
  GLOBE_GEO_MEDIUM_JSON_PATH,
  GLOBE_IMAGE_8K_PATH,
  ZOOM_POV_MAX,
} from '../constants.ts';
import { IGeoJSON, IGeoJSONFeature } from '../interfaces.ts';
import {
  Earth_ConfigurePolygons,
  Earth_Customize,
  Earth_FilterData,
  Earth_OnPolygonClick,
  Earth_OnResize,
  Earth_OnSelect,
  Earth_ResetState,
  Earth_TurnOffColors,
  Earth_TurnOnColors,
} from '../functions.ts';
import { DICT_GLOBE_ORIGINS } from '../dictionary.ts';

gsap.registerPlugin(ScrollTrigger);

export class SimpleEarth {
  world: GlobeInstance | null;
  WebGLRenderer: THREE.WebGLRenderer | null;
  Scene: THREE.Scene | null;
  Camera: THREE.Camera | null;

  data: IGeoJSON | null;
  selectedCountry: string | null;

  uiRevealed: boolean;
  zoomedOut: boolean;

  constructor(selector: string, configOptions?: ConfigOptions) {
    this.world = Globe(configOptions)(document.querySelector(selector)!)
      .globeImageUrl(GLOBE_IMAGE_8K_PATH)
      .bumpImageUrl(GLOBE_BUMP_IMAGE_PATH)
      .backgroundImageUrl(GLOBE_BACKGROUND_IMAGE_PATH);

    this.WebGLRenderer = this.world!.renderer();
    this.Scene = this.world!.scene();
    this.Camera = this.world!.camera();

    // this.capTexture = new THREE.TextureLoader().load(GLOBE_CAP_MATERIAL_PATH);

    this.data = null;
    this.selectedCountry = null;

    this.uiRevealed = false;
    this.zoomedOut = false;

    this.world!.onGlobeReady(async () => {
      fetch(GLOBE_GEO_MEDIUM_JSON_PATH)
        .then((response) => response.json())
        .then((data: IGeoJSON) => this.render(data))
        .catch((error) => console.error('onGlobeReady: ', error));

      this.world!.enablePointerInteraction(false);
    });
  }

  // Initialization #################################################################################
  render(data: IGeoJSON) {
    this.data = data;
    this.preconfigure();

    this.world!.polygonsData(
      Earth_FilterData(this.data!, 'default:news') as object[]
    );

    // ########################################
    this.initEvents();
    window.addEventListener('resize', () => Earth_OnResize(this.world!));
    this.onZoom();

    console.log(this);
  }

  initEvents() {
    this.world!.enablePointerInteraction(true);
  }

  // Customization #################################################################################
  preconfigure() {
    Earth_ConfigurePolygons(this.world!);

    Earth_Customize(this.world!);
    this.world!.pointOfView({ lat: 0, lng: 20, altitude: 8 }, 5500);
  }

  // Setter #################################################################################

  // Events #################################################################################
  onZoom() {
    this.world!.onZoom((pov) => {
      if (pov.altitude > ZOOM_POV_MAX) {
        if (!this.zoomedOut) {
          this.world?.onPolygonClick(() => false);

          this.world!.polygonsData(
            Earth_FilterData(this.data!, 'default:news') as object[]
          );
          this.resetRoutes();
        }
        Earth_TurnOffColors(this);
      } else {
        Earth_TurnOnColors(this);
      }
    });
  }

  // Reset #################################################################################
  resetRoutes() {
    this.world!.ringsData([]);
  }
}
