<template>
  <i :data-icon="dataIcon" :class="['icon', className]" />
</template>

<script>
export default {
  name: 'DataIcon',
  props: {
    className: { type: String, default: '' },
    dataIcon: { type: String, default: '' },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  height: 3.04rem;
  width: 5.1rem;
  vertical-align: text-bottom;
}

// Top Banner
[data-icon="switch"] {
  background-image: url(../../assets/images/icons/switch_off_blue.svg);
}

[data-icon="participants"] {
  height: 1.3rem;
  width: 2.5rem;
  margin-right: -.4rem;
  margin-bottom: -.1rem;
  background-image: url(../../assets/images/icons/participants.svg);
}

[data-icon="cycle-video"] {
  background-image: url(../../assets/images/icons/video.svg);
  background-position: center;
}

[data-icon="p-mic"] {
  background-image: url(../../assets/images/icons/mic.svg);
}

[data-icon="layout-icon"] {
  background-image: url(../../assets/images/icons/layout-icon.svg);
}

// Call Controls
[data-icon="end_call"] {
  height: 2.1rem;
  width: 3.4rem;
  background-image: url(../../assets/images/icons/hang-up.svg);
}

[data-icon="video_icon"] {
  height: 1.54rem;
  width: 2.6rem;
  background-image: url(../../assets/images/icons/video-icon.svg);
}

[data-icon="no_video"] {
  height: 3rem;
  width: 3rem;
  background-image: url(../../assets/images/icons/no_video.svg);
}

[data-icon="mic"] {
  height: 3rem;
  width: 1.8rem;
  margin-top: .6rem;
  background-image: url(../../assets/images/icons/mic.svg);
}

[data-icon="mic-muted"] {
  height: 3rem;
  width: 3.1rem;
  margin-left: .3rem;
  background-image: url(../../assets/images/icons/mic-muted.svg);
}

[data-icon="add"] {
  height: 2.8rem;
  width: 2.7rem;
  background-image: url(../../assets/images/icons/add.svg);
}

[data-icon="screenshare"] {
  height: 2.9rem;
  width: 3.7rem;
  background-image: url(../../assets/images/icons/screenshare.svg);
}

[data-icon="annotate"] {
  height: 2.2rem;
  width: 2.2rem;
  background-image: url(../../assets/images/icons/annotate.svg);
}

[data-icon="message"] {
  height: 2rem;
  width: 2.4rem;
  background-image: url(../../assets/images/icons/message.svg);
}

[data-icon="message_blue"] {
  height: 2rem;
  width: 2.4rem;
  background-image: url(../../assets/images/icons/message_blue.svg);
}

// Chat
[data-icon="close_blue"] {
  background-image: url(../../assets/images/icons/close_blue.svg);
}

[data-icon="send"] {
  background-image: url(../../assets/images/icons/send.svg);
}
</style>
