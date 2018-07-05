import LdPage from '../../components/page'
import LdHeader from '../../components/header'
import LdFooter from '../../components/footer'
import LdStepbar from '../../components/stepbar'
import {LdContent, LdContentMain, LdContentHover} from '../../components/content'
import grantStore from './store'
import grant from '../../services/grant'
import plan from '../../services/plan'
import company from '../../services/company'
import {STUFF_TYPE, STRIKE_TYPE, VEST_PLAN_PREOPTS, TOOL_TYPE, COMPANY_TYPE, CURRENCY_TYPE, CURRENCY_TOKEN} from '../../config/const'
import localDb from '../../db.js'
import {filterCompanyRegarea, filterCompanyStockarea, filterCompanyExpround} from '../../filters/company'
import { LdPlot1, LdPlot2, LdPlot3 } from '../../components/graph'
import { LdGrantDialog,LdGrant2Dialog } from '../../components/dialog'
import axios from 'axios'
import currencyFormat from '../../filters/currency'
import percentFormat from '../../filters/percent'
import {filterStuffType, filterToolType, filterKeepType} from '../../filters/grant'
import {info, success, warning, error, loading} from '../../common/notify'
import {exceptionScript} from '../../common/exception'
import currencyExchange from '../../common/exchange'

export default {
  components: {
    LdPage,
    LdHeader,
    LdFooter,
    LdStepbar,
    LdContent,
    LdContentMain,
    LdContentHover,
    LdPlot1,
    LdPlot2,
    LdPlot3,
    LdGrantDialog,
    LdGrant2Dialog
  },
  filters: {
    filterCompanyRegarea,
    filterCompanyStockarea,
    filterCompanyExpround,
    percentFormat,
    currencyFormat,
    filterStuffType,
    filterToolType,
    filterKeepType
  },
  data () {
    let store = new grantStore(this, {
    })
    return {
      load: null,
      store,
      pre_stock_val: 0,  // 保存前一次设置的境内股份有限公司的股本数量
      pre_nature_type: 0, // 保存前一次设置的境内公司性质
      dialogVisible: false,  // 添加授予对话框
      dialogGrantNoticeVisible: false, // 发出授予对话框
      cap_per_stock: 0,  // 每股估值
      vestCustomerDefine: false,  // 自定义生效安排
      growthExpect: 0,  // 年化估值增长预期：Slider数值
      growPlanDefault: 0,  // 默认增长率
      growPlanMax: 0,  // 最大增长率 = 默认值 * 2.5
      grantType: 0, // 授予方式
      toolType: 0, // 激励工具类型
      plot1Data: [
      ],
      plot2Data: [
        [0, 0],
        [0, 0],
        [0, 0]
      ],
      company: {}, // 公司基本信息
      plan: {}, // 当前方案信息
      grantPercentStyle: {
        color: '#f56c6c'
      },
      vestPlanOpts: [], // 生效规则下拉选项
      vestSetups: [ // 自定义生效设置
        {
          month: 12,
          percent: 30
        }
      ],
      grantCapValMax: 1,
      current_grant_default_ratio: 0,
      stuff_grant_default_ratio: {},
      net_val_currency: '', // 公司净资产币种
      marketCoverInfo: [0,0,0,0], // 授予覆盖比例
      ruleValueInfo: [],  // 规则信息
      grantedRatio: 0,
      grantingRatio: 0,
      grantPlotAngelK: 0,
      planId: this.$route.params.id,
      planType: 1,
      stuffTypes: STUFF_TYPE,
      strikeTypeOpts: STRIKE_TYPE,
      companyTypeOpts: COMPANY_TYPE,
      currencyTypeOpts: CURRENCY_TYPE,
      grantStuff: null,
      doGrantDate: '',
      doGrantIdCard: '',
      doGrantSignSubject: '', // 授予签署主体
      currentGrant: {}
    }
  },
  computed: {
    states () {
      return this.store.states
    },
    dataEditCompanyInfo () {
      return this.store.states.dataEditCompanyInfo
    },
    dataAddGrant () {
      return this.store.states.dataAddGrant
    },
    grantStuffs () {
      return this.store.states.grantStuffs
    },
    stuffTypeOpts () {
      return STUFF_TYPE[this.store.states.dataAddGrant.staff_type]
    },
    grantTotalPercent () {
      let total = 0
      this.vestSetups.forEach((item, index, arr) => {
        let remain = 100 - total
        let per = parseFloat(item.percent)

        if (per > remain) {
          this.vestSetups[index].percent = per = remain
        }
        total += isNaN(per) ? 0 : per
      })
      return total
    },
    strokeTotal () {
      // 行权总额=授予股数*行权价格
      return this.dataAddGrant.grant_stock * this.dataAddGrant.strike_price
    },
    cap_stock_edit_disable () {
      // 禁用公司估值和股本修改
      return this.planType=='2' || (this.planType=='1' && this.company.c_has_noticed=='1')
    },
    grantRateLevel () {
      let inVal = this.dataAddGrant.grant_rate
      let sysVal = this.current_grant_default_ratio
      if (sysVal==0) return 0

      let radio = inVal/sysVal
      return radio > 0 && radio <= 0.33 ? 1 :
             radio > 0.33 && radio <= 0.66 ? 2 :
             radio > 0.66 && radio <= 1 ? 3 :
             radio > 1 && radio <= 1.33 ? 4 :
             radio > 1.33 && radio <= 2 ? 5 :
             radio > 2 ? 6 : 0
    }
  },
  watch: {
    'dataAddGrant.strike_val': function (val, oldVal) {
      // 行权设置值变化，自动计算行权价格
      this.calcStrikePrice()
    },
    'dataAddGrant.grant_rate': function (val, oldVal) {
      // 授予比例变化，自动计算授予股数
      this.calcGrantStock()
    },
    'dataAddGrant.reg_val': function (val, oldVal) {
      // 有限责任公司，注册资本变化，自动计算每股行权价
      this.calcStrikePrice()
    },
    'dataAddGrant.net_val': function (val, oldVal) {
      // 有限责任公司，注册资本变化，自动计算每股行权价
      this.calcStrikePrice()
    },
    'dataAddGrant.strike_type': function (val, oldVal) {
      // 行权规则发生变化时，自动计算每股行权价
      //console.log('行权类型发生变化', val)
      this.calcStrikePrice()
    },
    'dataAddGrant.effective_year': function (val, oldVal) {
      // 有效年数发生变化时 更新plot1
      this.$refs.plot1.setMaxYear(val)
      console.log('有效年份发生变化', val)
    },
    'growthExpect': function (val) {
      this.handleSliderChange(val)
    },
    'vestSetups': function (val) {
      this.$refs.plot1.paint(val)
    },
    'strokeTotal': function (val) {
      this.calcGraphData()
      this.$refs.plot2.paint(this.plot2Data, this.company.c_cap_currency, this.grantCapValMax)
    }
  },
  created () {
    this.load = loading(this, '授予数据加载中...')
    this.init()
  },
  mounted () {
  },
  methods: {
    init () {
      this.initData() // 从localDb和服务器获取当前方案所需信息
    },
    initData () {
      // 本地数据库
      let userinfo = localDb.get('userinfo')
      if (!userinfo) {
        // 本地存储没有用户信息跳转登陆页面
        return this.$router.push('/login')
      }
      let planId = this.planId // 方案ID来自路由参数
      let dataAddGrant = this.store.states.dataAddGrant

      dataAddGrant.plan_id = planId  // 初始化添加授予方案ID
      // 用方案ID 分页获取获取所有岗位方案授予明细表
      let  tableData = this.store.states.tableData
      let that = this

      axios.all([
        company.get(), // 获取公司基本信息
        plan.get({plan_id: planId}), // 获取方案初始化信息
        plan.detail({plan_id: planId, staff_type: 0, current_page: 1, page_size: 10}) // 获取方案授予明细表
      ]).then(axios.spread(function (data1, data2, data3) {
        let companyInfo = data1.data[0]
        let areaId = companyInfo.c_reg_zone
        let stockZoneId = companyInfo.c_stock_zone
        let roundId = companyInfo.c_round
        that.states.dataAddGrant.net_val = companyInfo.c_net_val
        that.states.dataAddGrant.reg_val = companyInfo.c_reg_val

        that.company = companyInfo
        that.$refs.grantEditDialog.setCompany(companyInfo)
        that.pre_stock_val = companyInfo.c_stock_val
        that.pre_nature_type = companyInfo.c_nature_type
        that.$set(that.dataEditCompanyInfo, 'p_id', planId)
        that.$set(that.dataEditCompanyInfo, 'company_id', companyInfo.c_id)
        that.$set(that.dataEditCompanyInfo, 'currency_type', companyInfo.c_cap_currency)
        that.$set(that.dataEditCompanyInfo, 'cap_val', companyInfo.c_cap_val)
        that.$set(that.dataEditCompanyInfo, 'stock_val', companyInfo.c_stock_val)
        that.$set(that.dataEditCompanyInfo, 'nature_type', companyInfo.c_nature_type)
        that.net_val_currency = companyInfo.c_cap_currency

        // 初始化图表数据
        that.calcGraphData()

        //console.log('服务端获取公司基本信息', companyInfo)

        console.log('获取方案基本信息', data2)
        that.plan = data2.data
        let grantType = data2.data.p_grant_type
        that.planType = data2.data.p_type
        that.grantType = grantType
        that.toolType = data2.data.p_tool_type
        that.$refs.grantEditDialog.setGrantType(grantType)
        that.$refs.grantEditDialog.setPlanType(that.planType)

        if (data3.data) {
          tableData[0] = data3.data['1']
          tableData[1] = data3.data['2']
          tableData[2] = data3.data['3']
          tableData[3] = data3.data['4']
          //console.log('获取所有岗位方案授予明细表', data3, tableData)
        }

        return axios.all([
          grant.init({plan_id:planId, company_id:companyInfo.c_id, plan_item_id:0}), // 获取方案授予初始化信息
          grant.default({round: roundId, grant_type: grantType}),
          grant.getlocktmpl({tool_type: that.toolType})
        ])
      })).then(axios.spread(function (data1, data2, data3) {
          let planType = that.planType

          //console.log('获取方案授予初始化信息', data1)
          let newSn = data1.data.newSn // 新授予ID
          let grantedRatio = parseFloat(data1.data.grantedRatio)  //  已授予比例
          let grantingRatio = parseFloat(data1.data.grantingRatio)  // 授予中比例

          dataAddGrant.sn = newSn
          that.grantedRatio = grantedRatio
          that.grantingRatio = grantingRatio

          //console.log('获取授予相关默认值', data2)
          if (planType == 1) {
            that.growPlanDefault = parseInt(data2.data.growPlanInfo[0].gp_value) // 年化估值增长预期平均值
            that.growthExpect = that.growPlanDefault
            that.growPlanMax = that.growPlanDefault * 2.5 // 最大值为平均值的6倍
            that.marketCoverInfo = data2.data.marketCoverInfo
            that.ruleValueInfo = data2.data.ruleValueInfo
            that.grantPlotAngelK = 90 / that.ruleValueInfo[0].rv_value

            that.$refs.grantEditDialog.setGrowth(that.growthExpect, that.growPlanMax)
            that.plotGrantRatio()
          }

          // 系统预设生效模板
          //console.log('预设生效规则', data3)
          that.vestPlanOpts = data3.data
          that.$refs.grantEditDialog.setVests(data3.data)
        })
      ).then(()=>{
        this.load && this.load.close()
      }).catch(()=>{
        this.load && this.load.close()
      })
    },
    plotGrantRatio () {
      let grantedRatio = this.grantedRatio
      let grantingRatio = this.grantingRatio
      let grantPlotAngelK = this.grantPlotAngelK
      // console.log('绘制plot3', grantedRatio, grantingRatio, grantPlotAngelK)
      this.$refs.plot3.setBase(grantedRatio*grantPlotAngelK)
      this.$refs.plot3.setAngle(grantingRatio*grantPlotAngelK)
    },
    calcGrantStock () {
      // 计算授予股数
      let grant_rate = this.dataAddGrant.grant_rate
      this.dataAddGrant.grant_stock = grant_rate * this.dataEditCompanyInfo.stock_val / 100
    },
    focusOnCompanyInfo () {
      let data = this.dataEditCompanyInfo
      if (!data.currency_type) {
        this.$refs.currencyTypeSelect.focus()
      }
      if (!data.cap_val) {
        this.$refs.capValInput.focus()
      }
      if (!data.stock_val) {
        this.$refs.stockValInput.focus()
      }
    },
    checkCompanyInfo () {
      let data = this.dataEditCompanyInfo
      let checked = false
      if (this.company.c_reg_zone == '2') {
        // 境外注册：无需填写公司性质
        checked = data.company_id && data.currency_type && data.cap_val && data.stock_val
      } else {
        if (data.nature_type == '1') {
          // 有限责任公司，股本数量固定1亿
          data.stock_val = 100000000
        } else {
          // 从有限责任公司切换到股份有限公司，股本数量恢复前一次设置的值
          if (this.pre_nature_type != data.nature_type) {
            data.stock_val = this.pre_stock_val
            // console.log('恢复股份有限公司股本设置数量', this.pre_stock_val)
          }
          if (data.stock_val && data.stock_val != this.pre_stock_val) {
            // 保存境内股份有限公司最近改变的股本数量
            this.pre_stock_val = data.stock_val
          }
        }
        if (data.nature_type && this.pre_nature_type != data.nature_type) {
          // 保存境内最近一次修改的公司性质
          this.pre_nature_type = data.nature_type
        }
        checked = data.company_id && data.currency_type && data.cap_val && data.stock_val && data.nature_type
      }
      return checked
    },
    saveEditCompanyInfo () {
      let data = this.dataEditCompanyInfo
      if (this.checkCompanyInfo()) {
        company.edit(data).then(res => {
          // 公司信息存儲到本地
          this.company.c_cap_currency = data.currency_type
          this.company.c_cap_val = data.cap_val
          // company.c_net_currency = data.cap_val
          // company.c_net_val = data.net_val
          this.company.c_nature_type = data.nature_type
          this.company.c_stock_val = data.stock_val
          let userinfo = localDb.get('userinfo')
          userinfo.company_info = this.company
          localDb.set('userinfo', userinfo)
        })
      }
    },
    handleOnClickNotice (row) {
      console.log('授予通知员工信息', row)
      this.grantStuff = row
      this.dialogGrantNoticeVisible = true
    },
    hadleOnClickGrantNoticeSubmit () {
      console.log('提交发出授予通知', this.grantStuff)
      console.log('授予日期', this.doGrantDate)
      let row = this.grantStuff

      grant.notice({
        plan_item_id: row.pi_id,
        grant_idcard: this.doGrantIdCard,
        grant_time: parseInt(this.doGrantDate / 1000),
        sign_subject: this.doGrantSignSubject
      }).then(data => {
        success('发出授予成功！')
        this.plan.p_grant_time = new Date().getTime()/1000
        this.dialogGrantNoticeVisible = false

        let tableData = this.store.states.tableData[parseInt(row.pi_staff_type)-1]
        tableData.total = parseInt(tableData.total) - 1
        tableData.data.splice(tableData.data.indexOf(row), 1)
      })
    },
    handleOnClickMore (row) {
      console.log('更多', row)
    },
    handleOnClickEditGrantBtn (row) {
      this.$refs.grantEditDialog.set(row)
      this.$refs.grantEditDialog.show()
      console.log('编辑授予', row)
    },
    handleOnClickViewProtocolBtn (row) {
      grant.protocol({plan_item_id: row.pi_id}).then(data => {
        window.location =data.data.file_path
      })
    },
    handleOnClickDeleteGrantBtn (row) {
      this.$confirm('此操作将永久删除该授予, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        grant.delete({plan_item_id: row.pi_id}).then(data => {
          if (data.retCode != 0) {
            return error(data.errMsg)
          }
          let tableData = this.store.states.tableData[parseInt(row.pi_staff_type)-1]
          tableData.total = parseInt(tableData.total) - 1
          tableData.data.splice(tableData.data.indexOf(row), 1)
          this.updateGauge()
          success('删除成功!')
        })
      }).catch(() => {
        info('已取消删除')          
      })
    },
    handleArrowClick (k) {
      this.grantStuffs[k].open = !this.grantStuffs[k].open
    },
    removeVestSetup (item) {
      let index = this.vestSetups.indexOf(item)
      if (index !== -1) {
        this.vestSetups.splice(index, 1)
      }
    },
    handleOnCustomerVestInput () {
      this.plot1Data = this.vestSetups
      this.$refs.plot1.paint(this.plot1Data)
    },
    calcStrikePrice () {
      // 计算行权价格
      let strike_val = this.dataAddGrant.strike_val
      let cap_val = this.company.c_cap_val
      let stock_val = this.company.c_stock_val
      let cap_currency = this.company.c_cap_currency
      if (this.dataAddGrant.strike_type == '1') {
        this.cap_per_stock = cap_val / stock_val
        // 按最近一轮融资，每股估值
        this.dataAddGrant.strike_currency = cap_currency
        this.dataAddGrant.strike_price = strike_val * this.cap_per_stock / 100
        //console.log('按最近一轮融资估值的百分比作为行权价', this.dataAddGrant.strike_price, strike_val, this.cap_per_stock)
      } else if (this.dataAddGrant.strike_type == '2') {
        let net_per_stock = this.dataAddGrant.net_val / this.dataEditCompanyInfo.stock_val // 每股净资产
        let strike_price = net_per_stock * strike_val
        if (strike_price < 1e-6) { // 行权价低于0.000001，数字过滤器显示NAN，因此置0
          strike_price = 0
        }
        this.dataAddGrant.strike_price = strike_price
        this.dataAddGrant.strike_currency = this.net_val_currency
      } else if (this.dataAddGrant.strike_type == '3') {
        let stock_val = this.dataEditCompanyInfo.stock_val
        if (this.dataEditCompanyInfo.nature_type == '1') {
          let reg_val = this.dataAddGrant.reg_val
          this.dataAddGrant.strike_price = reg_val / stock_val
        } else {
          let cap_val = this.dataEditCompanyInfo.cap_val
          this.dataAddGrant.strike_price = cap_val / stock_val
        }
        this.dataAddGrant.strike_currency = cap_currency
      } else {
        this.dataAddGrant.strike_price = 0
        this.dataAddGrant.strike_currency = cap_currency
      }
    },
    initAddGrantData (staff_type) {
      if (!this.checkCompanyInfo()) {
        //warning('公司信息未填写完整')
        //this.focusOnCompanyInfo()
        //return false
      }
      this.states.dataAddGrant.staff_type = staff_type
      // 境内有限责任：股本数量一亿股
      // 境内有限股份：设定股本数量
      // 境外：
      let cap_val = this.states.dataEditCompanyInfo.cap_val // 估值
      let stock_val = this.states.dataEditCompanyInfo.stock_val // 股本数量
      let nature_type = this.states.dataEditCompanyInfo.nature_type // 公司性质
      let currency_type = this.states.dataEditCompanyInfo.currency_type // 币种类型

      let grant_rate = this.states.dataAddGrant.grant_rate // 授予比例
      let strike_type = this.states.dataAddGrant.strike_type // 行权方式
      let net_val = this.states.dataAddGrant.net_val // 每股净资产
      let strike_val = this.states.dataAddGrant.strike_val // 行权设置值

      if (strike_type == '1') {
        // 按最近一轮融资，每股估值百分比计算行权价
        let cap_per_stock = this.cap_per_stock = cap_val / stock_val // 每股估值
        this.dataAddGrant.strike_price = strike_val * cap_per_stock
        this.dataAddGrant.strike_currency = currency_type
      } else if (strike_type == '2') {
        // 按最近一个财务年度，每股净资产计算行权价
        this.dataAddGrant.strike_currency = this.net_val_currency
        this.dataAddGrant.strike_price = strike_val * net_val
      } else if (strike_type == '3') {
        this.dataAddGrant.strike_currency = currency_type
      } else {
        this.dataAddGrant.strike_currency = currency_type
      }
      console.log('增加授予初始数据：', this.dataAddGrant)
      this.calcGrantStock()
      this.calcStrikePrice()
      return true
    },
    handleOpenAddGrantDialog (type) {
      if (this.planType == '2') {
        this.$refs.grant2Dialog.show()
      } else {
        let staff_type = String(type)
        if (this.initAddGrantData(staff_type)) {
          this.dialogVisible = true
        }
      }
    },
    // 弹出增加授予对话框前对填写信息进行验证
    handleStuffTypeChange (val) {
      if (this.planType != 1) return

      let stuff_grant_default_ratio = this.stuff_grant_default_ratio

      if (!stuff_grant_default_ratio || stuff_grant_default_ratio[val] == undefined) {
        grant.staff({round: this.company.c_round, grant_type: this.grantType, staff_id:val})
         .then(data => {
          stuff_grant_default_ratio[val] = data.data.mg_value
          this.current_grant_default_ratio = stuff_grant_default_ratio[val] || 0
          // console.log('获取岗位授予默认比例', stuff_grant_default_ratio)
         })
      } else {
        this.current_grant_default_ratio = stuff_grant_default_ratio[val] || 0
      }
    },
    handleOnStrikeTypeChange (val) {
      let dataAddGrant = this.store.states.dataAddGrant
      switch (val) {
        case '1':
          dataAddGrant.strike_val = 50
          // console.log('公司最近一轮融资估值', dataAddGrant.strike_val)
          break
        case '2':
          dataAddGrant.strike_val = 1
          break
        default:
          dataAddGrant.strike_val = 0
      }
      this.calcStrikePrice()
      this.handleSliderChange()
    },
    handleOnVestChange (val) {
      // 切换生效安排：预设与自定义
      if (val) {
        this.plot1Data = this.vestSetups
        this.$refs.plot1.paint(this.plot1Data)
      } else {
        let vest = this.dataAddGrant.vestPlan
        this.showPlot1(vest)
      }
    },
    handleOnVestSelectChange (val) {
      this.showPlot1(val)
    },
    showPlot1(val) {
      if (!this.vestPlanOpts.length) return

      this.plot1Data = JSON.parse(this.vestPlanOpts[parseInt(val)].lock_schema)
      this.$refs.plot1.paint(this.plot1Data)
    },
    addVestSetup () {
      // 自定义生效安排
      this.vestSetups.push({month:parseInt(this.vestSetups[this.vestSetups.length-1].month)+12, percent:10})
    },
    handleOnChangeNetValCurrency () {
      if (this.dataAddGrant.strike_type == '2') {
        this.dataAddGrant.strike_currency = this.net_val_currency
        this.handleSliderChange()
      }
    },
    calcGraphData () {
      try {
        if (!this.strokeTotal) return

        let strokeTotal = this.strokeTotal || 1
        let expAmp = (1+this.growthExpect / 100)
        let expAmp2 = Math.pow(expAmp, 2)
        let expAmp3 = Math.pow(expAmp, 3)
        let capStock = this.cap_per_stock * this.dataAddGrant.grant_stock

        console.clear()
        this.grantCapValMax = this.company.c_cap_val * this.current_grant_default_ratio * Math.pow(1 + this.growPlanDefault/100, 3) * 1.25 / 100
        console.log(this.company.c_cap_val, this.current_grant_default_ratio, this.growPlanDefault)

        let cex = currencyExchange(this.dataAddGrant.strike_currency, this.company.c_cap_currency)
        let currency = this.company.c_cap_currency
        console.log('行权总额', CURRENCY_TOKEN[this.dataAddGrant.strike_currency] + ' ' + strokeTotal,
                    CURRENCY_TOKEN[this.dataAddGrant.strike_currency]+'=>'+CURRENCY_TOKEN[currency], cex,
                    '行权总额兑换成估值币种', strokeTotal * cex,
                    ' 授予股数估值', CURRENCY_TOKEN[currency] + ' ' + capStock,
                    ' 1年后总估值',  CURRENCY_TOKEN[currency] + ' ' + (capStock * expAmp),
                    ' 2年后总估值',  CURRENCY_TOKEN[currency] + ' ' + (capStock * expAmp2),
                    ' 3年后总估值',  CURRENCY_TOKEN[currency] + ' ' + (capStock * expAmp3),
                    ' 市场占比三年后最大值(参考)',  CURRENCY_TOKEN[currency] + ' ' + this.grantCapValMax
                    )

        strokeTotal = strokeTotal * cex
        this.plot2Data[0][0] = strokeTotal
        this.plot2Data[1][0] = strokeTotal
        this.plot2Data[2][0] = strokeTotal
        this.plot2Data[0][1] = capStock * expAmp
        this.plot2Data[1][1] = capStock * expAmp2
        this.plot2Data[2][1] = capStock * expAmp3
      } catch (err) {
        exceptionScript(err)
      }
    },
    handleSliderChange (v) {
      this.calcGraphData()

      if (this.$refs.plot2) {
        // this.$refs.plot2.paint(this.plot2Data, this.dataAddGrant.strike_currency)
        this.$refs.plot2.paint(this.plot2Data, this.company.c_cap_currency, this.grantCapValMax)  // 始终以公司估值币种为参考币种
      }
    },
    updateGauge () {
      grant.init({plan_id:this.planId, company_id:this.company.c_id, plan_item_id:0}).then(data => {
        this.grantedRatio = parseFloat(data.data.grantedRatio)  //  已授予比例
        this.grantingRatio = parseFloat(data.data.grantingRatio)  // 授予中比例

        this.plotGrantRatio()
      })
    },
    handleOnAddGrant () {
      let dataAddGrant = this.store.states.dataAddGrant

      if (this.vestCustomerDefine) {
        dataAddGrant.lock_tmpl = '0'
        dataAddGrant.lock_schema = JSON.stringify(this.vestSetups)
      } else {
        try {
          let vestPlanOpt = this.vestPlanOpts[parseInt(this.dataAddGrant.vestPlan)]
          dataAddGrant.lock_tmpl = vestPlanOpt.lock_tmpl
          dataAddGrant.lock_schema = vestPlanOpt.lock_schema
        } catch (err) {
          return exceptionScript(err)
        }
      }

      let load = loading(this, '添加授予中...')
      grant.add(dataAddGrant).then(data=>{
        load.close()
        success('添加授予成功')
        try {
          // 更新表格数据
          let newGrantData = data.data
          let tableData = this.store.states.tableData[parseInt(newGrantData.pi_staff_type)-1]
          tableData.total = parseInt(tableData.total) + 1
          tableData.data.push(newGrantData)

          // 更新plot3
          this.updateGauge()
        } catch (err) {
          return exceptionScript(err)
        }
        this.dialogVisible = false
      })
    },
    growthExpectSliderTooltip (val) {
      if (val == this.growPlanDefault) return val + '%(系统推荐值)'
      return val + '%'
    },
    staffTypeFormatter (row, column, cellValue, index) {
      return STUFF_TYPE[row.pi_staff_type][cellValue]
    }
  }
}
