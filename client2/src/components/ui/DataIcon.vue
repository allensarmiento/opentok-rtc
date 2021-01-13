<template>
  <i :data-icon="dataIcon" :class="[iconVariant, className]" />
</template>

<script>
export default {
  name: 'DataIcon',
  props: {
    className: { type: String, default: '' },
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
  background-repeat: no-repeat;
}

.primary {
  height: 3.04rem;
  width: 5.1rem;
  vertical-align: text-bottom;
}
</style>
