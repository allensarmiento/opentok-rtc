import * as HTMLElems from '../utilities/htmlElems';

class LayoutBase {
  constructor(container, items, type) {
    this.container = container;
    this.items = items;

    container.data('currentLayoutType', type);
  }

  rearrange() {
    const features = this.features();

    Object.keys(this.items).forEach((id) => {
      const { style } = this.items[id];

      Object.keys(features).forEach((feature) => {
        style[feature] = features[feature];
      });
    }, this); // ? Is 'this' needed?

    this.flush();
  }

  features() { // eslint-disable-line class-methods-use-this
    return {};
  }

  get total() {
    return Object.keys(this.items).length;
  }

  flush() {
    HTMLElems.flush(this.container);
  }

  destroy() {
    this.container = null;
  }
}

export default LayoutBase;
