<template>
  <section id="top-banner">
    <div class="icon-container">
      <i data-icon="tokbox-logo"></i>
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

      <div class="audioSwitch" disabled>
        <a id="audioSwitch">
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

      <!-- toggleArchiving -->
      <!-- enableArchiveManager -->

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
    </div>
  </section>
</template>

<script>
export default {
  name: 'TopBanner',
};
</script>
