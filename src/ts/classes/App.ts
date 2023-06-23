import { Earth } from './Earth.ts';
import { EARTH_DEFAULT_ORIGIN_COUNTRIES_ISO3 } from '../constants.ts';

export class App {
  body: HTMLBodyElement | null;
  appHTML: HTMLElement | null;
  globe: Earth;

  constructor() {
    this.body = null;
    this.appHTML = null;
    this.globe = new Earth('#globe', EARTH_DEFAULT_ORIGIN_COUNTRIES_ISO3, {
      animateIn: false,
      waitForGlobeReady: true,
      rendererConfig: {
        antialias: true,
        alpha: true,
      },
    });
  }

  init() {
    window.addEventListener('DOMContentLoaded', () => {
      this.body = document.querySelector('body')!;
      this.appHTML = document.querySelector('#app')!;
      this.log();
    });
  }

  log() {
    console.log(this.globe);
  }
}
