<template>
  <ControlsButton id="annotate">
    <template v-slot:button>
      <DataIcon dataIcon="annotate" />
    </template>
    <template v-slot:description>Annotate</template>
  </ControlsButton>
</template>

<script>
import ControlsButton from './ControlsButton.vue';
import DataIcon from '../../ui/DataIcon.vue';

export default {
  name: 'AnnotateControl',
  components: { ControlsButton, DataIcon },
};
</script>

<style lang="scss" scoped>
::v-deep [data-icon="annotate"] {
  height: 2.2rem;
  width: 2.2rem;
  background-image: url(../assets/annotate.svg);
}
</style>
