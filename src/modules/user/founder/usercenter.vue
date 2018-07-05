<template>
  <ld-page>
    <ld-header></ld-header>
    <div class="header-content">
      <!--<img src=""/>
      <p>hi,欢迎来到灵动未来</p>-->
    </div>

    <ld-content :height="560">
      <div class="user-center">
        <div class="aside-content">
          <img src="../../../assets/images/avatar/6.png"/>
          <p class="user-tag">{{userType}}</p>
          <div class="company-name">
            {{accountName}}
          </div>
          <template v-if="userTypeId == 2">
            <div class="expire-lint">
              <p class="expire-time">{{serviceExpiredTime}}到期</p>
              <el-progress :percentage="servicePercent" :show-text="false"></el-progress>
            </div>
            <div style="margin-top: 30px; text-align: center;">
              <a class="ld-btn ld-btn-primary" @click="buyService">续费</a>
            </div>
          </template>
          <template v-else-if="userTypeId == 1">
            <div style="margin-top: 30px; text-align: center;">
              <a class="ld-btn ld-btn-primary" @click="buyService">升级付费用户</a>
            </div>
          </template>
          <template v-else>
            <div style="margin-top: 30px; text-align: center;">
              <a class="ld-btn ld-btn-primary" @click="companyVerify">去认证</a>
            </div>
          </template>
        </div>

        <div class="main-content">
          <template>
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="公司信息" name="first"/>
              <el-tab-pane label="订单管理" name="second"/>
              <el-tab-pane label="账号安全" name="third"/>
            </el-tabs>
          </template>

          <div class="content">
            <template v-if="activeName == 'first'">
              <template v-if="userTypeId < 1">
                <div style="font-size:14px;margin-left: 50px;margin-top: 20px;cursor: pointer;text-align: left;">当前您没有认证信息！<a style="color: #0074f1;" @click="companyVerify">去认证</a></div>
              </template>
              <template v-else>
                <table class="data-list">
                  <tr>
                    <th>企业名称</th>
                    <td>{{userinfo.company_info.c_name}}</td>
                  </tr>
                  <tr>
                    <th>注册号</th>
                    <td>{{userinfo.company_info.c_reg_number}}</td>
                  </tr>
                  <tr>
                    <th>法人姓名</th>
                    <td>{{userinfo.company_info.c_u_name}}</td>
                  </tr>
                  <tr>
                    <th>法人身份证号</th>
                    <td>{{userinfo.company_info.c_id_card}}</td>
                  </tr>
                  <tr>
                    <th>法人名下实名认证的手机号</th>
                    <td>{{companyphone}}</td>
                  </tr>
                </table>
              </template>
            </template>
            <template v-if="activeName == 'second'">
              <template v-if="userTypeId < 1">
                <div style="font-size:14px;margin-left: 50px;margin-top: 20px;cursor: pointer; text-align: left;">当前您没有认证信息！<a style="color: #0074f1;" @click="companyVerify">去认证</a></div>
              </template>
              <template v-else>
                <div class="order-list">
                  <el-table
                          :data="orderList"
                          stripe
                          style="width: 100%; font-size: 14px;">
                    <el-table-column
                            prop="date"
                            label="购买时间"
                            align="center"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="sn"
                            label="单号"
                            align="center"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="content"
                            label="订单内容"
                            align="center"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="amount"
                            label="金额"
                            align="center"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            label="状态"
                            align="center"
                            width="80">
                      <template slot-scope="scope">
                        <template v-if="scope.row.status==1">
                          <div v-show="scope.row.status==1">未付款</div>
                        </template>
                        <template v-else-if="scope.row.status==2">
                          <div>已付款</div>
                          <div v-show="!scope.row.invoiceId">未开发票</div>
                          <div v-show="scope.row.invoiceId">已开发票</div>
                        </template>
                      </template>
                    </el-table-column>
                    <el-table-column
                            prop="operation"
                            align="center"
                            label="操作">
                      <template slot-scope="scope">
                        <template v-if="scope.row.status==1">
                          <div>
                            <a style="color:#0074f1;cursor: pointer;" @click="repay(scope.row.order_id)">去付款</a>
                          </div>
                          <div>
                            <a style="cursor: pointer;color: #ccc;" @click="delOrder(scope.row.order_id)">删除</a>
                          </div>
                        </template>
                        <template v-else>
                          <template v-if="scope.row.invoiceId">
                            <a style="color:#0074f1;cursor: pointer;" @click="viewInvoice(scope.row.invoiceId)">查看发票</a>
                          </template>
                          <template v-else>
                            <a style="color:#0074f1;cursor: pointer;" @click="applyInvoice(scope.row.order_id)">申请发票</a>
                          </template>
                        </template>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-dialog
                          title="提示"
                          :visible.sync="delOrderId"
                          width="30%"
                          :before-close="handleClose">
                    <span>确认要删除该订单?</span>
                    <span slot="footer" class="dialog-footer">
    <el-button @click="delOrderId = 0">取 消</el-button>
    <el-button type="primary" @click="confirm_del_order(delOrderId)">确 定</el-button>
  </span>
                  </el-dialog>
                </div>
              </template>
            </template>
            <template v-if="activeName == 'third'">
              <table class="data-list">
                <tr>
                  <th>手机账户</th>
                  <td>可以使用手机{{userphone}}登录</td>
                </tr>
                <tr>
                  <th>登录密码</th>
                  <td>密码要求至少包括字母，符号或数字中的两项且长度超过6位，建议您经常修改密码，以保证账号更加安全</td>
                </tr>
              </table>
              <div style="margin-top: 50px; text-align: center;">
                <a class="ld-btn ld-btn-primary" @click="changePwd">修改密码</a>
              </div>
            </template>
          </div>
        </div>
      </div>
    </ld-content>
    <ld-footer></ld-footer>
  </ld-page>
