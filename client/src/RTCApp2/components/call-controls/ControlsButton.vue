<template>
  <div class="control">
    <button
      :id="id"
      :class="[
        'control__button',
        controlButtonColor,
        activated ? 'activated' : '',
      ]"
      :disabled="disabled"
    >
      <DataIcon :dataIcon="dataIcon" className="control__icon" />
    </button>
    <p class="control__description">
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
    buttonColor: { type: String, default: '' },
    dataIcon: { type: String, default: '' },
    activated: { type: Boolean, default: false },
  },
  computed: {
    controlButtonColor() {
      return this.buttonColor
        ? `control__button--${this.buttonColor}`
        : '';
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../sass/mixins.scss";

.control {
  display: table-cell;
  padding-top: 1rem;
  color: #c0c0c0;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;

  &__button {
    background-image: url(../../assets/images/icons/inactive-circle.svg);
    width: 5.42rem;
    height: 5.42rem;
    vertical-align: top;
    background-color: transparent;
    border: none;
    color: white;
    cursor: pointer;

    &--red {
      background-image: url(../../assets/images/icons/red-circle.svg);
    }

    &.activated {
      background-image: url(../../assets/images/icons/active-circle.svg);
    }
  }

  &__icon {
    vertical-align: middle;
  }

  &__description {
    margin-top: 1rem;
    margin-bottom: 0;
    line-height: 0;
  }
}
</style>
