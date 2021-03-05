<template>
  <section class="bubbles">
    <Bubble for="viewRecordings" data-recordings="loading">
        <BubbleContent class="top-arrow">
          <p class="title recordings">Your recordings</p>
          <p class="title no-recordings">No recordings</p>
          <p class="title loading">Loading archived recordings...</p>
          <div class="tc-list videos">
            <ul></ul>
          </div>
        </BubbleContent>
      </Bubble>
      <Bubble for="chooseLayout">
        <BubbleContent class="top-arrow">
          <ul>
            <li><a data-layout-type="float"></a></li>
            <li><a data-layout-type="f2f_horizontal"></a></li>
            <li><a data-layout-type="grid"></a></li>
            <li><a data-layout-type="f2f_vertical"></a></li>
            <li><a data-layout-type="hangout_horizontal"></a></li>
            <li><a data-layout-type="hangout_vertical"></a></li>
          </ul>
        </BubbleContent>
      </Bubble>
  </section>
</template>

<script>
import Bubble from '../ui/Bubble.vue';
import BubbleContent from '../ui/BubbleContent.vue';

export default {
  name: 'Bubbles',
  components: { Bubble, BubbleContent },
};
</script>

<style lang="scss" scoped>
</style>
