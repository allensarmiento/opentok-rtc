import LayoutBase from './LayoutBase';

class Hangout extends LayoutBase {
  constructor(container, items, item, type) {
    super(container, items, type);

    Object.keys(this.handlers).forEach((type) => {
      window.addEventListener(type, this);
    }, this);

    this.sanitize(!!item);

    if (item) {

    }
  }

  get handlers() {}

  sanitize() {}

  putItemOnStage() {}

  getRandomItem() {}

  updateTotalOnStage() {}
}

export default Hangout;
