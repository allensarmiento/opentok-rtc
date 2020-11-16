<template>
  <div ref="modal">
  </div>
</template>

<script>
const transEndEventName = ('WebkitTransition' in document.documentElement.style)
  ? 'webkitTransitionEnd' : 'transitionend';

export default {
  name: 'Modal',
  props: {
    show: { type: Boolean, default: false },
  },
  data() {
    return {
      preShowFocusElement: null,
      queuedModals: [],
      modalShown: false,
    };
  },
  methods: {
    callShow(preshowCB, allowMultiple) {
      let screenFree;

      this.preShowFocusElement = document.activeElement;

      if (this.preShowFocusElement) {
        this.preShowFocusElement.blur();
      }

      if (!this.modalShown || allowMultiple) {
        screenFree = Promise.resolve();
      } else {
        screenFree = new Promise((resolve) => {
          this.queuedModals.push(resolve);
        });
      }

      return screenFree.then(() => new Promise((resolve) => {
        this.modalShown = true;

        if (preshowCB) preshowCB();

        const onTransitioned = () => {
          this.$refs.removeEventListener(transEndEventName, onTransitioned);
          this.addCloseHandler();
          resolve();
        };

        this.$refs.modal.addEventListener(transEndEventName, onTransitioned);
        this.$refs.modal.classList.add('visible');
        this.$refs.modal.classList.add('show');
      }));
    },
    addCloseHandler() {},
  },
};
</script>
