<template>
  <header class="header">
    <h1 class="title">{{ isWebRTCVersion ? 'WebRTC Demo' : 'OpenTok Demo by' }}</h1>
    <img
      class="logo"
      src="../assets/new-vonage-logo.png"
      alt="opentok tranparent logo"
    />
    <h2 v-if="isWebRTCVersion" class="subtitle">
      Built by TokBox on the OpenTok Platform
    </h2>
    <h2 v-if="isWebRTCVersion" class="subtitle">
      This WebRTC Demo enables group video conferencing, text, chat,&nbsp;
      screen sharing, and more.
    </h2>
  </header>
</template>

<script>
export default {
  name: 'VonageHeader',
  props: {
    isWebRTCVersion: { type: Boolean, default: false },
  },
};
</script>

<style lang="scss" scoped>
@import "../../sass/mixins.scss";
@import "../../sass/variables.scss";

.header {
  min-height: 22.2rem;

  @include for-size(smartphones-portrait) {
    min-height: 6.6rem;
  }
}

.title {
  margin: 1rem 0;
  padding: 0;
  color: #8794a2;
  font-family: $base-font-family;
  font-size: 1.4rem;
  font-weight: 200;
  text-align: center;
  letter-spacing: .1rem;
  line-height: 6rem;

  @include for-size(smartphones-portrait) {
    visibility: hidden;
  }
}

.logo {
  @include for-size(smartphones-portrait) {
    top: 3.7rem;
    width: 24rem;
  }
}

.subtitle {
  margin: .6rem 0;
  padding: 0;
  color: $grey-4;
  font-family: $base-font-family;
  font-size: 2rem;
  font-weight: 400;
  text-align: center;

  @include for-size(smartphones-portrait) {
    visibility: hidden;
  }
}
</style>
