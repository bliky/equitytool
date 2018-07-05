import request from './request'
import api from '../config/api'

const sms = {
  vcode: data => {
    return request().post(api.sms.vcode, data).then(res => {
        return res.data
    })
  }
}

export default sms
