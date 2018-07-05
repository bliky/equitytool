<template>
<el-dialog :visible.sync="dialogVisible" :show-close="false" :custom-class="'ld-grant-dialog'+ (planType==1?'':' min')">
  <div class="ld-grant-add ld-input-min">
    <el-form class="ld-l" style="overflow-y: auto;">
      <p style="color: #FF4F51; font-size: 11px;">*请完善以下信息，方便我们更好地为您服务</p>
      <div class="ld-form-groups">
        <div class="ld-form-group">
          <div class="ld-form-group__hd">
            个人信息
          </div>
          <div class="ld-form-group__bd">
            <el-row>
              <el-col :span="12">
                <el-input v-model="editGrant.grant_name"><span slot="prepend">姓名</span></el-input>
              </el-col>
              <el-col :span="12">
                <el-select @change="handleOnStuffIdChange" v-model="editGrant.staff_id" placeholder="请选择岗位">
                  <span slot="prefix">岗位</span>
                  <el-option
                    v-for="(item, key) in OPTS_STAFF_TYPE"
                    :key="key"
                    :label="item"
                    :value="key">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-input v-model="editGrant.grant_email"><span slot="prepend">邮箱</span></el-input>
              </el-col>
              <el-col :span="12">
                <div class="ld-readonly">
                  <span class="ld-readonly__hd">ID</span>
                  <span class="ld-readonly__bd">{{userID}}</span>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-input v-model="editGrant.grant_rate">
                  <div slot="prepend">授予比例<div class="ld-signalbars" :class="`s${grantRatioLevel}`"><span class="ld-signalbar ld-signalbar1"></span><span class="ld-signalbar ld-signalbar2"></span><span class="ld-signalbar ld-signalbar3"></span></div></div>
                  <span slot="append">%</span>
                </el-input>
              </el-col>
              <el-col :span="12">
                <div class="ld-readonly">
                  <span class="ld-readonly__hd">授予股数</span>
                  <span class="ld-readonly__bd">{{editGrant.grant_stock|currency-format('0,0')}}</span>
                  <span class="ld-readonly__ft">股</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>

        <div class="ld-form-group">
          <div class="ld-form-group__hd">
            行权价规则
          </div>
          <div class="ld-form-group__bd">
            <el-row>
              <el-col :span="24">
                <el-select v-model="editGrant.strike_type" placeholder="请选择行权规则" @change="handleOnStrikeTypeChange">
                  <el-option
                    v-for="(item, key) in OPTS_STRIKE_TYPE"
                    :key="key"
                    :label="item"
                    :value="key">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
            <!-- 按最近一轮融资估值 -->
            <el-row v-if="editGrant.strike_type=='1'">
              <el-col :span="8">
                <div class="ld-readonly">
                  <span class="ld-readonly__hd">每股估值</span>
                  <span class="ld-readonly__bd">{{capValPerStock|currency-format('0,0.00')}}</span>
                  <span class="ld-readonly__ft">元</span>
                </div>
              </el-col>
              <el-col :span="8" style="padding-left:0;">
                <div style="overflow:hidden;"><span style="float:left; width:20px;text-align:center;height:30px;line-height:30px;"><i class="el-icon-close"></i></span><div style="margin-left: 20px;">
                <el-input v-model="editGrant.strike_val" placeholder="占比">
                  <span slot="append">%</span>
                </el-input></div></div>
              </el-col>
              <el-col :span="8" style="padding-left:0;">
                <div>
                  <span style="float:left; width:20px;text-align:center;height:30px;line-height:30px;font-size:22px;">=</span>
                  <div class="ld-readonly" style="margin-left: 20px;">
                    <span class="ld-readonly__hd">行权价</span>
                    <span class="ld-readonly__bd">{{editGrant.strike_price|currency-format('0,0.000')}}</span>
                    <span class="ld-readonly__ft">元/股</span>
                  </div>
                </div>
              </el-col>
            </el-row>
            <!-- 按最近一个财年净资产 -->
            <el-row v-if="editGrant.strike_type=='2'">
              <el-col :span="4">
                <el-select v-model="editGrant.strike_currency" placeholder="币种">
                  <el-option
                    v-for="(item, key) in OPTS_CURRENCY"
                    :key="key"
                    :label="item"
                    :value="key">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="11">
                <div>
                  <div style="float:left; width: 100px;">
                    <el-input placeholder="净资产" v-model="editGrant.net_val"></el-input>
                  </div>
                  <div style="margin-left: 100px;">
                    <span style="float:left; width:20px;text-align:center;height:30px;line-height:30px;font-size:22px;">÷</span>
                    <div class="ld-readonly" style="margin-left: 20px;">
                      <span class="ld-readonly__hd">总股本</span>
                      <span class="ld-readonly__bd">{{company.c_stock_val|currency-format('0,0')}}</span>
                      <span class="ld-readonly__ft">股</span>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="3" style="padding-left:0;">
                <div style="overflow:hidden;">
                  <span style="float:left; width:20px;text-align:center;height:30px;line-height:30px;font-size:22px;">
                    ×
                  </span>
                  <div style="margin-left: 20px;">
                    <el-input placeholder="倍数" v-model="editGrant.strike_val"></el-input>
                  </div>
                </div>
              </el-col>
              <el-col :span="6" style="padding-left:0;">
                <div>
                  <span style="float:left; width:20px;text-align:center;height:30px;line-height:30px;font-size:22px;">=</span>
                  <div class="ld-readonly" style="margin-left: 20px;">
                    <span class="ld-readonly__hd">行权价</span>
                    <span class="ld-readonly__bd">{{editGrant.strike_price|currency-format('0,0.000')}}</span>
                    <span class="ld-readonly__ft">元/股</span>
                  </div>
                </div>
              </el-col>
            </el-row>
            <!-- 按股权价值 -->
            <el-row v-if="editGrant.strike_type=='3'">
              <template v-if="company.c_nature_type == '1'">
                <el-col :span="3">
                  <el-select v-model="editGrant.strike_currency" placeholder="币种">
                    <el-option
                      v-for="(item, key) in OPTS_CURRENCY"
                      :key="key"
                      :label="item"
                      :value="key">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="7">
                  <el-input placeholder="注册资本" v-model="editGrant.reg_val"></el-input>
                </el-col>
                <el-col :span="7" style="padding-left:0;">
                  <div>
                    <span style="float:left; width:20px;text-align:center;height:30px;line-height:30px;font-size:22px;">÷</span>
                    <div class="ld-readonly" style="margin-left: 20px;">
                      <span class="ld-readonly__hd">总股本</span>
                      <span class="ld-readonly__bd">{{company.c_stock_val|currency-format('0,0')}}</span>
                      <span class="ld-readonly__ft">股</span>
                    </div>
                  </div>
                </el-col>
                <el-col :span="7" style="padding-left:0;">
                  <div>
                    <span style="float:left; width:20px;text-align:center;height:30px;line-height:30px;font-size:22px;">=</span>
                    <div class="ld-readonly" style="margin-left: 20px;">
                      <span class="ld-readonly__hd">行权价</span>
                      <span class="ld-readonly__bd">{{editGrant.strike_price|currency-format('0,0.000')}}</span>
                      <span class="ld-readonly__ft">元/股</span>
                    </div>
                  </div>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="12">
                  <span style="float:left; width:260px;text-align:right;height:30px;line-height:30px;font-size:14px; color:#94979a;">
                    股份有限公司每股价格作为行权价
                  </span>
                </el-col>
                <el-col :span="12">
                  <div>
                    <div class="ld-readonly">
                      <span class="ld-readonly__hd">行权价</span>
                      <span class="ld-readonly__bd">{{editGrant.strike_price|currency-format('0,0.000')}}</span>
                      <span class="ld-readonly__ft">元/股</span>
                    </div>
                  </div>
                </el-col>
              </template>
            </el-row>
            <!-- 零价格 -->
            <el-row v-if="editGrant.strike_type=='4'">
              <div class="ld-readonly">
                <span class="ld-readonly__hd">行权价</span>
                <span class="ld-readonly__bd">{{editGrant.strike_price|currency-format('0,0.000')}}</span>
                <span class="ld-readonly__ft">元/股</span>
              </div>
            </el-row>
          </div>
        </div>

        <div class="ld-form-group">
          <div class="ld-form-group__hd" style="position: relative;">
            <span>生效安排</span>
            <div style="position: absolute; right: 0px; top:-10px;">
              <el-input v-if="toolType=='1'" v-model="editGrant.effective_year" style="display: inline-block; width: 120px; height:20px; margin-right: 10px;" placeholder="有效时间"><span slot="suffix">年</span></el-input>
              <el-switch
                v-model="isCustDefVest"
                @change="handleOnCustDefSwitchChange"
                active-text="自定义">
              </el-switch>
            </div>
          </div>
          <div class="ld-form-group__bd">
            <el-row v-if="isCustDefVest">
              <el-col :span="24">
                <el-form>
                  <el-row v-for="(item, index) in custDefVests" style="margin-top:0;">
                    <el-form-item
                      :key="index"
                      :rules="{
                        required: true, message: '不能为空', trigger: 'blur'
                      }"
                      >
                      <el-col :span="5">
                        <div>
                          <span style="float:left; width:50px;text-align:right;font-size:14px; color:#94979a;">
                            授予满
                          </span>
                          <div style="margin-left: 60px;">
                            <div class="el-input el-input--suffix">
                              <input type="text" v-model="item.month" @keyup="handleOnCustomerVestInput" autocomplete="off" class="el-input__inner">
                              <span class="el-input__suffix" style="top: 5px;">
                                <span class="el-input__suffix-inner">
                                  <span>月</span>
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="5" style="padding-left: 0;">
                        <div>
                          <span style="float:left; width:60px;text-align:center;font-size:14px; color:#94979a;">
                            生效
                          </span>
                          <div style="margin-left: 60px;">
                            <div class="el-input el-input--suffix">
                              <input type="text" v-model="item.percent" @keyup="handleOnCustomerVestInput" autocomplete="off" class="el-input__inner">
                              <span class="el-input__suffix" style="top: 5px;">
                                <span class="el-input__suffix-inner">
                                  <span>%</span>
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="4" v-if="index > 0">
                        <div style="font-size: 22px; color:#f56c6c;">
                          <i class="el-icon-remove" style="cursor: pointer;" @click.prevent="handleOnRemoveVestSetup(item)"></i>
                        </div>
                      </el-col>
                    </el-form-item>
                  </el-row>
                  <el-row style="margin-top:0;">
                    <el-col :span="10" style="padding-left: 20px;">
                      <div style="line-height: 22px; text-align: center; color:#94979a;">
                        <i class="el-icon-circle-plus" @click.prevent="handleOnAddVestSetup" style="cursor: pointer; font-size: 22px; margin-top:4px; color: #67C23A; position:relative; top:2px;"></i>
                        <span style="margin-left: 5px; color: #f56c6c">
                          {{custDefVestTotalPercent}}%
                        </span>
                      </div>
                    </el-col>
                  </el-row>
                </el-form>
              </el-col>
            </el-row>

            <el-row v-else>
              <el-col :span="24">
                <el-select v-model="vestPlanSelVal" @change="handleOnVestSelectChange" placeholder="请选择">
                  <el-option
                    v-for="(item, key) in OPTS_VEST_PLAN"
                    :key="item.lock_tmpl"
                    :label="item.lock_des"
                    :value="key">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </div>
        </div>

        <div class="ld-form-group" v-if="planType==1">
          <div class="ld-form-group__hd">
            年化估值增长预期
          </div>
          <div class="ld-form-group__bd">
            <el-row>
              <el-col :span="24">
                <el-slider v-model="growthExpect" :max="growthExpectMax" :format-tooltip="growthExpectSliderTooltip"></el-slider>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <el-button @click="handleOnGrantSubmit" :disabled="grantSubmitDisabled" style="margin-top: 20px;" type="primary" size="small" round>保存</el-button>
    </el-form>
    <div class="ld-r" v-if="planType==1">
      <div class="ld-fiugre">
        <div class="ld-hd">
          图表分析
        </div>
        <div class="ld-bd">
          <div class="ld-plot-wrap">
            <div class="ld-t">生效安排</div>
            <div class="ld-plot">
              <ld-plot1 ref="plot1" :series="plot1Data" :total="editGrant.grant_stock" :broken="editGrant.effective_year"></ld-plot1>
            </div>
          </div>
          <div class="ld-plot-wrap">
            <div class="ld-t">预期价值</div>
            <div class="ld-plot">
              <ld-plot2 ref="plot2" :series="plot2Data" :broken="editGrant.effective_year"></ld-plot2>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</el-dialog>
