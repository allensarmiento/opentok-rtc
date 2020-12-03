# Events

## Global

### Global Handlers

- connectionCreated
- connectionDestroyed
- sessionConnected
- sessionDisconnected
- streamCreated
- streamDestroyed
- streamPropertyChanged
- archiveStarted
- archiveStopped

```js
function connectionCreated() {
  RoomView.participantsNumber = ++numUsrsInRoom;
}

function connectionDestroyed() {
  RoomView.participantsNumber = --numUsrsInRoom;
}

function sessionConnected() {
  Utils.sendEvent('roomController:sessionConnected');
}

function sessionDisconnected() {
  // The client has disconnected from the session.
  // This event may be dispatched asyncrhonously in response to a successful
  // call to the disconnect() method of the Session object.
  // The event may also be dispatched if a session connection is lost
  // inadvertantly, as in the case of a lost network connection.
  numUsrsInRoom = 0;
  Utils.sendEvent('roomController:sessionDisconnected');
  subscriberStreams = {};
}

function streamCreated(evt) {
  publisherReady.then(() => {
    // A new stream, published by another client, has been created on this
    // session. For streams published by your own client, the Publisher
    // object dispatches a streamCreated event. For a code example and more
    // details, see StreamEvent.
    const { stream } = evt;
    // SIP call streams have no video.
    const streamVideoType = stream.videoType || 'noVideo';

    let connectionData;
    try {
      connectionData = JSON.parse(stream.connection.data);
    } catch (error) {
      connectionData = {};
    }

    // Add an isSip flag to stream object
    steam.isSip = !!connectionData.sip;
    if (!stream.name) {
      stream.name = connectionData.name || '';
    }

    const { streamId } = stream;
    stream.phoneNumber = stream.isSip && stream.name;

    if (stream.isSip) {
      stream.name = 'Invited Participant';
    }

    subscriberStreams[streamId] = {
      stream,
      buttons: new SubscriberButtons(streamVideoType, stream.phoneNumber)
    };

    const subOptions = subscriberOptions[streamVideoType];
    const enterWithVideoDisabled = streamVideoType === 'camera'
      && disabledAllVideos;

    _sharedStatus = RoomStatus.get(STATUS_KEY);

    const subsDomElem = RoomView.createStreamView(streamId, {
      name: stream.name,
      type: stream.videoType,
      controlElems: subscriberStreams[streamId].buttons,
    });

    subOptions.subscribeToVideo = !enterWithVideoDisabled;

    // We want to observe the container where the actual subscriber will live
    const subsContainer = LayoutManager.getItemById(streamId);
    if (subsContainer && _mutationObserver) {
      _mutationObserver.observe(subsContainer, { attributes: true });
    }

    subscriberStreams[streamId].subscriberPromise = otHelper
      .subscribe(evt.stream, subsDOMElem, subOptions, {}, enableAnnotations)
      .then((subscriber) => {
        if (streamVideoType === 'screen') {
          if (enableAnnotations) {
            Utils.sendEvent('roomController:annotationStarted');
          }

          const subContainer = subscriber.element.parentElement;
          Utils.sendEvent('layoutView:itemSelected', {
            item: subContainer,
          });
          return subscriber;
        }

        Object.keys(_subscriberHandlers).forEach((name) => {
          subscriber.on(name, _subscriberHandlers[name]);
        });

        if (enterWithVideoDisabled) {
          pushSubscriberButton(streamId, 'video', true);
        }

        sendVideoEvent(evt.stream);
        return subscriber;
      }, (error) => {
        debug.error(`Error subscribing new participant. ${error.message}`);
      });
  });
}

function streamDestroyed(evt) {
  // A stream from another client has stopped publishing to the session.
  // The default behavior is that all Subscriber objects that are subscribed
  // to the stream are unsubscribed and removed from the HTML DOM. Each
  // Subscriber object dispatches a destroyed event when the element is
  // removed from the HTML DOM. If you call the preventDefault() method in
  // the event listener for the streamDestroyed event, the default behavior
  // is prevented and you can clean up Subscriber objects using your own
  // code. See Session.getSubscribersForStream().
  // For streams published by your own client, the Publisher object
  // dispatches a streamDestroyed event.
  // For a code example and more details, see StreamEvent.
  const { stream } = evt;
  if (stream.videoType === 'screen') {
    Utils.sendEvent('roomController:annotationEnded');
  }

  RoomView.deleteStreamView(stream.streamId);
  subscriberStreams[stream.streamId] = null;
}

function streamPropertyChanged(evt) {
  if (otHelper.publisherId !== evt.stream.id) return;

  if (evt.changedProperty === 'hasVideo') {
    evt.reason = 'publishVideo';
    sendStatus(evt, 'video', evt.newValue);
  } else if (evt.changedProperty === 'hasAudio') {
    evt.reason = 'publishAudio';
    sendStatus(evt, 'audio', evt.newValue);
  }
}

function archiveStarted(evt) {
  // Dispatched when an archive recording of the session starts
  Utils.sendEvent('archiving', {
    status: 'started',
    id: evt.id,
  });
}

function archiveStopped() {
  // Dispatched when an archive recording of the session stops
  Utils.sendEvent('archiving', { status: 'stopped' });
}
```

