<template>
  <section class="banner">
    <IconContainer>
      <DataIcon dataIcon="tokbox_logo" variant="none" />
    </IconContainer>

    <CenterContainer>
      <RoomInfo />
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
      <ManageRecordings v-if="config.Archiving.archiveManager.enabled" />
    </RightContainer>

    <LayoutContainer />
  </section>
</template>

<script>
import { mapState } from 'vuex';
import IconContainer from '../ui/IconContainer.vue';
import DataIcon from '../ui/DataIcon.vue';
import CenterContainer from '../ui/CenterContainer.vue';
import RoomInfo from './RoomInfo.vue';
import RightContainer from '../ui/RightContainer.vue';
import RoundedSwitch from '../ui/RoundedSwitch.vue';
import SourcePick from '../ui/SourcePick.vue';
import ArchiveToggle from '../ui/ArchiveToggle.vue';
import ManageRecordings from '../ui/ManageRecordings.vue';
import LayoutContainer from '../ui/LayoutContainer.vue';

export default {
  name: 'TopBanner',
  components: {
    IconContainer,
    DataIcon,
    CenterContainer,
    RoomInfo,
    RightContainer,
    RoundedSwitch,
    SourcePick,
    ArchiveToggle,
    ManageRecordings,
    LayoutContainer,
  },
  computed: {
    ...mapState('RTCApp', ['config']),
  },
};
</script>

<style lang="scss" scoped>
@import "../../sass/mixins.scss";

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

::v-deep [data-icon="tokbox_logo"] {
  height: 4.1rem;
  width: 23.5rem;
  background-image: url(../../assets/images/tokbox-logo.svg);

  @include for-size(smartphones-portrait) {
    width: 5.6rem;
    min-width: 5.6rem;
    background-image: url(../../assets/images/tokbox-logo-bug.svg);
  }
}

::v-deep [data-icon="cycle-video"] {
  background-image: url(../../assets/images/icons/video.svg);
  background-position: center;
}

::v-deep [data-icon="p-mic"] {
  background-image: url(../../assets/images/icons/mic.svg);
}
</style>
