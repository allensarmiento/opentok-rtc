import * as LandingView from '../views/landingView';
import * as Modal from '../controllers/modalController';
import tokboxNexmoLogo from '../../assets/images/new-vonage-logo.png';
import '../../less/main.less';

const landingVariables = {
  isWebRTCVersion: false,
  showTos: true
};

const DOM = {
  enterButton: document.querySelector('#enter'),
  room: document.querySelector('#room'),
  user: document.querySelector('#user'),
  form: document.querySelector('#form'),
  roomLabel: document.querySelector('#room-label'),
  userLabel: document.querySelector('#user-label'),
  errorMessage: document.querySelector('.error-room')
};

export function init() {
  document.querySelector('.header').insertAdjacentHTML('beforeend', `
    <h1>${landingVariables.isWebRTCVersion ? 'WebRTC Demo' : 'Vonage Demo by'}</h1>
    <img src="${tokboxNexmoLogo}" alt="opentok transparent logo">
    ${landingVariables.isWebRTCVersion ? `
      <h2>Built by Vonage on the OpenTok Platform</h2> 
      <h3>This WebRTC Demo enables group video conferenging, text chat, screen sharing, and more.</h3>
    ` : ``}
  `);

  if (landingVariables.showTos) {
    LandingView.loadTosTemplate();
  }

  resetForm();

  const storedUsername = window.localStorage.getItem('username');
  if (storedUsername) {
    user.value = storedUsername;
    DOM.userLabel.classList.add('visited');
  }
}

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

function onKeyup() {
  DOM.roomLabel.classList.add('visited');
  DOM.room.removeEventListener('keyup', onFocus)
}

function onFocus() {
  // this.id comes from the focus element id
  if (this.id === 'room') {
    DOM.errorMessage .classList.remove('show');
    DOM.roomLabel.style.opacity = 1;
    DOM.roomLabel.classList.add('visited');

    if (DOM.user.value.length === 0) {
      DOM.userLabel.classList.remove('visited');
    }
  } else {
    DOM.user.classList.add('visited');
    if (DOM.room.value.length === 0) {
      DOM.roomLabel.classList.remove('visited');
    }
  }
}

function addHandlers() {
  DOM.enterButton
    .addEventListener('click', function onEnterClicked(event) {
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
        // TODO: Show contract  
      }
    });
}

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

function showContract() {
  const selector = '.tc-modal.contract';
  const acceptElement = document.querySelector(`${selector} .accept`);

  return Modal.show(selector)
    .then(() => {
      return new Promise(resolve => {
        acceptElement.addEventListener('click', function onClicked(evt) {
          acceptElement.removeEventListener('click', onClicked);
          resolve(true);
          evt.preventDefault();
          Modal.hide(selector);
        });

        // TODO
        const newEvt = new CustomEvent('modal:close', j)
      });
    });
}

