import { SimpleEarth } from '../src/ts/classes/SimpleEarth';
import { EARTH_CONFIG_OPTIONS } from '../src/ts/constants';
import gsap from 'gsap';
import { EWikiData } from '../src/ts/enum';
import { GLOBE_DATA_NEWS } from '../src/ts/data';

let isClicked = false;
let hasIntroduced = false;

let currentID = EWikiData.SUDAN;

const timeline = gsap.timeline();
const earth = new SimpleEarth('#app', EARTH_CONFIG_OPTIONS);
const ui = document.querySelector('#ui');
const handleArea = ui.querySelector('.handle-area');
const blogHeaderContainer = ui.querySelector('.blog-header-container');

function moveToViewBy(percent) {
  let randAlt = Math.random() * 1.75 + 0.75;

  if (percent <= 0.2 && currentID !== EWikiData.SUDAN) {
    currentID = EWikiData.SUDAN;
    const { lat, lng } = GLOBE_DATA_NEWS[currentID];

    earth.world!.pointOfView({ lat, lng, altitude: 0.55 }, 2500);
  } else if (
    percent > 0.2 &&
    percent <= 0.4 &&
    currentID !== EWikiData.GREECE
  ) {
    currentID = EWikiData.GREECE;
    earth.world!.pointOfView(GLOBE_DATA_NEWS[currentID], 2500);
  } else if (
    percent > 0.4 &&
    percent <= 0.6 &&
    currentID !== EWikiData.MYANMAR
  ) {
    currentID = EWikiData.MYANMAR;
    const { lat, lng } = GLOBE_DATA_NEWS[currentID];

    earth.world!.pointOfView({ lat, lng, altitude: 0.425 }, 2500);
  } else if (
    percent > 0.6 &&
    percent <= 0.8 &&
    currentID !== EWikiData.DR_CONGO
  ) {
    currentID = EWikiData.DR_CONGO;
    const { lat, lng } = GLOBE_DATA_NEWS[currentID];

    earth.world!.pointOfView({ lat, lng, altitude: 0.55 }, 2500);
  } else if (percent > 0.8 && percent <= 1 && currentID !== EWikiData.ITALY) {
    currentID = EWikiData.ITALY;
    earth.world!.pointOfView(GLOBE_DATA_NEWS[currentID], 2500);
  }
}

handleArea.addEventListener('click', () => {
  blogHeaderContainer.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
  setTimeout(() => {
    earth.world!.pointOfView({ lat: 0, lng: 20, altitude: 8 }, 2500);
  }, 2000);

  if (!hasIntroduced)
    setTimeout(() => {
      let { lat, lng } = GLOBE_DATA_NEWS[currentID];
      earth.world!.pointOfView({ lat, lng, altitude: 0.55 }, 2500);
    }, 2000);

  if (!isClicked) {
    timeline
      .to('#app', {
        translateX: '31%',
        duration: 1.5,
        ease: 'power2.inOut',
      })
      .to('#ui', {
        translateX: '0',
        duration: 1.5,
        delay: -1.5,
        ease: 'circ.out',
      });

    if (!hasIntroduced) {
      blogHeaderContainer.classList.add('introduce');
      hasIntroduced = true;
    }
  } else {
    timeline
      .to('#ui', {
        translateX: '-96.375%',
        duration: 1.5,
        ease: 'power2.inOut',
      })
      .to('#app', {
        translateX: '0',
        duration: 1.5,
        delay: -1.25,
        ease: 'circ.out',
      });
  }

  isClicked = !isClicked;
  earth.world!.pointOfView({ lat: 0, lng: 20, altitude: 8 }, 2500);
  document.body.classList.toggle('side');
});

blogHeaderContainer.addEventListener('scroll', function () {
  moveToViewBy((this.scrollTop + this.clientHeight) / this.scrollHeight);
});
