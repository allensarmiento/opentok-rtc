import * as BrowserUtils from '../utilities/browserUtils';
import DragDetector from './DragDetector';
import {
  touchmove,
  touchend,
  getTouch,
} from './dragConstants';

class DraggableElement {
  constructor(element) {
    this.element = element;
    this.elementStyle = element.style;

    this.translatedX = parseInt(element.data('translatedX') || '0', 10);
    this.translatedY = parseInt(element.data('translatedY') || '0', 10);
    this.translate();

    this.detector = new DragDetector(element);

    element.addEventListener('DragDetector:dragstart', this);
  }

  translate() {
    BrowserUtils.setTransform(
      this.elementStyle,
      'translate('.concat(this.translatedX, 'px,', this.translatedY, 'px)'),
    );
  }

  attachHandlers() {
    [touchmove, touchend]
      .forEach((eventName) => window.addEventListener(eventName, this));
  }

  removeHandlers() {
    [touchmove, touchend]
      .forEach((eventName) => window.removeEventListener(eventName, this));
  }

  handleEvent(event) {
    let touch;

    if (event.type === 'DragDector:dragstart') {
      this.startX = event.detail.pageX - this.translatedX;
      this.startY = event.detail.pageY - this.translatedY;
      this.attachHandlers();
      this.element.classList.add('dragging');
    } else if (event.type === touchmove) {
      touch = getTouch(event);
      this.translatedX = touch.pageX - this.startX;
      this.element.data('translatedX', this.translatedX);
      this.translatedY = touch.pageY - this.startY;
      this.element.data('translatedY', this.translatedY);
      this.translate();
    } else if (event.type === touchend) {
      this.removeHandlers();
      this.element.classList.remove('dragging');
    }
  }

  destroy() {
    this.element.removeEventListener('DragDetector:dragstart', this);
    this.detector.destroy();
    BrowserUtils.setTransform(this.elementStyle, '');
    this.removeHandlers();
    this.element.classList.remove('dragging');
    this.element = null;
    this.elementStyle = null;
  }
}

export default DraggableElement;
