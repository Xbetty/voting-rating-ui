import envConfig from '../config/index.js'
import axios from 'axios'
// import { type } from 'os';
let apiHost = envConfig.apiHost
export default {
  // 发起评分或投票
  initiateScoreOrVote (form) {
    return axios.post(`${apiHost}/project/initiateScoreOrVote`, form)
  },
  // 我发起的评分或投票initiated/已评分或投票列表operated/待评分或投票列表wait
  projectList (form) {
    return axios.post(`${apiHost}/project/projectList`, form)
  },
  // 删除评分或投票项目
  deleteProject (id) {
    return axios.post(`${apiHost}/project/deleteProject`, {
      _id: id
    })
  },
  // 评分或投票详情
  projectDetails (form) {
    return axios.post(`${apiHost}/project/projectDetails`, form)
  },
  // 用户评分或投票
  userOperate (form) {
    return axios.post(`${apiHost}/project/userOperate`, form)
  },
  // 评分/投票统计，我分享的项目列表
  projectStatic (form) {
    return axios.post(`${apiHost}/project/projectStatic`, form)
  },
  // 待操作项目数量
  waitOperateCounts (votingType) {
    return axios.post(`${apiHost}/project/waitOperateCounts`, votingType)
  },
  // 更改项目状态
  changeProjectStatus (form) {
    return axios.post(`${apiHost}/project/changeProjectStatus`, form)
  }
}
