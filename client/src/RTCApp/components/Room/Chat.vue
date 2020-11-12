<template>
  <section id="chat">
    <form id="chatForm" class="dialog-chat">
      <header>
        <div class="chat-title">
          <i data-icon="message_blue"></i>
          <span>Messaging</span>
        </div>
        <i id="closeChat" data-icon="close_blue"></i>
      </header>

      <div id="chatMsgs" class="tc-list">
        <ul><!-- Chat messages goes here --></ul>
      </div>

      <footer>
        <textarea id="msgText"
          placeholder="Type your message..."
          required
        ></textarea>
        <button id="sendTxt"
          type="submit"
          data-icon="send"
          class="btn btn-blue btn-padding btn-padding-small"
        ></button>
      </footer>
    </form>
  </section>
</template>

<script>
export default {
  name: 'Chat',
};
</script>
