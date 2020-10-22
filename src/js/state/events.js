class Events {
  constructor() {
    this.events = {};
  }

  addEventHandler(eventName, handler) {
    this.events[eventName] = handler;
    window.addEventListener(eventName, handler);
  }

  removeEventHandler(eventName, handler) {
    this.events[eventName] = null;
    window.removeEventListener(eventName, handler);
  }
}

export const events = new Events();

export function addEventHandler(eventName, handler) {
  events.addEventHandler(eventName, handler);
}

export function removeEventHandler(eventName, handler) {
  events.removeEventHandler(eventName, handler);
}

export function sendEvent(eventName, data) {
  data = data ? { detail: data } : {};

  window.dispatchEvent(new CustomEvent(eventName, data));
}

