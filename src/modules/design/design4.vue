<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <ld-content :height="1350">
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
          <tr class="stdh f16 bg-grey primary bold center">
            <td>{{areaId | filterCompanyRegarea}}</td>
            <td>{{stockZoneId | filterCompanyStockarea}}</td>
            <td>{{roundId | filterCompanyExpround}}</td>
          </tr>
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
          <div class="download" @click.stop="handleOnClickDownloadPlanTpl">
            <img src="../../assets/images/download.png"/>&nbsp;&nbsp;股权激励计划模板
          </div>
          <div>公司内已有有效计划者可忽略</div>
        </div>
      </div>

      <div style="margin-top: 40px; text-align: center;">
        <router-link class="ld-btn ld-btn-primary" to='/design/d1'>重新设定方案机制</router-link>
        <a class="ld-btn ld-btn-primary" @click="finishDesign()">设定授予数量</a>
      </div>
    </ld-content-main>

    <!-- 下载股权激励计划模板弹窗 -->
    <el-dialog width="400px" :visible.sync="dialogDownloadPlanTplVisible"  custom-class="ld-plan-dialog">
      <div class="ld-input-min">
        <el-form>
          <p style="color: #FF4F51; font-size: 11px;">*请完善以下信息，方便我们更好地为您服务</p>
          <div class="ld-form-groups">
            <div class="ld-form-group">
              <div class="ld-form-group__hd">
                可授予股权激励总量
              </div>
              <div class="ld-form-group__bd">
                <el-row :gutter="10">
                  <el-col :span="24">
                    <el-input v-model="percent" placeholder="本计划下可用于股份激励的股份数占总股本比例"><span slot="suffix">%</span></el-input>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="ld-form-group">
              <div class="ld-form-group__hd">
                涉及股份的来源
              </div>
              <div class="ld-form-group__bd">
                <el-row :gutter="10">
                  <el-col :span="24">
                    <el-select v-model="source_type" placeholder="选择股份来源">
                      <el-option label="增发" value="1"></el-option>
                      <el-option label="转让" value="2"></el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <el-button @click.stop="handleOnClickDownloadPlanTplDialogSubmit" style="margin-top: 20px;" type="primary" size="small" round>下载股权激励计划模板</el-button>
        </el-form>
      </div>
    </el-dialog>

    <ld-capital-dialog ref="capitalDialog" :next-step="createPlan"></ld-capital-dialog>
  </ld-content>
</template>

<script>
import {LdContent} from '../../components/content'
import LdCompanyInfo from '../../components/company'
import LdSider from '../../components/rsider'
import {LdCapitalDialog} from '../../components/dialog'
import localDb from '../../db.js'
import plan from '../../services/plan'
import company from '../../services/company'
import {filterCompanyRegarea, filterCompanyStockarea, filterCompanyExpround} from '../../filters/company'
import {error, loading} from '../../common/notify'

