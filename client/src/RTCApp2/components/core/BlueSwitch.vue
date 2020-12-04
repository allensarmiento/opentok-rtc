<template>
  <div class="switch">
    <a class="switch__btn" disabled>
      <DataIcon dataIcon="switch" />
      <span class="switch__text">
        <slot></slot>
      </span>
    </a>
  </div>
</template>

<script>
import DataIcon from './DataIcon.vue';

export default {
  name: 'BlueSwitch',
  components: { DataIcon },
};
</script>

<style lang="scss" scoped>
@import "../../sass/mixins.scss";

.switch {
  width: 21.6rem;
  min-width: 21.6rem;

  &__icon {
    height: 3.04rem;
    width: 5.1rem;
    vertical-align: text-bottom;
  }

  &__text {
    margin-left: 1.2rem;
    margin-right: 1.2rem;
    color: #c0c0c0;
    vertical-align: top;
    line-height: 2.4rem;
    font-size: 1.2rem;
  }

  @include for-size(smartphones-portrait) {
    display: none;
  }
}
</style>
