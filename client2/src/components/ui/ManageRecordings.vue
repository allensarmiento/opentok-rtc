<template>
  <div class="recordings">
    <RoundedButton id="viewRecordings" class="count">
      <span id="recordings">0</span>
    </RoundedButton>
  </div>
</template>

<script>
import RoundedButton from './RoundedButton.vue';

export default {
  name: 'ManageRecordings',
  components: { RoundedButton },
};
</script>