export default {
  components: {
    LdContent,
    LdCompanyInfo,
    LdSider,
    LdCapitalDialog
  },
  filters: {
    filterCompanyRegarea,
    filterCompanyStockarea,
    filterCompanyExpround
  },
  data () {
    return {
      user: localDb.get('userinfo'),
      company: {},
      has_noticed: false,
      dialogDownloadPlanTplVisible: false,
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
      areaId: localDb.get('areaId'),
      stockZoneId: localDb.get('stockZoneId'),
      roundId: localDb.get('roundId'),
      //激励工具ID
      toolTypeId: 0,

      //持股方式ID
      keepTypeId: 0,

      //授予方式ID
      grantTypeId: 0,
      percent: '', // 股权激励占比
      source_type: ''  // 股份来源
    }
  },
  created () {
    let load = loading(this, '数据加载中...')
    company.get().then(data => {
      this.company = data.data[0]
      this.saveCompany(this.company)
      this.has_noticed = this.company.c_has_noticed=='1'?true:false
      load.close()
    }).catch(err=>{
      error('获取公司信息失败')
      load.close()
    })
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
    saveCompany (company) {
      let userInfo = localDb.get('userinfo')
      userInfo.company_info = company
      localDb.set('userinfo', userInfo)
    },
    clearLocalStorage () {
      localDb.remove('areaId')
      localDb.remove('keepTypeId')
      localDb.remove('opts')
      localDb.remove('planId')
      localDb.remove('roundId')
      localDb.remove('stockZoneId')
      localDb.remove('stock_val')
      localDb.remove('toolTypeId')
      localDb.remove('cap_currency')
      localDb.remove('cap_val')
    },
    handleOnClickDownloadPlanTpl () {
      this.dialogDownloadPlanTplVisible = true
    },
    handleOnClickDownloadPlanTplDialogSubmit () {
      plan.downtpl({
        tool_type: this.toolTypeId,
        reg_zone: this.areaId,
        stock_zone: this.stockZoneId,
        percent: this.percent,
        source_type: this.source_type
      }).then(data => {
        window.location = data.data.file_path
        this.dialogDownloadPlanTplVisible = false
      })
    },
    changeSuggest (suggestId) {
      this.suggestId = suggestId
    },
    createPlan () {
      let load = loading(this, '授予数量加载中...')
      let areaId = this.areaId
      let stockZoneId = this.stockZoneId
      let roundId = this.roundId
      let _csrf_token = localDb.get('csrf-token')
      //data = Object.assign({}, data, {'_csrf-api': _csrf_token})
      //添加方案数据
      let newPlanData = {company_id: this.company.c_id, 'reg_zone': areaId, stock_zone: stockZoneId, round_id: roundId, tool_type: this.toolTypeId, keep_type: this.keepTypeId, grant_type: this.grantTypeId, '_csrf-api':_csrf_token}

      plan.create(newPlanData).then(res => {
        this.clearLocalStorage()
        load.close()
        if (res.data.jump == '1') {
          this.$confirm(res.data.tips, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            this.$router.push('/grant/' + res.data.p_id)
          }).catch(() => {
            info('取消跳转')         
          })
        } else {
          this.$router.push('/grant/' + res.data.p_id)
        }
      })
    },
    finishDesign () {
      // 读取本地存储的用户信息，若没有，则跳转登录页
      if (!this.user) {
        this.$router.push({path: '/login', query: { redirect: '/design/d4' }})
        return
      }

      // 判断授予情况，有授予，弹出股改弹窗
      if (this.has_noticed) {
        this.$refs.capitalDialog.setCompany(this.company)
        this.$refs.capitalDialog.show()
      } else {
        this.createPlan()
      }
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
    margin-top: 40px;
   
    .line {
      width: 60px;
      border-bottom: 2px solid #ff4f51;
      transform-origin: 0 100%;
      -webkit-transform: scaleY(0.5);
      margin: 30px auto;
    }
    
    
    .suggest-title{
      display: block;
      margin-top: 60px;
      margin-bottom: 20px;
    }
    table{
      margin-top: 20px;
      
      tr{
        td.active{
          color: #272E35;
          background-color: #ebf4fc;
          font-weight: 600;
        }
      }
      
    }
  }
  
  .suggest-button{
    text-align: center;
    /*margin: 90px auto;*/
   height: 90px;
   margin-top: 1px;
    background-color: #ebf4fc;
    color: #FFFFFF;
    font-c
    /*opacity: 0.3;*/

    .suggest-button-item{
      width: auto;
      margin-top: 30px;
      float: left;
      margin-left: 40px;
      height: 30px;
      line-height: 30px;
      border: solid 1px #7DB8F6;
   
      background-color: #7DB8F6;
      padding: 0px 16px;
    }
  }

  .suggest-video{
    position: relative;
    height: 600px;
    padding-bottom: 20px;
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
      background-color: #ebf4fc;
      z-index: 10;
      opacity: 0.5;
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
      cursor: pointer;
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
    border-collapse: collapse;
    border-spacing: 0;
    margin-top: 15px;
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
          font-size: 13px;
          background-color: #FFFFFF;
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
