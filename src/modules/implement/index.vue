<template>
  <ld-page>
    <ld-header :active="2"></ld-header>
    <ld-stepbar :step="3"></ld-stepbar>

    <ld-content :height="1000">
      <ld-content-main>

        <div style="text-align: center; margin: 30px;">
          <div>
            <p style="margin-bottom: 30px;">下列授予数据基于公司总股本为<span style="margin:0 5px;">{{company && company.c_stock_val|currency-format('0,0')}}</span>股, 总估值为<span style="margin:0 5px;">{{company && company.c_cap_val|currency-format('0,0.00', company.c_cap_currency)}}</span></p>
            <img src="../../assets/images/arrow_down.png"/>
          </div>
        </div>

        <div class="ld-grant-list">
          <div class="table-title">
            <a class="icon-finish">完成授予</a>
            <a class="icon-unsigned">未签署</a>
            <a class="icon-refused">授予被拒绝</a>
          </div>

          <div class="ld-grant-item open">
            <div class="ld-grant__bd">
              <div class="ld-grant-table">
                <el-table
                  :data="tableData"
                  stripe
                  highlight-current-row
                  style="width: 100%">
                  <el-table-column
                    prop="pi_serial_number"
                    label="ID"
                    align="center"
                    width="100">
                  </el-table-column>
                  <el-table-column
                    width="60"
                    prop="pi_grant_name"
                    label="姓名"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    width="160"
                    prop="pi_grant_email"
                    label="邮箱"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    width="80"
                    prop="pi_staff_id"
                    label="岗位"
                    :formatter="staffTypeFormatter"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    width="80"
                    label="激励工具"
                    align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.pi_tool_type|filter-tool-type }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    width="100"
                    prop="pi_grant_stock"
                    label="授予股数"
                    align="center">
                    <template slot-scope="scope">
                      {{scope.row.pi_grant_stock|currency-format('0,0')}}
                    </template>
                  </el-table-column>
                  <el-table-column
                    width="80"
                    prop="pi_strike_price"
                    label="行权价格"
                    align="center">
                    <template slot-scope="scope">
                      {{scope.row.pi_strike_price|currency-format('$0,0.00')}}
                    </template>
                  </el-table-column>
                  <el-table-column
                    :show-overflow-tooltip = "true"
                    prop="pi_lock_des"
                    label="生效安排描述"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    width="80"
                    align="center">
                    <template slot-scope="scope">
                      <el-popover
                        placement="bottom"
                        width="220"
                        trigger="hover">
                        <div style="text-align: center;">
                          <el-button v-if="scope.row.pi_status==2 || scope.row.pi_status == 3" size="mini" type="text" @click.stop="handleOnClickNotice(scope.row)">再次通知授予</el-button>
                          <el-button size="mini" type="text" @click.stop="handleOnClickViewProtocolBtn(scope.row)">查看协议</el-button>
                          <!-- <el-button v-if="scope.row.pi_status == 2" size="mini" type="text" @click.stop="handleOnClickViewProtocolBtn(scope.row)">撤回</el-button> -->
                          <br v-if="scope.row.pi_status == 3" />
                          <el-button v-if="scope.row.pi_status == 3" size="mini" type="text" @click.stop="handleOnClickEditGrantBtn(scope.row)">修改</el-button>
                          <el-button v-if="scope.row.pi_status == 3" size="mini" type="text" style="color: #F56C6C;" @click.stop="handleOnClickDeleteGrantBtn(scope.row)">删除</el-button>
                        </div>
                        <span slot="reference" class="ld-icon ld-icon-comunicate" style="margin-left: 8px;"></span>
                      </el-popover>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="状态"
                    width="80"
                    align="center">
                    <template slot-scope="scope">
                      <span v-if="scope.row.pi_status==1">编辑中</span>
                      <span v-else-if="scope.row.pi_status==2" title="未签署">
                        <img src="../../assets/images/unsigned_state.png">
                      </span>
                      <span v-else-if="scope.row.pi_status==3" title="授予被拒绝">
                        <img src="../../assets/images/refused_state.png">
                      </span>
                      <span v-else-if="scope.row.pi_status==4" title="授予完成">
                        <img src="../../assets/images/finish_state.png">
                      </span>
                      <span v-else title="已删除">已删除</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </div>

        <el-pagination
          background
          layout="prev, pager, next"
          :total="50"
          @next-click="clickNext()">
        </el-pagination>

        <div style="margin-top: 40px; text-align: center;">
          <router-link class="ld-btn ld-btn-primary" :to="'/grant/' + planId">上一步</router-link>
        </div>
        <ld-footer></ld-footer>
      </ld-content-main>
    </ld-content>

    <!-- 发出授予通知弹窗 -->
    <el-dialog width="400px" :visible.sync="dialogGrantNoticeVisible"  custom-class="ld-plan-dialog">
      <div class="ld-input-min">
        <el-form>
          <div class="ld-title">授予通知</div>
          <div v-if="grantStuff" style="margin-top: 10px;">
            您正在向
            <span style="color:#FF4F51; margin:0 10px;">{{grantStuff && grantStuff.pi_staff_id | filter-stuff-type(grantStuff.pi_staff_type)}} {{grantStuff && grantStuff.pi_grant_name}}</span>授予
            <span style="color:#FF4F51; margin:0 10px;">{{grantStuff && grantStuff.pi_grant_stock | currency-format('0,0')}}</span>股
            <span style="color:#FF4F51; margin:0 10px;">{{grantStuff && grantStuff.pi_tool_type | filter-tool-type}}</span><br>授予通知将发送至
            <span style="color:#FF4F51; margin:0 10px;">{{grantStuff && grantStuff.pi_grant_email}}</span>
          </div>
          <div class="ld-form-groups" style="margin-top: 30px;">
            <div class="ld-form-group">
              <div class="ld-form-group__hd">
                被授予人信息
              </div>
              <div class="ld-form-group__bd">
                <el-row :gutter="10">
                  <el-col :span="20">
                    <el-input v-model="doGrantIdCard" placeholder="被授予人身份证号">
                      <span slot="prepend">身份证</span>
                    </el-input>
                  </el-col>
                </el-row>
                <el-row :gutter="10" style="margin-top: 20px;">
                  <el-col :span="20">
                    <el-date-picker
                      v-model="doGrantDate"
                      value-format="timestamp"
                      type="date"
                      placeholder="选择日期">
                    </el-date-picker>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <el-button @click.stop="hadleOnClickGrantNoticeSubmit" style="margin-top: 20px;" type="primary" size="small" round>确定</el-button>
        </el-form>
      </div>
    </el-dialog>

    <ld-grant-dialog ref="grantEditDialog"></ld-grant-dialog>
  </ld-page>
