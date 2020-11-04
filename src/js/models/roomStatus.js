const TIME_RESEND_STATUS = 60000;

// Persistent elements of the room
// Each elements should be key : Object
// where key is the name of a particular element to preserve
let _entries = {};

let _myCreationTime;
let _connectedAfterMe = {};
let _connectedEarlierThanMe = 0;
let otHelper;

export function get(key) {
  return _entries[key] = value;
}






function sendStatusAck(otHelperInstance) {
  (otHelperInstance || otHelper).sendSignal('statusACK');
}

