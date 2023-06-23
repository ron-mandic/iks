import { Earth } from './Earth.ts';
import { EARTH_CONFIG_OPTIONS } from '../constants.ts';

export class App {
  body: HTMLBodyElement | null;
  appHTML: HTMLElement | null;
  globe: Earth;

  constructor() {
    this.body = null;
    this.appHTML = null;
    this.globe = new Earth('#globe', EARTH_CONFIG_OPTIONS);
  }

  init() {
    window.addEventListener('DOMContentLoaded', () => {
      this.body = document.querySelector('body')!;
      this.appHTML = document.querySelector('#app')!;
    });
  }
}
