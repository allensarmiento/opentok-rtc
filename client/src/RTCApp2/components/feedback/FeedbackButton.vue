<template>
  <section class="feedback-button">
    <span id="showFeedback" class="feedback-button__text">
      Feedback / Report a Bug
    </span>
  </section>
</template>

<script>
export default {
  name: 'FeedbackButton',
};
</script>

<style lang="scss" scoped>
@import "../../sass/mixins.scss";
@import "../../sass/variables.scss";

.feedback-button {
  position: absolute;
  top: 25rem;
  right: 0;
  left: -19rem;
  height: 4.9rem;
  width: 19rem;
  margin: 0;
  z-index: 1001;
  background-image: url(../../assets/images/icons/feedback.svg);
  background-repeat: no-repeat;
  opacity: 0;
  transform: rotate(90deg) translate(0, 7.8rem);
  transition: all $transition-time;
  cursor: pointer;

  &__text {
    display: block;
    padding: 2rem;
    font-size: 1.2rem;
    transform: rotate(180deg);
  }

  &.visible {
    opacity: 1;
    left: 0;
  }

  @include for-size(smartphones-portrait) {
    display: none;
  }
}
</style>
