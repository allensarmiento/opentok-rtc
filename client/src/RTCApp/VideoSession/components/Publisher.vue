<template>
  <li>
    <div class="controls">
      <div class="buttons">
        <div><i></i></div>
      </div>
    </div>
  </li>
</template>

<script>
import OT from '@opentok/client';

export default {
  name: 'Publisher',
  props: {
    session: { type: OT.session, required: true },
    options: { type: Object, default: () => ({}) },
    isScreensharing: { type: Boolean, default: false },
  },
  watch: {
    options(value) {
      const { publishAudio, publishVideo } = value;
      this.publisher.publishAudio(publishAudio);
      this.publisher.publishVideo(publishVideo);
    },
    // TODO: How should screen sharing be handled?
    // It could be a separate component that displays over the entire screen.
    // It could only be handled by the publisher.
    // What should happen if 2 people are screen sharing?
    isScreensharing(isSharing) {
      if (isSharing) {
        OT.checkScreenSharingCapability((response) => {
          if (!response.supported || response.extensionRegistered === false) {
            // The browser does not support screen sharing
          } else if (response.extensionInstalled === false) {
            // Prompt to install the extension
          } else {
            // Screen sharing is available. Publish the screen.
            const screenPublisherElement = document.createElement('div');

            this.screenPublisher = OT.initPublisher(
              screenPublisherElement,
              {
                videoSource: 'screen',
                maxResolution: { width: 1920, height: 1080 },
              },
              (initError) => {
                if (initError) {
                  // Look at error.message to see what went wrong.
                } else {
                  this.session.publish(this.screenPublisher, (pubError) => {
                    if (pubError) {
                      // Look error.message to see what went wrong.
                    }
                  });
                }
              },
            );

            this.screenPublisher.on('mediaStopped', () => {
              console.log('mediaStopped');
              // The user clicked stop.
            });

            this.screenPublisher.on('streamDestroyed', (event) => {
              if (event.reason === 'mediaStopped') {
                console.log('mediaStopped');
                // User clicked stop sharing
              } else if (event.reason === 'forceUnpublished') {
                console.log('forceUnpublished');
                // A moderator forced the user to stop sharing
              }
            });
          }
        });
      } else {
        // Force the screensharing to stop
        this.screenPublisher.destroy();
      }
    },
  },
  data() {
    return {
      publisher: null,
      screenPublisher: null,
    };
  },
  mounted() {
    this.publisher = OT.initPublisher(this.$el, this.options, (error) => {
      if (error) {
        this.$emit('error', error);
      } else {
        this.$emit('publisherCompleted');
      }
    });

    this.$emit('publisherCreated', this.publisher);
    const publish = () => {
      this.session.publish(this.publisher, (error) => {
        if (error) {
          this.$emit('error', error);
        } else {
          this.$emit('publisherConnected', this.publisher);
        }
      });
    };

    if (this.session && this.session.isConnected()) {
      publish();
    }
    if (this.session) {
      this.session.on('sessionConnected', publish);
    }
  },
};
</script>

<style lang="scss" scoped>
.controls {
  top: 4rem;
  left: 4rem;
}

.button {
  padding: 1.5rem;
}
</style>
