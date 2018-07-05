<template>
  <ld-page>
    <ld-header></ld-header>

    <ld-content :height="560" style="margin-top: 0px;">
      <div class="header-content">
        账号安全
      </div>

      <div class="main-content">
        <template v-if="setStep == 1">
          <div class="change-title pwd-form-item">
            重新设定密码
          </div>
          <div class="pwd-form-item">
            <el-input placeholder="请输入原密码" type="password" v-model="old_passwd"></el-input>
          </div>
          <div class="pwd-form-item">
            <el-input placeholder="请输入新密码" type="password" v-model="passwd"></el-input>
          </div>
          <div class="pwd-form-item">
            <el-input placeholder="请再次输入新密码" type="password" v-model="passwd2"></el-input>
          </div>
          <div class="pwd-form-item" style="margin-top: 50px;">
            <el-button type="primary" style="width: 100%;" @click="changePwd">确定</el-button>
          </div>
        </template>
        <template v-if="setStep == 2">
          <div class="change-title pwd-form-item">
            新密码设定成功
          </div>
          <img src="../../../assets/images/op_success.png"/>
          <p class="op-lint">您已成功能设定新密码，请用新密码登录</p>
          <div class="pwd-form-item" style="margin-top: 50px;">
            <el-button type="primary" style="width: 100%;" @click="login">马上登录</el-button>
          </div>
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
import user from '../../../services/user'
import localDb from '../../../db'
import md5 from 'js-md5'

export default {
  components: {
    LdContent,
    LdPage,
    LdHeader,
    LdFooter,
  },
  data () {
    return {
      old_passwd:'',
      passwd:'',
      passwd2:'',
      setStep: 1
    }
  },

  mounted () {
  },

  methods: {
      changePwd() {
          if(!this.old_passwd){
              this.$message('请输入原密码');
              return
          }

          if(!this.passwd){
              this.$message('请输入新密码');
              return
          }

          if(!this.passwd2){
              this.$message('请再次输入新密码');
              return
          }

          if(this.passwd == this.old_passwd){
              this.$message('新密码不能与原密码相同');
              return
          }

          if(this.passwd !== this.passwd2){
              this.$message('两次输入密码不一致');
              return
          }
          let that = this
          user.passwd({pwd: md5(this.old_passwd), new_pwd: md5(this.passwd), confirm_pwd: md5(this.passwd2)}).then(function (res) {
              if(res.retCode){
                  that.$message(res.errMsg)
              }else{
                  localDb.remove('userinfo')
                  user.logout({}).then(function (res) {
                      if(res.retCode){
                          that.$message(res.errMsg)
                      }
                  })
                  that.setStep = 2
              }
          })
      },

      handleClick(tab, event) {
          console.log(tab)
      },

      login() {
          this.$router.push({path: '/login'});
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
    .pwd-form-item{
      width: 300px;
      margin: 30px auto;
    }
    .change-title{
      color: @color-blue;
    }
    img{
      width: 72px;
      height: 72px;
    }
    .op-lint{
      font-size: 12px;
      display: block;
      margin-top: 20px;
    }
  }

</style>
