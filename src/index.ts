import Alpine from 'alpinejs';
import { app } from './ts/variables.ts';

function setup() {
  // @ts-ignore
  window.Alpine = Alpine;
  Alpine.start();

  app.init();
}

setup();

window.addEventListener('scroll', function () {
  // get scroll height
  let svg = document.querySelector('svg');
  let percentage =
    (window.scrollY + window.innerHeight) / document.body.scrollHeight;

  svg!.style.strokeDasharray = `${percentage * 100} ${100 - percentage * 100}`;
});
