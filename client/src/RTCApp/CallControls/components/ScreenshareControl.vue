<template>
  <ControlsButton id="screen-share">
    <template v-slot:button>
      <DataIcon dataIcon="screenshare" />
    </template>
    <template v-slot:description>Share Screen</template>
  </ControlsButton>
</template>

<script>
import ControlsButton from './ControlsButton.vue';
import DataIcon from '../../ui/DataIcon.vue';

export default {
  name: 'ScreenshareControl',
  components: { ControlsButton, DataIcon },
};
</script>

<style lang="scss" scoped>
::v-deep [data-icon="screenshare"] {
  height: 2.9rem;
  width: 3.7rem;
  background-image: url(../assets/screenshare.svg);
}
</style>
