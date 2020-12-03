<template>
  <section id="top-banner" class="top-banner">
    <div class="icon-container">
      <i data-icon="tokbox_logo"></i>
    </div>

    <div class="center-container">
      <div class="room-info">
        <p class="room-name"></p>
        <i data-icon="participants"></i>
        <span id="participantsStr"></span>
      </div>
    </div>

    <div class="right-container">
      <div class="videoSwitch">
        <a id="videoSwitch" disabled>
          <i data-icon="videoSwitch"></i>
          <span>Stop receiving video</span>
        </a>
      </div>

      <div class="audioSwitch">
        <a id="audioSwitch" disabled>
          <i data-icon="audioSwitch"></i>
          <span>Mute all participants</span>
        </a>
      </div>

      <div class="sourcePick">
        <a id="toggleFacingMode">
          <i data-icon="cycleVideo"></i>
        </a>
      </div>

      <div class="sourcePick">
        <a id="pickMic">
          <i data-icon="pmic"></i>
        </a>
      </div>

      <div v-if="enableArchiving" id="toggleArchiving" disalbed>
        <a id="startArchiving" class="btn btn-blue btn-padding">
          Record
        </a>
        <a id="stopArchiving" class="btn btn-blue btn-padding duration">
          Stop Recording
        </a>
      </div>

      <div v-if="enableArchiveManager" id="manageRecordings">
        <a id="viewRecordings" class="btn btn-blue btn-padding">
          <span id="recordings">0</span>
        </a>
      </div>
    </div>

    <div class="layout-container">
      <div>
        <div id="layout-icon">
          <a id="chooseLayout">
            <i data-icon="layout-icon"></i>
          </a>
        </div>

        <div id="layout-label">Layout</div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TopBanner',
  props: {
    enableArchiving: { type: Boolean, default: false },
    enableArchiveManager: { type: Boolean, default: false },
  },
};
</script>

<style lang="scss" scoped>
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

  @media only screen and (max-width: 48rem) {
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

  @media only screen and (max-width: 48rem) {
    width: 5.6rem;
    min-width: 5.6rem;
  }
}

.center-container {
  float: left;
  flex-grow: 1;

  height: 100%;
  padding-left: 3rem;

  @media only screen and (max-width: 48rem) {
    max-width: 13rem;
    padding: 0;
    padding-left: 1.7rem;
  }

  .room-info {
    min-width: 6rem;

    color: #7a8b93;
    font-size: 1.3rem;
    font-weight: 600;
    letter-spacing: .11rem;
    line-height: 0.5;

    .room-name {
      height: 2.6rem;
      margin-bottom: .8rem;

      font-size: 2.2rem;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 2.2rem;
      overflow: hidden;

      @media only screen and (max-width: 48rem) {
        width: 11.6rem;
        margin: .4rem 0 0 0;

        font-size: 1.6rem;
      }
    }
  }
}

.right-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  float: right;
  right: 0;

  @media only screen and (max-width: 48rem) {
    height: 9.2rem;
    width: unset;
    min-width: calc("100% - 19rem");
    float: left;
  }

  div {
    float: left;
  }

  .videoSwitch, .audioSwitch {
    width: 21.6rem;
    min-width: 21.6rem;

    span {
      margin-left: 1.2rem;
      margin-right: 1.2rem;

      color: #c0c0c0;
      vertical-align: top;
      line-height: 2.4rem;
      font-size: 1.2rem;
    }

    @media only screen and (max-width: 48rem) {
      display: none;
    }
  }
}

.layout-container {

}
</style>
