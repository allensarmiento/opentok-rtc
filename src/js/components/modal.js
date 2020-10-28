import * as Events from '../state/events';

let preShowFocusElement;
let modalShown = false;
let queuedModals = [];

const transEndEventName = ('WebkitTransition' in document.documentElement.style)
  ? 'webkitTransitionEnd' : 'transitionend';

let closeHandlers = {};
let keyPressHandler;

export function show(selector, preShowCb, allowMultiple) {
  let screenFree;

  preShowFocusElement = document.activeElement;

  if (preShowFocusElement) {
    preShowFocusElement.blur();
  }

  if (!modalShown || allowMultiple) {
    screenFree = Promise.resolve();
  } else {
    screenFree = new Promise(resolve => {
      queuedModals.push(resolve);
    });
  }

  return screenFree.then(() => {
    return new Promise(function(resolve) {
      modalShown = true;

      const modal = document.querySelector(selector);
      modal.addEventListener(transEndEventName, function onTransitionend() {
        modal.removeEventListener(transEndEventName, onTransitionend);
        addCloseHandler(selector);
        resolve();
      });
      // ! I added this here because the modal wouldn't close.
      // ! May need to come back to this.
      // addCloseHandler(selector);

      modal.classList.add('visible');
      modal.classList.add('show');
    });
  });
}

function addCloseHandler(selector) {
  const closeElement = document.querySelector(`${selector} .close`);
  if (!closeElement) {
    return;
  }

  closeHandlers[selector] = {
    target: closeElement,
    handler: () => {
      Events.sendEvent('modal:close');
      hide(selector);
    }
  };

  keyPressHandler = event => {
    const keyCode = event.which || event.keyCode;
    if (keyCode === 27) { // escape key
      closeHandlers[selector].handler();
    }
  };

  closeElement.addEventListener('click', closeHandlers[selector].handler);
  document.body.addEventListener('keyup', keyPressHandler);
}

export function hide(selector) {
  return new Promise(resolve => {
    const modal = document.querySelector(selector);

    modal.addEventListener(transEndEventName, function onTransitionend() {
      modal.removeEventListener(transEndEventName, onTransitionend);
      modal.classList.remove('visible');
      
      if (preShowFocusElement) {
        preShowFocusElement.focus();
      }

      resolve();
    });

    removeCloseHandler(selector);
    modal.classList.remove('show');
  }).then(function() {
    modalShown = false;
    const nextScreen = queuedModals.shift();
    if (nextScreen) {
      nextScreen();
    }
  });
}

function removeCloseHandler(selector) {
  const obj = closeHandlers[selector]; 
  if (obj) {
    obj.target.removeEventListener('click', obj.handler);
  }
  document.body.removeEventListener('keyup', keyPressHandler);
}

