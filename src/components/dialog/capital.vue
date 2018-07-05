<template>
<div>

<el-dialog width="520px" :visible.sync="dialogCapitalVisible"  custom-class="ld-plan-dialog">
  <div style="text-align: left; margin-bottom: 15px;">
    <p style="line-height: 30px;font-size: 16px; color: #52575d;">系统记录的当前公司总股数为<b>{{company.c_stock_val|currency-format('0,0')}}</b>股；当前公司总估值为<b>{{company.c_cap_val|currency-format('0,0.00', company.c_cap_currency)}}</b>元。
如上述信息与当前情况一致，请点击<a style="color:#3f96f4; cursor:pointer;" @click.stop="handleOnClickNextStep">下一步</a>；如因资本运作致使上述数据发生变化，请录入资本运作相关信息：
    </p>
  </div>

  <div class="ld-capital-taps" style="height: 80px; margin-top:20px;">
    <div class="ld-capital-tap" :class="{active: tapIdx==1}" @click.stop="handleOnClickTap(1)">再融资/增资<i class="ld-tap-side-check"></i></div>
    <div class="ld-capital-tap" :class="{active: tapIdx==2}" @click.stop="handleOnClickTap(2)">搭建VIE<i class="ld-tap-side-check"></i></div>
    <div class="ld-capital-tap" :class="{active: tapIdx==3}" @click.stop="handleOnClickTap(3)">股份制改造<i class="ld-tap-side-check"></i></div>
    <div class="ld-capital-tap" :class="{active: tapIdx==4}" @click.stop="handleOnClickTap(4)">拆股<i class="ld-tap-side-check"></i></div>
    <div class="ld-capital-tap" :class="{active: tapIdx==5}" @click.stop="handleOnClickTap(5)">并股<i class="ld-tap-side-check"></i></div>
    <div class="ld-capital-tap" :class="{active: tapIdx==6}" @click.stop="handleOnClickTap(6)">资本金转增<i class="ld-tap-side-check"></i></div>
  </div>

  <div class="ld-input-min">
    <el-form>
      <template v-if="tapIdx==1">
        <div class="ld-form-groups">
          <div class="ld-form-group">
            <div class="ld-form-group__hd">
              融资（或增资）金额
            </div>
            <div class="ld-form-group__bd">
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-select v-model="currency_type" placeholder="货币选择">
                    <el-option
                      v-for="(item, key) in currencyTypeOpts"
                      :label="item"
                      :value="key">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <el-input v-model="cap_val" placeholder="金额"><span slot="prefix">{{ currencyToken }}</span></el-input>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="ld-form-group">
            <div class="ld-form-group__hd">
              因本次融资(或增资)增发的股权，占增发后总股权的比例
            </div>
            <div class="ld-form-group__bd">
              <el-row :gutter="10">
                <el-col :span="16">
                  <el-input v-model="ratio" placeholder=""><span slot="suffix">%</span></el-input>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </template>

      <template v-if="tapIdx==2">
        <div class="ld-form-groups">
          <div class="ld-form-group">
            <div class="ld-form-group__hd">
              已发行总股本
            </div>
            <div class="ld-form-group__bd">
              <el-row :gutter="10">
                <el-col :span="24">
                  <el-input v-model="stock_val" placeholder="VIE架构境外公司"><span slot="suffix">股</span></el-input>
                </el-col>
              </el-row>
            </div>
          </div>

          <div class="ld-form-group">
            <div class="ld-form-group__hd">
              新引入投资人持有股数
            </div>
            <div class="ld-form-group__bd">
              <el-row :gutter="10">
                <el-col :span="24">
                  <el-input v-model="new_stock" placeholder="本次搭建VIE架构过程中新引入投资者持有"><span slot="suffix">股</span></el-input>
                </el-col>
              </el-row>
            </div>
          </div>

          <div class="ld-form-group">
            <div class="ld-form-group__hd">
              VIE搭建完成后公司总估值
            </div>
            <div class="ld-form-group__bd">
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-select v-model="currency_type" placeholder="货币选择">
                    <el-option
                      v-for="(item, key) in currencyTypeOpts"
                      :label="item"
                      :value="key">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <el-input v-model="cap_val" placeholder="金额"><span slot="prefix">{{ currencyToken }}</span></el-input>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </template>

      <template v-if="tapIdx==3">
        <div class="ld-form-groups">
          <div class="ld-form-group">
            <div class="ld-form-group__hd">
              已发行总股本
            </div>
            <div class="ld-form-group__bd">
              <el-row :gutter="10">
                <el-col :span="24">
                  <el-input v-model="stock_val" placeholder="股份制改造后公司已发行总股本"><span slot="suffix">股</span></el-input>
                </el-col>
              </el-row>
            </div>
          </div>

          <div class="ld-form-group">
            <div class="ld-form-group__hd">
              新引入投资人持有股数
            </div>
            <div class="ld-form-group__bd">
              <el-row :gutter="10">
                <el-col :span="24">
                  <el-input v-model="new_stock" placeholder="股份制改造过程中新引入投资者持有"><span slot="suffix">股</span></el-input>
                </el-col>
              </el-row>
            </div>
          </div>

          <div class="ld-form-group">
            <div class="ld-form-group__hd">
              股份制改造完成后公司总估值
            </div>
            <div class="ld-form-group__bd">
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-select v-model="currency_type" placeholder="货币选择">
                    <el-option
                      v-for="(item, key) in currencyTypeOpts"
                      :label="item"
                      :value="key">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <el-input v-model="cap_val" placeholder="金额"><span slot="prefix">{{ currencyToken }}</span></el-input>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </template>

      <template v-if="tapIdx==4">
        <div class="ld-form-groups">
          <div class="ld-form-group">
            <div class="ld-form-group__hd" style="float: left; position: relative; top: 7px;">
              每一股拆分
            </div>
            <div style="float:left; margin-left: 10px; width: 150px;">
              <el-input v-model="ratio" placeholder=""><span slot="suffix">股</span></el-input>
            </div>
          </div>
        </div>
      </template>

      <template v-if="tapIdx==5">
        <div class="ld-input-min">
        <el-form>
          <div class="ld-form-groups">
            <div class="ld-form-group">
              <div class="ld-form-group__hd" style="float: left; position: relative; top: 7px;">
                每
              </div>
              <div style="float:left; margin-left: 10px; width: 150px;">
                <el-input v-model="ratio" placeholder=""><span slot="suffix">股</span></el-input>
              </div>
              <div style="float:left; margin-left: 10px; line-height: 30px;">
                合并成一股
              </div>
            </div>
          </div>
        </el-form>
      </div>
      </template>

      <template v-if="tapIdx==6">
        <div class="ld-form-groups">
          <div class="ld-form-group">
            <div class="ld-form-group__hd" style="float: left; position: relative; top: 7px;">
              每一股经资本金转增后，增加至
            </div>
            <div style="float:left; margin-left: 10px; width: 120px;">
              <el-input v-model="ratio" placeholder=""><span slot="suffix">股</span></el-input>
            </div>
          </div>
        </div>
      </template>
      <div>
        <p style="font-size:16px;">上述资本运作完成后，公司总股数更新为 <b>{{stockMod|currency-format('0,0')}}</b>股;<br>总估值更新为<b>{{capMod|currency-format('0,0.00', currencyMod)}}</b>元。</p>
        <div class="">
          <el-checkbox v-model="checked">确认：更新后的股数和估值信息与公司当前情况一致</el-checkbox>
        </div>
      </div>
      <el-button :disabled="!checked" @click.stop="handleOnClickCapitalSubmit" style="margin-top: 20px;" type="primary" size="small" round>确认</el-button>
    </el-form>
  </div>
