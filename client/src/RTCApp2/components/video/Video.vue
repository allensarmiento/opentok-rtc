<template>
  <Session :apiKey="apiKey" :sessionId="sessionId" :token="token" />
</template>

<script>
import Session from './Session.vue';

export default {
  name: 'Video',
  components: { Session },
  props: {
    apiKey: { type: String, default: '' },
    sessionId: { type: String, default: '' },
    token: { type: String, default: '' },
  },
};
</script>

<style lang="scss" scoped>

</style>
