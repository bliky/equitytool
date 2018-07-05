<template>
  <ld-page>
    <ld-header></ld-header>

    <ld-content :height="content_height" style="margin-top: 0px;">
      <div class="header-content">
        支付中心
      </div>

      <div v-if="order_step==1" class="main-content">
        <div class="content-title">
          感谢您选择灵动求精管理股权激励
        </div>
        <div class="content-des">
          我们为每个认证用户给予免费发出5次授予通知的机会，很抱歉，您的免费次数已用完
          <p>继续使用，请升级为<span>托管用户</span></p>
        </div>

        <div class="service-list">
          <div class="service-item" :class="{active:service_type==1}" @click="selectService(1)">
            <div class="item item-title">-季度托管用户-</div>
            <div class="item item-price">首季度<span>￥999</span></div>
            <div class="item item-discount">
              <p><span>原价3个月1499元</span></p>省<pr>500</pr>元
            </div>
            <i class="check el-icon-circle-check" v-show="service_type==1"/>
            <img src="../../../assets/images/discont_flag.png"/>
            <div class="shelter"></div>
          </div>
          <div class="service-item" :class="{active:service_type==2}" @click="selectService(2)">
            <div class="item item-title">-年度托管用户-</div>
            <div class="item item-price"><span>￥4998</span>/年</div>
            <div class="item item-discount">
              <p><span>原价12个月5996元</span></p>省<pr>998</pr>元
            </div>
            <i class="check el-icon-circle-check" v-show="service_type==2"/>
            <img src="../../../assets/images/annual_discount.png"/>
            <div class="shelter"></div>
          </div>
        </div>

        <div style="text-align: center;">
          <a class="ld-btn ld-btn-danger" @click="nextStep()">下一步</a>
        </div>
      </div>
      <div v-if="order_step==2" class="service-pay">
        <div class="item-title">
          支付金额
          <span class="order-price">￥{{order_price}}</span>
          <p v-if="service_type==1">（首季度尝鲜优惠）</p>
        </div>
        <div class="order-des">
          使用期限：今日完成支付，可在2018年9月31日24前使用
          <span>（使用到期后需付费才能继续使用本系统）</span>
        </div>

        <div class="item-title">
          发票信息
        </div>
        <div class="invoice-list">
          <div class="item" :class="invoice_type==1" @click="setInvoiceType(1)">个人发票<i v-show="invoice_type==1" class="side-check"/></div>
          <div class="item" :class="invoice_type==2" @click="setInvoiceType(2)">企业增值税普通发票<i v-show="invoice_type==2" class="side-check"/></div>
          <div class="item" :class="invoice_type==3" @click="setInvoiceType(3)">企业增值税专用发票<i v-show="invoice_type==3" class="side-check"/></div>
          <div class="item" @click="setInvoiceType(0)">不需要发票<i v-show="invoice_type==0" class="side-check"/></div>
        </div>
        <p style="clear:both;"></p>

        <div class="item-content" v-show="invoice_type">
          <table class="data-list">
            <tr>
              <th><i class="red_ico">*</i>发票抬头</th>
              <td>
                <template v-if="invoice_list.length">
                  <el-dropdown @command="chooseInvoiceCommand" trigger="click" placement="bottom-start">
                  <span class="el-dropdown-link">
                    <el-input v-model="invoice_title"/>
                  </span>
                    <el-dropdown-menu slot="dropdown">
                      <template v-for="invoice in invoice_list">
                        <el-dropdown-item :command="invoice.i_id">{{invoice.i_title}}</el-dropdown-item>
                      </template>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
                <template v-else>
                  <el-input v-model="invoice_title"/>
                </template>
              </td>
            </tr>

            <tr>
              <th><i class="red_ico">*</i>纳税人识别号</th>
              <td>
                <el-input v-model="reg_number"/>
              </td>
            </tr>

            <tr>
              <th><i class="red_ico">*</i>地址</th>
              <td>
                <el-input v-model="reg_addr"/>
              </td>
            </tr>

            <tr>
              <th><i class="red_ico">*</i>电话</th>
              <td>
                <el-input v-model="reg_mobile"/>
              </td>
            </tr>

            <tr>
              <th><i class="red_ico">*</i>开户行</th>
              <td>
                <el-input v-model="bank_name"/>
              </td>
            </tr>

            <tr>
              <th><i class="red_ico">*</i>账号</th>
              <td>
                <el-input v-model="bank_account"/>
              </td>
              <a @click="save_invoice">保存</a>
            </tr>
          </table>
        </div>

        <div class="item-title" v-show="invoice_type">
          发票送达方式
        </div>
        <div class="invoice-list" v-show="invoice_type">
          <div class="item" :class="{active:send_type==1}" @click="setSendType(1)">电子发票<i v-show="send_type==1" class="side-check"/></div>
          <div class="item" :class="{active:send_type==2}" @click="setSendType(2)">纸质发票<i v-show="send_type==2" class="side-check"/></div>
        </div>
        <p style="clear:both;"></p>
        <div class="item-content" v-show="invoice_type">
          <table class="data-list">
            <template v-if="send_type==1">
              <tr>
                <th><i class="red_ico">*</i>发票接收邮箱</th>
                <td>
                  <el-input v-model="ship_email"/>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <th><i class="red_ico">*</i>收货人</th>
                <td>
                  <el-input v-model="ship_name"/>
                </td>
              </tr>
              <tr>
                <th><i class="red_ico">*</i>收货地址</th>
                <td>
                  <el-input v-model="ship_addr"/>
                </td>
              </tr>
              <tr>
                <th><i class="red_ico">*</i>电话</th>
                <td>
                  <el-input v-model="ship_phone"/>
                </td>
              </tr>
            </template>
          </table>
        </div>

        <div class="item-title">
          支付方式
        </div>
        <div class="pay-list">
          <div class="pay wxpay" :class="{active:pay_type==1}" @click="setPayType(1)">
            <img src="../../../assets/images/wx_pay.png"/>
            <i v-show="pay_type==1" class="side-check"/>
          </div>
          <div class="pay alipay" :class="{active:pay_type==2}" @click="setPayType(2)">
            <img src="../../../assets/images/ali_pay.png"/>
            <i v-show="pay_type==2" class="side-check"/>
          </div>
        </div>
        <p style="clear:both;"></p>

        <div ref="pay_html" v-html="pay_html"></div>

        <div style="text-align: center; margin-top: 60px">
          <a class="ld-btn ld-btn-danger" @click="doPay()">支付订单</a>
        </div>
      </div>
      <div v-if="order_step==3" class="order-content">
        <div class="order-detail">
          <div class="order-amount">支付金额：<span>{{order_price}}</span>元</div>
          <div class="detial">
            <span>交易订单:20180606001</span>
            <span>交易内容:首季度托管服务</span>
          </div>
        </div>

        <div class="pay-qr-code">
          <div class="qr-img">
            <img :src="pay_qr"/>
          </div>
          <div class="qr-des">
            <img src="../../../assets/images/weixin.png"/>
            <span>使用微信扫码支付</span>
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
    import service from '../../../services/service'
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
                service_type: 2,
                order_step: 1,
                order_price: 4998,
                content_height: 800,
                pay_type:1,
                order_id:0,

                //发票相关
                invoice_list: [],
                invoice_title: '',
                reg_number: '',
                reg_addr: '',
                reg_mobile: '',
                bank_name: '',
                bank_account: '',
                send_type: 2,
                invoice_type: 1,

                ship_name: '',
                ship_phone: '',
                ship_addr: '',
                ship_email: '',
                invoice_id: 0,

                pay_qr: '',
                pay_html: '',

                //查询支付状态的定时器
                check_pay_status_timer:'',

                //路由带入的订单ID
                oid: this.$route.query.oid
            }
        },

        mounted () {
            this.userinfo = localDb.get('userinfo')
            if(!this.userinfo){
                this.$router.push({path: '/login'})
            }
            if(this.oid){
                this.initOrderInfo()
            }
        },

        methods: {
            nextStep(){
                this.order_step = 2
                this.content_height = 1200

                this.getInvoiceList()

                if(!this.oid){
                    //获取已有订单信息
                    let that = this
                    service.getunpayed({order_type:this.service_type}).then(function (res) {
                        if(res.data.order_id){
                            that.order_id = res.data.order_id
                        }
                    }).catch(function (err) {
                        console.log('订单支付异常', err)
                    })
                }
            },
            doPay(){
                if(!this.pay_type){
                    this.$message('请选择支付方式')
                    return
                }
                if(this.invoice_id){
                    if(!this.send_type){
                        this.$message('请选择发票类型')
                    }
                    switch (this.send_type){
                        case 1:
                            if(!this.ship_email){
                                this.$message('请填入发票接收人邮箱')
                                return
                            }
                            break
                        case 2:
                            if(!this.ship_addr || !this.ship_phone || !this.ship_name){
                                this.$message('发票收货人信息不完整')
                                return
                            }
                            break
                        default:
                            break
                    }
                }
                let params = {
                    order_id:this.order_id,
                    pay_type:this.pay_type,
                    order_type:this.service_type,
                    ship_name:this.ship_name,
                    ship_phone:this.ship_phone,
                    ship_addr:this.ship_addr,
                    ship_email:this.ship_email,
                    invoice_id:this.invoice_id,
                    send_type:this.send_type,
                    return_rul:window.location.host+'/payresult'
                }
                let that = this
                service.buyservice(params).then(function (res) {
                    if(res.retCode){
                        that.$message(res.errMsg)
                    }else{
                        that.$message('生成订单成功')
                        that.order_id = res.data.order_id
                        //设置需要更新用户信息的标志
                        localDb.set('refresh_user', 1)
                        //设置订单相关的信息
                        localDb.set('order_id', that.order_id)
                        localDb.set('pay_type', that.pay_type)
                        if(that.pay_type == 2){
                            that.pay_html=res.data.pay_url
                            that.$nextTick(()=>{
                                that.$refs.pay_html.querySelector('#alipaysubmit').submit()
                            })
                        }else{
                            that.pay_qr = res.data.pay_url
                            that.order_step = 3
                            that.content_height = 800
                            that.check_pay_status_timer = setInterval(function(){
                                that.check_pay_status()
                                return ''
                            },2000);
                        }
                    }
                }).catch(function (err) {
                    console.log('订单支付异常', err)
                })
            },
            check_pay_status(){
                let vm = this
                service.paystatus({order_id: vm.order_id}).then(function (res) {
                    if(res.data.order_status == 2){
                        clearInterval(vm.check_pay_status_timer)
                        //TODO: 重新加载用户信息
                        //vm.$router.push({path: '/usercenter'})
                        vm.$router.push({path: '/payresult'})
                    }
                }).catch(function (err) {
                    console.log('查询订单状态失败', err)
                })
            },
            save_invoice(){
                if(this.invoice_type){
                    let params = {
                        id: this.invoice_id,
                        title: this.invoice_title,
                        reg_number: this.reg_number,
                        reg_addr: this.reg_addr,
                        reg_mobile: this.reg_mobile,
                        bank_name: this.bank_name,
                        bank_account: this.bank_account
                    }
                    let that = this
                    service.editinvoice(params).then(function (res) {
                        if(res.retCode){
                            that.$message(res.errMsg)
                        }else{
                            that.$message('发票信息保存成功')
                            that.invoice_id = res.data.invoiceId
                        }
                    }).catch(function (err) {
                        console.log('公司认证接口请求异常', err)
                    })
                }else{
                    this.$message('无需添加发票信息')
                }
            },
            //获取发票列表
            getInvoiceList(){
                let that=this
                service.invoicelist({page_size:6}).then(function (res) {
                    if(res.retCode){
                        that.$message('获取发票列表失败：'+res.errMsg)
                    }else{
                        that.invoice_list = res.data
                        console.log('发票列表信息')
                        console.log(that.invoice_list)
                    }
                }).catch(function (err) {
                    console.log('公司认证接口请求异常', err)
                })
            },
            //选择服务类型
            selectService(serviceType){
                this.service_type = serviceType
                if(serviceType == 1){
                    this.order_price = 999
                }else{
                    this.order_price = 4998
                }
            },
            //选择支付类型
            setPayType(payType){
                this.pay_type = payType
            },
            //选择纸质或者电子发票
            setSendType(sendType){
                this.send_type = sendType
            },
            //选择发票类型
            setInvoiceType(invoiceType){
                this.invoice_type = invoiceType
            },
            chooseInvoiceCommand(command) {
                for (let i=0, len=this.invoice_list.length; i<len; i++) {
                    if(command == this.invoice_list[i].i_id){
                        this.invoice_id = this.invoice_list[i].i_id
                        this.invoice_title = this.invoice_list[i].i_title
                        this.reg_number = this.invoice_list[i].i_reg_number
                        this.reg_addr = this.invoice_list[i].i_reg_addr
                        this.reg_mobile = this.invoice_list[i].i_reg_mobile
                        this.bank_name = this.invoice_list[i].i_bank_name
                        this.bank_account = this.invoice_list[i].i_bank_account
                        if(this.invoice_list[i].i_ship_name){
                            this.ship_name = this.invoice_list[i].i_ship_name
                        }
                        if(this.invoice_list[i].i_ship_addr){
                            this.ship_addr = this.invoice_list[i].i_ship_addr
                        }
                        if(this.invoice_list[i].i_ship_phone){
                            this.ship_phone = this.invoice_list[i].i_ship_phone
                        }
                        if(this.invoice_list[i].i_ship_email){
                            this.ship_email = this.invoice_list[i].i_ship_email
                        }
                    }
                }
            },
            //初始加载订单信息
            initOrderInfo(){
                let that=this
                service.getorder({order_id:that.oid}).then(function (res) {
                    if(res.retCode){
                        that.$message('订单信息有误：'+res.errMsg)
                        that.$router.push({path: '/usercenter'})
                    }else{
                        let resData = res.data
                        that.order_id = resData.o_id
                        that.pay_type = resData.o_pay_type
                        that.selectService(resData.o_order_type)
                        if(resData.o_invoice_id){
                            let vm=that
                            service.getinvoice({invoice_id:resData.o_invoice_id}).then(function (invoice_res) {
                                if(res.retCode){
                                    that.$message('发票信息有误：'+res.errMsg)
                                    vm.$router.push({path: '/usercenter'})
                                }else{
                                    let invoiceData = invoice_res.data
                                    vm.invoice_id = invoiceData.i_id
                                    vm.invoice_title = invoiceData.i_title
                                    vm.reg_number = invoiceData.i_reg_number
                                    vm.reg_addr = invoiceData.i_reg_addr
                                    vm.reg_mobile = invoiceData.i_reg_mobile
                                    vm.bank_name = invoiceData.i_bank_name
                                    vm.bank_account = invoiceData.i_bank_account
                                    if(invoiceData.i_ship_name){
                                        vm.ship_name = invoiceData.i_ship_name
                                    }
                                    if(invoiceData.i_ship_addr){
                                        vm.ship_addr = invoiceData.i_ship_addr
                                    }
                                    if(invoiceData.i_ship_phone){
                                        vm.ship_phone = invoiceData.i_ship_phone
                                    }
                                    if(invoiceData.i_ship_email){
                                        vm.ship_email = invoiceData.i_ship_email
                                    }
                                    vm.invoice_type=invoiceData.i_type
                                }
                            }).catch(function (err) {
                                console.log('公司认证接口请求异常', err)
                            })
                        }else{
                            that.invoice_type=0
                        }
                        that.nextStep()
                    }
                }).catch(function (err) {
                    console.log('获取订单信息请求异常', err)
                })
            }
        }
    }
