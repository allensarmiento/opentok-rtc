<template>
  <div class="switch">
    <a disabled>
      <DataIcon dataIcon="switch" />
      <span class="text">
        <slot></slot>
      </span>
    </a>
  </div>
</template>

<script>
import DataIcon from './DataIcon.vue';

export default {
  name: 'RoundedSwitch',
  components: { DataIcon },
};
</script>

<style lang="scss" scoped>
@import "../sass/mixins.scss";

.switch {
  width: 21.6rem;
  min-width: 21.6rem;

  @include for-size(smartphones-portrait) {
    display: none;
  }
}

.text {
  margin-left: 1.2rem;
  margin-right: 1.2rem;
  color: #c0c0c0;
  vertical-align: top;
  line-height: 2.4rem;
  font-size: 1.2rem;
}

::v-deep [data-icon="switch"] {
  background-image: url(../assets/images/icons/switch_off_blue.svg);
}
</style>
