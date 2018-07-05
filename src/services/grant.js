import request from './request'
import api from '../config/api'

const grant = {
  add: data => {
    return request().post(api.grant.add, data).then(res => {
        return res.data
    })
  },
  get: data => {
    return request().post(api.grant.get, data).then(res => {
        return res.data
    })
  },
  delete: data => {
    return request().post(api.grant.delete, data).then(res => {
        return res.data
    })
  },
  update: data => {
    return request().post(api.grant.update, data).then(res => {
        return res.data
    })
  },
  notice: data => {
    return request().post(api.grant.notice, data).then(res => {
        return res.data
    })
  },
  default: data => {
    return request().post(api.grant.default, data).then(res => {
        return res.data
    })
  },
  staff: data => {
    return request().post(api.grant.staff, data).then(res => {
        return res.data
    })
  },
  getlocktmpl: data => {
    return request().post(api.grant.getlocktmpl, data).then(res => {
        return res.data
    })
  },
  init: data => {
    return request().post(api.grant.init, data).then(res => {
        return res.data
    })
  },
  protocol: data => {
    return request().post(api.grant.protocol, data).then(res => {
      return res.data
    })
  }
}

export default grant
