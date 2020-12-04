<template>
  <i :data-icon="dataIcon" class="icon" />
</template>

<script>
export default {
  name: 'DataIcon',
  props: {
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
</style>