### Helpers

```js
function sendStatus(evt, control, enabled) {
  let stream = evt.stream || evt.target.stream;
  if (!stream) return;

  const id = stream.streamId;
  stream = subscriberStreams[id];
  const buttonInfo = !stream ? publisherButtons[control] : stream.buttons[control];
  buttonInfo.enabled = !!enabled;

  Utils.sendEvent(`roomController:${control}`, {
    id,
    reason: event.reason,
    enabled: buttonInfo.enabled
  });
}
```

## Room

### Room View

- endCall
- startArchiving
- stopArchiving
- streamVisibilityChange
- buttonClick
- videoSwitch
- muteAllSwitch
- dialOut
- addToCall
- togglePublisherAudio
- togglePublisherVideo
- shareScreen
- screenChange
- chatVisibility
- toggleFacingMode
- setAudioSource
- verifyDialOut

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
      const isMicrophone = name === 'audio' && isPublisher;
      const isSubscribeToVideo = name === 'video' && !isPublisher;
      if (isMicrophone || isSubscribeToVideo) {
        Utils.sendEvent('roomController:userChangeStatus', {
          status: newStatus,
          name,
        });

        if (isMicrophone) {
          sendSignalMuteAll(false, true);
          _sharedStatus.roomMuted = false;
        }
      }
    }
  }
}

function /* roomView: */ videoSwitch(evt) {
  changeSubscriberStatus('video', evt.detail.status);
}

function /* roomView: */ muteAllSwitch(evt) {
  const roomMuted = evt.detail.status;
  _sharedStatus.roomMuted = roomMuted;
  setAudoiStatus(roomMuted);
  sendSignalMuteAll(roomMuted, false);
}

function /* roomView: */ dialOut(evt) {
  if (evt.detail) {
    const phoneNumber = evt.detail.replace(/\D/g, '');
    if (requireGoogleAuth && (googleAuth.isSignIn.get() !== true)) {
      googleAuth.signIn().then(() => {
        document.body.data('google-signed-in', 'true');
        dialOut(phoneNumber);
      });
    } else {
      dialOut(phoneNumber);
    }
  }
}

function /* roomView: */ addToCall() {
  showAddToCallModal();
}

function /* roomView: */ togglePublisherAudio(evt) {
  const newStatus = evt.detail.hasAudio;
  
  if (
    !otHelper.isPublisherReady
    || otHelper.publisherHas('audio') !== newStatus
  ) {
    otHelper.togglePublisherAudio(newStatus);
  }
}

function /* roomView: */ togglePublisherVideo() {
  const newStatus = evt.detail.hasVideo;

  if (
    !otHelper.isPublisherReady
    || otHelper.publisherHas('video') !== newStatus
  ) {
    otHelper.togglePuublisherVideo(newStatus);
  }
}

