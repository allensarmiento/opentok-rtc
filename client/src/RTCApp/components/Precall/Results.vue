<template>
  <div id="results">
    <div id="precall-video-results" class="precall-media-results">
      <p class="media-heading">VIDEO QUALITY</p>
      <p class="bitrate">
        <span id="video-bitrate"></span> Kbps
      </p>
      <p id="precall-resolution"></p>
      <p id="precall-framework"></p>
      <p id="precall-video-packet-loss"></p>
    </div>

    <div id="precall-audio-results" class="precall-media-results">
      <p class="media-heading">AUDIO QUALITY</p>
      <p class="bitrate">
        <span id="audio-bitrate">40</span> Kbps
      </p>
      <p id="precall-audio-packet-loss">0% packet loss</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Results',
};
</script>
