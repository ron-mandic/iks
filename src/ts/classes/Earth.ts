import { ConfigOptions, GlobeInstance } from 'globe.gl';
import * as Three from 'three';

export class Earth {
  globeInstance: GlobeInstance | null;
  Three: Three.WebGLRenderer | null;
  configOptions: ConfigOptions | undefined;

  constructor(selector: string, configOptions?: ConfigOptions) {
    this.globeInstance = null;
    this.Three = null;
    if (configOptions) this.configOptions = configOptions;

    this.onLoad(selector);
    this.onResize();
  }

  onLoad(selector: string) {
    window.addEventListener('DOMContentLoaded', async () => {
      await import('globe.gl').then(async (module) => {
        this.globeInstance = module.default()(
          document.querySelector(selector)!
        );
        this.globeInstance.globeImageUrl('./8k_earth_daymap.jpg').pointOfView(
          {
            lat: 52.518611,
            lng: 13.408333,
            altitude: 1,
          },
          4000
        );

        this.Three = this.globeInstance.renderer();
      });
    });
  }

  onResize() {
    // resize canvas on window resize
    window.addEventListener('resize', () => {
      if (!this.globeInstance) return;
      this.globeInstance!.width(window.innerWidth);
      this.globeInstance!.height(window.innerHeight);
    });
  }
}
