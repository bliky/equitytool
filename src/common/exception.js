import { error, login } from './notify'

/*const loginAuth = () => {
  document.getElementById('app').__vue__.$router.push('/login')
}*/
const loginAuth = login

// HTTP请求异常，状态码不等于200
const exceptionHttp = err => {
  console.error('HTTP请求异常: ', err)

  let msg = ''
  let status = err.status || 0
  if (status) {
    switch (status) {
      case 400:
      case '400':
        msg = '[status: ' + status + ', url: ' + err.config.url + ', msg: ' + err.data.message + ']'
        loginAuth()
        break
      case 500:
      case '500':
        msg = '[status: ' + status + ', url: ' + err.config.url + ', msg: ' + err.data.message + ', file: ' + err.data.file + ', line: ' + err.data.line + ']'
        break
      default :
        msg = '[status: ' + status + ', url: ' + err.config.url + ', msg: ' + err.data.message + ']'
        break
    }
  } else {
    msg = '[url: ' + err.config.url + ', msg: ' + err.message + ']'
  }

  error('服务器开小差鸟...请联系后台小哥哥~么么哒~(*^_^*)' + msg)
}

// API接口异常, 状态码等于200, retCode不等于0
const exceptionServices = err => {
  console.error('API调用异常: ', err)

  let retCode = err.data.retCode
  let msg = '[code: ' + retCode + ', url: ' + err.config.url + ', msg: ' + err.data.errMsg + ']'

  switch (retCode) {
    case '1020000': // 未登录
    case 1020000:
      loginAuth()
      break
    case '1040003': // 获取的资源不存在
    case 1040003:
      document.getElementById('app').__vue__.$router.push('/404')
      break
  }

  error('前端API异常处理有点小坏坏...请联系前端小哥哥~么么哒~(*^_^*)' + msg)
  // router.push({ path: 'login', query: { code: '404' }})
}

// 脚本异常：语法错误 对象不存在
const exceptionScript = err => {
  console.error('脚本运行异常: ', err)

  let desc = err.toString().split("\n")[0]
  let msg = '[desc: ' + err.name + '|' + err.message + ']'

  error('脚本错误...请联系前端小哥哥调试代码' + msg)
}

export {
  exceptionHttp,
  exceptionServices,
  exceptionScript
}
