<template>
  <ld-content :height="560">
    <ld-stepbar :step="1" step1Text="方案机制录入"></ld-stepbar>

    <div style="text-align: center;margin-top: 90px">
      <p style="line-height: 30px;font-size: 14px;font-style: normal;color: #52575d;">
        系统记录的当前公司总股数为 <b style="font-size:14px;color: #0074f1">{{stock_val|currency-format('0,0')}}</b>;当前公司总估值为<b style="font-size:14px;color: #0074f1">{{cap_val|currency-format('0,0.00', cap_currency)}}</b> <br/>
        如因资本运作致使上述数据发生变化，请根据已发生的资本运作类型，点击进入并录入相关信息
      </p>
    </div>
    <ld-stock-dialog ref="stockDialog" :company-id="company_id"></ld-stock-dialog>
    <div style="margin-top:120px;text-align: center;">
      <router-link to="/entry/e1" class="ld-btn ld-btn-primary">上一步</router-link>
      <a class="ld-btn ld-btn-primary" @click="nextStep">下一步</a>
    </div>
  </ld-content>
</template>

<script>
import LdStepbar from '../../components/stepbar'
import localDb from '../../db'
import { LdStockDialog } from '../../components/dialog'
import currencyFormat from '../../filters/currency'
import {exceptionScript} from '../../common/exception'
import {success, error, loading, login} from '../../common/notify'
import plan from '../../services/plan'

export default {
  components: {
    LdStepbar,
    LdStockDialog
  },
  filters: {
    currencyFormat
  },
  data () {
    return {
      cap_currency: String(localDb.get('cap_currency')),
      cap_val: localDb.get('cap_val'),
      stock_val: localDb.get('stock_val'),
      company_id: localDb.get('userinfo') ? localDb.get('userinfo').company_info.c_id : login()
    }
  },
  mounted () {
    try {
      let userinfo = localDb.get('userinfo')
      if (!userinfo) {
        return login()
      }
      this.$refs.stockDialog.setCompany(userinfo.company_info)
    } catch (err) {
      exceptionScript(err)
    }
  },
  methods: {
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
    nextStep:function () {
      let toolTypeId = localDb.get('toolTypeId')
      let keepTypeId = localDb.get('keepTypeId')
      //录入方案数据
      let newPlanData = {company_id: this.company_id, tool_type:toolTypeId, keep_type:keepTypeId, cap_currency:this.cap_currency, cap_val:this.cap_val,stock_val:this.stock_val}
      let that = this
      plan.enter(newPlanData).then(res => {
        if (res.data.jump == '1') {
          that.$confirm(res.data.tips, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            this.clearLocalStorage()
            that.$router.push('/grant/' + res.data.p_id)
          }).catch(() => {
            //info('取消跳转')
          })
        } else {
          this.clearLocalStorage()
          that.$router.push('/grant/' + res.data.p_id)
        }
      })
    }
  },

}
</script>

<style lang="less">
</style>
