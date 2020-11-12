<template>
  <section id="switchAlerts" class="tc-modal switch-alert-modal">
    <form class="tc-dialog">
      <i data-icon="close_gray" class="close"></i>
      <header><span class="msg"></span></header>
      <hr />
      <p class="detail"></p>
      <select id="select-devices" class="devices"></select>
      <footer>
        <button class="btn btn-blue btn-padding ctaarrow-white accept"></button>
      </footer>
    </form>
  </section>
</template>

<script>
export default {
  name: 'SwitchAlertModal',
};
</script>
