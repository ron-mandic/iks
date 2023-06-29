import { Earth } from './Earth.ts';
import { EWikiData } from '../enum.ts';
import { DICT_GLOBE_ORIGINS } from '../dictionary.ts';
import { UI_TriggerCanvas, UI_TriggerPointOfView } from '../functions.ts';
import $ from 'jquery';

export class UI {
  ref: HTMLElement;
  parent: Earth;
  dictKeys: { [key: string]: string };
  dictViews: { [key: string]: HTMLElement };
  dictTabs: { [key: string]: HTMLElement };
  dictCharts: { [key: string]: HTMLElement };

  motherView: HTMLElement;

  arrTabs;
  currentKey: string;
  currentView: HTMLElement;

  trigger: HTMLElement;

  constructor(ref: HTMLElement, earth: Earth) {
    this.ref = ref;
    this.parent = earth;
    this.arrTabs = Array.from(this.ref.querySelectorAll('.tabs'));

    this.motherView = this.ref.querySelector('#c-0')!;

    this.dictKeys = {
      [EWikiData.SYRIA]: 'c-1',
      [EWikiData.AFGHANISTAN]: 'c-2',
      [EWikiData.SOUTH_SUDAN]: 'c-3',
      [EWikiData.MYANMAR]: 'c-4',
      [EWikiData.DR_CONGO]: 'c-5',
    };
    this.dictViews = {
      [EWikiData.SYRIA]: this.ref.querySelector('#c-1')!,
      [EWikiData.AFGHANISTAN]: this.ref.querySelector('#c-2')!,
      [EWikiData.SOUTH_SUDAN]: this.ref.querySelector('#c-3')!,
      [EWikiData.MYANMAR]: this.ref.querySelector('#c-4')!,
      [EWikiData.DR_CONGO]: this.ref.querySelector('#c-5')!,
    };
    this.dictTabs = {
      [EWikiData.SYRIA]: this.arrTabs[0] as HTMLElement,
      [EWikiData.AFGHANISTAN]: this.arrTabs[1] as HTMLElement,
      [EWikiData.SOUTH_SUDAN]: this.arrTabs[2] as HTMLElement,
      [EWikiData.MYANMAR]: this.arrTabs[3] as HTMLElement,
      [EWikiData.DR_CONGO]: this.arrTabs[4] as HTMLElement,
    };
    this.dictCharts = {
      [EWikiData.SYRIA]: this.dictViews[EWikiData.SYRIA].querySelector(
        '.chart'
      )! as HTMLElement,
      [EWikiData.AFGHANISTAN]: this.dictViews[
        EWikiData.AFGHANISTAN
      ].querySelector('.chart')! as HTMLElement,
      [EWikiData.SOUTH_SUDAN]: this.dictViews[
        EWikiData.SOUTH_SUDAN
      ].querySelector('.chart')! as HTMLElement,
      [EWikiData.MYANMAR]: this.dictViews[EWikiData.MYANMAR].querySelector(
        '.chart'
      )! as HTMLElement,
      [EWikiData.DR_CONGO]: this.dictViews[EWikiData.DR_CONGO].querySelector(
        '.chart'
      )! as HTMLElement,
    };

    this.currentKey = 'c-0';
    this.currentView = this.ref.querySelector('#c-0')!;

    this.trigger = document.querySelector('.trigger')!;

    this.initClickEvents();
  }

  update(key: string) {
    if (key in DICT_GLOBE_ORIGINS) {
      this.dictCharts[key].classList.remove('on');

      this.currentView = this.dictViews[key];
      this.currentKey = this.currentView.id;
    }
  }

  animateChart(key: string) {
    if (this.dictCharts[key]) this.dictCharts[key].classList.add('on');
  }

  showView(key: string) {
    this.currentView.classList.add('is-hidden');
    this.update(key);
    this.currentView.classList.remove('is-hidden');
  }

  initClickEvents() {
    this.ref.querySelectorAll('.card').forEach((el) => {
      el.addEventListener('click', (e: Event) =>
        UI_TriggerPointOfView(e, this.parent.world!)
      );
    });

    this.ref.querySelectorAll("input[type='radio']").forEach((el) => {
      el.addEventListener('click', (e) => {
        UI_TriggerCanvas(e.target as HTMLInputElement, this);
      });
    });
  }

  reset() {
    this.currentKey = 'c-0';
    this.currentView.classList.add('is-hidden');
    this.currentView = this.ref.querySelector('#c-0')!;
    this.currentView.classList.remove('is-hidden');
  }

  resetInputs() {
    this.ref.querySelectorAll("input[type='radio']").forEach((el) => {
      let input = el as HTMLInputElement;
      input.checked = false;
    });
  }

  resetScrollState(animated = false) {
    animated
      ? this.ref.querySelector('.container')!.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      : (this.ref.querySelector('.container')!.scrollTop = 0);
  }

  unClip() {
    $('.clipped').css('opacity', '1');
    $('.clipped').css('clip-path', 'polygon(0 100%, 100% 100%, 100% 0%, 0 0%)');
    $(
      '.logo img, .clip-container h1, .clip-container hr, .clip-container img.trigger'
    ).addClass('out');
    $('.slider_inner').addClass('in');
    setTimeout(function () {
      $('.slider_inner').click();
    }, 2500);
  }

  onStart(callback: () => void) {
    this.trigger.addEventListener('click', callback);
  }
}
