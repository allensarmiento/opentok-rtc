<template>
  <div class="info">
    Need help?
    <a class="link" href="https://tokbox.com/" target="_blank">
      About TokBox
    </a>
    /
    <a class="link" href="https://tokbox.com/contact/sales" target="_blank">
      Contact Sales
    </a>
  </div>
</template>

<script>
export default {
  name: 'MoreInfo',
};
</script>

<style lang="scss" scoped>
@import "../../sass/mixins.scss";
@import "../../sass/variables.scss";

.info {
  margin-top: 6.9rem;
  margin-bottom: 3.2rem;
  color: #748393;
  font-size: 1.2rem;

  @include for-size(smartphones) {
    position: fixed;
    right: 2rem;
    bottom: 0;
  }
}

.link {
  color: $blue-text;
  text-decoration: none;
}
</style>
