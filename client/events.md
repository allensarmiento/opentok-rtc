# Events

## Room

```js
function /* roomView: */ endCall() {
  otHelper.disconnect();
}

function /* roomView: */ startArchiving(evt) {
  sendArchivingOperation(evt.detail && evt.detail.operation) || 'startComposite';
}

function /* roomView: */ stopArchiving() {
  sendArchivingOperation('stop');
}

function /* roomView: */ streamVisibilityChange(evt) {
  const getStatus = function(info) {
    let status = null;

    if (evt.detail.value === 'hidden') {
      info.prevEnabled = 'prevEnabled' in info
        ? info.prevEnabled
        : info.enabled;
      status = false;
    } else {
      status = 'prevEnabled' in info ? info.prevEnabled : info.enabled;
      delete info.prevEnabled;
    }

    return status;
  };

  const streamId = evt.detail.id;
  if (streamId !== 'publisher' && subscriberStreams[streamId]) {
    const stream = subscriberStreams[streamId];
    otHelper.toggleSubscribersVideo(
      stream.stream,
      getStatus(stream.buttons.video)
    );
  }
}

function /* roomView: */ buttonClick(evt) {
  const { streamId, streamType, name } = evt.detail;
  const disableAll = !!evt.detail.disableAll;
  const switchStatus = evt.detail.status;
  const isPublisher = streamId === 'publisher';
  
  let buttonInfo = null;
  let args = [];
  let newStatus;

  if (isPublisher) {
    buttonInfo = publisherButtons[name];
    newStatus = !buttonInfo.enabled;

    // There are a couple of possible race conditions that would end on us
    // not changing the status on the publisher (because it's already on that
    // state).
    const shouldReturn = !otHelper.isPublisherReady
      || otHelper.publisherHas(name) === newStatus;
    if (shouldReturn) return;
  } else {
    const stream = subscriberStreams[streamId];

    if (!stream) {
      debug.error('Got an event from a nonexistent stream');
      return;
    }

    if (name === 'hangup') {
      hangup(streamId);
      return;
    }

    buttonInfo = stream.buttons[name];
    args.push(stream.stream);
    newStatus = !buttonInfo.enabled;

    // BUG xxxx - We don't receive videoDisabled/videoEnabled events when
    // stopping/starting the screen sharing video.
    // OPENTOK-26021 - We don't receive any event when mute/unmute the audio
    // in local streams.
    if (streamType === 'screen' || name === 'audio') {
      // so we assume the operation was performed properly and change the
      // UI status.
      sendStatus({ stream: stream.stream }, name, newStatus);
    }
  }

  if (!buttonInfo) {
    debug.error('Got an event from an unknown button!');
    return;
  }

  args.push(newStatus);

  if (!disableAll || (disableAll && (switchStatus !== newStatus))) {
    const obj = exports[buttonInfo.context];
    obj[buttonInfo.action].apply(obj, args);
    // if stream button clicked and isn't a screen
    if (!disableAll && streamType !== 'screen') {
      // if type = 'audio'
      //   it only has to propogate the change when the button clicked is the
      //   microphone
      // if type = 'video'
      //   only when button clicked is not the publisher's one (is a
      //   subscriber's video button)
      // if type = 'screen'
      //   don't do anything
    }
  }
}

function /* roomView: */ videoSwitch() {
}
function /* roomView: */ muteAllSwitch() {
}
function /* roomView: */ dialOut() {
}
function /* roomView: */ addToCall() {
}
function /* roomView: */ togglePublisherAudio() {
}
function /* roomView: */ togglePublisherVideo() {
}
```
