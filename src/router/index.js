import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/page/login.vue'
import AdminIndex from '@/page/index.vue'
import InitiateScore from '@/page/initiateScore/initiateScore.vue'
import MyInitiateScore from '@/page/myInitiateScore/myInitiateScore.vue'
import ScoreDetails from '@/page/scoreDetails/scoreDetails.vue'
import InitiateVote from '@/page/initiateVote/initiateVote.vue'
import MyInitiateVote from '@/page/myInitiateVote/myInitiateVote.vue'
import VoteDetails from '@/page/voteDetails/voteDetails.vue'
import ScoreStatic from '@/page/scoreStatic/scoreStatic.vue'
import VoteStatic from '@/page/voteStatic/voteStatic.vue'
import PersonStatic from '@/page/personStatic/personStatic.vue'
import PersonManage from '@/page/personManage/personManage.vue'
import UpdatePassword from '@/page/updatePassword/updatePassword.vue'
import UpdateData from '@/page/updateData/updateData.vue'
import WaitScore from '@/page/waitScore/waitScore.vue'
import WaitVote from '@/page/waitVote/waitVote.vue'
import MyScoredProject from '@/page/myScoredProject/myScoredProject.vue'
import MyVotedProject from '@/page/myVotedProject/myVotedProject.vue'
import MySharedProject from '@/page/mySharedProject/mySharedProject.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    // 默认为登录页
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/loginout',
    name: 'loginout',
    component: Login
  },
  {
    // 管理员首页
    path: '/adminIndex',
    name: 'adminIndex',
    component: AdminIndex,
    children: [
      {
        // 默认为发起评分页面
        path: '',
        component: InitiateScore
      },
      {
        // 发起评分
        path: '/initiateScore',
        name: 'initiateScore',
        component: InitiateScore
      },
      {
        // 我发起的评分
        path: '/myInitiateScore',
        name: 'myInitiateScore',
        component: MyInitiateScore
      },
      {
        // 评分项目详情
        path: '/scoreDetails',
        name: 'scoreDetails',
        component: ScoreDetails
      },
      {
        // 发起投票
        path: '/initiateVote',
        name: 'initiateVote',
        component: InitiateVote
      },
      {
        // 我发起的投票
        path: '/myInitiateVote',
        name: 'myInitiateVote',
        component: MyInitiateVote
      },
      {
        // 投票项目详情
        path: '/voteDetails',
        name: 'voteDetails',
        component: VoteDetails
      },
      {
        // 评分统计
        path: '/scoreStatic',
        name: 'scoreStatic',
        component: ScoreStatic
      },
      {
        // 投票统计
        path: '/voteStatic',
        name: 'voteStatic',
        component: VoteStatic
      },
      {
        // 人员统计
        path: '/personStatic',
        name: 'personStatic',
        component: PersonStatic
      },
      {
        // 人员管理
        path: '/personManage',
        name: 'personManage',
        component: PersonManage
      },
      {
        // 修改密码
        path: '/updatePassword',
        name: 'updatePassword',
        component: UpdatePassword
      },
      {
        // 修改个人信息
        path: '/updateData',
        name: 'updateData',
        component: UpdateData
      },
      {
        // 待评分项目
        path: '/waitScore',
        name: 'waitScore',
        component: WaitScore
      },
      {
        // 待投票项目
        path: '/waitVote',
        name: 'waitVote',
        component: WaitVote
      },
      {
        // 已评分项目
        path: '/myScoredProject',
        name: 'myScoredProject',
        component: MyScoredProject
      },
      {
        // 已投票项目
        path: '/myVotedProject',
        name: 'myVotedProject',
        component: MyVotedProject
      },
      {
        // 我分享的项目
        path: '/mySharedProject',
        name: 'mySharedProject',
        component: MySharedProject
      }
    ]
  }]
})
