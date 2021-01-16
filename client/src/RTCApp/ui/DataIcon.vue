<template>
  <i :data-icon="dataIcon" :class="[iconVariant]" />
</template>

<script>
export default {
  name: 'DataIcon',
  props: {
    dataIcon: { type: String, default: '' },
    variant: { type: String, default: 'primary' },
  },
  computed: {
    iconVariant() {
      switch (this.variant) {
        case 'none':
          return '';
        default:
          return 'primary';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
i {
  display: inline-block;
  background-repeat: no-repeat;
  background-position: center;
  background-size: auto 100%;

  &:after {
    content: '';
    display: none;
  }
}

.primary {
  height: 3.04rem;
  width: 5.1rem;
  vertical-align: text-bottom;
}
</style>
