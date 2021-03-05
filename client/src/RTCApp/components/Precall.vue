<template>
  <section class="tc-modal user-name-modal" @keyup.enter.stop="sumbitForm">
    <img class="logo" :src="logo" alt="opentok transparent logo" />
    <p class="room-name">{{ roomName }}</p>
    <div class="precall-right">
      <form class="tc-dialog" @submit.prevent="submitForm">
        <div class="video-preview">
          <div class="video-preview-name">{{ username }}</div>
        </div>
        <div class="enter-name-prompt">
          <div>
            <input
              v-model="username"
              class="user-name-input block username"
              autocomplete="off"
              autofocus
            />
            <label>Your Name (Optional)</label>
          </div>
        </div>
        <div class="publish-settings">
          <div class="video-settings">
            <div>
              <img src="../assets/video-icon.svg" />
              <span>Video</span>
            </div>
            <a
              :class="['initial-video-switch', videoSwitch]" 
              @click="toggleVideoSwitch"
            >
              <label>{{ publisherOptions.publishVideo ? 'On' : 'Off' }}</label>
              <i data-icon="videoSwitch"></i>
            </a>
          </div>
          <div class="audio-settings">
            <div>
              <img src="../assets/mic-icon.svg" />
              <span>Audio</span>
              <div class="audio-meter">
                <div class="audio-meter-level"></div>
              </div>
            </div>
            <a
              :class="['initial-audio-switch', audioSwitch]"
              @click="toggleAudioSwitch"
            >
              <label>{{ publisherOptions.publishAudio ? 'On' : 'Off' }}</label>
              <i data-icon="audioSwitch"></i>
            </a>
          </div>
          <div class="session-settings">
            <div>
              <img src="../assets/session.png" />
              <span>Session mode</span>
            </div>
            <a
              :class="['initial-session-switch', sessionSwitch]"
              @click="toggleSessionSwitch"
            >
              <label>{{ capitalize(publisherOptions.sessionMode) }}</label>
              <i data-icon="sessionSwitch"></i>
            </a>
          </div>
          <div class="resolution-settings">
            <div>
              <img src="../assets/resolution.png" />
              <span>Resolution</span>
            </div>
            <select v-model="publisherOptions.resolution" class="resolution">
              <option value="1280x720" selected="selected">HD</option>
              <option value="1920x1080">Full HD</option>
              <option value="3480x2160">4K</option>
            </select>
          </div>
          <div class="pre-call-test">
            <div class="precall-test-labels">
              <img src="../assets/connectivity-icon.svg" />
              <span>Connectivity test</span>
              <span class="test-status">
                <label class="test-label-status"></label>
                <button
                  class="connectivity-cancel"
                  @click.prevent="connectivityCancelClicked"
                >
                  <i data-icon="connectivity-cancel"></i>
                </button>
              </span>
            </div>
          </div>
          <div class="precall-test-meter">
            <div class="precall-test-meter-level"></div>
          </div>
          <button
            type="submit"
            class="enter btn btn-blue btn-padding"
            disabled
          >
            <span class="room-name">Join {{ roomName }}</span>
          </button>
        </div>
      </form>
      <div class="pre-call-test-results">
        <!-- TODO -->
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Precall',
  methods: {
    sumbitForm() {},
  },
};
</script>

<style lang="scss" scoped>

</style>
