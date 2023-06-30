import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// @ts-ignore
import $ from 'jquery';

gsap.registerPlugin(ScrollTrigger);

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

const lenis = new Lenis({
  duration: 0.6,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

let paragraphs = Array.from(
  document.querySelectorAll('p.lenis')!
) as HTMLParagraphElement[];
let spans = [];

paragraphs.forEach((paragraph) => {
  let htmlString = '';
  let pArray = paragraph.textContent.split('');
  for (let i = 0; i < pArray.length; i++) {
    htmlString += `<span>${pArray[i]}</span>`;
  }
  paragraph.innerHTML = htmlString;
});

spans = Array.from(document.querySelectorAll('span')) as HTMLSpanElement[];

function revealSpans() {
  for (let i = 0; i < spans.length; i++) {
    if (
      spans[i].parentElement.getBoundingClientRect().top <
      window.innerHeight * 0.375
    ) {
      let { left, top } = spans[i].getBoundingClientRect();
      top = top - window.innerHeight * 0.375;
      let opacityValue =
        1 - (top * 0.01 + left * 0.001) < 0.1
          ? 0.1
          : 1 - +(top * 0.01 + left * 0.001).toFixed(3);

      opacityValue = opacityValue > 1 ? 1 : +opacityValue.toFixed(3);
      spans[i].style.opacity = opacityValue;
    }
  }
}

window.addEventListener('scroll', () => {
  revealSpans();
});
revealSpans();

function raf(time) {
  lenis.raf(time);
  ScrollTrigger.update();
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// ###############################

const stickySections = Array.from(document.querySelectorAll('.sticky'));
let images = [
  'https://images.unsplash.com/photo-1594841343391-97ac1b9a950e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1634520086427-173e7976d882?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1544056113-76ec529669b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  'https://images.unsplash.com/photo-1645038590504-ae11d7a6f6ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=928&q=80',
];

images.forEach((img) => {
  stickySections.forEach((section) => {
    let image = document.createElement('img');
    image.src = img;
    section.querySelector('.scroll_section')!.appendChild(image);
  });
});

function transform(section: Element) {
  const offsetTop = section.parentElement!.offsetTop;
  const scrollSection = section.querySelector('.scroll_section');

  let percentage = ((window.scrollY - offsetTop) / window.innerHeight) * 100;
  percentage = percentage < 0 ? 0 : percentage > 300 ? 300 : percentage;
  // @ts-ignore
  scrollSection!.style.transform = `translate3d(${-percentage}vw, 0, 0)`;
}

window.addEventListener('scroll', (event) => {
  for (let i = 0; i < stickySections.length; i++) {
    transform(stickySections[i]);
  }
});

// ###############################
window.addEventListener('scroll', function () {
  // get scroll height
  let svg = document.querySelector('svg');
  let percentage =
    (window.scrollY + window.innerHeight) / document.body.scrollHeight;

  svg.style.strokeDasharray = `${percentage * 100} ${100 - percentage * 100}`;
});
