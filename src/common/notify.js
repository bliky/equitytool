import Vue from 'vue'
import user from '../services/user'
import vcode from '../services/vcode'
import {host, apis} from '../config/api'
import localDb from '../db'
import cookie from '../util/cookie'
import md5 from 'js-md5'

const vm =  new Vue()

const info = (msg) => {
  vm.$message({
    type: 'info',
    message: msg
  })
}

const success = (msg) => {
  vm.$message({
    type: 'success',
    message: msg
  })
}

const warning = (msg) => {
  vm.$message({
    type: 'warning',
    message: msg
  })
}

const error = (msg) => {
  vm.$message.error(msg)
}

const loading = (instance, loadingText) => {
  var instance = instance || vm
  return instance.$loading({
    lock: true,
    text: loadingText || '玩命加载中...',
    // spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

const login = () => {
  let mobile = ''
  let passwd = ''
  let vercode = ''
  let vcodeimg = ''
  let capId = ''
  let formId = 'ldLoginForm'
  let imgId = 'ldLoginVcodeImg'

  const h = vm.$createElement
  const handlerOnClickLogin = e => {
    user.login({phone: mobile, passwd: md5(passwd), cap_id: capId, cap_input: vercode}).then(res => {
      localDb.set('userinfo', res.data)
      localDb.set('session-id', res.data.session_id)
      localDb.set('csrf-token', res.data.csrf_token)
      cookie.setCookie('csrf-token', res.data.csrf_token)
      vm.$msgbox.close()
      location.reload()
      success('登录成功')
    })
  }

  const getVercode = () => vcode.gen().then(res => {
    vcodeimg = apis.vcode.load(res.data.cap_id)
    capId = res.data.cap_id
    return vcodeimg
  })

  const handlerOnClickVcode = e => {
    getVercode().then(vcodeimg => {
      document.getElementById(imgId).src = vcodeimg
    })
  }

  const open = () => {
    let msgBox = vm.$msgbox({
      title: '',
      message: (function (argument) {
        console.log('登录弹窗this', vm)
        return h('div', {class:"ld-login-form", attrs:{id: formId}}, [
          h('div', {class:"ld-logo"}, [
            h('img', {attrs:{src: '/static/logo.png'}}),
            h('p', null, '登录灵动未来，释放股权激励价值')
          ]),
          h('div', {class:'ld-login-form__item'}, [
            h('div', {class:"el-input el-input-group el-input-group--prepend"}, 
            [h('div', {class:'el-input-group__prepend'}, '+86'), h('input', {class:'el-input__inner', domProps:{value:mobile}, on:{input:e=>{mobile=event.target.value}}, attrs:{placeholder:'手机'}})])
          ]),
          h('div', {class:'ld-login-form__item'}, [
            h('div', {class:"el-input el-input-group el-input-group--prepend"}, 
            [h('input', {class:'el-input__inner', domProps:{value:passwd}, on:{input:e=>{passwd=event.target.value}}, attrs:{type:'password', placeholder:'请输入密码'}})])
          ]),
          h('div', {class:'ld-login-form__item'}, [
            h('div', {class:"el-input el-input-group el-input-group--append"}, [
              h('input', {class:'el-input__inner', domProps:{value:vercode}, on:{input:e=>{vercode=event.target.value}}, attrs:{placeholder:'输入验证码'}}),
              h('div', {class:'el-input-group__append', on:{click:handlerOnClickVcode}}, [h('div', {class:'ld-vcode'}, [h('img', {attrs:{id:imgId, alt:'点击获取', src:vcodeimg}})])])
            ])
          ]),
          h('div', {style:{marginTop:'50px'}}, [h('button', {style:{width:'100%'}, class:'el-button el-button--primary', on:{
            click: handlerOnClickLogin
          }}, '登录')])
        ])
      })(),
      customClass: 'ld-login-dialog',
      showCancelButton: false,
      showConfirmButton: false,
      closeOnClickModal: false,
      showClose: true
    })
  }

  getVercode().then(()=>{
    open()
  })
}

export {
  info,
  success,
  warning,
  error,
  login,
  loading
}
