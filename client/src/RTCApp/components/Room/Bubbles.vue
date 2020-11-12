<template>
  <section class="bubbles">
    <section for="viewRecordings" class="bubble" data-recordings="loading">
      <div class="bubble-content top-arrow">
        <p class="title recordings">Your recordings</p>
        <p class="title no-recordings">No recordings</p>
        <p class="title loading">Loading archived recordings...</p>
        <div class="tc-list videos">
          <ul></ul>
        </div>
      </div>
    </section>

    <section for="chooseLayout" class="bubble">
      <div class="bubble-content top-arrow">
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
