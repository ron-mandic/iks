import { ConfigOptions, GlobeInstance } from 'globe.gl';
import * as Three from 'three';
import * as d3 from 'd3';
import { $ } from '../functions.ts';

export class Earth {
  world: GlobeInstance | null;
  Three: Three.WebGLRenderer | null;
  objConfigOptions: ConfigOptions | undefined;

  constructor(selector: string, configOptions?: ConfigOptions) {
    this.world = null;
    this.Three = null;
    if (configOptions) this.objConfigOptions = configOptions;

    this.onLoad(selector);
    this.onResize();
  }

  async configure() {
    const colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd);
    const getVal = (feat: any) =>
      feat.properties.gdp_md / Math.max(1e5, feat.properties.pop_est);
    const countries = await fetch('./data/custom.geo.medium.json').then((res) =>
      res.json()
    );

    // Codes of Syria, Afghanistan, South Sudan, Myanmar, DR Congo, Sudan, Somalia, Central African Republic, Eritrea, Nigeria, Iraq, Burundi, Vietnam
    const arrayISO3Countries = [
      'SYR',
      'AFG',
      'SSD',
      'MMR',
      'COD',
      'SDN',
      'SOM',
      'CAF',
      'ERI',
      'NGA',
      'IRQ',
      'BDI',
      'VNM',
    ];

    // @ts-ignore
    this.world!.backgroundImageUrl('./night-sky.max.darker.png')
      .lineHoverPrecision(0)
      .polygonsData(
        countries.features.filter((d: any) =>
          arrayISO3Countries.includes(d.properties.iso_a3)
        )
      )
      .polygonAltitude(0.0125)
      .polygonCapColor((feat) => colorScale(getVal(feat)))
      .polygonStrokeColor(() => '#999776')
      .polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
      .onZoom((pov) => {
        if (pov.altitude > 5) {
          this.world!.polygonCapColor((_) => 'transparent').polygonStrokeColor(
            () => false
          );
        } else {
          this.world!.polygonCapColor((d) =>
            colorScale(getVal(d))
          ).polygonStrokeColor(() => '#999776');
        }
      })
      .polygonsTransitionDuration(300)
      .onPolygonClick((d, event, { lng, lat }) => {
        this.world?.pointOfView({ lat, lng, altitude: 1 }, 2000);
        // @ts-ignore
        $('h1')!.innerHTML = d.properties!.admin;

        /* const N = 10;
        const gData = [...Array(N).keys()].map(() => ({
          lat: (Math.random() - 0.5) * 180,
          lng: (Math.random() - 0.5) * 360,
          size: Math.random() * 150,
          color: ['red', 'white', 'blue', 'green'][
            Math.round(Math.random() * 3)
          ],
        }));
        this.world?.hexBinPointsData(gData); */

        const N = 10;
        const arcsData = [...Array(N).keys()].map(() => ({
          startLat: 34.51059334835744,
          startLng: 39.329231898597875,
          endLat: (Math.random() - 0.5) * 180,
          endLng: (Math.random() - 0.5) * 360,
          color: '#FFFCC4',
        }));
        this.world?.arcsData(arcsData);

        /* const N_PATHS = 10;
        const pathData = [...Array(N_PATHS).keys()].map(() => {
          let lat = (Math.random() - 0.5) * 90;
          let lng = (Math.random() - 0.5) * 360;
          let alt = 0;

          return [
            [34.51059334835744, 39.329231898597875, alt],
            [(Math.random() - 0.5) * 90, (Math.random() - 0.5) * 360, alt],
          ];
        });
        this.world?.pathsData(pathData);

        /* Gen random data
        const N = 2;
        const ringsData = [...Array(N).keys()].map(() => ({
          lat: 34.51059334835744,
          lng: 39.329231898597875,
          maxR: 3,
          propagationSpeed: 1.5,
          repeatPeriod: 1600,
        }));
        this.world?.ringsData(ringsData); */
      });

    // this.world!.showGlobe(true).showAtmosphere(true);

    const markerSvg = `<svg viewBox="-4 0 36 36">
    <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
    <circle fill="transparent" cx="14" cy="14" r="7"></circle>
  </svg>`;

    /* const N = 10;
    const gData = [...Array(N).keys()].map(() => ({
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
      size: 7 + Math.random() * 30,
      color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)],
    }));
    this.world!.htmlElementsData(gData).htmlElement((d) => {
      const el = document.createElement('div');
      el.innerHTML = markerSvg;
      el.style.color = d.color;
      el.style.width = `${d.size}px`;

      el.style.pointerEvents = 'auto';
      el.style.cursor = 'pointer';
      el.onclick = () => console.info(d);
      return el;
    }); */

    this.world!.arcColor('color')
      .arcDashLength(() => Math.random())
      .arcAltitudeAutoScale(0.5)
      .arcStroke(0.25)
      .arcAltitude(0.325)
      .arcLabel(() => "I'm an arc")
      .arcsTransitionDuration(2000)
      // .arcDashGap(() => 200) -> make it look like it is animated
      .arcDashAnimateTime(() => 4000);

    this.world!.pathColor(
      () => ['rgba(0,0,255,0.6)', 'rgba(255,0,0,0.6)'] // gradient
    )
      .pathStroke(2)
      .pathTransitionDuration(1000);

    this.world?.polygonSideColor(() => 'rgba(0, 0, 0, 0.15)');

    const colorInterpolator = (t) => `rgba(255,100,50,${Math.sqrt(1 - t)})`;
    this.world!.ringColor(() => colorInterpolator)
      .ringMaxRadius('maxR')
      .ringPropagationSpeed('propagationSpeed')
      .ringAltitude(0.015)
      .ringRepeatPeriod('repeatPeriod');

    this.world!.controls().autoRotate = true;
    this.world!.controls().autoRotateSpeed = 0.035;
  }

  onLoad(selector: string) {
    window.addEventListener('DOMContentLoaded', async () => {
      await import('globe.gl').then(async (module) => {
        this.world = module.default({
          animateIn: true,
          waitForGlobeReady: true,
          rendererConfig: {
            antialias: true,
          },
        })(document.querySelector(selector)!);
        this.world
          .globeImageUrl('./8k_earth_daymap.jpg')
          .bumpImageUrl('./topology.min.png')
          .pointOfView({ altitude: 4 }, 5000);

        await this.configure();

        setTimeout(() => this.world!.polygonsTransitionDuration(4000), 3000);

        const globeMaterial = this.world!.globeMaterial();
        globeMaterial.bumpScale = 4;
        const texture = new Three.TextureLoader().load(
          './earth-water.low.png',
          (texture) => {
            globeMaterial.specularMap = texture;
            globeMaterial.specular = new Three.Color('grey');
            globeMaterial.shininess = 10;
          }
        );

        setTimeout(() => {
          // wait for scene to be populated (asynchronously)
          const directionalLight = this.world!.scene().children.find(
            (obj3d) => obj3d.type === 'DirectionalLight'
          );
          directionalLight && directionalLight.position.set(1, 1, 1); // change light position to see the specularMap's effect
        });

        this.world
          .hexBinPointLat((d) => d.lat)
          .hexBinPointLng((d) => d.lng)
          .hexBinPointWeight((d) => d.size)
          .hexAltitude(({ sumWeight }) => sumWeight * 0.0025);

        this.Three = this.world.renderer();
      });
    });
  }

  onResize() {
    // resize canvas on window resize
    window.addEventListener('resize', () => {
      if (!this.world) return;
      this.world!.width(window.innerWidth);
      this.world!.height(window.innerHeight);
    });
  }
}
