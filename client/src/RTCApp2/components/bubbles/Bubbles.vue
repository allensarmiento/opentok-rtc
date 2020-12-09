<template>
  <section class="bubbles">
    <section for="viewRecordings" class="bubble">
      <div class="bubble__content">
        <p class="bubble__title">Your recordings</p>
        <p class="bubble__title">No recordings</p>
        <p class="bubble__title">Loading archived recordings...</p>
        <div class="bubble__list">
          <ul></ul>
        </div>
      </div>
    </section>

    <section for="chooseLayout" class="bubble">
      <div class="bubble__content">
        <ul>
          <li><a data-layout-type="float"></a></li>
          <li><a data-layout-type="f2f_horizontal"></a></li>
          <li><a data-layout-type="grid"></a></li>
          <li><a data-layout-type="f2f_vertical"></a></li>
          <li><a data-layout-type="hangout_horizontal"></a></li>
          <li><a data-layout-type="hangout_vertical"></a></li>
        </ul>
      </div>
    </section>
  </section>
</template>

<script>
export default {
  name: 'Bubbles',
};
</script>

<style lang="scss" scoped>

</style>
