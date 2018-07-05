import request from './request'
import api from '../config/api'

const vcode = {
  gen: data => {
    return request().post(api.vcode.gen, data).then(res => {
        return res.data
    })
  },
  load: data => {
    return request().get(api.vcode.load, data)
  }
}

export default vcode
