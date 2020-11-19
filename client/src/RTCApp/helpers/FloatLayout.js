import LayoutBase from './LayoutBase';
import Draggable from './Draggable';

class Float extends LayoutBase {
  constructor(container, items) {
    super(container, items, 'float');
    this.addedDraggableFeature = false;
  }

  features() { // eslint-disable-line class-methods-use-this
    return {
      width: '100%',
      height: '100%',
    };
  }

  publisher() {
    return this.items.publisher;
  }

  addDraggableFeature() {
    if (this.addedDraggableFeature || !this.publisher) {
      return;
    }

    this.addedDraggableFeature = true;
    Draggable.on(this.publisher);
  }

  rearrange() {
    LayoutBase.prototype
      .rearrange
      .apply(this, arguments); // eslint-disable-line prefer-rest-params
  }

  destroy() {
    Draggable.off(this.publisher);
    LayoutBase.prototype
      .destroy
      .apply(this, arguments); // eslint-disable-line prefer-rest-params
  }
}

export default Float;