function /* roomView: */ shareScreen() {
  if (_hasPendingOperation) return;

  if (_isSharing) {
    otHelper.stopShareScreen();
    _isSharing = false;
    // We don't need to send this because desktop stream is sending a
    // destroyed event.
  } else {
    const desktopEleemnt = RoomView.createStreamView('desktop', {
      name: screenPublisherOptions.name,
      type: 'desktop',
      controlElems: {},
    });

    _hasPendingOperation = true;
    otHelper.shareScreen(
      desktopElement,
      screenPublisherOptions,
      streamHandlers,
      enableAnnotations,
    ).then(() => {
      _isSharing = true;
      _hasPendingOperation = false;

      Utils.sendEvent('screenShareController:changeScreenShareStatus', {
        isSharing: _isSharing
      });

      if (enableAnnotations) {
        Utils.sendEvent('screenShareController:annotationStarted');
      }
    }).catch((error) => {
      _hasPendingOperation = false;

      if (error.code === OTHelper.screenShareErrorCodes.accessDenied) {
        RoowView.deleteStreamView('desktop');
      } else {
        Utils.sendEvent('screenShareController:shareScreenError', {
          code: error.code,
          message: error.message,
        });
      }
    });
  }
}

function /* roomView: */ screenChange() {}
function /* roomView: */ chatVisibility(visible) {}
function /* roomView: */ toggleFacingMode() {}
function /* roomView: */ setAudioSource(value) {}
function /* roomView: */ verifyDialOut() {}
```

### Room Status

- updatedRemotely
  - Has 2 functions

```js
function /* roomStatus: */ updatedRemotely() {
  publisherReady.then(() => {
    _sharedStatus = RoomStatus.get(STATUS_KEY);

    const roomMuted = _sharedStatus.roomMuted;
    setAudioStatus(roomMuted);

    if (roomMuted) {
      Utils.sendEvent('roomController:roomMuted', { isJoining: true });
    }
  });
}

function /* roomStatus: */ updatedRemotely() {
  if (!_hasStatus) return;

  const data = RoomStatus.get(STATUS_KEY);
  if (data) {
    _historyChat = data;
    for (let i = 0; l = _historyChat.length; i < 1; i++) {
      Utils.sendEvent(
        'chatController:incomingMessage',
        { data: _historyChat[i] },
      );
    }
  } else {
    _historyChat = [];
    RoomStatus.set(STATUS_KEY, _historyChat);
  }
}
```

### Room Controller

- userChangeStatus
- roomMuted
- sessionConnected
- sessionDisconnected
- controllersReady
- annotationStarted
- annotationEnded
- chromePublisherError
- archiveUpdates
- controllersReady

```js
function /* roomController: */ userChangeStatus(evt) {
  // If user changed the staus we need to reset the switch
  if (evt.detail.name === 'video') {
    setSwitchStatus(false, false, videoSwitch, 'roomView:videoSwitch');
  } else if (evt.detail.name === 'audio') {
    setSwitchStatus(false, false, audioSwitch, 'roomView:muteAllSwitch');
  }
}

function /* roomController: */ roomMuted(evt) {
  const isJoining = evt.detail.isJoining;

  setAudioSwitchRemotely(true);
  Modal.showConfirm(isJoining ? MODAL_TXTS.join : MODAL_TXTS.muteRemotely);
}

function /* roomController: */ sessionConnected() {}

function /* roomController: */ sessionDisconnected() {
  RoomView.participantsNumber = 0;
  LayoutManager.removeAll();
}

// Disables the call controls
function /* roomController: */ controllersReady() {
  const selectorStr = '#top-banner [disabled], .call-controls[disabled]'
    + ':not(#toggle-publisher-video):not(#toggle-publisher-audio)'
    + ':not(#annotate)';

  const elements = document.querySelectorAll(selectorStr);

  Array.prototype.forEach.call(elements, (element) => {
    Utils.setDisabled(element, false);
  });
}

