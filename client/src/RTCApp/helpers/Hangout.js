import LayoutBase from './LayoutBase';
import * as BrowserUtils from '../utilities/BrowserUtils';

class Hangout extends LayoutBase {
  constructor(container, items, item, type) {
    super(container, items, type);

    Object.keys(this.handlers).forEach((type) => {
      window.addEventListener(type, this);
    }, this);

    this.sanitize(!!item);

    if (item) {
      this.putItemOnStage(item);
    } else if (!this.totalOnStage) {
      this.putItemOnStage(this.getRandomItem());
    }

    this.updateTotalOnStage();
  }

  get handlers() {
    return {
      'layoutView:itemSelected': (event) => {
        const { item } = event.detail;

        if (this.isOnStage(item)) {
          // Selected item is already on stage so it should be expanded to
          // cover all. That means the other item on stage should go to the
          // strip leaving the stage.
          const itemType = this.getItemType(item) === 'camera'
            ? 'screen' : 'camera';
          this.removeCurrentItemFromStage(itemType);
        } else {
          this.putItemOnStage(item);
        }

        this.updateTotalOnStage();
      },
      'layoutManager:itemDeleted': (event) => {
        const { item } = event.detail;

        if (this.isOnStage(item)) {
          this.removeItemFromStage(item).updateTotalOnStage();

          if (!this.totalOnStage) {
            BrowserUtils.sendEvent('hangout:emptyStage');
          }
        }
      },
      'layoutManager:itemAdded': (event) => {
        const { item } = event.detail;

        // New screen shared goes to stage if there is not another screen shared
        // there.
        if (this.getItemType(item) === 'screen' && !this.stageIds.screen) {
          this.putItemOnStage(item).updateTotalOnStage();
        }
      },
    };
  }

  handleEvent(event) {
    this.handlers[event.type].call(this, event);
  }

  /**
   * @param {object} item
   * @return {boolean} If item is already on stage
   */
  isOnStage(item) {
    return item.classList.contains('on-stage');
  }

  /**
   * Removes the current item on stage given a type if exists.
   * @param {string} type Item type
   * @return {Hangout} this
   */
  removeCurrentItemFromStage(type) {
    const item = this.items[this.stageIds[type]];
    return this.removeItemFromStage(item);
  }

  /**
   * Removes the item on stage if exists.
   * @param {object} item
   * @return {Hangout} this
   */
  removeItemFromStage(item) {
    if (item) {
      this.removeStageId(item);
      item.classList.remove('on-stage');

      if (this.getItemType(item) === 'screen') {
        BrowserUtils.sendEvent('hangout:screenOnStage', { status: 'off' });
      }
    }

    return this;
  }

  removeStageId() {}

  /** 
   * @return {object[]} For each event with type and attribute name
   */
  get stageTypeDescriptors() {
    ['camera', 'screen'].map((type) => {
      return {
        type,
        attrName: this.getAttributeName(type),
      };
    });
  },

  /** @return {object} All ids of items on stage */
  get stageIds() {
    const ids = {};

    this.stageTypeDescriptors.forEach((descriptor) => {
      const id = this.container.data(descriptor.attrName);

      if (id) ids[descriptor.type] = id;
    }, this);

    return ids;
  }

  set stageIds(itemIds) {
    const ids = itemIds || {};

    this.stageTypeDescriptors.forEach((descriptor) => {
      if (ids[descriptor.type]) {
        this.container.data(descriptor.attrName, ids[descriptor.type]);
      } else {
        this.container.data(descriptor.attrName, null);
      }
    }, this);
  }

  /** @return {number} Total items rendered on the stage */
  get totalOnStage() {
    return Object.keys(this.stageIds).length;
  }

  /** @return {number} Total items rendered on the strip */
  get totalOnStrip() {
    return this.total - this.totalOnStage;
  }

  /**
   * @param {string} type camera or screen
   * @return {string} Data attribute where the id will be stored depending
   * on type.
   */
  getAttributeName(type) {
    return `onStage${type.chatAt(0).toUpperCase()}${type.slice(1)}`;
  }

  /**
   * @param {object} item
   * @return {string} Type of item which is used to index internally
   */
  getItemType(item) {
    let type = null;

    switch(item.data('streamType')) {
      case: 'camera',
      case: 'publisher',
        type = 'camera';
        break;
      default:
        type = 'screen';
    }

    return type;
  }

  /**
   * @param {object} item
   * @return {string} Id of item received as param
   */
  getItemId(item) {
    return item.data('id');
  }

  sanitize(reset) {
    // TODO
  }

  /**
   * Puts an item on stage:
   *  1) Remove the current item on stage of same type if exists
   *  2) Put item received as param on the stage
   * @param {object} item
   * @return {Hangout} this
   */
  putItemOnStage(item) {
    if (!item) return this;

    const type = this.getItemType(item);
    this.removeCurrentItemFromStage(type).putStageId(item);
    item.classList.add('on-stage');
    
    if (type === 'screen') {
      BrowserUtils.sendEvent('hangout:screenOnStage', { status: 'on' });
    }
    
    return this;
  }

  putStageId() {}

  /** @return {object} Random item except publisher */
  getRandomItem() {
    return this.items[Object.keys(this.items).find((id) => id !== 'publisher')];
  }

  updateTotalOnStage() {}
}

export default Hangout;
