import Globe, { ConfigOptions, GlobeInstance } from 'globe.gl';
import * as THREE from 'three';
import {
  ARC_STROKE_WIDTH,
  ARC_TRANSITION_DURATION,
  GLOBE_BACKGROUND_IMAGE_PATH,
  GLOBE_BUMP_IMAGE_PATH,
  GLOBE_GEO_LOW_JSON_PATH,
  GLOBE_IMAGE_8K_PATH,
  GLOBE_TEXTURE_PATH,
  POLYGON_ALTITUDE,
  POLYGON_COLOR_CAP_ORIGIN_COUNTRY,
  POLYGON_COLOR_SIDE,
  POLYGON_COLOR_STROKE,
  RING_ALTITUDE,
  ZOOM_POV_MAX,
} from '../constants.ts';
import { IArc, IGeoJSON, IGeoJSONFeature } from '../interfaces.ts';

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
    this.capTexture = new THREE.TextureLoader().load(
      './mymind-XUlsF9LYeVk-unsplash.jpg'
    );

    this.data = null;
    this.selectedCountry = null;

    this.zoomedOut = false;

    this.world!.onGlobeReady(async () => {
      fetch(GLOBE_GEO_LOW_JSON_PATH)
        .then((response) => response.json())
        .then((data: IGeoJSON) => this.render(data))
        .catch((error) => console.error('Error:', error));
    });
  }

  // Initialization #################################################################################
  render(data: IGeoJSON) {
    this.data = data;
    this.preconfigure();
    this.populate();

    this.onResize();
    this.onZoom();

    this.initEvents();

    console.log(this);
  }

  populate() {
    this.world!.polygonsData(
      this.data!.features.filter((d) => {
        return (
          d.properties.name === 'United States of America' ||
          d.properties.name === 'Russia'
        );
      })
    );
  }

  preconfigure() {
    this.preconfigurePolygons();
    this.preconfigureArcs();
    this.preconfigureRings();

    this.customize();

    this.world!.pointOfView({ altitude: 4 }, 5500);
  }

  preconfigurePolygons() {
    this.world!.polygonAltitude(POLYGON_ALTITUDE)
      .polygonStrokeColor(() => POLYGON_COLOR_STROKE)
      .polygonSideColor(() => POLYGON_COLOR_SIDE)
      .polygonsTransitionDuration(0)
      // @ts-ignore
      .polygonCapColor((_: IGeoJSONFeature) => {
        return POLYGON_COLOR_CAP_ORIGIN_COUNTRY;
      });
  }

  preconfigureArcs() {
    this.world!.lineHoverPrecision(0)
      .arcColor('color')
      .arcStroke(ARC_STROKE_WIDTH)
      .arcLabel(() => '')
      // @ts-ignore
      .arcAltitude((d: IArc) => 0.075)
      .arcsTransitionDuration(ARC_TRANSITION_DURATION);
  }

  preconfigureRings() {
    this.world!.ringColor(
      (t: number) => `rgba(255,115,115,${Math.sqrt(1 - t)})`
    )
      .ringMaxRadius('maxRadius')
      .ringPropagationSpeed('propagationSpeed')
      .ringAltitude(RING_ALTITUDE)
      .ringRepeatPeriod('repeatPeriod');
  }

  customize() {
    this.world!.controls().autoRotate = true;
    this.world!.controls().autoRotateSpeed = 0.035;

    const globeMaterial: THREE.Material = this.world!.globeMaterial();
    // @ts-ignore
    globeMaterial.bumpScale = 4;
    // @ts-ignore
    const texture = new THREE.TextureLoader().load(
      GLOBE_TEXTURE_PATH,
      (texture) => {
        // @ts-ignore
        globeMaterial.specularMap = texture;
        // @ts-ignore
        globeMaterial.specular = new THREE.Color('grey');
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
  initEvents() {
    this.world?.onPolygonClick((polygon: IGeoJSONFeature) => {
      console.log(polygon.properties);
    });

    this.world?.onGlobeClick((coords, _) => {
      console.log(coords);
    });

    this.world
      ?.polygonCapColor(() => '#000')
      .polygonCapMaterial((_) => {
        return new THREE.MeshPhongMaterial({
          map: this.capTexture,
          shininess: 10,
          specular: new THREE.Color(0xffffff),
        });
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
        // @ts-ignore
        if (!this.zoomedOut) this.world?.polygonCapMaterial(() => false);
        this.zoomedOut = true;
      } else {
        // @ts-ignore
        if (this.zoomedOut)
          this.world!.polygonCapColor((d: IGeoJSONFeature) => {
            return POLYGON_COLOR_CAP_ORIGIN_COUNTRY;
          })
            .polygonStrokeColor(() => '#999776')
            .polygonCapMaterial((_) => {
              return new THREE.MeshPhongMaterial({
                map: this.capTexture,
                shininess: 10,
                specular: new THREE.Color(0xffffff),
              });
            });
        this.zoomedOut = false;
      }
    });
  }
}
