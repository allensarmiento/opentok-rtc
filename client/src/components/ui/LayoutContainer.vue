<template>
  <div class="container">
    <div>
      <div id="layout-icon" class="icon">
        <a id="chooseLayout" class="layout">
          <DataIcon class="layout-icon" dataIcon="layout-icon" />
        </a>
      </div>
      <div id="layout-label" class="label">Layout</div>
    </div>
  </div>
</template>

<script>
import DataIcon from './DataIcon.vue';

export default {
  name: 'LayoutContainer',
  components: { DataIcon },
};
</script>

<style lang="scss" scoped>
@import "../../sass/mixins.scss";

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 9.8rem;
  width: 11.4rem;
  text-align: center;
  border-left: .1rem solid #455b66;

  @include for-size(smartphones-portrait) {
    display: none;
  }
}

.icon {
  float: none;
  height: 2.2rem;
}

.layout-icon {
  height: 2.2rem;
  width: 2.11rem;
}

::v-deep [data-icon="layout-icon"] {
  background-image: url(../../assets/images/icons/layout-icon.svg);
}

.label {
  float: none;
  margin-top: .8rem;
  color: #c0c0c0;
  font-size: 1.2rem;
}
</style>
