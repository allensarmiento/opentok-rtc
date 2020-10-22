import * as PrecallView from '../views/precallView';
import * as Events from '../state/events';

let alreadyInitialized = false;

export function init() {
  if (alreadyInitialized) return;
  
  PrecallView.init();
  addEventHandlers();
  PrecallView.renderPrecallTemplate();
  // TODO: Render tosTemplate if available
  alreadyInitialized = true;
}

function addEventHandlers() {
  Events.addEventHandler('roomView:endprecall', function() {
    Events.sendEvent('PrecallController:endPrecall');
  });

  // NOTE: Is this needed? 
  Events.addEventHandler('PrecallController:endPrecall', function() {
    model.addEventListener('value', render);
    // ? Why call the render method here when there's an event listener already?
    render();
  });

  Events.addEventHandler('PrecallController:audioOnly', function() {
    setSwitchStatus(false, 'Video', 'roomView:initialVideoSwitch');
  });
}

function render() {

}

function setSwitchStatus(status, switchName, eventName) {
  const switchValues = { on: 'On', off: 'off' };
  const elementId = `initial${switchName}Switch`;
  const domElem = document.getElementById(elementId);
  const labelElem = domElem.querySelector('label');
  const oldStatus = domElem.classList.contains('activated');

  let newStatus;
  
  if (status === undefined) {
    newStatus = domElem.classList.toggle('activated');
    labelElem.innerText = switchValues.on;
  } else {
    newStatus = status;
    
    if (status) {
      newStatus = domElem.classList.add('activated');
      labelElem.innerText = switchValues.on;
    } else {
      domElem.classList.remove('activated');
      labelElem.innerText = switchValues.off;
    }
  }

  if (newStatus !== oldStatus) {
    Events.sendEvent(eventName, { status: newStatus });
  }
}

