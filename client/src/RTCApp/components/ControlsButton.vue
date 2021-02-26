<template>
  <div class="container">
    <button :class="['button', color, isActive]" :disabled="disabled">
      <slot name="button"></slot>
    </button>
    <p class="description">
      <slot name="description"></slot>
    </p>
  </div>
</template>

<script>
export default {
  name: 'ControlsButton',
  props: {
    color: { type: String, default: '' },
    active: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  computed: {
    isActive() {
      return this.active ? 'active' : '';
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: table-cell;
  padding-top: 1rem;
  color: #c0c0c0;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
}

.button {
  background-image: url(../assets/inactive-circle.svg);
  width: 5.42rem;
  height: 5.42rem;
  vertical-align: top;
  background-color: transparent;
  border: none;
  color: white;
  cursor: pointer;
}

.red {
  background-image: url(../assets/red-circle.svg);
}

.active {
  background-image: url(../assets/active-circle.svg);
}

.description {
  margin-top: 1rem;
  margin-bottom: 0;
  line-height: 0;
}
</style>
