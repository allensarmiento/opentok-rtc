<template>
  <div class="content">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'BubbleContent',
};
</script>

<style lang="scss" scoped>
$border-color: #c5bbb4;
$background-color: #fff;

.content {
  position: relative;
  max-width: 26.5rem;
  padding: 2rem;
  background-color: $background-color;
  box-shadow: -2px 3px 4px 0 rgba(0. 0. 0. .5);
  border: 1px solid $border-color;
  border-radius: 1rem;
  color: #9b9c9b;
  font-size: 1.2rem;

  &:before {
    content: "";
    display: block;
    position: absolute;
    left: -1rem;
    top: 4.2rem;
    height: 0;
    width: 0;
    border-top: 1rem solid transparent;
    border-bottom: 1rem solid transparent;
  }

  &:after {
    left: -.9rem;
    top: 4.25rem;
    border-top: .9rem solid transparent;
    border-bottom: .9rem solid transparent;
    border-right: .9rem solid #fff;
  }
}
</style>
