import * as BrowserUtils from '../utils/browserUtils';

/**
 * @param {HTMLElement} elem 
 * @param {string} text
 */
export function addText(elem, text) {
  const lines = text.split(/\r?\n/);

  // Add the first element, followed by <br>, followed by element...
  addLine(elem, lines[0]);
  for (let i = 1; i < lines.length; i++) {
    elem.appendChild(document.createElement('BR'));
    addLine(elem, lines[i]);
  }
}

/**
 * @param {HTMLElement} elem 
 * @param {string} line
 */
function addLine(elem, line) {
  if (line.length > 0) {
    elem.appendChild(document.createTextNode(line));
  }
}

/**
 * @param {HTMLElement} el
 * @param {string} tagName 
 * @return {HTMLElement | null} Element with specified tag name or null
 */
export function getAncestorByTagName(el, tagName) {
  tagName = tagName.toUpperCase();

  if (el.tagName === tagName) {
    return el;
  }

  while (el.parentNode) {
    el = el.parentNode;
    if (el.tagName === tagName) {
      return el;
    }
  }

  return null;
}

/** */
export function flush() {
  if (BrowserUtils.isIE()) {
    // While many attributes, when changed, cause a reflow this doesn't appear
    // to be the case with data-* attributes in Internet Explorer. Changing
    // these will not immediately result in the element being redrawn - we
    // have to trigger out reflow manually.
    return elements => {
      elements = Array.isArray(elements) ? elements : [elements];
      elements.forEach(element => {
        element = typeof element === 'string' 
          ? document.querySelector(element) : element;
        if (element) {
          element.classList.toggle('flush-this-element-please');
        }
      });
    };
  }

  return () => {};
}
