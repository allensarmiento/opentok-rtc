import LayoutBase from './LayoutBase';

class F2FVertical extends LayoutBase {
  constructor(container, items) {
    super(container, items, 'f2f_vertical');
  }

  features() {
    return {
      width: `${100 / this.total}%`,
      height: '100%',
    };
  }
}

export default F2FVertical;
