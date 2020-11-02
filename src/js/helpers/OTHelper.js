import OT from '@opentok/client';

class OTHelper {
  constructor() {
    this._session = null;
    this._publisher = null;
    this._publisherInitialized = false;
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

  sendSignal(type, msgData, to) {
    let messageOrder = 0;

    // Multipart message sending process. This is expected to be the
    // acutal session.
    return new Promise((resolve, reject) => {
      const msg = { type, data: msgData && JSON.stringify(msgData) };
      const msgId = ++messageOrder;
      // TODO
    });

    // TODO
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
}

export default OTHelper;