</script>

<style lang="less">
  @import '../../../components/variables.less';
  @import '../../../components/mixins.less';

  .header-content{
    height: 68px;
    line-height: 68px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    background-color: @color-blue3;
  }

  .main-content{
    text-align: center;
    width: 700px;
    margin-left: auto;
    margin-right: auto;
    .content-title{
      font-size: 20px;
      color: @color-title;
      margin: 45px auto 30px;
    }
    .content-des{
      font-size: 14px;
      margin-bottom: 45px;
      color: @color-text;
      p{
        margin-top: 10px;
        span{
          color: @color-red2;
        }
      }
    }
    //服务选择
    .service-list{
      height: 164px;
      width: 100%;
      margin-bottom: 90px;
      .service-item{
        width: 340px;
        height: 164px;
        border: 1px solid @color-text-gray;
        float: left;
        position: relative;
        cursor: pointer;
        &+.service-item{
          margin-left: 20px;
        }
        &.active{
          border: 1px solid @color-red2;
          .shelter{
            width: 340px;
            height: 164px;
            background-color: @color-red2;
            position: absolute;
            opacity: 0.15;
            left:0;
            top:0;
          }
        }
        img{
          position: absolute;
          top:-14px;
          left:-14px;
        }
        .check{
          position: absolute;
          right: 5px;
          top: 5px;
          color: @color-red2;
        }
        .item{
          height: 35px;
          line-height: 35px;
          margin-top: 15px;
          color: @color-text-secondary;
          &.item-title{
            font-size: 16px;
            color: @color-text;
          }
          &.item-discount{
            font-size: 14px;
            p{
              text-decoration:line-through;
              color: @color-red2;
              display: inline-block;
              margin-right: 5px;
              span{
                color: @color-text-secondary;
              }
            }
            pr{
              color: @color-red2;
            }
          }
          &.item-price{
            font-size: 16px;
            color: @color-text-secondary;
            span{
              font-size:45px;
              color: @color-red2;
            }
          }
        }
      }
    }
  }

  //支付页面
  .service-pay{
    text-align: center;
    width: 680px;
    margin-left: 220px;
    margin-top: 60px;
    .item-title{
      font-size: 16px;
      text-align: left;
      margin-top: 45px;
      margin-bottom: 20px;
      .order-price{
        margin: 0 20px;
        font-size: 30px;
        color: @color-red2;
      }
      p{
        display: inline-block;
        font-size: 12px;
        color: @color-pink;
      }
    }
    .red_ico{
      color: red;
      margin-right: 5px;
    }
    .order-des{
      font-size: 12px;
      color: @color-text-secondary;
      margin: 0 10px 30px 24px;
      text-align: left;
      span{
        color: @color-blue4;
      }
    }
    .item-content{
      font-size: 14px;
      margin-top: 30px;
      tr{
        line-height: 40px;
      }
      th{
        width: 120px;
        padding-right: 16px;
        font-weight: normal;
        text-align: right;
      }
      .el-input{
        width: 320px;
        .el-input__inner{
          height: 30px;
        }
      }
      a{
        color: @color-blue;
        margin-left: 20px;
        cursor: pointer;
      }
    }
    //发票及发票配送列表
    .invoice-list{
      .item{
        height: 30px;
        text-align: center;
        line-height: 30px;
        border: solid 1px @color-text-gray-light;
        float: left;
        margin-left: 16px;
        font-size: 12px;
        color: @color-text;
        padding:0 20px;
        position: relative;
        cursor: pointer;
        &.active{
          border:solid 1px @color-blue;
        }
      }
    }
    //选中对勾
    .side-check{
      position: absolute;
      right: -1px;
      bottom: -1px;
      height: 16px;
      width: 16px;
      background-image: url("../../../assets/images/side_check.png");
      background-repeat:no-repeat;
      background-size:100% 100%;
    }
    //支付方式
    .pay-list{
      .pay{
        width: 152px;
        height: 46px;
        border: 1px solid @color-text-gray-light;
        float: left;
        margin-left: 20px;
        line-height: 46px;
        position: relative;
        cursor: pointer;
        img{
          vertical-align: middle;
        }
        &.active{
          border:solid 1px @color-blue;
        }
      }
    }
  }

  //扫码页面
  .order-content{
    text-align: center;
    .order-detail{
      background-color: @color-blue4;
      height: 174px;
      padding-top: 60px;
      .order-amount{
        font-size: 14px;
        color: @color-text;
        span{
          font-size: 20px;
          color: @color-red2;
          display: inline-block;
          margin-left: 20px;
          margin-right: 10px;
        }
      }
      .detial{
        margin-top: 20px;
        margin-bottom: 60px;
        span{
          color: @color-text-secondary;
          font-size: 12px;
          display: inline-block;
          &+span{
            margin-left: 40px;
          }
        }
      }
    }
    .pay-qr-code{
      .qr-img{
        margin-top: 60px;
        img{
          width: 192px;
          height: 192px;
        }
      }
      .qr-des{
        margin-top: 30px;
        img{
          width: 32px;
          height: 32px;
          margin-right: 10px;
          vertical-align:middle;
        }
        span{
          font-size: 12px;
          color: @color-text-secondary;
        }
      }
    }
  }
</style>
