<template>
  <div class="ld-stepbar-wrapper">
    <ul class="ld-stepbar">
      <li :class="`${step==1 ? 'active' : ''}`"><i class="ld-icon ld-icon-xcfajz"></i><p>{{step1Text}}</p><div class="bot"><div class="line"></div></div></li>
      <li :class="`${step==2 ? 'active' : ''}`"><i class="ld-icon ld-icon-qdsysl"></i><p>{{step2Text}}</p><div class="bot"><div class="line"></div></div></li>
      <li :class="`${step==3 ? 'active' : ''}`"><i class="ld-icon ld-icon-yxldss"></i><p>{{step3Text}}</p><div class="bot"><div class="line"></div></div></li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    step: {
      type: Number,
      default: 1
    },
    step1Text: {
      type: String,
      default: '形成方案机制'
    },
    step2Text: {
      type: String,
      default: '确定授予数量'
    },
    step3Text: {
      type: String,
      default: '方案落地实施'
    }
  },
  data () {
    return {
      s: 1
    }
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

@stepbar-icon-width: 46px;
@stepbar-icon-height: 32px;

.ld-stepbar-wrapper {
  height: 120px;
  border-bottom: solid 1px #d1d5da;
  box-shadow: 0 1px 1px rgba(0,0,0,0.075);
  ul.ld-stepbar {
    width: 912px;
    height: 100%;
    overflow: hidden;
    margin: 0 auto;
    li {
      float:left;
      text-align: center;
      width: 33.3333%;
      height: 100%;
      padding-top: 23px;
      position: relative;
      .bot{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        display: none;
        .line {
          width: 180px;
          margin: 0 auto;
          position: relative;
          &:after {
            .setBottomLine(@color-red2, 5px);
          }
        }
      }
      p {
        margin-top: 15px;
        font-size: @font-size-normal;
        color: @color-text;
      }
      &.active {
        p {
          color: @color-primary;
        }
        .bot {
          display: block;
        }
        .ld-icon-xcfajz {
          background-image: url(../../assets/images/icon_xcfajz_selected.png);
        }
        .ld-icon-qdsysl {
          background-image: url(../../assets/images/icon_qdsysl_selected.png);
        }
        .ld-icon-yxldss {
          background-image: url(../../assets/images/icon_yxldss_selected.png);
        }
      }
    }
  }
  background-color: #EBF4FC;
}

.ld-icon {
  display: inline-block;
  width: @stepbar-icon-width;
  height: @stepbar-icon-height;
  background-size: @stepbar-icon-width @stepbar-icon-height;
  background-repeat: no-repeat;
  background-position: center;
  &.ld-icon-xcfajz {
    background-image: url(../../assets/images/icon_xcfajz.png);
  }
  &.ld-icon-qdsysl {
    background-image: url(../../assets/images/icon_qdsysl.png);
  }
  &.ld-icon-yxldss {
    background-image: url(../../assets/images/icon_yxldss.png);
  }
}
</style>
