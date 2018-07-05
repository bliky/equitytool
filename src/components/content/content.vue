<template>
  <div class="ld-content" :style="`height: ${height=='auto'?'auto':height+'px'}`">
  	<slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    height: {
      type: String,
      default: '500'
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

.ld-content {
  width: @main-width;
  height: 500px;
  margin: 20px auto;
  overflow: hidden;
}
</style>