</template>

<script>
import {LdContent} from '../../../components/content'
import LdPage from '../../../components/page'
import LdHeader from '../../../components/header'
import LdFooter from '../../../components/footer'
import user from '../../../services/user'
import service from '../../../services/service'
import timeFormat from '../../../filters/time'
import localDb from '../../../db'

export default {
  components: {
    LdContent,
    LdPage,
    LdHeader,
    LdFooter,
  },
  data () {
    return {
        activeName:'',

        userinfo:[],
        companyInfo:[],

        servicePercent:0,
        accountName: '',
        userTypeId: 0,
        userType: '',
        serviceExpiredTime: '',
        userphone: '',
        companyphone: '',

        orderList: [],
        queryOrderList:0,

        userTypeList: ['注册用户','认证用户','付费用户'],

        delOrderId:0,
    }
  },

  mounted () {
      this.activeName = 'first'
      //是否需要更新用户信息
      if(localDb.get('refresh_user')){
          this.get_userinfo().then(()=>{
              this.initUserInfo()
          })
      }else{
          this.initUserInfo()
      }
  },
  methods: {
      initUserInfo(){
          this.userinfo = localDb.get('userinfo')
          if(this.userinfo){
              this.accountName = this.userinfo.u_phone
              if(this.userinfo.has_company && this.userinfo.company_info.c_name){
                  this.accountName = this.userinfo.company_info.c_name
              }else if(this.userinfo.u_name){
                  this.accountName = this.userinfo.u_name
              }else if(this.userinfo.u_email){
                  this.accountName = this.userinfo.u_email
              }

              let phoneStr = this.userinfo.u_phone
              this.userphone = phoneStr.substr(0,3)+"****" + phoneStr.substr(7)

              if(this.userinfo.has_company){
                  let _timestamp = parseInt((new Date().getTime()) / 1000)
                  if(this.userinfo.u_service_expired_time && this.userinfo.u_service_expired_time > _timestamp){
                      this.userTypeId = 2
                      this.serviceExpiredTime = timeFormat(this.userinfo.u_service_expired_time,'YYYY-MM-DD')
                      if(this.userinfo.u_service_start_time && this.userinfo.u_service_expired_time != this.userinfo.u_service_start_time){
                          this.servicePercent = parseInt((_timestamp - this.userinfo.u_service_start_time)/(this.userinfo.u_service_expired_time - this.userinfo.u_service_start_time) * 100)
                      }
                  }else if(this.userinfo.company_info.c_cert_id){
                      this.userTypeId = 1
                  }
                  if(this.userinfo.company_info.c_phone){
                      let c_phonestr = this.userinfo.company_info.c_phone
                      this.companyphone = c_phonestr.substr(0,3)+"****" + c_phonestr.substr(7)
                  }
              }
              this.userType = this.userTypeList[this.userTypeId]
          }else{
              this.$router.push({path: '/login'})
          }
      },
      companyVerify() {
          this.$router.push({path: '/verifycompany'})
      },
      buyService() {
          this.$router.push({path: '/serviceselect'})
      },
      changePwd() {
          this.$router.push({path: '/changepwd'})
      },

      handleClick(tab, event) {
          if(this.activeName == 'second' && this.userTypeId && !this.queryOrderList){
              this.getOrderList()
          }
      },
      getOrderList(){
          let that = this
          service.orderlist({}).then(function (res) {
              if(res.retCode){
                  that.$message(res.errMsg)
              }else{
                  that.queryOrderList=res.data
                  that.formatOrderList()
              }
          }).catch(function (err) {
              console.log('获取用户订单信息失败', err)
          })
      },
      //格式化订单信息
      formatOrderList(){
          console.log('订单列表：')
          console.log(this.queryOrderList)
          this.orderList = []
          for (let i=0, len=this.queryOrderList.length; i<len; i++) {
              this.orderList.push({
                  order_id: this.queryOrderList[i].o_id,
                  sn:this.queryOrderList[i].o_sn,
                  date:timeFormat(this.queryOrderList[i].o_create_time,'YYYY-MM-DD'),
                  content:this.queryOrderList[i].o_order_type == 1 ? '季度服务购买' : '年度服务购买',
                  amount:'￥'+ Number(this.queryOrderList[i].o_order_money).toFixed(2),
                  status:this.queryOrderList[i].o_order_status,
                  invoiceId: this.queryOrderList[i].o_invoice_id
              })
          }
      },
      nextPage() {
          this.$message('没有更多数据了')
      },
      repay(orderId){
          this.$router.push({path: '/serviceselect',query:{oid:orderId}})
      },
      viewInvoice(invoiceId){
          this.$message('正在紧急开发中，发票ID'+invoiceId)
      },
      applyInvoice(orderId){
          this.$message('正在紧急开发中，订单ID：'+orderId)
      },
      delOrder(orderId){
          this.delOrderId = orderId
      },
      confirm_del_order(orderId){
          let that = this
          service.delorder({order_id: orderId}).then(function (res) {
              if(res.retCode){
                  that.$message(res.errMsg)
              }else{
                  that.delOrderId=0
                  that.getOrderList()
              }
          }).catch(function (err) {
              console.log('获取用户订单信息失败', err)
          })
      },
      //如果是从支付完成后进入需要重新获取用户信息
      get_userinfo(){
          localDb.remove('refresh_user')
          let that=this
          return user.userinfo({}).then(function (res){
              if(res.retCode){
                  that.$message(res.errMsg)
              }else{
                  console.log('获取用户信息：', res.data)
                  localDb.set('userinfo', res.data)
              }
          }).catch(function (err) {
              console.log('获取用户信息失败', err)
          })
      }
  }
}
</script>

