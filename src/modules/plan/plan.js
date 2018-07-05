import LdPage from '../../components/page'
import LdHeader from '../../components/header'
import LdFooter from '../../components/footer'
import plan from '../../services/plan' // eslint-disable-line
import company from '../../services/company' // eslint-disable-line
import capital from '../../services/capital' // eslint-disable-line
import moment from 'moment'
import timeFormat from '../../filters/time'
import currencyFormat from '../../filters/currency'
import percentFormat from '../../filters/percent'
import {filterStuffType, filterToolType, filterCompanyRound} from '../../filters/grant'
import localDb from '../../db.js'
import {CURRENCY_TYPE, CURRENCY_TOKEN} from '../../config/const'
import { LdPlot4, LdPlot5 } from '../../components/graph'
import axios from 'axios'
import {info, success, warning, error, loading} from '../../common/notify'
import {exceptionScript} from '../../common/exception'
import currencyExchange from '../../common/exchange'

let mergeCells = []
let load = null

export default {
  components: {
    LdPage,
    LdHeader,
    LdFooter,
    LdPlot4,
    LdPlot5
  },
  filters: {
    timeFormat,
    currencyFormat,
    filterStuffType,
    filterToolType,
    filterCompanyRound
  },
  watch: {
    cap_val () {
      this.calculate()
    },
    stock_val () {
      this.calculate()
    },
    new_stock () {
      this.calculate()
    },
    ratio () {
      this.calculate()
    },
    currency_type () {
      this.calculate()
    }
  },
  data () {
    return {
      company_id: 0,
      checkedPlanList: [],
      stock_encourage_percent: 0, // 股权激励池占比
      edit_stock_encourage_percent: false,
      total_stock_val: 0, // 总股本数量
      granted : 0, // 已授予总股数
      decision : 0, // 决策中总股数
      effect_stock : 0, // 已解锁总股数
      lock_stock : 0, // 未解锁总股数
      staff_type : [], // 各层级股数
      staff_group : [], // 各职位类型股数
      setting: 0,
      plot1Data: [
        {
          percent: 0,
          color: '#0074f1'
        }
      ],
      plot2Data: [
        {
          percent: 0,
          color: '#0074f1'
        },
        {
          percent: 0,
          color: '#ff4f51'
        }
      ],
      plot3Data: [
        {
          label: '高层',
          percent: 0,
          color: '#DB4648'
        },
        {
          label: '中层',
          percent: 0,
          color: '#ff4f51'
        },
        {
          label: '基层', 
          percent: 0,
          color: '#ffa5bc'
        },
        {
          label: '核心',
          percent: 0,
          color: '#ffc6d0'
        }
      ],
      plot4Data: [
        {
          label: '高层',
          percent: 0,
          color: '#DB4648'
        },
        {
          label: '技术',
          percent: 0,
          color: '#de5355'
        },
        {
          label: '产品',
          percent: 0,
          color: '#e06062'
        },
        {
          label: '设计',
          percent: 0,
          color: '#e36d6f'
        },
        {
          label: '运营',
          percent: 0,
          color: '#e5797b'
        },
        {
          label: '战略',
          percent: 0,
          color: '#e78587'
        },
        {
          label: '仓储',
          percent: 0,
          color: '#ea9293'
        },
        {
          label: '市场',
          percent: 0,
          color: '#ec9e9f'
        },
        {
          label: '销售',
          percent: 0,
          color: '#eeabac'
        },
        {
          label: '财务',
          percent: 0,
          color: '#f1b7b8'
        },
        {
          label: '人资',
          percent: 0,
          color: '#f3c3c4'
        },
        {
          label: '法务',
          percent: 0,
          color: '#f5cdcd'
        },
        {
          label: '行政',
          percent: 0,
          color: '#f8dada'
        },
        {
          label: '采购',
          percent: 0,
          color: '#fae3e4'
        },
        {
          label: '客服',
          percent: 0,
          color: '#fceeee'
        },
        {
          label: '其他',
          percent: 0,
          color: '#fcf7f4'
        }
      ],
      plot5Data: [
        {
          label: '未解锁',
          percent: 0, // 股权激励池占比
          color: '#DB4648'
        },
        {
          label: '已解锁',
          percent: 0, // 股权激励池占比
          color: '#ff4f51'
        }
      ],
      company: null, // 公司信息
      currentPage: 1,
      planList: [],
      planTotal: 0,
      planTurn: 0,
      viewMode: false,
      currentGrantsPage: 1,
      grantsPageSize: 10,
      fetchGrantsTotal: 0,
      fetchGrantsList: [],
      tableLoading: false,
      tableData: [],
      capital_type: 0,
      currencyMod: '',
      stockMod: 0,
      capMod: 0,
      capitalChecked: false,
      // 公司股改数据
      currency_type: '', // 币种类型
      cap_val: '', // 估值/融资金额
      stock_val: '', // 股本数量
      new_stock: '', // 新增股本数量
      ratio: '', // 增发股本占比
      // 再融资/增资
      dialogRongZengVisible: false,
      currencyTypeOpts: CURRENCY_TYPE,
      // 搭建VIE
      dialogVieVisible: false,
      // 股份制改造
      dialogGufenzhigaiVisible: false,
      // 并股
      dialogBingguVisible: false,
      // 股改
      dialogChaiguVisible: false,
      // 资本金转移
      dialogZibenzzVisible: false
    }
  },
  computed: {
    currencyToken () {
      return CURRENCY_TOKEN[this.currency_type] || ''
    },
    grantedPercent () {
      return percentFormat(this.granted * 100 / this.total_stock_val)
    },
    decisionPercent () {
      return percentFormat(this.decision * 100 / this.total_stock_val)
    },
    capValPerStock () {
      let cap_val = this.company.c_cap_val
      let stock_val = this.company.c_stock_val
      if (stock_val==0) return

      return cap_val / stock_val
    }
  },
  created () {
    load = loading(this, '方案信息加载中...')
  },
  mounted () {
    this.init()
    this.calPlotData()
  },
  methods: {
    currencyExchange,
    calculate () {
      try {
        switch (this.capital_type) {
          case 1:
            this.cal1()
          break
          case 2:
            this.cal2()
          break
          case 3:
            this.cal3()
          break
          case 4:
            this.cal4()
          break
          case 5:
            this.cal5()
          break
          case 6:
            this.cal6()
          break
        }
      } catch (err) {
        exceptionScript(err)
      }
    },
    cal1 () {
      let s1 = this.company.c_stock_val
      let m = this.cap_val
      let n = this.ratio/100
      let s2 = s1/(1-n)
      let v2 = m/n
      if (!isNaN(s2) && s2!==Infinity) { this.stockMod = s2 } else {this.stockMod='***'}
      if (!isNaN(v2) && v2!==Infinity) { this.capMod = v2 } else {this.capMod='***'}
      this.currencyMod = this.currency_type
    },
    cal2 () {
      let m = this.stock_val
      let n = this.new_stock
      let o = this.cap_val
      let s2 = m
      let v2 = o
      if (!isNaN(s2) && s2!==Infinity) { this.stockMod = s2 } else {this.stockMod='***'}
      if (!isNaN(v2) && v2!==Infinity) { this.capMod = v2 } else {this.capMod='***'}
      this.currencyMod = this.currency_type
    },
    cal3 () {
      let m = this.stock_val
      let n = this.new_stock
      let o = this.cap_val
      let s2 = m
      let v2 = o
      if (!isNaN(s2) && s2!==Infinity) { this.stockMod = s2 } else {this.stockMod='***'}
      if (!isNaN(v2) && v2!==Infinity) { this.capMod = v2 } else {this.capMod='***'}
      this.currencyMod = this.currency_type
    },
    cal4 () {
      let s1 = this.company.c_stock_val
      let v1 = this.company.c_cap_val
      let m = this.ratio
      let s2 = s1 * m
      let v2 = v1
      if (!isNaN(s2) && s2!==Infinity) { this.stockMod = s2 } else {this.stockMod='***'}
      if (!isNaN(v2) && v2!==Infinity) { this.capMod = v2 } else {this.capMod='***'}
      this.currencyMod = this.company.c_cap_currency
    },
    cal5 () {
      let s1 = this.company.c_stock_val
      let v1 = this.company.c_cap_val
      let m = this.ratio
      let s2 = s1 / m
      let v2 = v1
      if (!isNaN(s2) && s2!==Infinity) { this.stockMod = s2 } else {this.stockMod='***'}
      if (!isNaN(v2) && v2!==Infinity) { this.capMod = v2 } else {this.capMod='***'}
      this.currencyMod = this.company.c_cap_currency
    },
    cal6 () {
      let s1 = this.company.c_stock_val
      let v1 = this.company.c_cap_val
      let m = this.ratio
      let s2 = s1 * m
      let v2 = v1
      if (!isNaN(s2) && s2!==Infinity) { this.stockMod = s2 } else {this.stockMod='***'}
      if (!isNaN(v2) && v2!==Infinity) { this.capMod = v2 } else {this.capMod='***'}
      this.currencyMod = this.company.c_cap_currency
    },
    init () {
      let localUserInfo = localDb.get('userinfo')
      if (!localUserInfo) {
        return this.$router.push('/login')
      }

      try {
        let localCompanyInfo = localUserInfo.company_info
        //console.log('本地存储信息', localUserInfo, localCompanyInfo)
        this.planTurn = localCompanyInfo.c_plan_turn

        let that = this
        axios.all([
          company.get(), // 获取公司基本信息
          this.planFetchList(1, 12), // 获取方案列表
          plan.dash() // 获取dashboard数据
        ]).then(axios.spread(function (data1, data2, data3) {
          //console.log('获取公司信息', data1)
          that.company_id = data1.data[0].c_id
          that.company = data1.data[0]
          that.currencyMod = that.company.c_cap_currency
          that.capMod = that.company.c_cap_val
          that.stockMod = that.company.c_stock_val

          that.currentPage = data2.currentPage
          let planList = data2.planList
          for (let i=0, len=planList.length; i<len; i++) {
            planList[i].checked = false
          }
          that.planList = planList
          that.planTotal = data2.totalCount

          // dashboard数据
          //console.log('dashboard数据', data3)
          that.stock_encourage_percent = data3.data.stock_encourage_percent
          that.granted = data3.data.granted
          that.decision = data3.data.decision
          that.total_stock_val = parseInt(data3.data.total_stock_val)
          that.staff_group = data3.data.staff_group
          that.staff_type = data3.data.staff_type
          that.effect_stock = data3.data.effect_stock
          that.lock_stock = data3.data.lock_stock
          that.setting = data3.data.setting
          that.calPlotData()
        })).then(()=>{
          load && load.close()
        })
      } catch (err) {
        exceptionScript(err)
      }
    },
    handleOnChangeStockPercent () {
      company.stockpoolrate({
        rate: this.stock_encourage_percent
      }).then(data => {
        this.edit_stock_encourage_percent = false
        this.updateDash()
        success('修改成功')
      })
    },
    calPlotData () {
      this.plot1Data[0].percent = this.stock_encourage_percent
      this.plot2Data[0].percent = parseFloat(this.decisionPercent)
      this.plot2Data[1].percent = parseFloat(this.grantedPercent)

      let total_stock_val = this.total_stock_val
      let staff_type = this.staff_type
      let staff_group = this.staff_group
      let plot3Data = this.plot3Data
      let plot4Data = this.plot4Data
      let plot5Data = this.plot5Data
      for (let k in staff_type) {
        let kk = parseInt(k)
        plot3Data[kk-1].percent = staff_type[k] * 100/total_stock_val
        //console.log(staff_type[k], total_stock_val, plot3Data[kk-1].percent)
      }
      for (let k in staff_group) {
        let kk = parseInt(k)
        console.log(kk, plot4Data, staff_group)
        plot4Data[kk-1].percent = staff_group[k] * 100/total_stock_val
        //console.log(staff_group[k], total_stock_val, plot4Data[kk-1].percent)
      }

      let stock_total = this.effect_stock + this.lock_stock
      plot5Data[1].percent = this.effect_stock *100 / stock_total
      plot5Data[0].percent = this.lock_stock *100 / stock_total

      this.$refs.plot1.plot(this.plot1Data)
      this.$refs.plot2.plot(this.plot2Data)
      this.$refs.plot3.plot(plot3Data)
      this.$refs.plot4.plot(plot4Data)
      this.$refs.plot5.plot(plot5Data)
    },
    updateDash () {
      plan.dash().then(data => {
        this.stock_encourage_percent = data.data.stock_encourage_percent
        this.granted = data.data.granted
        this.decision = data.data.decision
        this.total_stock_val = parseInt(data.data.total_stock_val)
        this.staff_group = data.data.staff_group
        this.staff_type = data.data.staff_type
        this.effect_stock = data.data.effect_stock
        this.lock_stock = data.data.lock_stock
        this.setting = data.data.setting
        this.calPlotData()
      })
    },
    // 方案列表
    planFetchList (page, size) {
      return plan.list({current_page: page, page_size: size}).then(data => data.data)
    },
    // 增加授予
    handleOnGrantAddClick (p_id, plan) {
      this.$router.push('/grant/'+p_id)
    },
    // 查看实施进度
    handleOnGrantImplementClick (p_id, plan) {
      // 查看进度
      //console.log('查看进度', p_id)
      this.$router.push('/implement/'+p_id)
    },
    // 方案预览
    handleOnGrantViewClick (p_id, plan) {
      // 查看授予
      //console.log('查看授予', p_id)
      this.viewMode = true
      this.handleOnPlanCheckClick(p_id, plan)
    },
    // 删除方案
    planDelete (plan_id) { // 用户删除方案
      return plan.delete({plan_id: plan_id})
    },
    handleOnPlanDeleteClick (p_id, plan) {
      this.$confirm('此操作将永久删除该方案, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.planDelete(p_id).then(data => {
          if (data.retCode != 0) {
            return this.$message.error(data.errMsg)
          }
          let planList = this.planList
          let pidx = planList.indexOf(plan)
          planList.splice(pidx, 1)
          success('删除成功!')
        })
      }).catch(() => {
        info('已取消删除!')         
      })
    },
    /* begin 弹窗 */
    resetData () {
      this.currency_type = ''
      this.cap_val = ''
      this.stock_val = ''
      this.new_stock = ''
      this.ratio = ''
      this.capitalChecked = false
    },
    handleOnClickRongZengBtn () {
      this.resetData()
      this.capital_type = 1
      this.dialogRongZengVisible = true
    },
    handleOnClickVieBtn () {
      this.resetData()
      this.capital_type = 2
      this.dialogVieVisible = true
    },
    handleOnClickGufenzhigaiBtn () {
      this.resetData()
      this.capital_type = 3
      this.dialogGufenzhigaiVisible = true
    },
    handleOnClickChaiguBtn () {
      this.resetData()
      this.capital_type = 4
      this.dialogChaiguVisible = true
    },
    handleOnClickBingguBtn () {
      this.resetData()
      this.capital_type = 5
      this.dialogBingguVisible = true
    },
    handleOnClickZibenzzBtn () {
      this.resetData()
      this.capital_type = 6
      this.dialogZibenzzVisible = true
    },
    /* 弹窗提交按钮 */
    handleOnClickRongZengDialogSubmit () {
      this.capitalModify(1, {
        currency_type: this.currency_type,
        cap_val: this.cap_val,
        ratio: this.ratio
      }).then(data => {
        success('再融资/增资成功!')
        this.dialogRongZengVisible = false
      })
    },
    handleOnClickVieDialogSubmit () {
      this.capitalModify(2, {
        stock_val: this.stock_val,
        new_stock: this.new_stock,
        currency_type: this.currency_type,
        cap_val: this.cap_val
      }).then(data => {
        success('VIE搭建成功')
        this.dialogVieVisible = false
      })
    },
    handleOnClickGufenzhigaiDialogSubmit () {
      this.capitalModify(3, {
        stock_val: this.stock_val,
        new_stock: this.new_stock,
        currency_type: this.currency_type,
        cap_val: this.cap_val
      }).then(data => {
        success('股份制改造成功')
        this.dialogGufenzhigaiVisible = false
      })
    },
    handleOnClickChaiguDialogSubmit () {
        this.capitalModify(4, {
          ratio: this.ratio
        }).then(data => {
          success('拆股成功')
          this.dialogChaiguVisible = false
        })
    },
    handleOnClickBingguDialogSubmit () {
      this.capitalModify(5, {
        ratio: this.ratio
      }).then(data => {
        success('并股成功')
        this.dialogBingguVisible = false
      })
    },
    handleOnClickZibenzzDialogSubmit () {
      this.capitalModify(6, {
        ratio: this.ratio
      }).then(data => {
        success('资本金转增成功')
        this.dialogZibenzzVisible = false
      })
    },
    capitalModify (type, modata) {
      let modata2 = Object.assign({}, modata, {company_id: this.company_id, change_type: type})
      let load = loading(this, '更改公司股本信息...')
      return capital.modify(modata2).then(data => {
        load.close()
        // 更新表格数据
        this.company = data.data
        console.log('股改后的公司估值：', this.company.c_cap_currency, this.capValPerStock)
        this.fetchGrantsByPlanIds(this.checkedPlanList)
        return data.data
      }).catch(err => {
        load.close()
      })
    },
    /* end 弹窗 */
    // 方案预览: 复选更新授予表格数据
    handleOnPlanCheckClick (p_id, plan, e) {
      plan.checked = !plan.checked
      let change = false
      if (plan.checked) {
        if (this.checkedPlanList.indexOf(p_id) === -1) {
          this.checkedPlanList.push(p_id)
          change = true
        }
      } else {
        let idx = this.checkedPlanList.indexOf(p_id)
        if (idx != -1) {
          this.checkedPlanList.splice(idx, 1)
          change = true
        }
      }
      if (change) {
        this.tableLoading = true
        this.fetchGrantsByPlanIds(this.checkedPlanList)
      }
    },
    // 方案预览：根据选中的方案，从服务端获取合并后的授予数据
    fetchGrantsByPlanIds (planIds) {
      let pids = planIds.join(',')
      plan.grants({plan_id: pids}).then(data => {
        console.log('获取方案授予信息', data)
        let total = parseInt(data.data.totalCount)
        this.fetchGrantsTotal = isNaN(total)?0:total
        this.fetchGrantsList = data.data.dataList || []
        this.makeTableData()
      })
    },
    makeTableData () {
      let tableData = []
      let grantsList = this.fetchGrantsList
      let mergeRidx = 0
      mergeCells = []
      console.log('makeTableData', grantsList)
      for (let i=0, len=grantsList.length; i<len; i++) {
        let grant = grantsList[i]
        let detail = grant.detail
        let cspan = detail.length

        tableData = tableData.concat(detail)
        mergeCells.push({ridx: mergeRidx, cidx: 0, rspan: 1, cspan: cspan})
        mergeCells.push({ridx: mergeRidx, cidx: 1, rspan: 1, cspan: cspan})
        for (let j=mergeRidx+1; j<mergeRidx+cspan; j++) {
          mergeCells.push({ridx: j, cidx: 0, rspan: 0, cspan: 0})
          mergeCells.push({ridx: j, cidx: 1, rspan: 0, cspan: 0})
        }
        mergeRidx += cspan
      }
      console.log('mergeCells', mergeCells)
      this.tableData = tableData
      this.$nextTick(()=> {this.tableLoading = false})
    },
    // 表格分页
    handleOnPagerSizeChange (size) {
      console.log('分页Size发生变化')
    },
    handleOnPagerCurrentChange (currentPage) {
      console.log('当前页发生变化')
    },
    handleOnPagerClickPrev (currentPage) {
      console.log('上一页')
    },
    handleOnPagerClickNext (currentPage) {
      console.log('下一页')
    },
    //  方案预览：表格单元格合并
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0 || columnIndex == 1) {
        for (let i=0,len=mergeCells.length; i<len; i++) {
          let mergeCell = mergeCells[i]
          if (mergeCell.ridx == rowIndex && mergeCell.cidx == columnIndex) {
            return [mergeCell.cspan, mergeCell.rspan]
          }
        }
      }
    },
    tableColFilter (value, row, column) {
      return value || '0'
    }
    /*,planCreate () {
      return plan.create({
        company_id: company_id,
        reg_zone: '',
        stock_zone: '',
        round_id: '',
        tool_type: '',
        keep_type: '',
        grant_type: ''
      }).then(data => {
        console.log('设计方案', data)
      })
    },
    planFetchOne (plan_id) {
      return plan.get({plan_id: plan_id}).then(data => {
        console.log('获取方案信息', data)
      })
    },
    planEnter () {
      return plan.list({
        company_id: company_id,
        tool_type: '',
        keep_type: '',
        cap_currency: '',
        cap_val: '',
        stock_val: ''
      }).then(data => {
        console.log('录入方案信息', data)
      })
    }*/
  }
}
