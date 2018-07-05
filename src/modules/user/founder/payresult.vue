<template>
  <ld-page>
    <ld-header></ld-header>

    <ld-content :height="600" style="margin-top: 0px;">
      <div class="header-content">
        支付中心
      </div>

      <div class="main-content">
        <template v-if="pay_result">
          <div class="status-img">
            <img src="../../../assets/images/op_success.png"/>
            <img class="status_flag success" src="../../../assets/images/success_flag.png">
          </div>
          <div class="status">支付成功！</div>
        </template>
        <template v-else>
          <div class="status-img">
            <img src="../../../assets/images/op_fail.png"/>
            <img class="status_flag" src="../../../assets/images/fail_flag.png">
          </div>
          <div class="status">支付失败！<a @click="repay">重新支付</a></div>
        </template>
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
                order_id:0,
                pay_result:0,
            }
        },

        mounted () {
            this.order_id = localDb.get('order_id')
            if(!this.order_id){
                this.$message('订单信息有误')
                vm.$router.push({path: '/usercenter'})
            }
            this.check_pay_status()
        },

        methods: {
            repay(){
                this.$router.push({path: '/serviceselect',query:{oid:this.order_id}})
            },
            check_pay_status(){
                let vm = this
                service.paystatus({order_id: vm.order_id}).then(function (res) {
                    if(res.data.order_status == 2){
                        vm.pay_result = 1
                        setTimeout(function(){
                            vm.$router.push({path: '/usercenter'})
                            return
                        },3000);
                    }
                }).catch(function (err) {
                    console.log('查询订单信息失败', err)
                })
            },
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
    font-size: 16px;
    color: @color-text;
    .status-img{
      margin-top: 90px;
      margin-bottom: 60px;
      position: relative;
      img{
        width: 60px;
        height: 60px;
        position: relative;
        &.status_flag{
          width: 20px;
          height: auto;
          margin-left: -40px;
          margin-top: 20px;
          position: absolute;
        }
        &.success{
          margin-top: 25px;
        }
      }
    }
    a{
      color: @primary-color;
      cursor: pointer;
    }
  }
</style>
