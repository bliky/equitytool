<template>
  <ld-page fullscreen class="bg-loreg">
    <div style="text-align:center; background-color: rgba(255,255,255,.5); width: 400px; margin: 100px auto; padding: 40px; position: relative; z-index:10;">
      <img src="../../assets/logo.png" />
      <p style="margin-top: 15px; color: #7db8f6; font-size: 14px;">登录灵动未来，释放股权激励价值</p>
      <div class="ld-user-form">
        <div class="ld-user-form-item">
          <el-input placeholder="手机" maxlength="11" v-model="mobile">
            <template slot="prepend">+86</template>
          </el-input>
        </div>
        <div class="ld-user-form-item">
          <el-input placeholder="请输入密码" type="password" v-model="passwd"></el-input>
        </div>
        <div class="ld-user-form-item">
          <el-input placeholder="请输入验证码" v-model="vcode">
            <template slot="append"><div class="ld-vcode"><img   @click="refreshCaptcha"  :src="vcodeimg"/></div></template>
          </el-input>
        </div>
        <div style="margin-top: 50px;">
          <el-button type="primary" style="width: 100%;" @keyup.enter="handleLogin" @click="handleLogin">登录</el-button>
        </div>
        <p style="margin-top: 20px; text-align: right; color: #94979a; font-size: 12px;"><router-link to="/passwd" style="color:#3f96f4;">忘记密码？</router-link></p>
      </div>
      <p style="text-align: center; color: #52575d; font-size: 14px; letter-spacing: 2px; margin-top: 40px;">没有账号?<router-link to="/reg" style="color:#3f96f4;">注册</router-link></p>
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
import {host, apis} from '../../config/api'
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
      passwd: '',
      vcode: '',
      capId: '',
      redirect: this.$route.query.redirect || '/plan'
    }
  },
  mounted () {
    let that = this;
    vcode.gen({scenario: 'login'}).then(function (res) {
      that.vcodeimg = apis.vcode.load(res.data.cap_id);
      that.capId = res.data.cap_id;
    }).catch(function (err) {
      console.log('获取验证码服务请求异常', err)
    })
  },
  methods: {
    refreshCaptcha:function () {
        let that = this;
        vcode.gen({scenario: 'login'}).then(function (res) {
            that.vcodeimg = apis.vcode.load(res.data.cap_id);
            that.capId = res.data.cap_id;
        }).catch(function (err) {
            console.log('获取验证码服务请求异常', err)
        })
    },
    handleLogin:function () {

        if(!this.mobile){
            this.$message('请输入手机号')
            return false
        }
        if(!this.passwd){
            this.$message('请输入密码')
            return false
        }

        if(!this.vcode){
            this.$message('请输入验证码')
            return false
        }
        let that = this
        user.login({phone: this.mobile, passwd: md5(this.passwd), cap_id: this.capId,cap_input:this.vcode}).then(function (res) {
            if(res.retCode == 0){
                localDb.set('userinfo', res.data)
                localDb.set('session-id', res.data.session_id)
                localDb.set('csrf-token', res.data.csrf_token)
                cookie.setCookie('csrf-token', res.data.csrf_token)
                that.$router.push(that.redirect)
            }else{
                that.$message(res.errMsg)
                return false
            }
        })
    },
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
      cursor: pointer;
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