function /* roomController: */ annotationStarted() {
  Utils.setDisabled(annotateBtnElem, false);
}

function /* roomController: */ annotationEnded() {
  document.body.data('annotateVisible', 'false');
  Utils.setDisabled(annotateBtnElem, true);
}

function /* roomController: */ chromePublisherError() {
  Modal.showConfirm(MODAL_TXTS.chromePublisherError).then(() => {
    document.lcoation.reload();
  });
}

function /* roomController: */ video() {}
function /* roomController: */ audio() {}
function /* roomController: */ videoDisabled() {}
function /* roomController: */ videoEnabled() {}
function /* roomController: */ connected() {}
function /* roomController: */ disconnected() {}

function /* roomController: */ archiveUpdates(evt) {
  const archiveValues = Promise.resolve(evt.detail || {});

  const handlers = listeners.value;
  if (handlers) {
    handlers.forEach((handler) => {
      archiveValues.then(handler.method.bind(handler.context));
    });
  }
}

function /* roomController: */ controllersReady() {}
```

### Helpers

```js
function sendSignalMuteAll(status, onlyChangeSwitch) {
  otHelper.sendSignal('muteAll', { status, onlyChangeSwitch });
}

function setAudioStatus(switchStatus) {
  if (otHelper.isPublisherReady) {
    viewEventHandlers.buttonClick({
      detail: {
        streamId: 'publisher',
        name: 'audio',
        disableAll: true,
        status: switchStatus,
      },
    });
  }
}

function showAddToCallModal() {
  const selector = '.add-to-call-modal';

  return Modal.show(selector).then(() => {
    return new Promise((resolve) => {
      const enterButton = document.querySelector(`${selector} button`);
      if (enterButton) {
        enterButton.addEventListener('click', function onClicked(evt) {
          evt.preventDefault();
          enterButton.removeEventListener('click', onClicked);

          return Modal.hide(selector)
            .then(() => {
              resolve(document.querySelector(`${selector} input`).value.trim());
            });
        });
      }
    })
  });
}

function setSwitchStatus(status, bubbleUp, domElem, evtName) {
  const oldStatus = domElem.classList.contains('activated');
  let newStatus;

  if (status == undefined) {
    newStatus = domElem.classList.toggle('activated');
  } else {
    newStatus = status;

    if (status) {
      domElem.classList.add('activated');
    } else {
      domELem.classList.remove('activated');
    }
  }

  if (bubbleUp && newStatus !== oldStatus) {
    Utils.sendEvent(evtName, { status: newStatus });
  }
}

function setAudioSwitchRemotely(isMuted) {
  setSwitchStatus(isMuted, false, audioSwitch, 'roomView:muteAllSwitch');
  
  if (isMuted) {
    setPublisherAudioSwitchStatus('muted');
  } else {
    setPublisherAudioSwitchStatus('activated');
  }
}

function setPublisherAudioSwitchStatus(status) {
  if (status === 'activated') {
    togglePublisherAudioElem.classList.add('activated');
    togglePublisherAudioElem.querySelector('i').data('icon', 'mic');
  } else {
    togglePublisherAudioElem.classList.remove('activated');
    togglePublisherAudioElem.querySelector('i').data('icon', 'mic-muted');
  }
}

function sendStatus(evt, control, enabled) {
  let stream = evt.stream || evt.target.stream;
  if (!stream) return;

  const id = stream.streamId;
  stream = subscriberStreams[id];

  const buttonInfo = !stream
    ? publisherButtons[control] : stream.buttons[control]; 
  buttonInfo.enabled = !!enabled;

  Utils.sendEvent(`roomController:${control}`, {
    id,
    reason: evt.reason,
    enabled: buttonInfo.enabled,
  });
}
```

## Phone Number

### Phone Number View

- dialOut

```js
function /* phoneNumberView: */ dialOut(evt) {
  const phoneNumber = evt.detail;
  Utils.sendEvent('roomView:dialOut', phoneNumber);
}
```

## Screen Share

### Screen Share Controller

- changeScreenShareStatus
- destroyed
  - Has 2 functions
- annotationStarted
- annotationEnded
- shareScreenError
- extInstallationResult

```js
function /* screenShareController: */ changeScreenShareStatus(evt) {
  toggleScreenSharing(evt);
}

