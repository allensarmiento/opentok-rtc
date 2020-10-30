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

