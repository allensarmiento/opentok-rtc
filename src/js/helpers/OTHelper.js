import OT from '@opentok/client';

class OTHelper {
  constructor() {
    this._session = null;
    this._publisher = null;
    this._publisherInitialized = false;

    this._publishOptions = null;
    // We will use this in case the first publish fails. On the error we
    // will give the caller a promise that will fulfill when/if the
    // publish succeeds at the same future time (because of a retry).
    this._solvePublisherPromise;
    this._publisherPromise = new Promise(resolve => {
      this._solvePublisherPromise = resolve;
    });
  }

  toggleFacingMode() {
    return this._publisher.cycleVideo();
  }

  setAudioSource(deviceId) {
    this._publisher.setAudioSource(deviceId);
  }

  getVideoDeviceNotInUse(selectedDeviceId) {
    return new Promise((resolve, reject) => {
      this.getDevices('videoInput').then(videoDevices => {
        const matchingDevice = videoDevices.find(device => 
          device.deviceId !== selectedDeviceId);

        return resolve(matchingDevice || selectedDeviceId);
      });
    });
  }

  getDevices(kind='all') {
    return new Promise((resolve, reject) => {
      OT.getDevices((error, devices) => {
        if (error) return reject(error);

        devices = devices.filter(device => 
          device.kind === kind || kind === 'all');

        return resolve(devices);
      });
    });
  }

  initPublisher(domEl, properties, handlers) {
    return new Promise(resolve => {
      this.getFilteredSources({
        audioSource: properties.audioSource,
        videoSource: properties.videoSource
      }).then(mediaSources => {
        Object.assign(properties, mediaSources);
        this._publisher = OT.initPublisher(domEl, properties);
        return resolve(this._publisher);
      });
    });
  }

  getFilteredSources(mediaDeviceIds) {
    return new Promise((resolve, reject) => {
      this.getDevices().then(devices => {
        for (let source in mediaDeviceIds) {
          const matchingDevice = devices.find(device => 
            device.deviceId === mediaDeviceIds[source]);

          if (!matchingDevice) {
            mediaDeviceIds[source] = 
              this.getFallbackMediaDeviceId(devices, source);
          }

          return resolve(mediaDeviceIds);
        }
      }).catch(e => reject(e));
    });
  }

  getFallbackMediaDeviceId(devices, kind) {
    kind = kind.replace('Source', 'Input');
    const matchingDevice = devices.find(device => device.kind === kind);
    return matchingDevice ? matchingDevice.deviceId : null;
  }

  toggleSubscribersVideo(stream, value) {
    this.subscribeTo(stream, 'Video', value);
  }

  subscribeTo(stream, name, value) {
    const arrSubscribers = this._session.getSubscribersForStream(stream);
    // TODO Currently we expect only one element in arrSubscriber
    if (Array.isArray(arrSubscriber)) {
      arrSubscribers.forEach(subscriber => 
        void subscriber[`subscribeTo${name}`](value));
    }
  }

  isPublisherReady() {
    return this._publisherInitialized;
  }

  publisherHas(type) {
    return this._publisher.stream[
      `has${type.toLowerCase() === 'audio' && 'Audio' || 'Video'}`];
  }

  ////////////////////
  // Message chat 
  sendSignal(type, msgData, to) {
    let messageOrder = 0;

    // Multipart message sending process. This is expected to be the
    // acutal session.
    return new Promise((resolve, reject) => {
      const msg = { type, data: msgData && JSON.stringify(msgData) };
      const msgId = ++messageOrder;
      const totalSegments = msg.data 
        ? Math.ceil(msg.data.length / USER_DATA_SIZE) : 1;
      const messagesSent = [];

      for (let segmentOrder = 0; segmentOrder < totalSegments; segmentOrder++) {
        const signalData = 
          this._composeSegment(msgId, segmentOrder, totalSegments, msg);
        
          if (to) {
            signalData.to = to;
          }

          messagesSent[segmentOrder] = 
            new Promise((resolveMessage, rejectMessage) => {
              this._session.signal(signalData, error => {
                if (error) rejectMessage(error);
                else resolveMessage();
              });
            });
      }

      Promise.all(messagesSent).then(resolve).catch(reject);
    });
  }

  _composeSegment(msgId, segmentOrder, totalSegments, userMsg) {
    const obj = {
      type: userMsg.type,
      data: JSON.stringify({
        _head: {
          id: msgId,
          seq: segmentOrder,
          tot: totalSegments
        },
        data: userMsg.data 
          ? userMsg.data.substr(
            segmentOrder * USER_DATA_SIZE, USER_DATA_SIZE) 
          : ''
      })
    };

    if (userMsg.to) {
      obj.to = userMsg.to;
    }

    return obj;
  }

  ////////////////////
  // Toggle Publisher Options
  togglePublisherAudio(value) {
    return this._togglePublisherProperty('Audio', value);
  }

  togglePublisherVideo(value) {
    return this._togglePublisherProperty('Video', value);
  }

  _togglePublisherProperty(property, value) {
    this.publisherReady().then(publisher => {
      publisher[`publish${property}`](value);
    });
  }

  publisherReady() {
    return this._publisher && this._publisherPromise ||
      this._publishOptions && this.retryPublish() ||
      Promise.reject();
  }

  retryPublish() {
    return this.publish(
      this._publishOptions.elem, 
      this._publishOptions.properties,
      this._publishOptions.handlers
    );
  }

  publish(domEl, properties, handlers) {
    const self = this;
    this._publishOptions = null;
    const propCopy = {};

    Object.keys(properties).forEach(key => {
      propCopy[key] = properties[key];
    });

    return new Promise((resolve, reject) => {
      this._publisher = OT.initPublisher(domEl, properties, error => {
        if (error) {
          this._processError(
            domEl,
            properties,
            handlers,
            reject,
            {
              name: error.name,
              message: `Error initializing publisher. ${error.message}`
            }
          );

          return;
        }

        this._session.publish(this._publisher, error => {
          if (error) {
            this._processError(domEl, properties, handlers, reject, error);
          } else {
            this._publisherInitialized = true;

            Object.keys(handlers).forEach(name => {
              // ? What the purpose of this?
              // ? Probably when the publisher.on event is triggered,
              // ? the handlers[name] function gets called and we want
              // ? to call it using OTHelper
              this._publisher.on(name, handlers[name].bind(self));
            });

            this._solvePublisherPromise(this._publisher);
            resolve(this._publisher);
          }
        });
      });
    });
  }

  _processError(elem, properties, handlers, reject, error) {
    this._publishOptions = { elem, properties, handlers };
    this._publisher = null;

    reject({ error, publisherPromise: this._publisherPromise });
  }
}

export default OTHelper;
