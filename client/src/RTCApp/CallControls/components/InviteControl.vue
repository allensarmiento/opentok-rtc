<template>
  <ControlsButton id="addToCall">
    <template v-slot:button>
      <DataIcon dataIcon="add" />
    </template>
    <template v-slot:description>Invite</template>
  </ControlsButton>
</template>

<script>
import ControlsButton from './ControlsButton.vue';
import DataIcon from '../../ui/DataIcon.vue';

export default {
  name: 'InviteControl',
  components: { ControlsButton, DataIcon },
};
</script>

<style lang="scss" scoped>
::v-deep [data-icon="add"] {
  height: 2.8rem;
  width: 2.7rem;
  background-image: url(../assets/add.svg);
}
</style>
