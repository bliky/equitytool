<template>
  <div class="ld-page" :class="{fullscreen: fullscreen}">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    fullscreen: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  components: {
  },
  methods: {
  }
}
</script>

<style lang="less">
@import '../variables.less';

body, .ld-page {
  background-color: @color-bg;
}

.fullscreen {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
