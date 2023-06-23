import { objOriginCountries } from './constants.ts';

function $(selectors: string): Element | null {
  return document.querySelector(selectors);
}

function $$(selectors: string): NodeListOf<Element> {
  return document.querySelectorAll(selectors);
}

function funcGetArcsData(selectedCountry: string) {
  return objOriginCountries[selectedCountry as keyof typeof objOriginCountries]
    .asylumCountries;
}

export { $, $$, funcGetArcsData };
