const isTouch = 'ontouchstart' in exports;
export const touchstart = isTouch ? 'touchstart' : 'mousedown';
export const touchmove = isTouch ? 'touchmove' : 'mousemove';
export const touchend = isTouch ? 'touchend' : 'mouseup';
export const contextmenu = 'contextmenu';

export function getTouch() {
  return isTouch
    ? (e) => e.touches[0]
    : (e) => e;
}

export const DRAG_TIMEOUT = 200;
export const CLICK_THRESHOLD = 10;
