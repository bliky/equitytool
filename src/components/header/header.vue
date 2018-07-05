<template>
  <div class="ld-navbar-wrapper">
    <div class="ld-navbar">
      <div class="ld-navbar__lt">
        <a href="http://www.lingdongweilai.com"><img src="../../assets/logo.png" style="width: 146px; height: 30px; margin-top: 17px; float: left; "></a>
      </div>
      <div class="ld-navbar__rt">
        <ul class="ld-navbar-list">
          <li class="ld-navbar-item"><router-link to="/" :class="{active:active==1}">首页</router-link></li>
          <li class="ld-navbar-item"><router-link to="/design/d1" :class="{active:active==2}">设计方案</router-link></li>
          <li class="ld-navbar-item"><router-link to="/plan" :class="{active:active==3}">方案管理</router-link></li>
          <li class="ld-navbar-item"><span class="vline" style="top: 3px;opacity: .3;"></span></li>
          <template v-if="this.userinfo.u_id">
            <li class="ld-navbar-item"><router-link to="/usercenter" class="ld-btn-hover">
              <img src="../../assets/images/avatar/6.png"/>
              <el-dropdown>
                <span class="el-dropdown-link u-name">
                  {{accountName}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item><router-link to='/usercenter'>个人中心</router-link></el-dropdown-item>
                  <el-dropdown-item><a @click="logout">退出登录</a></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </router-link></li>
          </template>
          <template v-else>
            <li class="ld-navbar-item"><router-link to="/login" class="ld-btn-hover">登录</router-link></li>
            <li class="ld-navbar-item"><router-link to="/reg" class="ld-btn ld-btn-primary">注册</router-link></li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>

import user from '../../services/user'
import localDb from '../../db'

export default {
  props: {
    active: {
      type: Number,
      default: 0
    }
  },
  components: {
  },
  data (){
    return {
      accountName: '',
      userinfo: []
    }
  },
  mounted () {
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
      if(this.accountName.length > 9){
        this.accountName = this.accountName.substr(0,8)+'...'
      }
    }
  },
  methods: {
    logout: function () {
      let that = this
      user.logout({}).then(function (res) {
        localDb.remove('userinfo')
        that.$router.push({path: '/login'})
      })
    }
  }
}
</script>

<style lang="less">

  .ld-navbar-item{
    img{
      width: 40px;
      height: 40px;
      border-radius: 20px;
      margin-top: 12px;
      float:left;
    }
    .u-name{
      font-size: 12px;
      display: inline-block;
      float: left;
      color: #0074f1;
      margin-left: 10px;
    }
  }
</style>
