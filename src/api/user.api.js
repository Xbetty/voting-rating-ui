import envConfig from '../config/index.js'
import axios from 'axios'
let apiHost = envConfig.apiHost
export default {
  // -----登录-----
  userLogin (form) {
    return axios.post(`${apiHost}/user/userLogin`, form)
  },
  // -----人员管理-----
  // 获取用户列表
  getInfos (form) {
    return axios.post(`${apiHost}/user/getInfos`, form)
  },
  // 添加用户
  addInfos (form) {
    return axios.post(`${apiHost}/user/addInfos`, form)
  },
  // 删除用户
  removeInfos (id) {
    return axios.post(`${apiHost}/user/removeInfos`, {
      _id: id
    })
  },
  // 修改用户
  updateInfos (form) {
    return axios.post(`${apiHost}/user/updateInfos`, form)
  },
  // 修改密码
  updatePassword (form) {
    return axios.post(`${apiHost}/user/updatePassword`, form)
  },
  // -----人员统计-----
  userStatic (form) {
    return axios.post(`${apiHost}/user/userStatic`, form)
  }
}
