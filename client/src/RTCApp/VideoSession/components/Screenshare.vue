<template>
  <div></div>
</template>

<script>
import OT from '@opentok/client';

export default {
  props: {
    session: { type: OT.session, required: true },
  },
  data() {
    return {
      publisherOptions: {
        videoSource: 'screen',
        maxResolution: { width: 1920, height: 1080 },
      },
    };
  },
  mounted() {
    OT.checkScreenSharingCapability((response) => {
      if (!response.supported || response.extensionRegistered === false) {
        // This browser does not support screen sharing
      } else if (response.extensionInstalled === false) {
        // Prompt to install the extension
      } else {
        // Screen sharing is available. Publish the screen.
        const screenPublisherElement = document.createElement('div');
        const publisher = OT.initPublisher(
          screenPublisherElement,
          publisherOptions,
          (initError) => {
            if (initError) {
              // Look at error.message to see what went wrong.
            } else {
              this.session.publish(publisher, (pubError) => {
                if (pubError) {
                  // Look error.message to see what went wrong.
                }
              });
            }
          },
        );
      }
    });
  },
  methods: {
  },
};
</script>
