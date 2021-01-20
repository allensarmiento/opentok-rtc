<template>
  <ControlsButton id="endCall" color="red">
    <template v-slot:button>
      <DataIcon dataIcon="end-call" />
    </template>
    <template v-slot:description>Leave Call</template>
  </ControlsButton>
</template>

<script>
import ControlsButton from './ControlsButton.vue';
import DataIcon from '../../ui/DataIcon.vue';

export default {
  name: 'LeaveCallControl',
  components: { ControlsButton, DataIcon },
};
</script>

<style lang="scss" scoped>
::v-deep [data-icon="end-call"] {
  height: 2.1rem;
  width: 3.4rem;
  background-image: url(../assets/hang-up.svg);
}
</style>
