import OT from '@opentok/client';

export default {
  createSession(state, value) {
    const {
      apiKey,
      sessionId,
      token,
      username,
    } = value;

    const session = OT.initSession(apiKey, sessionId);
    session.connect(token, (error) => {
      if (error) {
        console.log(error);
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
  setChatMessages(state, value) {
    state.chatMessages = value;
  },
  addChatMessage(state, value) {
    const signal = {
      data: value,
      type: 'chat',
      retryAfterReconnect: false,
    };
    state.session.signal(signal, (signalError) => {
      if (signalError) {
        console.log(`Signal error (${signalError.name}): ${signalError.message}`);
      }
    });
  },
  setPublishAudio(state, value) {
    state.publishAudio = value;
  },
  setPublishVideo(state, value) {
    state.publishVideo = value;
  },
  setIsScreensharing(state, value) {
    state.isScreensharing = value;
  },
};
