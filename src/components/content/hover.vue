<template>
  <div ref="hover" class="ld-hover" :class="{hover: isHover}">
    <slot></slot>
  </div>
</template>

<script>
import mousewheel from '../../common/mousewheel'

export default {
  data () {
    return {
      isHover: false
    }
  },
  mounted () {
    //this.hover(true)
    this.scrollEventBind()
  },
  methods: {
    scrollEventBind () {
      console.log('mousewheel', mousewheel)
      mousewheel.bind(window, (event, normalized)=>{
        console.log('滚轮滚动', event, normalized)
      })
    },
    hover(h) {
      this.isHover = h || false
    }
  }
}
</script>

<style lang="less">
@import '../variables.less';

.ld-hover {
  width: 320px;
  float: left;
  background-color: #ebf4fc;
  height: 100%;
  &.hover {
    position: fixed;
    top: 200px;
    height: auto;
  }
}
.ld-content-main + .ld-hover {
  margin-left: 16px;
}
</style>
