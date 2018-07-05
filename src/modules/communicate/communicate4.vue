<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <ld-content :height="1300">
    <ld-content-main>
      <ld-stepline :step="step"></ld-stepline>

      <div class="ld-table">
        <div class="ld-table-title">
          <h2 class="title">股权激励机制建议</h2>
          <div class="line"></div>
          <h5 class="title">公司信息</h5>
        </div>

        <table style="width: 100%;">
          <colgroup>
            <col width="33.333%" />
            <col width="33.333%" />
            <col width="33.333%" />
          </colgroup>
          <tr class="stdh f12 grey"><th>注册地</th><th>(规划)上市地</th><th>发展阶段</th></tr>
          <tr class="stdh f16 bg-grey primary bold center"><td>中国境内</td><td>计划在中国境外上市</td><td>A轮</td></tr>
        </table>

        <div class="ld-table-title">
          <p class="suggest-title">基于上述公司信息，我们建议如下股权激励机制</p>
          <img src="../../assets/images/arrow_down.png"/>
          <table style="width: 100%;">
            <colgroup>
              <col width="33.333%" />
              <col width="33.333%" />
              <col width="33.333%" />
            </colgroup>
            <tr class="stdh f16 bg-grey bold center">
              <td :class="{'active': suggestId === 1}" @click="changeSuggest(1)" v-on:mouseenter="changeSuggest(1)">激励工具</td>
              <td :class="{'active': suggestId === 2}" @click="changeSuggest(2)" v-on:mouseenter="changeSuggest(2)">持股方式</td>
              <td :class="{'active': suggestId === 3}" @click="changeSuggest(3)" v-on:mouseenter="changeSuggest(3)">授予频率</td>
            </tr>
          </table>
        </div>
        <template v-for="suggest in suggestList">
          <div class="suggest-button" v-show="suggestId === suggest.suggestId">
            <template v-for="buttonItem in suggest.buttonList">
              <template v-if="buttonItem.isShow">
                <el-radio v-if="suggest.suggestId === 1" @click="setTypeInfo(suggest.suggestId, buttonItem.id)" v-model="toolTypeId" class="suggest-button-item" :label="buttonItem.id">{{buttonItem.name}}</el-radio>
                <el-radio v-else-if="suggest.suggestId === 2" @click="setKeepType(buttonItem.id)" v-model="keepTypeId" class="suggest-button-item" :label="buttonItem.id">{{buttonItem.name}}</el-radio>
                <el-radio v-else v-model="grantTypeId" @click="setGrantType(buttonItem.id)" class="suggest-button-item" :label="buttonItem.id">{{buttonItem.name}}</el-radio>
              </template>
            </template>
          </div>

          <div class="suggest-video" v-show="suggestId === suggest.suggestId">
            <video :poster="suggest.suggestVideoImg"><source :src="suggest.suggestVideoUrl" type="video/mp4">Your browser does not support the video tag.</video>
            <div class="video-play">
              <img src="../../assets/images/play.png"/>
            </div>
          </div>
        </template>

        <div class="ld-suggest-lint">
          <div class="download"><img src="../../assets/images/download.png"/>&nbsp;&nbsp;股权激励计划模板</div>
          <div>公司内已有有效计划者可忽略</div>
        </div>
      </div>

      <div style="margin-top: 40px; text-align: center;">
        <router-link class="ld-btn ld-btn-primary" to='/design/d1'>重新设定方案机制</router-link>
        <a class="ld-btn ld-btn-primary" @click="finishDesign()">设定授予数量</a>
      </div>
    </ld-content-main>
  </ld-content>
</template>

<script>
import {LdContent} from '../../components/content'
import LdCompanyInfo from '../../components/company'
import LdSider from '../../components/rsider'
import localDb from '../../db.js'
import plan from '../../services/plan'

