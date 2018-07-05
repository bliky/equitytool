import request from './request'
import api from '../config/api'

const company = {
  edit: data => {
    return request().post(api.company.edit, data).then(res => {
        return res.data
    })
  },
  get: data => {
    return request().post(api.company.get, data).then(res => {
        return res.data
    })
  },
  verify: data => {
    return request().post(api.company.verify, data).then(res => {
        return res.data
    })
  },
  stockpoolrate: data => {
    return request().post(api.company.stockpoolrate, data).then(res => {
        return res.data
    })
  }
}

export default company
