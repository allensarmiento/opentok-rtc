<template>
  <li></li>
</template>

<script>
import OT from '@opentok/client';

export default {
  props: {
    isScreensharing: { type: Boolean, default: false },
    session: { type: OT.session, required: true },
  },
  data() {
    return {
      publisher: null,
      publisherOptions: {
        videoSource: 'screen',
        maxResolution: { width: 1920, height: 1080 },
      },
    };
  },
  watch: {
    isScreensharing(isSharing) {
      if (isSharing) {
        OT.checkScreenSharingCapability((response) => {
          if (!response.supported || response.extensionRegistered === false) {
            // The browser does not support screen sharing
          } else if (response.extensionInstalled === false) {
            // Prompt to install the extension
          } else {
            // Screen sharing is available. Publish the screen.
            this.publisher = OT.initPublisher(
              this.$el,
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

            this.publisher.on('mediaStopped', () => {
              console.log('mediaStopped');
              // The user clicked stop.
            });

            this.publisher.on('streamDestroyed', (event) => {
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
        this.publisher.destroy();
      }
    },
  },
  mounted() {
    // OT.checkScreenSharingCapability((response) => {
    //   if (!response.supported || response.extensionRegistered === false) {
    //     // This browser does not support screen sharing
    //   } else if (response.extensionInstalled === false) {
    //     // Prompt to install the extension
    //   } else {
    //     // Screen sharing is available. Publish the screen.
    //     this.publisher = OT.initPublisher(
    //       this.$el,
    //       this.publisherOptions,
    //       (initError) => {
    //         if (initError) {
    //           // Look at error.message to see what went wrong.
    //         } else {
    //           this.session.publish(this.publisher, (pubError) => {
    //             console.log('Screen published');
    //             if (pubError) {
    //               // Look error.message to see what went wrong.
    //             }
    //           });
    //         }
    //       },
    //     );
    //   }
    // });
  },
  beforeUnmount() {
    // console.log('Unpublishing screenshare');
    // this.publisher.destroy();
  },
};
</script>
