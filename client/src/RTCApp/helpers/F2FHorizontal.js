import LayoutBase from './LayoutBase';

class F2FHorizontal extends LayoutBase {
  constructor(container, items) {
    super(container, items, 'f2f_horizontal');
  }

  features() {
    return {
      width: '100%',
      height: `${100 / this.total}%`,
    };
  }
}

export default F2FHorizontal;
