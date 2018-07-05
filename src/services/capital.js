import request from './request'
import api from '../config/api'

const capital = {
  modify: data => {
    return request().post(api.capital.modify, data).then(res => {
        return res.data
    })
  }
}

export default capital
