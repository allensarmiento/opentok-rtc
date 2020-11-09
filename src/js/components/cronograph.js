export default class Cronograph {
  constructor() {
    this.cronographElement = null;
    this.counter = 0;
    this.counterTimer = null;
  }

  /**
   * It initializes the cronograph.
   *  
   * @param {string} initialText Optional text which will be displayed 
   *  before starting
   */
  init(initialText) {
    this.cronographElement = document.querySelector('.duration');
    this._reset(initialText);
  }

  _reset(text) {
    this.counter = 0;
    if (this.cronographElement) {
      this._paint(text);
    }
  }

  _paint(text) {
    if (!text) {
      const minutes = Math.floor(counter / 60);
      const seconds = Math.floor(counter % 60);
      text = `${this._beautify(minutes)}:${this._beautify(seconds)}`;
    }

    this.cronographElement.textContent = text;
  }

  _beautify(value) {
    return (value < 10) ? `0${value}` : value;
  }

  /**
   * It starts the chronograph from 0 by default.
   * 
   * @param {number} from Sets the seconds from where the chronograph will 
   *  start counting.
   */
  start(from) {
    if (this.counterTimer !== null) {
      return;
    }

    this.counter = Math.max(from || 0, 0);
    this.counterTimer = setInterval(() => {
      this.counter++;
      this._paint();
    }, 1000);
  }

  stop() {
    clearInterval(this.counterTimer);
    this.counterTimer = null;
  }

  reset(text) {
    this._reset(text);
  }
}
