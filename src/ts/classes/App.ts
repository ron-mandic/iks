import { Earth } from './Earth.ts';

export class App {
  body: HTMLBodyElement | null;
  appHTML: HTMLElement | null;
  globe: Earth;

  constructor() {
    this.body = null;
    this.appHTML = null;
    this.globe = new Earth('#globe');
  }

  init() {
    window.addEventListener('DOMContentLoaded', () => {
      this.body = document.querySelector('body')!;
      this.appHTML = document.querySelector('#app')!;
      console.log(this.globe);
    });
  }
}
