<template>
  <div class="publish-settings">
    <div id="video-settings">
      <div>
        <img src="../../assets/images/icons/video-icon.svg" />
        <span>Camera</span>
      </div>

      <div id="video-switch" class="sourcePick switch-button">
        <a id="preToggleFacingMode">Switch</a>
      </div>

      <a id="initialVideoSwitch" class="activated">
        <label>On</label>
        <i data-icon="videoSwitch"></i>
      </a>
    </div>

    <div id="audio-settings">
      <div>
        <img src="../../assets/images/icons/mic-icon.svg" />
        <div id="audio-meter-container">
          <span>Microphone</span>
          <div id="audio-meter">
            <div id="audio-meter-level"></div>
          </div>
        </div>
      </div>

      <div id="audio-switch" class="sourcePick switch-button">
        <a id="prePickMic">Switch</a>
      </div>

      <a id="initialAudioSwitch" class="activated">
        <label>On</label>
        <i data-icon="audioSwitch"></i>
      </a>
    </div>
    <br />
  </div>
</template>

<script>
export default {
  name: 'PublishSettings',
};
</script>
