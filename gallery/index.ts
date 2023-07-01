import { geoNaturalEarth1 } from 'd3';

const tiles = document.querySelectorAll('.tile');
const heading = document.querySelector('h1');
const anchor = document.querySelector('a');
// const aside = document.querySelector('aside');

let count = 0;
const arrCount = [];
const dictTiles = {};

function paint(arr, el) {
  for (let i = 0; i < 9; i++) {
    if (arr[i]) el.children[i].setAttribute('data-label', arr[i]);
    else el.children[i].removeAttribute('data-label');
  }
}

function areAllConsecutive(arr, sorted = false) {
  let array = sorted ? arr.sort((a, b) => a - b) : arr;
  for (let i = 0; i < array.length - 1; i++) {
    if (array[i + 1] - array[i] !== 1) return false;
  }
  return true;
}

tiles.forEach((tile) => {
  tile.addEventListener('click', function () {
    const databaseId = this.dataset.id;
    this.classList.toggle('selected');
    this.querySelector('.modal').classList.toggle('off');

    if (dictTiles[databaseId] === undefined) {
      dictTiles[databaseId] = true;
      if (!arrCount.includes(+databaseId)) arrCount.push(+databaseId);
      count++;
    } else {
      delete dictTiles[databaseId];
      arrCount.splice(arrCount.indexOf(databaseId), 1);
      count--;
    }

    console.log(arrCount);
    // paint(arrCount, aside);

    heading.style.filter = `blur(${9 * 0.2 - count * 0.2}vmax)`;

    if (arrCount.length === 9 && areAllConsecutive(arrCount)) {
      // anchor.classList.remove('disabled');
      // aside.classList.add('disabled');
    } else {
      /* if (!anchor.classList.contains('disabled'))
        anchor.classList.add('disabled'); */
      /* if (!aside.classList.contains('disabled') && arrCount.length === 9)
        aside.classList.add('disabled'); */
    }
  });
  tile.addEventListener('dblclick', () => {
    tile.classList.toggle('visited');
  });
});
