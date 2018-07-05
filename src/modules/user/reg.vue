<template>
  <ld-page fullscreen class="bg-loreg">
    <div style="text-align:center; background-color: rgba(255,255,255,.5); width: 400px; margin: 100px auto; padding: 40px; position: relative; z-index:10;">
      <img src="../../assets/logo.png" />
      <p style="margin-top: 15px; color: #7db8f6; font-size: 14px;">注册灵动未来，释放股权激励价值</p>
      <div class="ld-user-form">
        <div class="ld-user-form-item">
          <el-input placeholder="手机" v-model="mobile">
            <template slot="prepend">+86</template>
          </el-input>
        </div>
        <div class="ld-user-form-item">
          <el-input placeholder="请输入验证码" v-model="vcode">
            <template slot="append"><div class="ld-vcode"><img @click="genNewVcode" :src="vcodeimg"/></div></template>
          </el-input>
        </div>
        <div class="ld-user-form-item">
          <el-input placeholder="请输入验证码" v-model="sms_code">
            <template slot="append"><span style="color: #3f96f4; cursor:pointer;" @click="getSmsCode">获取验证码</span></template>
          </el-input>
        </div>
        <div class="ld-user-form-item">
          <el-input placeholder="请输入密码" type="password" v-model="passwd"></el-input>
        </div>
        <div class="ld-user-form-item">
          <el-input placeholder="请重复输入密码" type="password" v-model="passwd2"></el-input>
        </div>
        <div style="margin-top: 50px;">
          <el-button type="primary" style="width: 100%;" @click="handleReg">注册</el-button>
        </div>
        <p style="margin-top: 20px; text-align: left; color: #94979a; font-size: 12px;">注册代表你已同意《灵动未来服务协议》</p>
      </div>
      <p style="text-align: center; color: #52575d; font-size: 14px; letter-spacing: 2px; margin-top: 40px;">已有账号?<router-link to="/login" style="color:#3f96f4;">登录</router-link></p>
    </div>
    <ld-footer></ld-footer>
    <div class="ld-flyman" style="position: absolute; left:0; bottom: 0;"></div>
  </ld-page>
</template>

<script>
import LdPage from '../../components/page'
import LdHeader from '../../components/header'
import LdFooter from '../../components/footer'
import LdStepbar from '../../components/stepbar'
import user from '../../services/user'
import vcode from '../../services/vcode'
import sms from '../../services/sms'
import {apis} from '../../config/api'
import localDb from '../../db'
import cookie from '../../util/cookie'
import md5 from 'js-md5'

export default {
  components: {
    LdPage,
    LdHeader,
    LdFooter,
    LdStepbar
  },
  data () {
    return {
      vcodeimg: '',
      mobile: '',
      sms_code: '',
      passwd: '',
      passwd2: '',
      cap_id: 0,
      vcode: ''
    }
  },
  mounted () {
    this.genNewVcode()
  },
  methods: {
    handleReg () {
        if(!this.passwd){
            this.$message('请输入密码');
            return
        }

        if(!this.passwd2){
            this.$message('请输入重复密码');
            return
        }

        if(this.passwd !== this.passwd2){
            this.$message('两次输入密码不一致');
            return
        }
        let that = this
        user.register({phone: this.mobile, passwd: md5(this.passwd), sms_code: this.sms_code}).then(function (res) {
            if(res.retCode){
                that.$message(res.errMsg)
            }else{
                let userinfo = res.data
                localDb.set('userinfo', userinfo)
                localDb.set('session-id', userinfo.session_id)
                localDb.set('csrf-token', userinfo.csrf_token)
                cookie.setCookie('csrf-token', res.data.csrf_token)
                //TODO 跳转后续确定
                that.$router.push({path: '/design/d1'});
            }
        })
    },

    getSmsCode(){
        if(!this.mobile){
            this.$message('请输入手机号');
            return
        }
        if(!this.vcode){
            this.$message('请输入图片验证码结果');
            return
        }

        let that = this
        sms.vcode({phone: this.mobile, cap_id: that.cap_id, cap_input: this.vcode,scenario:1}).then(function (res){
            if(res.retCode){
                this.$message(res.errMsg)
            }else{
                //TODO 防止重复发送短信
                this.$message('短信验证码发送成功');
            }
        }).catch(function (err) {
            console.log('短信发送失败', err)
        })
    },

    genNewVcode(){
        let that = this
        vcode.gen({scenario: 'register'}).then(function (res) {
            if(res.data.cap_id){
                that.cap_id = res.data.cap_id
                that.vcodeimg = apis.vcode.load(res.data.cap_id)
            }else{
                that.$message(res.errMsg)
            }
        }).catch(function (err) {
            console.log('获取验证码服务请求异常', err)
        })
    }
  }
}
</script>

<style lang="less">
.ld-user-form {
  width: 300px;
  margin: 30px auto;
  .el-input-group__append {
    padding: 0 10px;
    .ld-vcode {
      height: 38px;
      width: 50px;
      overflow: hidden;
      img {
        height: 100%;
        width: 100%;
      }
    }
  }
  .ld-user-form-item {
    &+.ld-user-form-item {
      margin-top: 20px;
    }
  }
}
</style>
