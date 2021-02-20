<template>
  <form class="form">
    <div class="input-group">
      <input id="room" class="input required" data-wd="roomname" />
      <label class="label user">Meeting name</label>
      <p class="error-text">
        <i data-icon="warning" />
        Please enter a meeting name.
      </p>
    </div>

    <div class="input-group">
      <input id="user" class="input" data-wd="username" />
      <label class="label user">Your name</label>
    </div>

    <button class="enter-btn" data-wd="enterroom"></button>
  </form>
</template>

<script>
export default {
  name: 'RoomForm',
};
</script>

<style lang="scss" scoped>
@import "../../sass/mixins.scss";

.form {
  height: 10rem;
  width: 100%;
  margin: 2rem 0 0 0;

  @include for-size(smartphones-portrait) {
    max-width: calc(100% - 6rem);
    margin: 2rem 3rem 0 2.4rem;
  }
}

.input-group {
  height: 50%;
  border-bottom: solid 1px #434d5a;
}

.input {
  position: absolute;
  left: 1.2rem;
  width: 23.3rem;
  background: none;
  color: #fff;
  font-size: 1.6rem;
  border: none;
  outline: none;
  text-shadow: #000 .1rem .1rem 1.2rem;
  z-index: 100;

  @include for-size(smartphones-portrait) {
    position: fixed;
    left: 0;
    font-size: 1.4rem;
    width: calc(100% - 18rem);
  }

  @include for-size(smartphones-landscape) {
    font-size: 1.4rem;
  }
}

.label {
  position: relative;
  bottom: 0;
  left: .8rem;
  width: 100%;
  color: #fff;
  font-size: 1.6rem;
  font-weight: normal;
  text-align: left;
  line-height: 5.7rem;
  transition: all .5s;

  &.visited {
    font-size: 1.2rem;
  }
}

.room {
  &.visited {
    left: 27.8rem;
    color: #748393;

    @include for-size(smartphones-portrait) {
      left: calc(100% - 8rem);
    }
  }
}

.error-text {
  display: block;
  position: relative;
  bottom: 4.5rem;
  width: 100%;
  margin: 0 35.6rem 0 0;
  padding: 0;
  border-bottom: solid 1px #ed5654;
  font-size: 1.6rem;
  color: #ed5654;
  opacity: 0;
  line-height: 3.8rem;

  @include for-size(smartphones-portrait) {
    margin: 0;
    font-size: 1.2rem;
  }

  @include for-size(smartphones-landscape) {
    font-size: .9rem;
  }
}

.user {
  &.visited {
    color: #748393;
    left: 29.6rem;

    @include for-size(smartphones-portrait) {
      left: calc(100% - 6rem);
    }
  }
}

.enter-btn {
  position: absolute;
  top: calc(50% - 2.5rem);
  right: -8.2rem;
  width: 5rem;
  height: 5rem;
  padding: 0;
  margin-left: 0;
  background: #0099cc;
  background-image: url(../assets/ctaarrow-white@2x.png);
  background-size: 1.25rem 2.1rem;
  background-repeat: no-repeat;
  background-position: center;
  border: 0;
  border-radius: 0;
  opacity: .7;
  transition: width .5s ease-out, opacity .5s;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }

  @include for-size(smartphones) {
    postion: fixed;
    right: 0;
  }
}
</style>
