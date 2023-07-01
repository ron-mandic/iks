import Globe, { ConfigOptions, GlobeInstance } from 'globe.gl';
import * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import {
  GLOBE_BACKGROUND_IMAGE_PATH,
  GLOBE_BUMP_IMAGE_PATH,
  GLOBE_GEO_MEDIUM_JSON_PATH,
  GLOBE_IMAGE_ART_8K_PATH,
  ZOOM_POV_MAX,
} from '../constants.ts';
import { IGeoJSON, IGeoJSONFeature } from '../interfaces.ts';
import {
  Earth_Animate,
  Earth_ConfigureArcs,
  Earth_ConfigureMarkers,
  Earth_ConfigurePaths,
  Earth_ConfigurePoints,
  Earth_ConfigurePolygons,
  Earth_ConfigureRings,
  Earth_Customize,
  Earth_FilterData,
  Earth_OnPolygonClick,
  Earth_OnResize,
  Earth_ResetState,
  Earth_TurnOffColors,
  Earth_TurnOnColors,
} from '../functions.ts';
import { UI } from './UI.ts';

gsap.registerPlugin(ScrollTrigger);

export class Earth {
  world: GlobeInstance | null;
  WebGLRenderer: THREE.WebGLRenderer | null;
  Scene: THREE.Scene | null;
  Camera: THREE.Camera | null;

  data: IGeoJSON | null;
  selectedCountry: string | null;

  // capTexture: THREE.Texture | null;
  uiRevealed: boolean;
  zoomedOut: boolean;

  ui: UI;
  timeline: gsap.core.Timeline;

  constructor(selector: string, configOptions?: ConfigOptions) {
    this.world = Globe(configOptions)(document.querySelector(selector)!)
      .globeImageUrl(GLOBE_IMAGE_ART_8K_PATH)
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

    this.ui = new UI(document.querySelector('#ui') as HTMLElement, this);

    this.timeline = gsap.timeline();

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
      Earth_FilterData(this.data!, 'default') as object[]
    );

    // ########################################
    this.initEvents();
    window.addEventListener('resize', () => Earth_OnResize(this.world!));
    this.onZoom();

    console.log(this);
  }

  initEvents() {
    this.world?.onPolygonClick((polygon, event, coords) =>
      Earth_OnPolygonClick(this, polygon as IGeoJSONFeature, event, coords)
    );

    this.world?.onGlobeClick((coords, event) => {
      Earth_ResetState(this, coords, event);
      this.ui.resetInputs();
      this.ui.reset();
      this.ui.resetScrollState();
      this.resetRoutes();
      // this.world!.pointOfView({ lat: 0, lng: 20, altitude: 4 }, 5500);

      if (!this.zoomedOut) Earth_ConfigureMarkers(this.world!);
    });

    this.ui.onStart(() => {
      this.world!.enablePointerInteraction(true);

      this.ui.unClip();
      Earth_Animate(this);
    });
  }

  // Customization #################################################################################
  preconfigure() {
    Earth_ConfigurePolygons(this.world!);
    Earth_ConfigureArcs(this.world!);
    Earth_ConfigurePaths(this.world!);
    Earth_ConfigureRings(this.world!);
    Earth_ConfigurePoints(this.world!);
    Earth_ConfigureMarkers(this.world!);

    Earth_Customize(this.world!);
  }

  // Setter #################################################################################

  // Events #################################################################################
  onZoom() {
    this.world!.onZoom((pov) => {
      if (pov.altitude > ZOOM_POV_MAX) {
        if (!this.zoomedOut) {
          this.world?.onPolygonClick(() => false);

          this.world!.polygonsData(
            Earth_FilterData(this.data!, 'default') as object[]
          );
          this.ui.resetInputs();
          this.ui.reset();
          this.resetRoutes();
        }
        Earth_TurnOffColors(this);
      } else {
        if (this.zoomedOut) {
          Earth_ConfigureMarkers(this.world!);
          this.world?.onPolygonClick((polygon, event, coords) =>
            Earth_OnPolygonClick(
              this,
              polygon as IGeoJSONFeature,
              event,
              coords
            )
          );
        }
        Earth_TurnOnColors(this);
      }
    });
  }

  // Reset #################################################################################
  resetRoutes() {
    this.world!.pointsData([])
      .pathsData([[[]]])
      .arcsData([])
      .ringsData([])
      .htmlElementsData([]);
  }
}
