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
}

export default OTHelper;

