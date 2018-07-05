import request from './request'
import api from '../config/api'

const upload = {
  picture: data => {
    return request().post(api.upload.picture, data).then(res => {
        return res.data
    })
  }
}

export default upload
