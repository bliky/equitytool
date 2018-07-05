import axios from 'axios'
import localdb from '../db'
import Qs from 'qs'
import { exceptionHttp, exceptionServices } from '../common/exception'

axios.defaults.withCredentials = true

export default needLogin => {
  let option = {
    timeout: 10000,
    validateStatus: function (status) {
      return status >= 200
    }
  }

  let header = {}
  let sessionId = localdb.get('session-id')
  header = Object.assign({}, header, {'session-id': sessionId, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'})

  option.headers = header
  //转换请求数以，格式化请求数据
  option.transformRequest = [function (data) {
      //添加csrf-token
      let _csrf_token = localdb.get('csrf-token')
      data = Object.assign({}, data, {'csrf-token': _csrf_token})

      data = Qs.stringify(data);
      return data;
  }]

  let axiosInstance = axios.create(option)
  axiosInstance.interceptors.response.use(function (response) {
    if (response.status != 200) {
      exceptionHttp(response)
      return Promise.reject(response) // 不进then 直接catch 捕获异常
    }
    if (response.data && response.data.retCode != 0) {
      exceptionServices(response)
      return Promise.reject(response) // 不进then 直接catch 捕获异常
    }

    return response
  }, function (err) {
    exceptionHttp(err)
    return Promise.reject(err);
  })
  return axiosInstance
}