function /* screenShareController: */ destroyed() {
  toggleScreenSharing.bind(undefined, NOT_SHARING);
}

function /* screenShareController: */ destroyed() {
  RoomView.deleteStreamView('desktop');
}

function /* screenShareController: */ annotationStarted() {
  Utils.setDisabled(annotateBtnElem, false);
}

function /* screenShareController: */ annotationEnded() {
  document.body.data('annotationVisible', 'false');
  Utils.setDisabled(annotateBtnElem, true);
}

function /* screenShareController: */ shareScreenError(evt) {
  destroyView();

  const status = evt.detail;
  const errCodes = OTHelper.screenShareErrorCodes;

  // Only if we really want to differentiate type of errors
  // or show different sections or something like that
  if (status.code === errCodes.accessDenied) {
    showError('Error', status.message);
  } else if (status.code === errCodes.extNotInstalled) {
    showInstallExtension();
  } else {
    showError('Sharing screen failed.', status.message);
  }
}

function /* screenShareController: */ extInstallationResult(evt) {
  const status = evt.detail;
  if (status.error) {
    showError('Installation failed.', status.message);
  } else {
    showInstallationSuccess();
  }
}
```

### Screen Share View

- installExtension

```js
function /* screenShareView: */ installExtension() {
  const newTab = window.open(
    `https://chrome.google.com/webstore/detail/${_chromeExtId}`,
    '_blank',
  );

  const error = !newTab || typeof newTab !== 'object';
  Utils.sendEvent('screenShareController:extInstallationResult', {
    error,
    message: error ? 'It seems you have a Pop-Up blocked enabled.'
      + 'Please disable it and try again.' : null,
  });

  if (error) {
    debug.error('Error opening Chrome Webstore');
  }
}
```

### Helpers

```js
function toggleScreenSharing(evt) {
  const isSharing = evt.detail.isSharing;
  document.body.data('desktopStatus', isSharing ? 'sharing' : 'notSharing');
  HTMLElems.flush('#toggleSharing');
}
```

## Chat

### Chat

```js
function /* chatEvents: */ hidden() {
  document.body.data('chatStatus', 'hidden');
  messageButtonElem.classList.remove('activated');
  setUnreadMessages(0);
  HTMLElems.flush('#toggleChat');
}
```

### Chat View

- unreadMessage
- hidden
- shown
- outgoingMessage

```js
function /* chatView: */ unreadMessage() {
  setUnreadMessages(_unreadMsg + 1);

  if (!_chatHasBeenShown) {
    setChatStatus(true);
  }
}

function /* chatView: */ hidden() {
  Utils.sendEvent('roomView:screenChange');
}

function /* chatView: */ shown() {
  Utils.sendEvent('roomView:screenChange');
}

function /* chatView: */ outgoingMessage(evt) {
  const data = evt.detail;
  return otHelper.sendSignal('chat', data);
    .then(() => {
      Utils.sendEvent('chatController:messageDelivered');
    })
    .catch((error) => {
      debug
        .error(`Error sending [${data.text.value} ] to the group. ${error.message}`);
    });
}
```

### Chat Controller

- incomingMesssage
- messageDelivered
- presenceEvent

```js
function /* chatController: */ incomingMessage(evt) {
  const { data } = evt.detail;
  insertChatLine(data);
  isVisible().then((visible) => {
    if (!visible) {
      Utils.sendEvent('chatView:unreadMessage', { data });
    }
  });
}

function /* chatController: */ messageDelivered() {
  chatMsgInput.value = '';
}

