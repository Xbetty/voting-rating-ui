import axios from 'axios'
import Promise from './promise.service'
import { Message } from 'element-ui'
export default {
  init () {
    // request拦截
    axios.interceptors.request.use(function (config) {
      config.headers['x-auth-token'] = JSON.parse(localStorage.getItem('userInfo')) ? JSON.parse(localStorage.getItem('userInfo')).token : ''
      config.headers['Content-Type'] = 'application/json'
      config.headers['x-requested-with'] = 'XMLHttpRequest'
      return config
    }, function (error) {
      return Promise.reject(error)
    })

    // response拦截
    axios.interceptors.response.use(function (response) {
      console.log('response', response)
      let data = response.data
      if (data.success || data.code === '0000' || data.code === 0) {
        return Promise.resolve(data)
      } else {
        Message({
          message: data.message || data.msg || '请重试~',
          type: 'warning'
        })
        return Promise.reject(data)
      }
    }, function (error) {
      console.log(1, error.response)
      if (error.response) {
        if (error.response.data.code === '0401' || error.response.status === 401) {
          window.location.href = `${window.location.origin}/login`
        }
        return Promise.reject(error)
      }
    })
  }
}
