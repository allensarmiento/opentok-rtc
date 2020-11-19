import * as BrowserUtils from '../utilities/browserUtils';
import {
  touchstart,
  touchmove,
  touchend,
  contextmenu,
  getTouch,
  DRAG_TIMEOUT,
  CLICK_THRESHOLD,
} from './dragConstants';

class DragDetector {
  constructor(element) {
    this.element = element;
    this.timer = null;
    this.startX = null;
    this.startY = null;

    element.addEventListener(touchstart, this);
  }

  startTimer() {
    this.attachHandlers();
    this.clearTimer();

    const timeout = () => this.sendEvent();
    this.timer = setTimeout(timeout.bind(this), DRAG_TIMEOUT);
  }

  clearTimer() {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.removeHandlers();
      this.timer = null;
    }
  }

  attachHandlers() {
    [touchmove, touchend, contextmenu].forEach((eventName) => {
      this.element.addEventListener(eventName, this);
    }, this);
  }

  removeHandlers() {
    [touchmove, touchend, contextmenu].forEach((eventName) => {
      this.element.removeEventListener(eventName, this);
    }, this);
  }

  sendEvent() {
    BrowserUtils.sendEvent('DragDetector:dragstart', {
      pageX: this.startX,
      pageY: this.startY,
    }, this.element);

    this.clearTimer();
  }

  handleEvent(event) {
    if (event.type === touchstart) {
      const touch = getTouch(event);
      this.startX = touch.pageX;
      this.startY = touch.pageY;
      this.startTimer();
    } else if (event.type === touchmove) {
      const touch = getTouch(event);
      if (
        Math.abs(touch.pageX - this.startX) > CLICK_THRESHOLD
        || Math.abs(touch.pageY - this.startY) > CLICK_THRESHOLD
      ) {
        this.sendEvent();
      }
    } else if (event.type === touchend || event.type === contextmenu) {
      this.clearTimer();
    }
  }

  destroy() {
    this.clearTimer();
    this.element.removeEventListener(touchstart, this);
    this.element = null;
    this.startX = null;
    this.startY = null;
  }
}

export default DragDetector;
