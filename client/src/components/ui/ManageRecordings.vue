<template>
  <div class="recordings">
    <RoundedButton id="viewRecordings" class="count">
      <span id="recordings">0</span>
    </RoundedButton>
  </div>
</template>

<script>
import RoundedButton from './RoundedButton.vue';

export default {
  name: 'ManageRecordings',
  components: { RoundedButton },
};
</script>

<style lang="scss" scoped>
@import "../../sass/mixins.scss";

.recordings {
  display: none;
  height: 4rem;
  margin: 2.8rem;
  position: relative;
  background-color: inherit !important;

  @include for-size(smartphones-portrait) {
    height: 9.2rem;
    width: unset;
    min-width: calc("100% - 19rem");
    float: left;
  }
}

.count {
  position: absolute;
  right: 0;
  height: 4rem;
  width: 3.4rem;
  margin-right: 3.4rem;
  padding: 0;
  background-color: #0888b3;
  box-shadow: none;
  border-radius: 0 .6rem .6rem 0;
  border-left: 2px solid #3dc4f0;
  font-size: 1.2rem;
  line-height: 4rem;
  transition: none;

  @include for-size(smartphones-portrait) {
    top: -2rem;
    right: 2.6rem;
  }
}
</style>
