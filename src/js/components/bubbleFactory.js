/*
 * This factory deails with Bubble UI Elements.
 *
 * What is a Bubble UI Element?
 * 
 *  It is a UI element that is displayed to the right of the element with which
 *  it is associated, typically items on the main menu.
 * 
 * How it works...
 * 
 *  This component provides features like show or hide bubbles and also it 
 *  hides them automatically when users click on the app outside bubbles.
 * 
 * E.g.:
 * 
 *  Javascript:
 * 
 *  BubbleFactory.get('addToCall').show();
 * 
 *  HTML:
 * 
 *  <a id="addToCall" href="#">Click me!</a>
 * 
 *  <section class="bubbles">
 *    <!-- The key is the "for" attribute to indicate the association -->
 *    <section for="addToCall" class="bubble">
 *      <div class="bubble-content">
 *        <p>Hi my friend!</p>
 *      </div>
 *    </section>
 *  </section>
 * 
 */

const transEndEventName = ('WebkitTransition' in document.documentElement.style)
  ? 'webkitTransitionEnd' : 'transitionend';

const VERTICAL_OFFSET = 4;
const HORIZONTAL_OFFSET = 10;

class Bubble {
  /** @param {string} id Id of the element which is associated with bubble */
  constructor(id) {
    this.container = document.querySelector(`.bubble[for="${id}"]`);
    this.topArrow = this.container.querySelector('.top-arrow');
    this.associatedWith = document.getElementById(id);
    this._onHidden = this._onHidden.bind(this);

    this.bubbleShown = null;
    this._visible = false;

    // Bubbles consumes 'click' events in order not to be closed automatically
    this.container.addEventListener('click', evt => {
      evt.stopImmediatePropagation();
    });
  }

  /** */
  show() {
    this.bubbleShown = this.bubbleShown || new Promise(resolve => {
      this.container.removeEventListener(transEndEventName, this._onHidden);
      this.container.addEventListener(transEndEventName, this._onShown);
      this.container.addEventListener(transEndEventName, function onEnd() {
        this.container.removeEventListener(transEndEventName, onEnd);
        resolve();
      });

      this._takePlace();
      this._visible = true;

      setTimeout(() => {
        this.container.classList.add('show');
      }, 50); // Give the chance to paint the UI element before fading in.
    });

    return this.bubbleShown;
  }

  _takePlace() {
    const rectObject = this.associatedWith.getBoundingClientRect();

    if (this.topArrow) {
      this.container.style.right = 
        `${window.innerWidth - rectObject.right - 20}px`;
      this.container.style.top = `${rectObject.bottom + VERTICAL_OFFSET}px`;
    } else {
      this.container.style.left = `${rectObject.right + HORIZONTAL_OFFSET}px`;
      this.container.style.top = `${rectObject.top - rectObject.height}px`;
    }
  }

}

let bubbles = {};

export function get(id) {
  const instance = bubbles[id];

  if (!instance) {
    bubbles[id] = new Bubble(id);
    instance = bubbles[id];
  }

  return instance;
}
