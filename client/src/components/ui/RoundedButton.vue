<template>
  <a :class="['btn', padding, className]" :data-icon="dataIcon" :type="type">
    <slot></slot>
  </a>
</template>

<script>
export default {
  name: 'RoundedButton',
  props: {
    className: { type: String, default: '' },
    padding: { type: String, default: 'md' },
    dataIcon: { type: String, default: '' },
    type: { type: String, default: '' },
  },
};
</script>

<style lang="scss" scoped>
@import "../../sass/variables.scss";

.btn {
  display: inline-block;
  height: 5rem;
  border: 0;
  border-radius: .4rem;
  background-color: #10a9dc;
  color: #fff;
  font-family: $base-font-family;
  font-size: 1.6rem;
  font-stretch: normal;
  font-style: normal;
  font-variant: normal;
  font-weight: normal;
  text-align: center;
  line-height: 5rem;
  box-shadow: 0 .1rem .3rem 0 rgba(0, 0, 0, .5);
  transition: all .5s ease-out;

  &:hover {
    background-color: #007ba3;
    text-decoration: none;
    box-shadow: 0 0 0 .2rem #0099cb;
    cursor: pointer;
  }
}

.sm { padding: 0 2rem; }
.md { padding: 0 3rem; }
.lg { padding: 0 5rem; }
</style>
