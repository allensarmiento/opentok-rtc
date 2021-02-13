<template>
  <div class="home">
    <div id="righthand-container">
      <div id="righthand-container-cell">
        <section id="main-content">
          <header class="header">
            <h1 v-if="isWebRTCVersion">WebRTC Demo</h1>
            <h1 v-else>OpenTok Demo by</h1>
            <img
              src="./assets/new-vonage-logo.png"
              alt="opentok transparent logo"
            />
            <h2 v-if="isWebRTCVersion">
              Built by TokBox on the OpenTok Platfrom
            </h2>
            <h3 v-if="isWebRTCVersion">
              This WebRTC Demo enables group video conferencing, text&nbsp;
              chat, screen sharing, and more.
            </h3>
          </header>

          <form>
            <div>
              <input id="room" class="text-input required" data-wd="roomname" />
              <label id="room-label">Meeting name</label>
              <p class="error-room error-text">
                <i data-icon="warning" />
                Please enter a meeting name.
              </p>
            </div>

            <div>
              <input id="user" class="text-input" data-wd="username" />
              <label id="user-label">Your name</label>
            </div>

            <button id="enter" data-wd="enterroom"></button>
          </form>

          <div class="landing-more-info">
            Need help?
            <a href="https://tokbox.com/" target="_blank">
              About TokBox
            </a>
            /
            <a href="https://tokbox.com/contact/sales" target="_blank">
              Contact Sales
            </a>
          </div>

          <div class="safari-plug">
            <a href="https://safari.opentokrtc.com/">
              Try the WebRTC Demo for Safari.
            </a>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Home',
  computed: {
    ...mapState('rtcApp', ['isWebRTCVersion']),
  },
};
</script>

<style lang="scss" scoped>
@import "../sass/variables.scss";
@import "../sass/mixins.scss";

.home {
  height: 100vh;
  padding: 0;
  margin: 0;
  background-color: #000;
  background-image: url(./assets/background.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  color: $text;
  text-shadow: #000 1px 1px 1.2rem;
  transition: none;
  overflow: hidden;
}

.header {
  min-height: 22.2rem;

  @include for-size(smartphones-portrait) {
    min-height: 6.6rem;
  }
}
</style>