</el-dialog>

</div>
</template>

<style lang="less">
@import '../variables.less';
@import '../mixins.less';

.ld-capital-taps {
  .ld-capital-tap {
    margin-right: 15px;
    margin-bottom: 15px;
    display: inline-block;
    text-align: center;
    height: 35px;
    line-height: 35px;
    padding: 0 20px;
    cursor: pointer;
    box-sizing: border-box;
    border: 1px solid @color-split;
    position: relative;
    &.active {
      border-color: #0074f1;
      .ld-tap-side-check {
        display: inline-block;
      }
    }
    .ld-tap-side-check {
      display: none;
      position: absolute;
      right: -1px;
      bottom: -1px;
      width: 18px;
      height: 18px;
      background-size: 18px 18px;
      background-repeat: no-repeat;
      background-image: url('../../assets/images/side_check.png');
    }
  }
}
</style>>

<script>
import {success, error, loading} from '../../common/notify'
import capital from '../../services/capital'
import {CURRENCY_TYPE, CURRENCY_TOKEN} from '../../config/const'
import currencyFormat from '../../filters/currency'
import {exceptionScript} from '../../common/exception'
import localDb from '../../db'

export default {
  props: {
    nextStep: {
      type: Function
    }
  },
  filters: {
    currencyFormat
  },
  computed: {
    currencyToken () {
      return CURRENCY_TOKEN[this.currency_type] || ''
    }
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
      load: null,
      tapIdx: 1,
      checked: false,
      company: {},
      currencyMod: '',
      stockMod: 0,
      capMod: 0,
      dialogCapitalVisible: false,
      // 公司股改数据
      currency_type: '', // 币种类型
      cap_val: '', // 估值/融资金额
      stock_val: '', // 股本数量
      new_stock: '', // 新增股本数量
      ratio: '', // 增发股本占比
      currencyTypeOpts: CURRENCY_TYPE
    }
  },
  mounted () {
  },
  methods: {
    calculate () {
      try {
        switch (this.tapIdx) {
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
    setCompany (company) {
      this.company = company
      this.stockMod = company.c_stock_val
      this.capMod = company.c_cap_val
      this.currencyMod = company.c_cap_currency
      this.currency_type = company.c_cap_currency
    },
    show () {
      this.dialogCapitalVisible = true
    },
    close () {
      this.dialogCapitalVisible = false
    },
    handleOnClickNextStep () {
      this.close()
      this.nextStep && this.nextStep()
    },
    resetData () {
      this.cap_val = ''
      this.stock_val = ''
      this.new_stock = ''
      this.ratio = ''
    },
    handleOnClickTap (idx) {
      this.tapIdx = idx
      this.resetData()
    },
    handleOnClickCapitalSubmit () {
      try {
        switch (this.tapIdx) {
          case 1:
            this.rongZengSubmit ()
          break
          case 2:
            this.vieSubmit ()
          break
          case 3:
            this.gufenzhigaiSubmit ()
          break
          case 4:
            this.chaiguSubmit ()
          break
          case 5:
            this.bingguSubmit ()
          break
          case 6:
            this.zibenzzSubmit ()
          break
        }
      } catch (err) {
        exceptionScript(err)
      }
    },
    rongZengSubmit () {
      this.capitalModify(1, {
        currency_type: this.currency_type,
        cap_val: this.cap_val,
        ratio: this.ratio
      }).then(data => {
        this.$message({
          type: 'success',
          message: '再融资/增资成功!'
        })
        this.resetData()
      })
    },
    vieSubmit () {
      this.capitalModify(2, {
        stock_val: this.stock_val,
        new_stock: this.new_stock,
        currency_type: this.currency_type,
        cap_val: this.cap_val
      }).then(data => {
        this.$message({
          type: 'success',
          message: 'VIE搭建成功'
        })
        this.resetData()
      })
    },
    gufenzhigaiSubmit () {
      this.capitalModify(3, {
        stock_val: this.stock_val,
        new_stock: this.new_stock,
        currency_type: this.currency_type,
        cap_val: this.cap_val
      }).then(data => {
        this.$message({
          type: 'success',
          message: '股份制改造成功'
        })
        this.resetData()
      })
    },
    chaiguSubmit () {
        this.capitalModify(4, {
          ratio: this.ratio
        }).then(data => {
          this.$message({
              type: 'success',
              message: '拆股成功'
          })
          this.resetData()
        })
    },
    bingguSubmit () {
      this.capitalModify(5, {
        ratio: this.ratio
      }).then(data => {
        this.$message({
          type: 'success',
          message: '并股成功'
        })
        this.resetData()
      })
    },
    zibenzzSubmit () {
      this.capitalModify(6, {
        ratio: this.ratio
      }).then(data => {
        this.$message({
          type: 'success',
          message: '资本金转增成功'
        })
        this.resetData()
      })
    },
    capitalModify (type, modata) {
      let modata2 = Object.assign({}, modata, {company_id: this.company.c_id, change_type: type})
      this.load = loading(this, '修改股本信息...')
      return capital.modify(modata2).catch(err => {
        this.load.close()
      }).then(data => {
        this.load.close()
        if (data.data) {
          let company = data.data
          this.stockMod = company.c_stock_val
          this.capMod = company.c_cap_val
          this.currencyMod = company.c_cap_currency

          // 更新本地存储
          let userInfo = localDb.get('userinfo')
          userInfo.company_info = company
          localDb.set('userinfo', userInfo)
          // 保存修改后，下一步
          this.nextStep && this.nextStep()
        }
        return data.data
      })
    }
  }
}
</script>
