import Alpine from 'alpinejs';
import { app } from './ts/variables.ts';

function setup() {
  // @ts-ignore
  window.Alpine = Alpine;
  Alpine.start();

  app.init();
}

setup();
