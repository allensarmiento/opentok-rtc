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
}

export default OTHelper;

