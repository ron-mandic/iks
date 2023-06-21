function $(selectors: string): Element | null {
  return document.querySelector(selectors);
}

function $$(selectors: string): NodeListOf<Element> {
  return document.querySelectorAll(selectors);
}

export { $, $$ };
