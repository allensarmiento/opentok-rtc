import * as BrowserUtils from './browserUtils';

export function flush() {
  if (BrowserUtils.isIE()) {
    // While many attributes, when changed, case a reflow this doesn't appear
    // to be the case with data-* attributes in Internet Explorer. Changing
    // these will not immediately result in the element being redrawn - we
    // have to trigger our reflow manually.
    return (elements) => {
      const elementsArr = Array.isArray(elements) ? elements : [elements];

      elementsArr.forEach((element) => {
        const toggleElement = typeof element === 'string'
          ? document.querySelector(element)
          : element;

        if (toggleElement) {
          toggleElement.classList.toggle('flush-this-element-please');
        }
      });
    };
  }

  return () => {};
}

export function addArchiveHandler() {}
