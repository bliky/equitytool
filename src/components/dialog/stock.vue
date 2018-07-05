<template>
<div>

<div class="ld-plan-viewer">
  <div class="ld-plan-btns center">
    <span class="ld-opt-btn" @click.stop="handleOnClickRongZengBtn">再融资/增资</span>
    <span class="ld-opt-btn" @click.stop="handleOnClickVieBtn">搭建VIE</span>
    <span class="ld-opt-btn" @click.stop="handleOnClickGufenzhigaiBtn">股份制改造</span>
    <span class="ld-opt-btn" @click.stop="handleOnClickChaiguBtn">拆股</span>
    <span class="ld-opt-btn" @click.stop="handleOnClickBingguBtn">并股</span>
    <span class="ld-opt-btn" @click.stop="handleOnClickZibenzzBtn">资本金转增</span>
  </div>
</div>
<!-- *弹窗* -->
<!-- 再融资/增资 -->
<el-dialog width="400px" :visible.sync="dialogRongZengVisible"  custom-class="ld-plan-dialog">
  <div class="ld-input-min">
    <el-form>
      <div class="ld-title">再融资/增资</div>
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
      <div>
        <p style="font-size:16px;">上述资本运作完成后，公司总股数更新为 <b>{{stockMod|currency-format('0,0')}}</b>股;<br>总估值更新为<b>{{capMod|currency-format('0,0.00', currencyMod)}}</b>元。</p>
        <div class="">
          <el-checkbox v-model="checked">确认：更新后的股数和估值信息与公司当前情况一致</el-checkbox>
        </div>
      </div>
      <el-button :disabled="!checked" @click.stop="handleOnClickRongZengDialogSubmit" style="margin-top: 20px;" type="primary" size="small" round>确定</el-button>
    </el-form>
  </div>
</el-dialog>
<!-- 搭建VIE -->
<el-dialog width="400px" :visible.sync="dialogVieVisible"  custom-class="ld-plan-dialog">
  <div class="ld-input-min">
    <el-form>
      <div class="ld-title">搭建VIE</div>
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
      <div>
        <p style="font-size:16px;">上述资本运作完成后，公司总股数更新为 <b>{{stockMod|currency-format('0,0')}}</b>股;<br>总估值更新为<b>{{capMod|currency-format('0,0.00', currencyMod)}}</b>元。</p>
        <div class="">
          <el-checkbox v-model="checked">确认：更新后的股数和估值信息与公司当前情况一致</el-checkbox>
        </div>
      </div>
      <el-button :disabled="!checked" @click.stop="handleOnClickVieDialogSubmit" style="margin-top: 20px;" type="primary" size="small" round>确定</el-button>
    </el-form>
  </div>
</el-dialog>
<!-- 股份制改造 -->
<el-dialog width="400px" :visible.sync="dialogGufenzhigaiVisible"  custom-class="ld-plan-dialog">
  <div class="ld-input-min">
    <el-form>
      <div class="ld-title">股份制改造</div>
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
      <div>
        <p style="font-size:16px;">上述资本运作完成后，公司总股数更新为 <b>{{stockMod|currency-format('0,0')}}</b>股;<br>总估值更新为<b>{{capMod|currency-format('0,0.00', currencyMod)}}</b>元。</p>
        <div class="">
          <el-checkbox v-model="checked">确认：更新后的股数和估值信息与公司当前情况一致</el-checkbox>
        </div>
      </div>
      <el-button :disabled="!checked" @click.stop="handleOnClickGufenzhigaiDialogSubmit" style="margin-top: 20px;" type="primary" size="small" round>确定</el-button>
    </el-form>
  </div>
</el-dialog>
<!-- 拆股 -->
<el-dialog width="400px" :visible.sync="dialogChaiguVisible"  custom-class="ld-plan-dialog">
  <div class="ld-input-min">
    <el-form>
      <div class="ld-title">拆股</div>
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
      <div>
        <p style="font-size:16px;">上述资本运作完成后，公司总股数更新为 <b>{{stockMod|currency-format('0,0')}}</b>股;<br>总估值更新为<b>{{capMod|currency-format('0,0.00', currencyMod)}}</b>元。</p>
        <div class="">
          <el-checkbox v-model="checked">确认：更新后的股数和估值信息与公司当前情况一致</el-checkbox>
        </div>
      </div>
      <el-button :disabled="!checked" @click.stop="handleOnClickChaiguDialogSubmit" style="margin-top: 20px;" type="primary" size="small" round>确定</el-button>
    </el-form>
  </div>
