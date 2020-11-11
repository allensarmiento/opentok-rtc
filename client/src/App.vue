<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/"></router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <room />
  </div>
</template>

<script>
import Room from './views/Room.vue';

export default {
  name: 'App',
  components: { Room },
};
</script>

<style lang="less">
@import "./less/main.less";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
