<template>
  <section class="tc-modal add-to-call-modal">
    <div class="tc-dialog">
      <header>
        <i data-icon="close_gray_full" class="close"></i>
        <div class="title" data-tab="feedback">
          <span>Invite Participants</span>
        </div>
      </header>
      <section class="dialog-content">
        <div class="meeting-link">
          <input id="current-url" class="current-url" readonly />
          <div class="copied-message">
            <span>copied to clipboard!</span>
          </div>
        </div>

        <!-- hasSip -->
      </section>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AddToCallModal',
};
</script>
