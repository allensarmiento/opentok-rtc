<template>
  <div class="info">
    <p class="name"></p>
    <DataIcon dataIcon="participants" />
    <span id="participantsStr" class="participants"></span>
  </div>
</template>

<script>
import DataIcon from '../../ui/DataIcon.vue';

export default {
  name: 'RoomInfo',
  components: { DataIcon },
};
</script>

<style lang="scss" scoped>
@import "../../sass/mixins.scss";

.info {
  min-width: 6rem;
  color: #7a8b93;
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: .11rem;
  line-height: .5;
}

.name {
  height: 2.6rem;
  margin-bottom: .8rem;
  font-size: 2.2rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 2.2rem;
  overflow: hidden;

  @include for-size(smartphones-portrait) {
    width: 11.6rem;
    margin: .4rem 0 0 0;
    font-size: 1.6rem;
  }
}
</style>
