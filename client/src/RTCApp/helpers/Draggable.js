import DraggableElement from './DraggableElement';
import {
  DRAG_TIMEOUT,
  CLICK_THRESHOLD,
} from './dragConstants';

const elements = {};

const Draggable = {
  on: (element) => {
    if (element && !elements[element]) {
      elements[element] = new DraggableElement(element);
    }
  },

  off: (element) => {
    const draggableElement = elements[element];

    if (draggableElement) {
      draggableElement.destroy();
      elements[element] = null;
    }
  },

  DRAG_TIMEOUT,
  CLICK_THRESHOLD,
};

export default Draggable;
