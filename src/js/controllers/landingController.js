import * as LandingView from '../views/landingView';
import * as Modal from '../components/modal';
import * as Events from '../state/events';

/* NOTE:
 *
 * When you click on the enter room button twice, the page refreshes
 *  - I suspect it has something to do with the form getting submitted
 *
 * Showing the contract may not work as expected.
 *  - I don't see localStorage updating
 *
 * Haven't tested if username is available in localStorage
 */

const landingVariables = {
  isWebRTCVersion: false,
  showTos: false
};

const DOM = {
  enterButton: document.querySelector('#enter'),
  room: document.querySelector('#room'),
  user: document.querySelector('#user'),
  form: document.querySelector('form'),
  roomLabel: document.querySelector('#room-label'),
  userLabel: document.querySelector('#user-label'),
  errorMessage: document.querySelector('.error-room')
};

/**
 * Initializes the landing page
 * TODO: Need to initialize the background (found in RTCApp)
 * TODO: Start room page
 */
export function init() {
  // Note that since the server forbids loading the content on an iframe this
  // should not execute. But it doesn't hurt either.
  if (window.top !== window.self && !window.iframing_allowed) {
    // If we're being loaded inside an ifram just hijack the top level window
    // and go back to the index page.
    window.top.document.location = '/index.html';
  } else {
    // And setting this on an else because the re-location might fail in some
    // cases.
    startApp();
  }

  if (window.location.hostname.indexOf('opentokrtc.com') === 0) {
    document.querySelector('.safari-plug').style.display = 'block';
  }
}

/**
 * Sets handlers and resets forms
 */
function startApp() {
  document.body.classList.remove('forbidden');

  LandingView.addHeader(landingVariables.isWebRTCVersion);

  if (landingVariables.showTos) {
    LandingView.loadTosTemplate();
  }

  resetForm();
  setUsernameFromLocalStorage();
  addHandlers();
}

/**
 * Resets all form fields and add event listeners
 */
function resetForm() {
  const fields = document.querySelectorAll('form input');
  Array.prototype.map.call(fields, function(field) {
    field.value = '';
    field.checked = false;
    DOM.room.focus();
    DOM.room.addEventListener('keyup', onKeyup);
    DOM.room.addEventListener('focus', onFocus);
    DOM.user.addEventListener('focus', onFocus);
  });
}

function setUsernameFromLocalStorage() {
  const storedUsername = window.localStorage.getItem('username');
  if (storedUsername) {
    DOM.user.value = storedUsername;
    DOM.userLabel.classList.add('visited');
  }
}

function onKeyup() {
  DOM.roomLabel.classList.add('visited');
  DOM.room.removeEventListener('keyup', onFocus)
}

function onFocus() {
  // this.id comes from the focus element id
  if (this.id === 'room') {
    DOM.errorMessage.classList.remove('show');
    DOM.roomLabel.style.opacity = 1;
    DOM.roomLabel.classList.add('visited');

    if (DOM.user.value.length === 0) {
      DOM.userLabel.classList.remove('visited');
    }
  } else {
    DOM.userLabel.classList.add('visited');
    if (DOM.room.value.length === 0) {
      DOM.roomLabel.classList.remove('visited');
    }
  }
}

/**
 * Handle enter room clicked
 */
function addHandlers() {
  DOM.enterButton.addEventListener('click', onEnterClicked);
}

function onEnterClicked(event) {
  event.preventDefault();
  event.stopImmediatePropagation();

  if (!isValid()) {
    DOM.form.classList.add('error');
    DOM.room.blur();
    DOM.roomLabel.style.opacity = 0;
    return;
  }

  DOM.form.classList.remove('error');
  DOM.enterButton.removeEventListener('click', onEnterClicked);

  if (landingVariables.showTos) {
    showContract().then(accepted => {
      if (accepted) {
        sessionStorage.setItem('tosAccepted', true);
        navigateToRoom();
      } else {
        // ? Why add handlers if not accepted?
        addHandlers();
      }
    });
  } else {
    navigateToRoom();
  }
}

/**
 * Check if form is valid
 * @return {boolean} 
 */
function isValid() {
  let formValid = true;
  const fields = document.querySelectorAll('form input.required');

  Array.prototype.map.call(fields, function(field) {
    // Note: We switch the error message element here (room or user)
    DOM.errorMessage = document.querySelector(`.error-${field.id}`);
    const valid = field.type === 'checkbox' ? field.checked : field.value.trim();
    if (valid) {
      DOM.errorMessage.classList.remove('show');
    } else {
      DOM.errorMessage.classList.add('show');
    }
    formValid = formValid && valid;
  });

  return formValid;
}

/**
 * Show the contract by using the modal component 
 */
function showContract() {
  const selector = '.tc-modal.contract';
  const acceptElement = document.querySelector(`${selector} .accept`);

  return Modal.show(selector)
    .then(() => {
      // ! When accepted, some form is getting submitted causing a refresh.
      return new Promise(resolve => {
        acceptElement.addEventListener('click', function onClicked(evt) {
          acceptElement.removeEventListener('click', onClicked);
          resolve(true);
          evt.preventDefault();
          Modal.hide(selector);
        });

        Events.events.addEventHandler('modal:close', function() {
          resolve();
        });
      });
    });
}

/**
 * Navigate to the room page by changing the url
 */
function navigateToRoom() {
  const base = window.location.href.replace(/([^/]+)\.[^/]+$/, '');
  let url = base.concat('room/', encodeURIComponent(DOM.room.value));
  const userName = encodeURIComponent(DOM.user.value.trim());

  if (userName) {
    url = url.concat(`?userName=${userName}`);
  }

  resetForm();
  window.location.href = url;
}

