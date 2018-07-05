<template>
  <ld-content-hover style="padding: 30px 20px;">
    <h3 style="font-size: 16px; color: #272e35;">股权激励方案建议</h3>
    <p style="margin-top: 9px; font-size: 12px; color: #bddaf9;">将根据您的选择为您匹配最佳方案</p>
    <p class="ld-sider-text">{{desc}}</p>
    <div style="margin-top: 30px;" class="ld-split-line"></div>

    <div class="ld-suggest">
      <div class="ld-suggest__hd">激励工具</div>
      <div class="ld-suggest__bd">
        <ul>
          <li :class="{active: optsData[0][0]}" v-popover:popover1>股票期权</li>
          <li :class="{active: optsData[0][1]}" v-popover:popover2>限制性股票</li>
          <li :class="{active: optsData[0][2]}" v-popover:popover3>员工入股</li>
        </ul>
      </div>
    </div>

    <div class="ld-suggest">
      <div class="ld-suggest__hd">持股方式</div>
      <div class="ld-suggest__bd">
        <ul>
          <li :class="{active: optsData[1][0]}" v-popover:popover4>股票期权(境内)</li>
          <li :class="{active: optsData[1][1]}" v-popover:popover5>直接持股(境外)</li>
          <li :class="{active: optsData[1][2]}" v-popover:popover6>间接持股</li>
        </ul>
      </div>
    </div>

    <div class="ld-suggest">
      <div class="ld-suggest__hd">授予频次</div>
      <div class="ld-suggest__bd">
        <ul>
          <li :class="{active: optsData[2][0]}" v-popover:popover7>一次性授予</li>
          <li :class="{active: optsData[2][1]}" v-popover:popover8>分批授予</li>
        </ul>
      </div>
    </div>

    <el-popover
      ref="popover1"
      placement="top-start"
      width="480"
      trigger="hover">
      <div style="width: 100%; height: 300px; background-color: #ebf4fc;"></div>
    </el-popover>
    <el-popover
      ref="popover2"
      placement="top-start"
      width="480"
      trigger="hover">
      <div style="width: 100%; height: 300px; background-color: #ebf4fc;"></div>
    </el-popover>
    <el-popover
      ref="popover3"
      placement="top-start"
      width="480"
      trigger="hover">
      <div style="width: 100%; height: 300px; background-color: #ebf4fc;"></div>
    </el-popover>
    <el-popover
      ref="popover4"
      placement="top-start"
      width="480"
      trigger="hover">
      <div style="width: 100%; height: 300px; background-color: #ebf4fc;"></div>
    </el-popover>
    <el-popover
      ref="popover5"
      placement="top-start"
      width="480"
      trigger="hover">
      <div style="width: 100%; height: 300px; background-color: #ebf4fc;"></div>
    </el-popover>
    <el-popover
      ref="popover6"
      placement="top-start"
      width="480"
      trigger="hover">
      <div style="width: 100%; height: 300px; background-color: #ebf4fc;"></div>
    </el-popover>
    <el-popover
      ref="popover7"
      placement="top-start"
      width="480"
      trigger="hover">
      <div style="width: 100%; height: 300px; background-color: #ebf4fc;"></div>
    </el-popover>
    <el-popover
      ref="popover8"
      placement="top-start"
      width="480"
      trigger="hover">
      <div style="width: 100%; height: 300px; background-color: #ebf4fc;"></div>
    </el-popover>
  </ld-content-hover>
</template>

<script>
import localDb from '../../db.js'
import {LdContentHover} from '../content'

export default {
  props: {
    desc: {
      type: String,
    },
    opts: {
      type: Array
    }
  },
  data () {
    return {
        optsData: this.opts
    }
  },
  mounted () {
  },
  components: {
    LdContentHover
  },
  methods: {
      changeOption(opts){
          localDb.set('opts', opts)
          this.optsData = opts

      }
  }
}
</script>

<style lang="less">
@import '../variables.less';
@import '../mixins.less';

.ld-sider-text {
  position: relative;
  margin-top: 15px;
  font-size: 14px;
  color: #52575d;
  height: 95px;
  overflow-y: auto;
  .wrap();
}
</style>
