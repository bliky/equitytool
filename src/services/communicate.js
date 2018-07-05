import request from './request'
import api from '../config/api'

const communicate = {
  add: data => {
    return request().post(api.communicate.addcommunication, data).then(res => {
        return res.data
    })
  },
  update: data => {
    return request().post(api.communicate.updatecommunication, data).then(res => {
        return res.data
    })
  },
  del: data => {
    return request().post(api.communicate.delcommunication, data).then(res => {
        return res.data
    })
  },
  confirm: data => {
    return request().post(api.communicate.confirmcommunication, data).then(res => {
        return res.data
    })
  },
  getlist: data => {
    return request().post(api.communicate.getlist, data).then(res => {
        return res.data
    })
  },
  addstafftarget: data => {
    return request().post(api.communicate.addstafftarget, data).then(res => {
        return res.data
    })
  },
  updatestafftarget: data => {
    return request().post(api.communicate.updatestafftarget, data).then(res => {
        return res.data
    })
  },
  initialtargetsinfo: data => {
    return request().post(api.communicate.getlist, data).then(res => {
        return res.data
    })
  }, 
  stafftargetslist: data => {
    return request().post(api.communicate.addstafftarget, data).then(res => {
        return res.data
    })
  }
}

export default communicate
