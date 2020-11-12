<template>
  <section id="screen">
    <div class="streams">
      <div class="tc-list">
        <ul></ul>
      </div>
    </div>

    <div class="call-controls" id="call-controls">
      <div>
        <button id="endCall" disabled>
          <i data-icon="end_call"></i>
        </button>
        <p>Leave Call</p>
      </div>

      <div>
        <button id="toggle-publisher-video" class="selected" disabled>
          <i data-icon="no_video"
            data-event-name="roomView:buttonClick"
            data-action="video"
            data-stream-id="publisher"
            data-stream-type="publisher"
          ></i>
        </button>
        <p>Your Video</p>
      </div>

      <div>
        <button id="toggle-publisher-audio" disabled>
          <i data-icon="mic-muted"></i>
        </button>
        <p>Your Mic</p>
      </div>

      <div id="addToCall-container">
        <button id="addToCall">
          <i data-icon="add"></i>
        </button>
        <p>Invite</p>
      </div>

      <!-- enableScreensharing -->
      <!-- enableAnnotation -->

      <div>
        <button id="message-btn" disabled>
          <i data-icon="message"></i>
        </button>
        <p>
          Message
          <span id="unreadMsg">(<span id="unreadCount">0</span>)</span>
        </p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Screen',
};
</script>
