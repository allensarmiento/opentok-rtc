<template>
  <section class="banner">
    <IconContainer>
      <DataIcon dataIcon="tokbox-logo" variant="none" />
    </IconContainer>
    <CenterContainer>
      <div class="room-info">
        <p class="room-name"></p>
        <DataIcon dataIcon="participants" />
        <span class="participants"></span>
      </div>
    </CenterContainer>
    <RightContainer>
      <RoundedSwitch>Stop receiving video</RoundedSwitch>
      <RoundedSwitch>Mute all participants</RoundedSwitch>
      <SourcePick>
        <a id="toggleFacingMode">
          <DataIcon dataIcon="cycle-video" />
        </a>
      </SourcePick>
      <SourcePick>
        <a id="pickMic">
          <DataIcon dataIcon="p-mic" />
        </a>
      </SourcePick>
      <ArchiveToggle v-if="config.Archiving.enabled" />
      <div class="recordings">
        <RoundedButton id="viewRecordings" class="count">
          <span id="recordings">0</span>
        </RoundedButton>
      </div>
    </RightContainer>
    <LayoutContainer />
  </section>
</template>

<script>
import { mapState } from 'vuex';
import IconContainer from '../ui/IconContainer.vue';
import DataIcon from '../ui/DataIcon.vue';
import CenterContainer from '../ui/CenterContainer.vue';
import LayoutContainer from '../ui/LayoutContainer.vue';
import RightContainer from '../ui/RightContainer.vue';
import RoundedSwitch from '../ui/RoundedSwitch.vue';
import SourcePick from '../ui/SourcePick.vue';
import ArchiveToggle from '../ui/ArchiveToggle.vue';
import RoundedButton from '../ui/RoundedButton.vue';

export default {
  name: 'TopBanner',
  components: {
    IconContainer,
    DataIcon,
    CenterContainer,
    LayoutContainer,
    RightContainer,
    RoundedSwitch,
    SourcePick,
    ArchiveToggle,
    RoundedButton,
  },
  computed: { ...mapState('rtcApp', ['config']) },
};
</script>

<style lang="scss" scoped>
@import "../sass/mixins.scss";

.banner {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 9.8rem;
  width: 100%;
  background-color: #293840;
  box-shadow: 0 .2rem .4rem 0 rgba(0, 0, 0, .5);

  @include for-size(smartphones-portrait) {
    height: 5.6rem;
  }
}

::v-deep [data-icon="tokbox-logo"] {
  height: 4.1rem;
  width: 23.5rem;
  background-image: url(../assets/tokbox-logo.svg);

  @include for-size(smartphones-portrait) {
    width: 5.6rem;
    min-width: 5.6rem;
    background-image: url(../assets/tokbox-logo-bug.svg);
  }
}

.room-info {
  min-width: 6rem;
  color: #7a8b93;
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: .11rem;
  line-height: .5;
}

.room-name {
  height: 2.6rem;
  margin-bottom: .8rem;
  font-size: 2.2rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 2.2rem;
  overflow: hidden;

  @include for-size(smartphones-portrait) {
    width: 11.6rem;
    margin: .4rem 0 0 0;
    font-size: 1.6rem;
  }
}

::v-deep [data-icon="cycle-video"] {
  background-image: url(../assets/video.svg);
  background-position: center;
}

::v-deep [data-icon="p-mic"] {
  background-image: url(../assets/mic.svg);
}

.recordings {
  display: none;
  height: 4rem;
  margin: 2.8rem;
  position: relative;
  background-color: inherit !important;

  @include for-size(smartphones-portrait) {
    height: 9.2rem;
    width: unset;
    min-width: calc("100% - 19rem");
    float: left;
  }
}

.count {
  position: absolute;
  right: 0;
  height: 4rem;
  width: 3.4rem;
  margin-right: 3.4rem;
  padding: 0;
  background-color: #0888b3;
  box-shadow: none;
  border-radius: 0 .6rem .6rem 0;
  border-left: 2px solid #3dc4f0;
  font-size: 1.2rem;
  line-height: 4rem;
  transition: none;

  @include for-size(smartphones-portrait) {
    top: -2rem;
    right: 2.6rem;
  }
}
</style>
