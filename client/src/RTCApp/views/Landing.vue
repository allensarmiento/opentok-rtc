<template>
  <div class="landing">
    <div class="right-container">
      <div class="container-cell">
        <section class="content">
          <header class="header">
            <h1 class="title">
              {{ isWebRTCVersion ? 'WebRTC Demo' : 'OpenTok Demo by' }}
            </h1>
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
          <JoinRoomForm />
          <div class="more-info">
            Need help?
            <a class="link" href="https://tokbox.com/" target="_blank">
              About TokBox
            </a>
            <span>/</span>
            <a
              class="link"
              href="https://tokbox.com/contact/sales"
              target="_blank"
            >
              Contact Sales
            </a>
          </div>
          <div class="safari-plug">
            <a class="link" href="https://safari.opentokrtc.com/">
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
import JoinRoomForm from '../components/JoinRoomForm.vue';

export default {
  name: 'Landing',
  components: {
    JoinRoomForm,
  },
  computed: {
    ...mapState('rtcApp', ['isWebRTCVersion']),
  },
};
</script>

<style lang="scss" scoped>
@import "../sass/variables.scss";
@import "../sass/mixins.scss";

.landing {
  height: 100vh;
  padding: 0;
  margin: 0;
  background-color: #000;
  background-image: url(../assets/background.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  color: $text;
  text-shadow: #000 1px 1px 1.2rem;
  transition: none;
  overflow: hidden;
}

.right-container {
  display: table;
  position: absolute;
  right: 0;
  height: 100%;
  width: 49.8rem;

  @include for-size(smartphones-portrait) {
    width: 100%;
  }
}

.container-cell {
  display: table-cell;
  vertical-align: middle;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  right: .2rem;
  float: right;
  width: 36rem;
  margin-right: 8rem;
  padding: 2rem;
  background: rgba(0, 0, 0, .6);
  border-radius: 1rem;
  box-shadow: 0 .2rem .6rem rgba(0, 0, 0, .3);

  @include for-size(smartphones-portrait) {
    height: 100%;
    width: 100%;
    margin-right: 0;
  }
}

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

.more-info {
  margin-top: 6.9rem;
  margin-bottom: 3.2rem;
  color: #748393;
  font-size: 1.2rem;

  @include for-size(smartphones) {
    position: fixed;
    right: 2rem;
    bottom: 0;
  }
}

.link {
  color: $blue-text;
  text-decoration: none;
}

.safari-plug {
  display: none;
  margin-top: 2.4rem;
}
</style>
