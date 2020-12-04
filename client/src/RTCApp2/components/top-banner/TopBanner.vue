<template>
  <section class="top-banner">
    <div class="icon-container">
      <i data-icon="tokbox_logo" class="icon-container__icon"></i>
    </div>

    <div class="center-container">
      <div class="center-container__room-info">
        <p class="center-container__room-info__name"></p>
        <DataIcon dataIcon="participants" />
        <span
          id="participantsStr"
          class="center-container__participants"
        ></span>
      </div>
    </div>

    <div class="right-container">
      <BlueSwitch>Stop receiving video</BlueSwitch>
      <BlueSwitch>Mute all participants</BlueSwitch>

      <div class="source-pick">
        <a id="toggleFacingMode">
          <DataIcon dataIcon="cycle-video" />
        </a>
      </div>

      <div class="source-pick">
        <a id="pickMic">
          <DataIcon dataIcon="p-mic" />
        </a>
      </div>

      <!-- TODO: -->
      <div v-if="enableArchiving" class="toggle-archiving" disabled>
        <BlueButton
          v-if="!isRecording"
          id="startArchiving"
          class="toggle-archiving__record"
        >
          Record
        </BlueButton>
        <BlueButton
          v-else
          id="stopArchiving"
          class="duration toggle-archiving__stop-record"
        >
          Stop Recording
        </BlueButton>
      </div>

      <div v-if="enableArchiveManager" class="manage-recordings">
        <BlueButton id="viewRecordings" class="manage-recordings__count">
          <span id="recordings">0</span>
        </BlueButton>
      </div>
    </div>

    <div class="layout-container">
      <div class="layout-container__center">
        <div id="layout-icon" class="layout-container__icon">
          <a id="chooseLayout" class="layout-container__layout">
            <DataIcon
              class="layout-container__layout__icon"
              dataIcon="layout-icon"
            />
          </a>
        </div>

        <div id="layout-label" class="layout-container__label">Layout</div>
      </div>
    </div>
  </section>
</template>

<script>
import BlueSwitch from '../core/BlueSwitch.vue';
import DataIcon from '../core/DataIcon.vue';
import BlueButton from '../core/BlueButton.vue';

export default {
  name: 'TopBanner',
  components: { BlueSwitch, DataIcon, BlueButton },
  props: {
    enableArchiving: { type: Boolean, default: true },
    enableArchiveManager: { type: Boolean, default: false },
  },
  data() {
    return {
      isRecording: false,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../../sass/mixins.scss";

.top-banner {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 9.8rem;
  width: 100%;
  background-color: #293840;
  box-shadow: 0 .2rem .4rem 0 rgba(0, 0, 0, 0.5);
  // visibility: hidden;

  @include for-size(smartphones-portrait) {
    height: 5.6rem;
  }
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  float: left;
  height: 100%;
  width: 26.9rem;
  min-width: 26.9rem;
  text-align: center;
  border-right: 1px solid #455b66;

  [data-icon="tokbox_logo"] {
    background-image: url(../../assets/images/tokbox-logo.svg);

    @include for-size(smartphones-portrait) {
      background-image: url(../../assets/images/tokbox-logo-bug.svg);
    }
  }

  &__icon {
    height: 4.1rem;
    width: 23.5rem;

    @include for-size(smartphones-portrait) {
      height: 2.7rem;
      width: 2.7rem;
    }
  }

  @include for-size(smartphones-portrait) {
    width: 5.6rem;
    min-width: 5.6rem;
  }
}

.center-container {
  float: left;
  flex-grow: 1;
  height: 100%;
  padding-left: 3rem;

  &__room-info {
    min-width: 6rem;
    color: #7a8b93;
    font-size: 1.3rem;
    font-weight: 600;
    letter-spacing: .11rem;
    line-height: 0.5;

    &__name {
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
  }

  @include for-size(smartphones-portrait) {
    max-width: 13rem;
    padding: 0;
    padding-left: 1.7rem;
  }
}

.right-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  float: right;
  right: 0;

  .source-pick {
    display: inline-block;
    min-width: 7rem;
    text-align: center;
    cursor: pointer;

    @include for-size(smartpohones-portrait) {
      margin-top: -3.6rem;
      margin-right: .7rem;
    }
  }

  .toggle-archiving {
    height: 4rem;
    margin: 2.8rem 0;
    position: relative;
    background-color: inherit !important;

    &__record {
      height: 4rem;
      width: 8.5rem;
      margin-right: 3.4rem;
      padding: 0 3.75rem;
      box-shadow: none;
      border-radius: .6rem;
      font-size: 1.2rem;
      line-height: 4rem;
      transition: none;

      @include for-size(smartphones-portrait) {
        margin: 0;
        padding: 0;
        top: -2rem;
        right: .8rem;
        width: 11.6rem;
      }
    }

    &__stop-record {
      height: 4rem;
      width: 8.5rem;
      margin-right: 3.4rem;
      padding: 0 3.75rem;
      background-color: #e75758;
      box-shadow: none;
      border-radius: .6rem;
      font-size: 1.2rem;
      line-height: 4rem;
      transition: none;

      @include for-size(smartphones-portrait) {
        margin: 0;
        padding: 0;
        top: -2rem;
        right: .8rem;
        width: 11.6rem;
      }

      &:hover, &:focus, &:active {
        background-color: #cb4348;
      }
    }

    @include for-size(smartphones-portrait) {
      top: -2rem;
      right: .8rem;
    }
  }

  .manage-recordings {
    display: none;
    height: 4rem;
    margin: 2.8rem 0;
    position: relative;
    background-color: inherit !important;

    &__manage-recordings__count {
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
    }

    @include for-size(smartphones-portrait) {
      top: -2rem;
      right: .2.6rem;
    }
  }

  @include for-size(smartphones-portrait) {
    height: 9.2rem;
    width: unset;
    min-width: calc("100% - 19rem");
    float: left;
  }
}

.layout-container {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 9.8rem;
  width: 11.4rem;

  text-align: center;
  border-left: .1rem solid #455b66;

  &__icon {
    float: none;
    height: 2.2rem;
  }

  &__layout {
    &__icon {
      height: 2.24rem;
      width: 2.11rem;
    }
  }

  &__label {
    float: none;
    margin-top: .8rem;

    color: #c0c0c0;
    font-size: 1.2rem;
  }

  @include for-size(smartphones-portrait) {
    display: none;
  }
}
</style>