</template>

<script>
import localDb from '../../db.js'
import {LdContent} from '../../components/content'
import LdPage from '../../components/page'
import LdHeader from '../../components/header'
import LdFooter from '../../components/footer'
import LdStepbar from '../../components/stepbar'
import company from '../../services/company'
import plan from '../../services/plan'
import grant from '../../services/grant'
import {STUFF_TYPE, STRIKE_TYPE, VEST_PLAN_PREOPTS, TOOL_TYPE, COMPANY_TYPE, CURRENCY_TYPE} from '../../config/const'
import currencyFormat from '../../filters/currency'
import percentFormat from '../../filters/percent'
import {filterStuffType, filterToolType} from '../../filters/grant'
import axios from 'axios'
import {success, error} from '../../common/notify'
import { LdGrantDialog } from '../../components/dialog'

export default {
  components: {
    LdPage,
    LdHeader,
    LdFooter,
    LdStepbar,
    LdContent,
    LdGrantDialog
  },
  data () {
    return {
      dialogGrantNoticeVisible: false,
      grantStuff: null,
      doGrantDate: '',
      doGrantIdCard: '',
      currentGrant: {},
      planId: this.$route.params.id,
      company: {},
      total: 0,
      tableData: []
    }
  },
  filters: {
    filterToolType,
    filterStuffType,
    percentFormat,
    currencyFormat
  },
  mounted () {
    let that = this
    let planId =  this.planId
    axios.all([
      company.get(), // 获取公司基本信息
      plan.grant({plan_id: planId, current_page: 1, page_size: 10}),
      plan.get({plan_id: planId}), // 获取方案初始化信息
    ]).then(axios.spread(function (data1, data2, data3) {
      let companyInfo = data1.data[0]
      let roundId = companyInfo.c_round
      that.company = companyInfo
      that.$refs.grantEditDialog.setCompany(companyInfo)
      console.log('获取公司信息', that.company)

      that.total = data2.data.totalCount
      that.tableData = data2.data.dataList
      console.log('获取方案授予', data2, that.tableData)

      let grantType = data3.data.p_grant_type
      let toolType = data3.data.p_tool_type
      that.$refs.grantEditDialog.setGrantType(grantType)

      return axios.all([
        grant.default({round: roundId, grant_type: grantType}),
        grant.getlocktmpl({tool_type: that.toolType})
      ])
    })).then(axios.spread(function (data1, data2) {
      console.log('方案默认信息和生效预设模板', data1, data2)
      let growPlanDefault = parseInt(data1.data.growPlanInfo[0].gp_value) // 年化估值增长预期平均值
      let growthExpect = growPlanDefault
      let growPlanMax = growPlanDefault * 2.5 // 最大值为平均值的6倍

      that.$refs.grantEditDialog.setGrowth(growthExpect, growPlanMax)

      that.$refs.grantEditDialog.setVests(data2.data)
    }))
  },
  methods: {
    clickNext(){
      return false;
    },
    handleOnClickNotice (row) {
      this.grantStuff = row
      this.doGrantIdCard = row.pi_grant_idcard
      this.doGrantDate = row.pi_grant_time * 1000
      this.dialogGrantNoticeVisible = true
    },
    hadleOnClickGrantNoticeSubmit () {
      console.log('提交发出授予通知', this.grantStuff)
      console.log('授予日期', this.doGrantDate)
      let data = this.grantStuff

      grant.notice({
        plan_item_id: data.pi_id,
        grant_idcard: this.doGrantIdCard,
        grant_time: parseInt(this.doGrantDate / 1000)
      }).then(data => {
        success('发出授予成功！')
        this.dialogGrantNoticeVisible = false
      }).catch(err => {
        console.log('发出授予通知API异常', err)
      })
    },
    handleOnClickEditGrantBtn (row) {
      this.$refs.grantEditDialog.set(row)
      this.$refs.grantEditDialog.show()
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
            return this.$message.error(data.errMsg)
          }
          let tableData = this.tableData
          this.total = parseInt(this.total) - 1
          tableData.splice(tableData.indexOf(row), 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      })
    },
    staffTypeFormatter (row, column, cellValue, index) {
      return STUFF_TYPE[row.pi_staff_type][cellValue]
    }
  }
}
</script>