<style lang="less">

  @import '../../../components/variables.less';
  @import '../../../components/mixins.less';
  
  .header-content{
    height: 60px;
    background-color: @color-blue4;
    p{
      display: block;
      width: 1120px;
      margin-left: auto;
      margin-right: auto;
      color: @color-blue3;
    }
  }

  .user-center{
    .aside-content{
      width: 320px;
      height: 330px;
      float: left;
      text-align: center;
      background-color: @color-blue4;
      font-size: 14px;
      img{
        margin-top: 60px;
        height: 64px;
        width: 64px;
        border-radius: 30px;
      }
      .user-tag{
        display: block;
        height: 20px;
        line-height: 20px;
        color: #ff4f51;
        font-size: 12px;
      }
      .company-name{
        height: 60px;
        line-height: 60px;
      }
      .expire-lint{
        width: 240px;
        margin-top: 10px;
        color: @color-blue3;
        margin-left: 30px;
        text-align: left;
      }
    }

    .main-content{
      width: 784px;
      height: 560px;
      margin-left: 16px;
      float: left;
      .content{
        .data-list{
          font-size: 14px;
          tr{
            line-height: 30px;
          }
          th{
            font-weight: normal;
            text-align: right;
            padding-right: 20px;
          }
          td{
            text-align: left;
          }
        }
        .order-list{
          .el-table th {
            background-color: @color-text-secondary;
            color: #fff;
          }
        }
      }
    }
  }

</style>
