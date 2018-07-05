<template>
  <ld-content :height="560">
    <ld-stepbar :step="1" step1Text="方案机制录入"></ld-stepbar>

    <div class="ld-entry2">
      <div class="ld-entry-group">
        <div class="ld-entry-group__hd">当前估值</div>
        <div class="ld-entry-group__bd">
          <div class="ld-entry-item">
            <el-select v-model="selected" placeholder="请选择" :disabled="has_noticed">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="ld-entry-item">
            <el-input v-model="cap_val"  type="number" placeholder="请输入当前估值" :disabled="has_noticed"></el-input>
          </div>
        </div>
      </div>

      <div class="ld-entry-group">
        <div class="ld-entry-group__hd">股本数量</div>
        <div class="ld-entry-group__bd">
          <div class="ld-entry-item" style="color:#52575d;">
            设定股本
          </div>
          <div class="ld-entry-item">
            <el-input  v-model.trim="stock_val"  type="number" placeholder="请输入股本数量" :disabled="has_noticed"></el-input>
          </div>
        </div>
      </div>
    </div>

    <div style="margin-bottom:100px;text-align: center;">
      <router-link to="/entry/e1" class="ld-btn ld-btn-primary">上一步</router-link>
      <a class="ld-btn ld-btn-primary" @click="nextStep">下一步</a>
    </div>

  </ld-content>
</template>

<style lang="less">
@import '../../components/variables.less';
@import '../../components/mixins.less';

.ld-entry2 {
  margin-top: 90px;
  margin-bottom: 90px;
  text-align: center;
  .ld-entry-group {
    &+.ld-entry-group {
      margin-left: 120px;
    }
    width: 260px;
    display: inline-block;
    .ld-entry-group__hd {
      font-size: 16px;
      color: #272e35;
      font-weight: bold;
      height: 60px;
      line-height: 60px;
      margin-bottom: 30px;
    }
    .ld-entry-group__bd {
      background-color: #fff;
      border: 1px solid @color-split;
      .ld-entry-item {
        height: 60px;
        line-height: 60px;
        font-size: 14px;
        .el-input.is-disabled .el-input__inner, .el-input__inner {
          border: 0;
        }
        &+.ld-entry-item {
          border-top: 1px solid @color-split;
        }
      }
    }
  }
}
</style>

<script>
import LdStepbar from '../../components/stepbar'
import plan from '../../services/plan'
import localDb from '../../db'
import {info, success, warning, error} from '../../common/notify'

export default {
  components: {
      LdStepbar,
  },
  data () {
    return {
      user: localDb.get('userinfo'),
      company: {},
      has_noticed: false,
      options: [
        {
          value: '1',
          label: '人民币'
        },
        {
          value: '2',
          label: '美元'
        },
        {
          value: '3',
          label: '港币'
        }
      ],
      selected: '货币',
      stock_val:'100000000',
      cap_val:''
    }
  },
  mounted () {
    if (!this.user) {
      this.$router.push('/login')
    }
    this.company = this.user.company_info
    this.has_noticed = this.company.c_has_noticed=='1'?true:false
    //if (this.has_noticed) {
      this.selected = this.company.c_cap_currency
      this.stock_val = this.company.c_stock_val
      this.cap_val = this.company.c_cap_val
    //}
  },
  methods: {
    nextStep: function () {
      // 估值币种
      if (['1','2','3'].indexOf(this.selected) === -1) {
        this.$alert('请正确的货币类型', '温馨提示', {
          confirmButtonText: '确定',
        })
        return false
      }
      // 当前估值
      if (this.cap_val == "") {
        this.$alert('请输入当前估值', '温馨提示', {
          confirmButtonText: '确定',
        })
        return false
      }
      // 股本数量
      if (this.stock_val == "") {
        this.$alert('请输入股本数量', '温馨提示', {
          confirmButtonText: '确定',
        })
        return false
      }
      // 保存数据
      let that = this
      let paramete = {
        tool_type:localDb.get('toolTypeId'),
        keep_type:localDb.get('keepTypeId'),
        cap_currency:this.selected,
        cap_val:this.cap_val,
        stock_val:this.stock_val,
      }

      localDb.set('cap_currency', that.selected)
      localDb.set('cap_val', that.cap_val)
      localDb.set('stock_val', that.stock_val)

      console.log('', this.has_noticed)

      if (this.has_noticed) {
        that.$router.push('/entry/e3')
      } else {
        plan.enter(paramete).then(res => {
          // 重新设置 估值币种  当前估值 股本数量

          // 重新设置local storage 公司信息
          let userinfo = that.user
          console.log(userinfo)
          userinfo.has_company = 1
          userinfo.company_info.c_cap_currency = that.selected
          userinfo.company_info.c_cap_val = that.cap_val
          userinfo.company_info.c_stock_val = that.stock_val
          localDb.set('userinfo',userinfo)

          if (res.data.jump == '1') {
            that.$confirm(res.data.tips, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'info'
            }).then(() => {
              that.$router.push('/grant/' + res.data.p_id)
            }).catch(() => {
              info('取消跳转')         
            })
          } else {
            that.$router.push('/grant/' + res.data.p_id)
          }
        })
      }
    }
  }
}
</script>
