<template>
  <section class="tc-modal archive-delete-modal">
    <form class="tc-dialog">
      <i data-icon="close_gray" class="close"></i>
      <header>Delete <span class="username"></span>'s Archive</header>
      <hr />
      <p>Are you sure you want to delete this archive?</p>
      <footer>
        <button class="btn btn-white btn-padding ctaarrow-blue">Cancel</button>
        <button class="btn btn-blue btn-padding ctaarrow-white delete-archive">Delete</button>
      </footer>
    </form>
  </section>
</template>

<script>
export default {
  name: 'DeleteArchiveModal',
};
</script>
