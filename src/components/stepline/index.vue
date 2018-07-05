<template>
  <div class="ld-stepline-wrapper">
    <div class="ld-stepline">
      <ul class="ld-steps" ref="steps">
        <li class="ld-step" :class="`${step==1?'active':''}`">
          <span class="ld-steptext">注册地</span>
        </li>
        <li class="ld-step" :class="`${step==2?'active':''} ${step==3?'active2':''}`">
          <span class="ld-steptext">规划（上市地）</span>
          <span class="ld-steptext2">发展阶段</span>
        </li>
      </ul>
      <div class="ld-stepline-inner" style="display:none;" :style="{width: ((step-1)*100/2)+'%'}"></div>
      <div class="ld-stepline-point" :style="{left: (-16 + (step-1)*stepWidth)+'px'}"></div>
    </div>
<!--     <div class="ld-center-x"></div>
    <div class="ld-center-y"></div> -->
  </div>
</template>

<script>
export default {
  props: {
    step: {
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
    this.stepWidth = this.$refs.steps.offsetWidth / 2
  },
  components: {
  },
  methods: {
  }
}
</script>

<style lang="less">
@import '../variables.less';
@import '../mixins.less';

@stepline-icon-width: 32px;
@stepline-icon-height: 32px;

.ld-stepline-wrapper {
  height: 52px;
  width: 542px;
  margin: 0 auto;
  position: relative;
  margin-top: 30px;
  padding-top: 20px;
  .ld-stepline {
    position: absolute;
    left: 16px;
    right: 16px;
    top: 36px;
    height: 4px;
    background-color: #dfe0e1;
    ul.ld-steps {
      .flexbox();
      li.ld-step {
        .flexitem();
        position: relative;
        &.active {
          .ld-steptext {
            color: @color-primary;
          }
          &:before {
            background-color: @color-primary;
          }
        }
        &.active2:last-child {
          .ld-steptext2 {
            color: @color-primary;
          }
          &:after {
            background-color: @color-primary;
          }
        }
        &:last-child {
          &:after {
            content: ' ';
            position: absolute;
            top: -3px;
            right: -5px;
            display: inline-block;
            height: 10px;
            width: 10px;
            border-radius: 50%;
            background-color: #dfe0e1;
          }
        }
        .ld-steptext {
          font-size: 13px;
          color: @color-text-secondary;
          position: absolute;
          top: -34px;
          left: -5px;
          transform: translateX(-50%);
        }
        .ld-steptext2 {
          font-size: 13px;
          color: @color-text-secondary;
          position: absolute;
          top: -34px;
          right: -5px;
          transform: translateX(50%);
        }
        &:before {
          content: ' ';
          position: absolute;
          top: -3px;
          left: -5px;
          display: inline-block;
          height: 10px;
          width: 10px;
          border-radius: 50%;
          background-color: #dfe0e1;
        }
      }
    }
  }
  .ld-stepline-inner {
    position: absolute;
    left: 0px;
    width: 0;
    top: 0px;
    height: 4px;
    background-color: @color-primary;
  }
  .ld-stepline-point {
    position: absolute;
    z-index: 100;
    width: 32px;
    height: 32px;
    left: -16px;
    top: -14px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 32px 32px;
    background-image: url(../../assets/images/piont.png);
  }
  .ld-center-x {
    position: absolute;
    top: 0;
    left: 50%;
    height: 100%;
    border-left: dotted 1px @color-primary;
  }
  .ld-center-y {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    border-top: dotted 1px @color-primary;
  }
}
</style>
