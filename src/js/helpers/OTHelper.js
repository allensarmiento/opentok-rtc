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
}

export default OTHelper;

