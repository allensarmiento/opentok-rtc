<template>
  <div class="home">
    <RightContainer>
      <ContainerCell>
        <section class="content">
          <VonageHeader :isWebRTCVersion="isWebRTCVersion" />
          <RoomForm />
          <MoreInfo />
          <SafariPlug />
        </section>
      </ContainerCell>
    </RightContainer>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import RightContainer from './components/RightContainer.vue';
import ContainerCell from './components/ContainerCell.vue';
import VonageHeader from './components/VonageHeader.vue';
import RoomForm from './components/RoomForm.vue';
import MoreInfo from './components/MoreInfo.vue';
import SafariPlug from './components/SafariPlug.vue';

export default {
  name: 'Home',
  components: {
    RightContainer,
    ContainerCell,
    VonageHeader,
    RoomForm,
    MoreInfo,
    SafariPlug,
  },
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
</style>
