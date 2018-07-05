import request from './request'
import api from '../config/api'

const service = {
  editinvoice: data => {
    return request().post(api.service.editinvoice, data).then(res => {
        return res.data
    })
  },
  invoicelist: data => {
    return request().post(api.service.invoicelist, data).then(res => {
        return res.data
    })
  },
  getinvoice: data => {
    return request().post(api.service.getinvoice, data).then(res => {
        return res.data
    })
  },
  buyservice: data => {
    return request().post(api.service.buyservice, data).then(res => {
        return res.data
    })
  },
  paystatus: data => {
    return request().post(api.service.paystatus, data).then(res => {
        return res.data
    })
  },
  orderlist: data => {
    return request().post(api.service.orderlist, data).then(res => {
        return res.data
    })
  },
  getorder: data => {
    return request().post(api.service.getorder, data).then(res => {
        return res.data
    })
  },
  delorder: data => {
    return request().post(api.service.delorder, data).then(res => {
        return res.data
    })
  },
  repayorder: data => {
    return request().post(api.service.repayorder, data).then(res => {
        return res.data
    })
  },
  addorderinvoice: data => {
    return request().post(api.service.addorderinvoice, data).then(res => {
        return res.data
    })
  },
  getunpayed: data => {
    return request().post(api.service.getunpayed, data).then(res => {
      return res.data
    })
  }
}

export default service
