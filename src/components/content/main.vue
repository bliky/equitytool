<template>
  <div class="ld-content-main" :class="{'is-full': full}">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    full: Boolean,
    height: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      stepWidth: 0
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

.ld-content-main {
  height: 100%;
  overflow: hidden;
  &:not(.is-full) {
    width: 784px;
    float: left;
  }
}
</style>
