<template>
  <div class="toggle-archiving">
    <RoundedButton
      v-if="!isRecording"
      id="startArchiving"
      class="record"
    >
      Record
    </RoundedButton>
    <RoundedButton
      v-else
      id="stopArchiving"
      class="duration stop-record"
    >
      Stop Recording
    </RoundedButton>
  </div>
</template>

<script>
import RoundedButton from './RoundedButton.vue';

export default {
  name: 'ArchiveToggle',
  components: { RoundedButton },
  data() {
    return {
      isRecording: false,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../sass/mixins.scss";

.toggle-archiving {
  height: 4rem;
  margin: 2.8rem 0;
  position: relative;
  background-color: inherit !important;

  @include for-size(smartphones-portrait) {
    top: -2rem;
    right: .8rem;
  }
}

.record {
  height: 4rem;
  // width: 8.5rem;
  margin-right: 3.4rem;
  padding: 0 3.75rem;
  box-shadow: none;
  border-radius: .6rem;
  font-size: 1.2rem;
  line-height: 4rem;
  transition: none;

  @include for-size(smartphones-portrait) {
    margin: 0;
    padding: 0;
    top: -2rem;
    right: .8rem;
    width: 11.6rem;
  }
}

.stop-record {
  height: 4rem;
  // width: 8.5rem;
  margin-right: 3.4rem;
  padding: 0 3.75rem;
  background-color: #e75758;
  box-shadow: none;
  border-radius: .6rem;
  font-size: 1.2rem;
  line-height: 4rem;
  transition: none;

  @include for-size(smartphones-portrait) {
    margin: 0;
    padding: 0;
    top: -2rem;
    right: .8rem;
    width: 11.6rem;
  }

  &:hover, &:focus, &:active {
    background-color: #cb4348;
  }
}
</style>
