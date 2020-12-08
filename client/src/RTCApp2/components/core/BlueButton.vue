<template>
  <a
    :class="[
      'btn btn--blue',
      buttonPadding,
      className
    ]"
  >
    <slot></slot>
  </a>
</template>

<script>
export default {
  name: 'BlueButton',
  props: {
    className: { type: String, default: '' },
    padding: { type: String, default: '' },
  },
  computed: {
    buttonPadding() {
      return this.padding
        ? `btn--padding--${this.padding}`
        : 'btn--padding';
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../sass/variables.scss";

.btn {
  display: inline-block;
  height: 5rem;
  border: 0;
  border-radius: 0;
  font-family: $base-font-family;
  font-size: 1.6rem;
  font-stretch: normal;
  font-style: normal;
  font-variant: normal;
  font-weight: normal;
  text-align: center;
  line-height: 5rem;
  transition: all 0.5s ease-out;

  &:hover {
    text-decoration: none;
    cursor: pointer;
  }

  &--blue {
    border-radius: .4rem;
    background-color: #10a9dc;
    box-shadow: 0 .1rem .3rem 0 rgba(0, 0, 0, 0.5);
    color: #fff;

    &:hover {
      background-color: #007ba3;
      box-shadow: 0 0 0 .2rem #0099cb;
    }
  }

  &--padding {
    padding: 0 3rem;

    &--small {
      padding: 0 2rem;
    }

    &--large {
      padding: 0 5rem;
    }
  }
}
</style>