</template>

<script>
import {STUFF_TYPE, STRIKE_TYPE, CURRENCY_TYPE} from '../../config/const'
import { LdPlot1, LdPlot2 } from '../graph'
import grant from '../../services/grant'
import {exceptionScript} from '../../common/exception'
import {success, error, loading} from '../../common/notify'
import currencyFormat from '../../filters/currency'
import currencyExchange from '../../common/exchange'

export default {
  props: {
  },
  components: {
    LdPlot1,
    LdPlot2
  },
  filters: {
    currencyFormat
  },
  data () {
    return {
      dialogVisible: false,
      grantSubmitDisabled: false,
      // 常量下拉选项
      OPTS_STRIKE_TYPE: STRIKE_TYPE, // 行权类型
      OPTS_CURRENCY: CURRENCY_TYPE,  // 货币类型
      OPTS_VEST_PLAN: [], // 系统预设生效方案
      // 编辑授予：用于更新授予提交的数据
      editGrant: {
        plan_item_id: '',
        grant_rate: '',
        staff_id: '',
        grant_stock: '',
        lock_schema: '',
        net_val: '',
        reg_val: '',
        strike_type: '',
        strike_val: '',
        strike_currency: '',
        strike_price: '',
        grant_email: '',
        grant_name: '',
        effective_year: ''
      },
      // 公司信息
      company: {},
      // 辅助变量
      stuffType: '', // 岗位一级分类：初始化授予数据中获取
      userID: '', // 激励对象ID
      stuffDefaultGrantRatio: {}, // 岗位二级分类授予默认比例
      grantRatioLevel: 0, // 授予比例强弱提示
      curStuffDefaultGrantRatio: 0.1, // 当前二级岗位默认授予比例
      isCustDefVest: false,  // 是否客户自定义生效规则
      custDefVests: [
        {
          month: 12,
          percent: 30
        }
      ], // 客户自定义生效规则数组
      vestPlanSelVal: '', // 生效规则系统预设选择值
      planType: '1', // 方案类型：设计与录入
      toolType: '', // 激励工具类型：股票期权，限制性股票，员工入股 grant.pi_tool_type
      grantType: '', // 授予类型
      growthExpectMax: 100, // 预期增长率最大值：仅仅用于显示
      growthExpectDef: 60, // 预期默认增长率：仅仅用于显示
      growthExpect: 60,  // 预期增长率：仅仅用于显示
      grantCapValMax: 1,  // 授予估值最大参考值：用于plot2最大截断值
      plot1Data: [],
      plot2Data: [
        [0, 0],
        [0, 0],
        [0, 0]
      ]
    }
  },
  computed: {
    // 下拉选项：岗位二级分类
    OPTS_STAFF_TYPE () {
      return STUFF_TYPE[this.stuffType]
    },
    // 公司每股估值
    capValPerStock () {
      let cap_val = this.company.c_cap_val
      let stock_val = this.company.c_stock_val
      if (stock_val==0) return 0

      return cap_val / stock_val
    },
    // 客户自定义生效总百分比
    custDefVestTotalPercent () {
      if (!this.custDefVests.length) return 0

      let total = 0
      this.custDefVests.forEach((item, index, arr) => {
        let remain = 100 - total
        let per = parseFloat(item.percent || 0)

        if (per > remain) {
          item.percent = per = remain
        }
        total += isNaN(per) ? 0 : per
      })
      return total
    },
    // 行权总额
    strikeTotalVal () {
      // 行权总额=授予股数*行权价格
      return this.editGrant.grant_stock * this.editGrant.strike_price
    }
  },
  mounted () {
  },
  watch: {
    'editGrant.grant_rate': function (val, oldVal) {
      console.log('[editGrant.grant_rate]授予比例值变化', val)
      let inVal = val
      let sysVal = this.curStuffDefaultGrantRatio
      if (sysVal==0) return 0

      let radio = inVal/sysVal

      this.calcGrantStock()

      this.grantRatioLevel = radio > 0 && radio <= 0.33 ? 1 :
             radio > 0.33 && radio <= 0.66 ? 2 :
             radio > 0.66 && radio <= 1 ? 3 :
             radio > 1 && radio <= 1.33 ? 4 :
             radio > 1.33 && radio <= 2 ? 5 :
             radio > 2 ? 6 : 0
    },
    'editGrant.grant_stock': function (val, oldVal) {
      this.paint1()
    },
    'custDefVests': function (val, oldVal) {
      this.paint1()
    },
    'editGrant.effective_year': function (val, oldVal) {
      this.$refs.plot1.setMaxYear(val)
    },
    'editGrant.net_val': function (val, oldVal) {
      this.calculateStrikePrice()
    },
    'editGrant.reg_val': function (val, oldVal) {
      this.calculateStrikePrice()
    },
    'editGrant.strike_type': function (val, oldVal) {
      this.calculateStrikePrice()
    },
    'editGrant.strike_val': function (val, oldVal) {
      this.calculateStrikePrice()
    },
    'editGrant.strike_price': function (val, oldVal) {
      this.paint2()
    },
    'growthExpect': function (val, oldVal) {
      this.paint2()
    }
  },
  methods: {
    // 获取服务器数据
    fetchDefaultGrantRatioByStuffId (id) {
      let stuff_grant_default_ratio = this.stuffDefaultGrantRatio

      if (!stuff_grant_default_ratio || stuff_grant_default_ratio[id] == undefined) {
        grant.staff({round: this.company.c_round, grant_type: this.grantType, staff_id:id})
             .then(data => {
              stuff_grant_default_ratio[id] = data.data[0].mg_value
              this.curStuffDefaultGrantRatio = stuff_grant_default_ratio[id] || 0
             })
      } else {
        this.curStuffDefaultGrantRatio = stuff_grant_default_ratio[id] || 0
      }
    },
    // 计算授予股数
    calcGrantStock () {
      this.editGrant.grant_stock = this.editGrant.grant_rate * this.company.c_stock_val / 100
    },
    // 计算行权价
    calculateStrikePrice () {
      try {
        // 计算行权价格
        let editGrant = this.editGrant
        let strike_val = editGrant.strike_val
        let cap_val = this.company.c_cap_val
        let stock_val = this.company.c_stock_val
        let cap_currency = this.company.c_cap_currency

        if (!stock_val) {
          editGrant.strike_price = 0
          return error('公司股本异常!')
        }

        if (!cap_val) {
          editGrant.strike_price = 0
          return error('公司估值异常!')
        }

        switch (this.editGrant.strike_type) {
          case '1':
            // 按最近一轮融资，每股估值
            editGrant.strike_currency = cap_currency
            editGrant.strike_price = strike_val * this.capValPerStock / 100
            break;
          case '2':
            editGrant.strike_currency = editGrant.strike_currency
            let strike_price = editGrant.net_val * strike_val / stock_val
            if (strike_price < 1e-6) {
              strike_price = 0
            }
            editGrant.strike_price = strike_price
            break;
          case '3':
            if (this.company.nature_type == '1') {
              editGrant.strike_price = editGrant.reg_val / stock_val
              editGrant.strike_currency = editGrant.strike_currency
            } else {
              editGrant.strike_price = this.capValPerStock
              editGrant.strike_currency = cap_currency
            }
            break;
          case '4':
            editGrant.strike_price = 0
            editGrant.strike_currency = cap_currency
            break;
        }
      } catch (err) {
        exceptionScript(err)
      }
    },
    calculatePlot2Data () {
      try {
        let editGrant = this.editGrant
        let strikeTotalVal = this.strikeTotalVal || 1

        let expAmp = (1+this.growthExpect / 100)
        let expAmp2 = Math.pow(expAmp, 2)
        let expAmp3 = Math.pow(expAmp, 3)
        let grantTotalCapVal = this.capValPerStock * this.editGrant.grant_stock

        console.clear()
        this.grantCapValMax = this.company.c_cap_val * this.curStuffDefaultGrantRatio * Math.pow(1 + this.growthExpectDef/100, 3) * 1.25 / 100
        console.log(this.company.c_cap_val, this.curStuffDefaultGrantRatio, this.growthExpectDef)

        let cex = currencyExchange(editGrant.strike_currency, this.company.c_cap_currency)

        /*let currency = this.company.c_cap_currency
        console.log('行权总额', CURRENCY_TOKEN[editGrant.strike_currency] + ' ' + strikeTotalVal,
                    CURRENCY_TOKEN[editGrant.strike_currency]+'=>'+CURRENCY_TOKEN[currency], cex,
                    '行权总额兑换成估值币种', strikeTotalVal * cex,
                    ' 授予股数估值', CURRENCY_TOKEN[currency] + ' ' + grantTotalCapVal,
                    ' 1年后总估值',  CURRENCY_TOKEN[currency] + ' ' + (grantTotalCapVal * expAmp),
                    ' 2年后总估值',  CURRENCY_TOKEN[currency] + ' ' + (grantTotalCapVal * expAmp2),
                    ' 3年后总估值',  CURRENCY_TOKEN[currency] + ' ' + (grantTotalCapVal * expAmp3),
                    ' 市场占比三年后最大值(参考)',  CURRENCY_TOKEN[currency] + ' ' + this.grantCapValMax
                    )*/

        strikeTotalVal = strikeTotalVal * cex
        this.plot2Data[0][0] = strikeTotalVal
        this.plot2Data[1][0] = strikeTotalVal
        this.plot2Data[2][0] = strikeTotalVal
        this.plot2Data[0][1] = grantTotalCapVal * expAmp
        this.plot2Data[1][1] = grantTotalCapVal * expAmp2
        this.plot2Data[2][1] = grantTotalCapVal * expAmp3
      } catch (err) {
        exceptionScript(err)
      }
    },
    // 绘图
    paint1 () {
      if (this.isCustDefVest) {
        this.plot1Data = this.custDefVests
      } else {
        this.plot1Data = JSON.parse(this.OPTS_VEST_PLAN[parseInt(this.vestPlanSelVal)].lock_schema)
      }
      this.$refs.plot1.paint(this.plot1Data)
    },
    paint2 () {
      this.calculatePlot2Data()
      this.$refs.plot2.paint(this.plot2Data, this.company.c_cap_currency, this.grantCapValMax)
    },
    // 事件处理
    handleOnStuffIdChange (val) {
      // 岗位下拉选项发生变化
      if (this.planType != 1) return // 录入方案不提供岗位授予默认比例

      this.fetchDefaultGrantRatioByStuffId(val)
    },
    handleOnStrikeTypeChange () {
      // 行权价规则下拉选项发生变化
    },
    handleOnCustDefSwitchChange() {
      // 生效规则用户自定义开关发生变化
      this.paint1()
    },
    handleOnRemoveVestSetup (item) {
      // 移除当前行自定义生效规则
      let index = this.custDefVests.indexOf(item)
      if (index !== -1) {
        this.custDefVests.splice(index, 1)
      }
    },
    handleOnAddVestSetup () {
      // 添加一行自定义生效规则
      this.custDefVests.push({month:parseInt(this.custDefVests[this.custDefVests.length-1].month)+12, percent:10})
    },
    handleOnCustomerVestInput () {
      // 用户自定义输入值变化
      this.paint1()
    },
    handleOnVestSelectChange () {
      // 预定义生效规则下拉选择变化
      this.paint1()
    },
    genLockSchema () {
      // 生成解锁模板
      let editGrant = this.editGrant
      if (this.isCustDefVest) {
        editGrant.lock_schema = JSON.stringify(this.custDefVests)
      } else {
        editGrant.lock_schema = this.OPTS_VEST_PLAN[parseInt(this.vestPlanSelVal)].lock_schema
      }
    },
    handleOnGrantSubmit () {
      // 授予弹窗提交按钮
      this.genLockSchema()
      let load = loading(this, '保存授予...')
      console.log(this.editGrant.lock_schema)
      grant.update(this.editGrant).then( data => {
        load.close()
        this.hide()
        success('保存授予成功！')
      })
    },
    // 外部数据设置接口
    show () {  // 显示授予弹窗
      this.dialogVisible = true
    },
    hide () {  // 显示授予弹窗
      this.dialogVisible = false
    },
    set (grantData) {  // 设置授予数据
      console.log('[ld-grant-dialog.set]设置授予数据', grantData)
      this.userID = grantData.pi_serial_number
      this.editGrant.plan_item_id = grantData.pi_id
      this.editGrant.grant_rate = grantData.pi_grant_rate
      this.editGrant.staff_id = grantData.pi_staff_id
      this.editGrant.grant_stock = grantData.pi_grant_stock
      this.editGrant.strike_type = grantData.pi_strike_type
      this.editGrant.strike_val = grantData.pi_strike_val
      this.editGrant.strike_currency = grantData.pi_strike_currency
      this.editGrant.strike_price = grantData.pi_strike_price
      this.editGrant.grant_email = grantData.pi_grant_email
      this.editGrant.grant_name = grantData.pi_grant_name
      this.editGrant.effective_year = grantData.pi_effective_year
      this.stuffType = grantData.pi_staff_type
    },
    setCompany (companyInfo) {  // 设置公司信息
      console.log('[ld-grant-dialog.setCompany]设置公司信息', companyInfo)
      this.company = companyInfo
      this.editGrant.net_val = companyInfo.c_net_val
      this.editGrant.reg_val = companyInfo.c_reg_val
    },
    setGrantType (type) {  // 设置授予类型
      console.log('[ld-grant-dialog.setGrantType]设置授予类型', type)
      this.grantType = type
    },
    setPlanType (type) {  // 设置方案类型
      console.log('[ld-grant-dialog.setPlanType]设置方案类型', type)
      this.planType = type
    },
    setGrowth (def, max) { // 设置默认增长率和最大增长率
      console.log('[ld-grant-dialog.setGrowth]设置默认增长率和最大增长率', def, max)
      this.growthExpectDef = def
      this.growthExpect = def
      this.growthExpectMax = max
    },
    setVests (vests) {
      console.log('[ld-grant-dialog.setVests]设置系统预设生效规则', vests)
      this.OPTS_VEST_PLAN = vests
    },
    growthExpectSliderTooltip (val) {
      if (val == this.growthExpectDef) return val + '%(系统推荐值)'
      return val + '%'
    }
  }
}
</script>
