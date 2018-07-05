import request from './request'
import api from '../config/api'

const user = {
  register: data => {
    return request().post(api.user.register, data).then(res => {
        return res.data
    })
  },
  login: data => {
    return request().post(api.user.login, data).then(res => {
        return res.data
    })
  },
  logout: data => {
    return request().post(api.user.logout, data).then(res => {
        return res.data
    })
  },
  passwd: data => {
    return request().post(api.user.passwd, data).then(res => {
        return res.data
    })
  }
}

export default user