<style lang="less">
@import '../../components/variables.less';
@import '../../components/mixins.less';

.ld-grant-list {
  margin-top: 30px;
  .table-title{
    width: 100%;
    text-align: right;
    font-size: 13px;
    height: 15px;
    line-height: 15px;
    a:before{
      content: '';
      display: inline-block;
      width: 15px;
      height: 15px;
      margin-left: 20px;
      margin-right: 3px;
    }
    .icon-finish:before{
      background-image: url("../../assets/images/finish_state.png");
    }
    .icon-unsigned:before{
      background-image: url("../../assets/images/unsigned_state.png");
    }
    .icon-refused:before{
      background-image: url("../../assets/images/refused_state.png");
    }
  }
  .ld-grant-item {
    margin-top: 20px;

    .ld-grant__bd {
      margin-top: 20px;
      overflow: hidden;
      .ld-grant-table {
        margin-top: -100%;
        .transition(margin-top, .3s);
      }
    }

    &.open {
      .ld-grant__bd {
        .ld-grant-table {
          margin-top: 0;
        }
      }
    }
  }
}

.ld-grant-table {
  .el-table th {
    background-color: #52575D;
    height: 45px;
    font-size: 14px;
    color: #fff;
  }
  .el-table td {
    height: 60px;
    font-size: 12px;
    color: #94979A;
  }
  .el-table td, .el-table th {
    padding: 0;
    .ld-icon {
      padding-top: 9px;
    }
  }
  .el-table th.is-leaf {
    border-bottom: 1px solid #52575D;
  }
  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background: #EAEBEB;
  }
}

.el-pagination{
  text-align: center;
  margin-top: 30px;
}
</style>
