import { Earth } from './Earth.ts';

export class App {
  globe: Earth;
  body: HTMLBodyElement | null;

  constructor() {
    this.body = null;
    this.globe = new Earth('#globe');
  }

  init() {
    console.log('App.ts: init');
    window.addEventListener('DOMContentLoaded', () => {
      this.body = document.querySelector('body')!;
    });
  }
}
