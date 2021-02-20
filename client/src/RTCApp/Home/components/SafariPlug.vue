<template>
  <div class="plug">
    <a class="link" href="https://safari.opentokrtc.com/">
      Try the WebRTC Demo for Safari.
    </a>
  </div>
</template>

<script>
export default {
  name: 'SafariPlug',
};
</script>

<style lang="scss" scoped>
@import "../../sass/variables.scss";

.plug {
  display: none;
  margin-top: 2.4rem;
}

.link {
  color: $blue-text;
  text-decoration: none;
}
</style>