function /* chatController: */ presenceEvent() {
  insertChatEvent(evt.detail);
}
```

### Helpers

```js
function setChatStatus(visible) {
  if (visible) {
    _chatHasBeenShown = true;
    setUnreadMessages(0);
    messageButtonElem.classList.add('activated');

    // hide call controls on small screens
    if (window.innerWidth <= 480) {
      hideCallControls();
    }
  } else {
    messageButtonElem.classList.remove('activated');
  }

  Utils.sendEvent('roomView:chatVisibility', visible);
  HTMLElems.flush('#toggleChat');
}
```

## Hangout

### Hangout

- screenOnStage
- rearranged
- layout
- itemSelected
- emptyStage

```js
function /* hangout: */ screenOnStage(evt) {
  const status = evt.detail.status;

  if (status === 'on') {
    dock.data('previouslyCollapsed', dock.classList.contains('collapsed'));
    dock.classList.add('collapsed');
  } else if (dock.data('previouslyCollapsed') !== null) {
    dock.data('previouslyCollapsed') === 'true'
      ? dock.classList.add('collapsed')
      : dock.classList.remove('collapsed');
    dock.data('previouslyCollapsed', null);
  }
}

function /* hangout: */ rearranged() {
  Utils.sendEvent('roomView:screenChange');
}

function /* hangout: */ layout(evt) {
  userLayout = evt.detail.type;
  rerrange();
}

function /* hangout: */ itemSelected(evt) {
  if (isGroup() && isOnGoing(Grid)) {
    userLayout = HANGOUT_BY_DEFAULT;
    rearrange(evt.detail.item);
  }
}

function /* hangout: */ emptyStage() {
  userLayout = 'grid';
  rearrange();
}
```

## Layout

### Layout View

- layout
- itemSelected
- emptyStage

```js
function /* layoutView: */ layout(evt) {
  userLayout = evt.detail.type;
  rerrange();
}

function /* layoutView: */ itemSelected(evt) {
  if (isGroup() && isOnGoing(Grid)) {
    userLayout = HANGOUT_BY_DEFAULT;
    rearrange(evt.detail.item);
  }
}

function /* layoutView: */ emptyStage() {
  userLayout = 'grid';
  rearrange();
}
```

## Layout Menu

### Layout Menu View

- layout
- itemSelected
- emptyStage

```js
function /* layoutMenuView: */ layout(evt) {
  userLayout = evt.detail.type;
  rerrange();
}

function /* layoutMenuView: */ itemSelected(evt) {
  if (isGroup() && isOnGoing(Grid)) {
    userLayout = HANGOUT_BY_DEFAULT;
    rearrange(evt.detail.item);
  }
}

function /* layoutMenuView: */ emptyStage() {
  userLayout = 'grid';
  rearrange();
}
```

## Layout Manager

### Layout Manager

- itemAdded
- itemDeleted
- resize
- layoutChanged
- scroll
- availableLayouts

```js
function /* layoutManager: */ itemAdded() {
  onVisitItems();
}

function /* layoutManager: */ itemDeleted() {
  onVisitItems();
}

function /* layoutManager: */ resize() {
  onVisitItems();
}

function /* layoutManager: */ layoutChanged() {
  onVisitItems();
}

function /* layoutManager: */ scroll() {
  onVisitItems();
}

function /* layoutManager: */ availableLayouts(evt) {
  const availableLayouts = evt.detail.layouts;

  Array.prototype.map.call(items, (elem) => {
    const layoutType = elem.data('layoutType');
    const isAvailable = !!availableLayouts[layoutType];
    elem.disabled = !isAvailable;
    
    if (isAvailable) {
      elem.removeAttribute('disabled');
    } else {
      elem.setAttribute('disabled', 'disabled');
    }
  });
}
```

### Helpers

```js
function onVisitItems() {
  if (scrollTimer) {
    exports.clearTimeout(scrollTimer);
  }

  scrollTimer = exports.setTimeout(visitItems, delay);
}

