<template>
  <div :class="forbiddenClass">
    <section class="main">
      <div id="righthand-container">
        <div id="righthand-container-cell">
          <section id="main-content">
            <!-- Header -->
            <header v-if="displayHeader" class="header">
              <h1>{{ isWebRTCVersion ? 'WebRTCDemo' : 'Vonage Demo By' }}</h1>
              <img
                src="../assets/images/new-vonage-logo.png"
                alt="opentok transparent logo"
              />
              <h2 v-if="isWebRTCVersion">
                Built by Vonage on the OpenTok Platform
              </h2>
              <h3 v-if="isWebRTCVersion">
                This WebRTC Demo enabled group video conferencing, text&nbsp;
                chat, screen sharing, and more.
              </h3>
            </header>

            <!-- Form -->
            <form ref="form">
              <div>
                <input
                  ref="roomInput"
                  v-model="roomForm.room.value"
                  id="room"
                  class="text-input required"
                  data-wd="roomname"
                  @keyup="onKeyup('room')"
                  @focus="onFocus('room')"
                />
                <label
                  id="room-label"
                  :class="visitedClass('room')"
                  :style="opacityStyle('room')"
                >
                  Meeting name
                </label>
                <p v-if="displayError" class="error-room error-text">
                  <i data-icon="warning"></i>
                  Please enter a meeting name.
                </p>
              </div>

              <div>
                <input
                  ref="userInput"
                  v-model="roomForm.user.value"
                  id="user"
                  class="text-input"
                  data-wd="username"
                  @keyup="onKeyup('user')"
                  @focus="onFocus('user')"
                />
                <label id="user-label" :class="visitedClass('user')">
                  Your name
                </label>
              </div>

              <button
                id="enter"
                data-wd="enterroom"
                @click.stop.prevent="onEnterClicked"
              ></button>
            </form>

            <!-- More info -->
            <div class="landing-more-info">
              Need help?
              <a href="https://tokbox.com/" target="_blank">About TokBox</a>
              /
              <a href="https://tokbox.com/contact/sales" target="_blank">Contact Sales</a>
            </div>

            <div class="safari-plug" :style="displaySafariPlug">
              <a href="https://safari.opentokrtc.com/">Try the WebRTC Demo for Safari</a>
            </div>
          </section>
        </div>
      </div>
    </section>

    <!-- Terms of Service -->
    <section v-if="showTos" class="tc-modal contract">
      <form class="tc-dialog">
        <i data-icon="close_gray" class="close"></i>
        <header>
          <span>Terms of Use</span>
        </header>
        <p>
          By accepting our terms of use you acknowledge that you have read&nbsp;
          <a target="_blank" href="https://tokbox.com/support/privacy-policy">
            privacy policy
          </a>,&nbsp;
          and you are at least 18 years of age.
        </p>
        <footer>
          <button
            id="enter"
            class="btn tb btn-primary btn-arrow btn-next btn-padding accept"
          >
            Accept and Continue
          </button>
        </footer>
      </form>
    </section>
  </div>
</template>

<script>
/* Notes
 * TODO: Implement showContract
 * TODO: Fix UI (Focusing doesn't work well)
 */

export default {
  name: 'Landing',
  mounted() {
    this.init();
  },
  data() {
    return {
      // DOM classes
      classes: {
        forbidden: true,
      },

      displayHeader: false,
      displayError: false,

      variables: {
        showTos: false,
      },

      // Project Settings
      isWebRTCVersion: false,
      showTos: true,

      // Room Form
      roomForm: {
        room: {
          value: '',
          visited: false,
          opacity: 1,
        },
        user: {
          value: '',
          visited: false,
        },
      },
    };
  },
  computed: {
    displaySafariPlug() {
      return window.location.hostname.indexOf('opentokrtc.com') === 0
        ? 'display: block;' : '';
    },
    forbiddenClass() {
      return this.classes.forbidden ? 'forbidden' : '';
    },
  },
  methods: {
    /** */
    init() {
      // Note that since the server forbids loading the content on an iframe
      // this should not execute. But it doesn't hurt eitehr.
      if (window.top !== window.self && !window.iframing_allowed) {
        // If we're being loaded inside an iframe just hijack the top level
        // window and go back to the index page.
        this.$router.push('/');
      } else {
        // And setting this on an else because the re-location might fail in
        // some cases.
        this.startApp();
      }
    },
    /** */
    startApp() {
      this.classes.forbidden = false;
      this.displayHeader = true;

      this.resetForm();
      this.setUsernameFromLocalStorage();
    },
    /** Resets all form fields and add event listeners. */
    resetForm() {
      this.roomForm.room.value = '';
      this.$refs.roomInput.checked = false;

      this.roomForm.user.value = '';
      this.$refs.userInput.checked = false;

      this.$refs.roomInput.focus();
    },
    /** */
    setUsernameFromLocalStorage() {
      const storedUsername = window.localStorage.getItem('username');

      if (storedUsername) {
        this.roomForm.user.value = storedUsername;
        this.roomForm.user.visited = true;
      }
    },
    /** */
    addHandlers() {},
    /** */
    visitedClass(inputType) {
      return this.roomForm[inputType].visited ? 'visited' : '';
    },
    /** */
    opacityStyle(inputType) {
      return this.roomForm[inputType].opacity ? 'opacity: 1;' : '';
    },
    /** */
    onKeyup(inputTarget) {
      this.roomForm[inputTarget].visited = true;
    },
    /** */
    onFocus(inputTarget) {
      if (inputTarget === 'room') {
        this.displayError = false;
        this.roomForm.room.opacity = 1;

        if (this.roomForm.room.value.trim().length) {
          this.roomForm.room.visited = true;
        } else {
          this.roomForm.visited = false;
        }
      } else if (inputTarget === 'user') {
        if (this.roomForm.user.value.trim().length) {
          this.roomForm.user.visited = true;
        } else {
          this.roomForm.user.visited = false;
        }
      }
    },
    /** */
    onEnterClicked() {
      if (!this.isValid()) {
        this.$refs.form.classList.add('error');
        this.$refs.roomInput.blur();
        this.roomForm.room.opacity = 0;
      } else {
        this.$refs.form.classList.remove('error');

        if (this.variables.showTos) {
          // TODO
          console.log('Show Contract');
        } else {
          console.log('Navigate to room');
        }
      }
    },
    /** */
    isValid() {
      const valid = this.$refs.roomInput.type === 'checkbox'
        ? this.$refs.roomInput.checked
        : this.roomForm.room.value;

      if (valid) {
        this.roomForm.room.visited = false;
      } else {
        this.roomForm.room.visited = true;
      }

      return valid;
    },
  },
};
</script>