export default {
  components: {
    LdContent,
    LdCompanyInfo,
    LdSider
  },
  data () {
    return {
      step: 4,
      suggestId: 1,
      suggestList: [],
      //激励工具
      toolTypeList: [],

      //持股方式
      keepTypeList: [],

      //授予方式
      grantTypeList: [],

      //opts的值
      opts: [],

      //激励工具ID
      toolTypeId: 0,

      //持股方式ID
      keepTypeId: 0,

      //授予方式ID
      grantTypeId: 0
    }
  },
  mounted () {
      this.opts = localDb.get('opts')
      this.toolTypeList = [
          {id: 1, name: '股票期权', isShow: this.opts[0][0]},
          {id: 2, name: '限制性股票', isShow: this.opts[0][1]},
          {id: 3, name: '员工入股', isShow: this.opts[0][2]}
      ]
      this.keepTypeList = [
          {id: 1, name: '股票期权(境内)', isShow: this.opts[1][0]},
          {id: 2, name: '股票期权(境外)', isShow: this.opts[1][1]},
          {id: 3, name: '间接持股', isShow: this.opts[1][2]}
      ]
      this.grantTypeList = [
          {id: 1, name: '一次性授予', isShow: this.opts[2][0]},
          {id: 2, name: '分批授予', isShow: this.opts[2][1]}
      ]

      this.suggestList= [
          {
              suggestId: 1,
              suggestMemo: "与激励对象签订协议，赋予激励对象在<strong>未来的某段时间</strong>，以<strong>协议中规定的价格</strong>购买<strong>一定数量公司股票的权利</strong>",
              buttonList: this.toolTypeList,
              suggestVideoImg: require('../../assets/images/video/video_tpl1.png'),
              suggestVideoUrl: 'http://cdn.oceanover.top/video13.mp4'
          },
          {
              suggestId: 2,
              suggestMemo: "持股方式",
              buttonList: this.keepTypeList,
              suggestVideoImg: require('../../assets/images/video/video_tpl2.png'),
              suggestVideoUrl: 'http://cdn.oceanover.top/video13.mp4'
          },
          {
              suggestId: 3,
              suggestMemo: "授予频率",
              buttonList: this.grantTypeList,
              suggestVideoImg: require('../../assets/images/video/video_tpl3.png'),
              suggestVideoUrl: 'http://cdn.oceanover.top/video13.mp4'
          }
      ]

      for(this.toolTypeId = 0; this.toolTypeId < 3; ++this.toolTypeId){
          if(this.opts[0][this.toolTypeId - 1]) break;
      }
      for(this.keepTypeId = 0; this.keepTypeId < 3; ++this.keepTypeId){
          if(this.opts[1][this.keepTypeId - 1]) break;
      }
      for(this.grantTypeId = 0; this.grantTypeId < 2; ++this.grantTypeId){
          if(this.opts[2][this.grantTypeId - 1]) break;
      }
  },
  methods: {
      changeSuggest(suggestId){
          this.suggestId = suggestId
      },
      finishDesign(){
          let areaId = localDb.get('areaId')
          let stockZoneId = localDb.get('stockZoneId')
          let roundId = localDb.get('roundId')


          //判断用户是否登录
          let userInfo = localDb.get('userinfo')
          if(!userInfo){
              this.$router.push({path: '/login'})
              return
          }

          let comanyId = 0
          if(userInfo.has_company){
              comanyId = userInfo.company_info.c_id
          }

          //添加方案数据
          let newPlanData = {company_id: comanyId, 'reg_zone': areaId, stock_zone: stockZoneId, round_id: roundId, tool_type: this.toolTypeId, keep_type: this.keepTypeId, grant_type: this.grantTypeId}

          console.log('创建方案数据')
          console.log(newPlanData)

          let that = this
          plan.create(newPlanData).then(function (res) {
              console.log(res)
              if(res.retCode){
                  that.$message(res.errMsg)
              }else{
                  localDb.set('planId', res.data.plan_id)
                  that.$router.push({path: '/grant'});
              }
          }).catch(function (err) {
              console.log('添加方案信息请求异常', err)
          })
      },
      setTypeInfo(type,typeId){
          switch (type){
              case 1:
                  this.toolTypeId = typeId
                  break
              case 2:
                  this.keepTypeId = typeId
                  break
              default:
                  this.grantTypeId = typeId
                  break
          }
      }
  }
}
</script>

<style lang="less">
@import '../../components/variables.less';
@import '../../components/mixins.less';

.ld-table {
  .ld-table-title{
    text-align: center;
    .line {
      width: 60px;
      border-bottom: 2px solid #ff4f51;
      transform-origin: 0 100%;
      -webkit-transform: scaleY(0.5);
      margin: 20px auto;
    }
    .suggest-title{
      display: block;
      margin-top: 80px;
      margin-bottom: 20px;
    }
    table{
      margin-top: 20px;
      tr{
        td.active{
          color: white;
          background-color: #52575d;
        }
      }
    }
  }
  .suggest-button{
    text-align: center;
    margin: 30px auto;
    .suggest-button-item{
      width: auto;
      height: 40px;
      line-height: 40px;
      border: solid 1px gray;
      padding: 0px 10px;
    }
  }
  .suggest-video{
    position: relative;
    height: 600px;
    video{
      width: 100%;
      height: 100%;
    }
    .video-play{
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0px;
      left: 0px;
      text-align: center;
      background-color: #bbd9f9;
      z-index: 10;
      opacity: 0.3;
      img{
        height: 40px;
        margin-top: 25%;
      }
    }
  }
  .ld-suggest-lint{
    text-align: center;
    font-size: 13px;
    margin-top: 50px;
    .download{
      color: #ff4f51;
      height: 20px;
      margin-bottom: 15px;
      img{
        height: 14px;
        margin-top: 3px;
      }
    }
  }
  &+.ld-table {
    margin-top: 20px;
  }
  table {
    margin-top: 30px;
    border-collapse: collapse;
    border-spacing: 0;
    th { font-weight: normal; }
    tr {
      &.stdh {
        height: 45px;
      }
      &.bold {
        th, td {
          font-weight: 520;
        }
      }
      &.grey {
        th, td {
          color: @color-text-secondary;
        }
      }
      &.bg-grey {
        th, td {
          background-color: #eaebeb;
        }
      }
      &.primary {
        th, td {
          color: @color-primary;
        }
      }
      &.center {
        th, td {
          text-align: center;
        }
      }
      &.f12 {
        th, td {
          font-size: 12px;
        }
      }
      &.f16 {
        th, td {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
