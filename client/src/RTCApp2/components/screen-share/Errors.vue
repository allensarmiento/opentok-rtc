<template>
  <section id="screenShareErrors" class="errors">
    <div class="errors__detail">
      <i data-icon="close_gray"></i>
      <section id="screenShareErrorMsg">
        <header class="errors__title"></header>
        <hr />
        <p class="errors__description"></p>
      </section>

      <section id="screenShareErrorInstall" class="errors_install">
        <header class="errors__install__alert">
          You need a Chrome extension to share your screen.
        </header>
        <hr />
        <p class="errors__install__message">
          Once you have installed it, refresh your browser and click 'share
          screen' again.
        </p>
        <footer>
          <button>Install extension</button>
        </footer>
      </section>

      <section id="extInstallationSuccessful">
        <header>
          You need a Chrome extension to share your screen.
        </header>
        <hr />
        <p>
          Once you have installed it, refresh your browser and click 'share
          screen' again
        </p>
        <footer>
          <button id="scrShrLater">Later</button>
          <button id="scrShrReload">Reload</button>
        </footer>
      </section>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ScreenShareErrors',
};
</script>

<style lang="scss" scoped>

</style>
