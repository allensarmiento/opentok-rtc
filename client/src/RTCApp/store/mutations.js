import OT from '@opentok/client';

export default {
  // Configuration
  setConfig(state, config) {
    state.config = config;
  },

  // Call Controls
  mouseoverControls(state, shouldShow) {
    state.showControls = shouldShow;
  },
  setShowControls(state, shouldShow) {
    state.showControls = shouldShow;
  },
  setVisibleControls(state, isVisible) {
    state.visibleControls = isVisible;
  },
  setOverControls(state, isOverControls) {
    state.overControls = isOverControls;
  },
  setHideControlsTimer(state, timer) {
    state.hideControlsTimer = timer;
  },

  // Chat
  setShowChat(state, shouldShow) {
    state.showChat = shouldShow;
  },
  setVisibleChat(state, isVisible) {
    state.visibleChat = isVisible;
  },
  setUnreadMessages() {},
  setChatInput(state, content) {
    state.chatInput = content;
  },

  // Video Session
  createSession(state, credentials) {
    const {
      apiKey,
      sessionId,
      token,
      username,
    } = credentials;
    const session = OT.initSession(apiKey, sessionId);

    session.connect(token, (connectError) => {
      if (connectError) {
        console.log(connectError);
      } else {
        const signal = {
          data: `${username} has joined the room.`,
          type: 'chat',
          retryAfterReconnect: false,
        };

        session.signal(signal, (signalError) => {
          if (signalError) {
            console.log(`Signal error (${signalError.name}): ${signalError.message}`);
          }
        });
      }
    });

    session.on('streamCreated', (event) => {
      const updatedStreams = state.streams;
      updatedStreams.push(event.stream);
      state.streams = updatedStreams;
    });

    session.on('streamDestroyed', (event) => {
      const streams = [...state.streams];
      const streamIdx = streams.indexOf(event.stream);

      if (streamIdx > -1) {
        streams.splice(streamIdx, 1);
        state.streams = streams;
      }
    });

    session.on('signal:chat', (event) => {
      const updatedMessages = [...state.chatMessages];
      updatedMessages.push(event);
      state.chatMessages = updatedMessages;
    });

    state.session = session;
  },
  setChatMessages(state, messages) {
    state.chatMessages = messages;
  },
  addChatMessage(state, message) {
    const signal = {
      data: message,
      type: 'chat',
      retryAfterReconnect: false,
    };

    state.session.signal(signal, (signalError) => {
      if (signalError) {
        console.log(`Signal error (${signalError.name}): ${signalError.message}`);
      }
    });
  },
  setPublishAudio(state, shouldPublish) {
    state.publishAudio = shouldPublish;
  },
  setPublishVideo(state, shouldPublish) {
    state.publishVideo = shouldPublish;
  },
  setIsScreensharing(state, isScreensharing) {
    state.isScreensharing = isScreensharing;
  },
};
