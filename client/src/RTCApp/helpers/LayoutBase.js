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

  flush() {} // eslint-disable-line class-methods-use-this
}

export default LayoutBase;