</el-dialog>
<!-- 并股 -->
<el-dialog width="400px" :visible.sync="dialogBingguVisible"  custom-class="ld-plan-dialog">
  <div class="ld-input-min">
    <el-form>
      <div class="ld-title">并股</div>
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
      <div>
        <p style="font-size:16px;">上述资本运作完成后，公司总股数更新为 <b>{{stockMod|currency-format('0,0')}}</b>股;<br>总估值更新为<b>{{capMod|currency-format('0,0.00', currencyMod)}}</b>元。</p>
        <div class="">
          <el-checkbox v-model="checked">确认：更新后的股数和估值信息与公司当前情况一致</el-checkbox>
        </div>
      </div>
      <el-button :disabled="!checked" @click.stop="handleOnClickBingguDialogSubmit" style="margin-top: 20px;" type="primary" size="small" round>确定</el-button>
    </el-form>
  </div>
</el-dialog>
<!-- 资本金转增 -->
<el-dialog width="400px" :visible.sync="dialogZibenzzVisible"  custom-class="ld-plan-dialog">
  <div class="ld-input-min">
    <el-form>
      <div class="ld-title">资本金转增</div>
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
      <div>
        <p style="font-size:16px;">上述资本运作完成后，公司总股数更新为 <b>{{stockMod|currency-format('0,0')}}</b>股;<br>总估值更新为<b>{{capMod|currency-format('0,0.00', currencyMod)}}</b>元。</p>
        <div class="">
          <el-checkbox v-model="checked">确认：更新后的股数和估值信息与公司当前情况一致</el-checkbox>
        </div>
      </div>
      <el-button :disabled="!checked" @click.stop="handleOnClickZibenzzDialogSubmit" style="margin-top: 20px;" type="primary" size="small" round>确定</el-button>
    </el-form>
  </div>
</el-dialog>

</div>
</template>

<script>
import {success, error, loading} from '../../common/notify'
import capital from '../../services/capital'
import {CURRENCY_TYPE, CURRENCY_TOKEN} from '../../config/const'
import localDb from '../../db'

export default {
  props: ['companyId'],
  components: {
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
      checked: false,
      company: {},
      currencyMod: '',
      stockMod: 0,
      capMod: 0,
      capital_type: 0,
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
      dialogZibenzzVisible: false,
    }
  },
  mounted () {
  },
  methods: {
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
    setCompany (company) {
      this.company = company
      this.stockMod = company.c_stock_val
      this.capMod = company.c_cap_val
      this.currencyMod = company.c_cap_currency
      this.currency_type = company.c_cap_currency
    },
    resetData () {
/*      this.cap_val = ''
      this.stock_val = ''
      this.new_stock = ''
      this.ratio = ''*/
    },  
    /* begin 弹窗 */
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
        this.$message({
          type: 'success',
          message: '再融资/增资成功!'
        })
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
        this.$message({
          type: 'success',
          message: 'VIE搭建成功'
        })
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
        this.$message({
          type: 'success',
          message: '股份制改造成功'
        })
        this.dialogGufenzhigaiVisible = false
      })
    },
    handleOnClickChaiguDialogSubmit () {
        this.capitalModify(4, {
            ratio: this.ratio
        }).then(data => {
            this.$message({
                type: 'success',
                message: '拆股成功'
            })
            this.dialogChaiguVisible = false
        })
    },
    handleOnClickBingguDialogSubmit () {
      this.capitalModify(5, {
        ratio: this.ratio
      }).then(data => {
        this.$message({
          type: 'success',
          message: '并股成功'
        })
        this.dialogBingguVisible = false
      })
    },
    handleOnClickZibenzzDialogSubmit () {
      this.capitalModify(6, {
        ratio: this.ratio
      }).then(data => {
        this.$message({
          type: 'success',
          message: '资本金转增成功'
        })
        this.dialogZibenzzVisible = false
      })
    },
    capitalModify (type, modata) {
      let modata2 = Object.assign({}, modata, {company_id: this.companyId, change_type: type})
      this.load = loading(this, '修改股本信息...')
      return capital.modify(modata2).catch(res => {
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
        }
        return data.data
      })
    }
    /* end 弹窗 */
  }
}
</script>
