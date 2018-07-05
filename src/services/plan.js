import request from './request'
import api from '../config/api'

const plan = {
  delete: data => {
    return request().post(api.plan.delete, data).then(res => {
      return res.data
    })
  },
  create: data => {
    return request().post(api.plan.create, data).then(res => {
      return res.data
    })
  },
  get: data => {
    return request().get(api.plan.get(data.plan_id)).then(res => {
      return res.data
    })
  },
  enter: data => {
    return request().post(api.plan.enter, data).then(res => {
      return res.data
    })
  },
  list: params => {
    return request().get(api.plan.list, {params: params}).then(res => {
      return res.data
    })
  },
  detail: data => {
    return request().post(api.plan.detail, data).then(res => {
      return res.data
    })
  },
  grants: data => {
    return request().post(api.plan.grants, data).then(res => {
      return res.data
    })
  },
  grant: data => {
    return request().post(api.plan.grant, data).then(res => {
      return res.data
    })
  },
  dash: data => {
    return request().post(api.plan.dash, data).then(res => {
      return res.data
    })
  },
  downtpl: data => {
    return request().post(api.plan.downtpl, data).then(res => {
      return res.data
    })
  }
}

export default plan
