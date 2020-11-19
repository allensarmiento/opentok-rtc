import LayoutBase from './LayoutBase';

class Grid extends LayoutBase {
  constructor(container, items) {
    super(container, items, 'grid');
  }

  features() {
    const total = this.total();
    const columns = Math.ceil(Math.sqrt(total));

    return {
      width: `${100 / columns}%`,
      height: `${100 / Math.ceil(total / columns)}%`,
    };
  }
}

export default Grid;