function visitItems() {
  const items = container.querySelectorAll(itemSelector);
  const total = items.length;

  if (total === 0) return;

  const viewTop = container.scrollTop;
  const containerHeight = container.offsetHeight;

  const viewLeft = container.scrollLeft;
  const containerWidth = container.offsetWidth;

  for (let i = 0; i < total; i++) {
    const item = items[i];

    if (item) {
      let visibility = 'hidden';

      if (item.classList.contains('on-stage')) {
        visibility = 'visible';
      } else {
        const itemHeight = item.offsetHeight;
        const itemWidth = item.offsetWidth;
        const itemOffsetTop = item.offsetTop;
        const itemOffsetLeft = item.offsetLeft;

        const topView = (
          itemOffsetTop >= viewTop
          && itemOffsetTop <= viewTop + containerHeight
        ) || (
          itemOffsetTop + itemHeight >= viewTop
          && itemOffsetTop + itemHeight <= viewTop + containerHeight
        );

        const leftView = (
          itemOffsetLeft >= viewLeft
          && itemOffsetLeft <= viewLeft + containerWidth
        ) || (
          itemOffsetLeft + itemWidth >= viewLeft
          && itemOffsetLeft + itemWidth <= viewLeft + containerWidth
        );

        if (topView && leftView) {
          visibility = 'visible';
        }
      }

      Utils.sendEvent('roomView:streamVisibilityChange', {
        id: item.data('id');
        value: visibility,
      });
    }
  }
}
```

## Recordings

### Recordings Controller

```js
```

## Signal

### Signal

```js
function /* signal: */ muteAll() {
  const statusData = JSON.parse(evt.data);
  const muteAllSwitch = statusData.status;
  const onlyChangeSwitch = statusData.onlyChangeSwitch;
  
  // onlyChangeSwitch is true when the iOS app sends a false muteAll signal.
  if (onlyChangeSwitch) return;

  const setNewAudioStatus = function (isMuted) {
    if (_sharedStatus.roomMuted !== isMuted) return;

    setAudioStatus(isMuted);
  }.bind(undefined, muteAllSwitch);

  if (!otHelper.isMyself(evt.from)) {
    _sharedStatus.roomMuted = muteAllSwitch;

    if (muteAllSwitch) {
      setAudioStatus(muteAllSwitch);
      Utils.sendEvent('roomController:roomMuted', { isJoining: false });
    } else {
      RoomView.showConfirmChangeMicStatus(muteAllSwitch)
        .then(setNewAudioStatus);
    }
  }
}

function /* signal: */ archives(evt) {
  Utils.sendEvent('roomController:archiveUpdates', evt);
}
```

### Helpers

```js
function setAudioStatus() {
  if (otHelper.isPublisherReady) {
    viewEventHandlers.buttonClick({
      detail: {
        streamId: 'publisher',
        name: 'audio',
        disableAll: true,
        status: switchStatus,
      },
    });
  }
}
```

## Feedback

### Feedback View

- sendFeedback
- reportIssue

```js
function /* feedbackView: */ sendFeedback(evt) {
  const report = evt.detail;
  const loggedEvent = {
    action: 'SessionQuality',
    partnerId: otHelper.session.apiKey,
    sessionId: otHelper.session.id,
    connectionId: otHelper.session.connection.id,
    publisherId: otHelper.publisherId,
    audioScore: report.audioScore,
    videoScore: report.videoScore,
    description: report.description,
    clientSystemTime: new Date().getTime(),
    source: document.location.href,
  };

  const xhr = new XMLHttpRequest();
  const url = window.feedbackUrl;
  xhr.open('POST', url, true);
  xhr.send(JSON.stringify(loggedEvent));
}

function /* feedbackView: */ reportIssue() {
  const loggedEvent = {
    action: 'ReportIssue',
    partnerId: otHelper.session.apiKey,
    sessionId: otHelper.session.id,
    connectionId: otHelper.session.connection.id,
    publisherId: otHelper.publisherId,
  };

  OT.reportIssue((error, reportId) => {
    if (!error) loggedEvent.reportIssueId = reportId;
  });
}
```

### Other

```js
function recordingsModelReady() {}

function archiving() {}
```
