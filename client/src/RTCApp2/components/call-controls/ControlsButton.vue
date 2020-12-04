<template>
  <div class="controls-button">
    <button :id="id" :disabled="disabled">
      <DataIcon :dataIcon="dataIcon" />
    </button>
    <p>
      <slot></slot>
    </p>
  </div>
</template>

<script>
import DataIcon from '../core/DataIcon.vue';

export default {
  name: 'ControlsButton',
  components: { DataIcon },
  props: {
    id: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    dataIcon: { type: String, default: '' },
  },
};
</script>

<style lang="scss" scoped>
.controls-button {
  display: table-cell;
  padding-top: 1rem;
  // TODO
}
</style>
