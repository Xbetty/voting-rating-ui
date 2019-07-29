import Vue from 'vue'
import Vuex from 'vuex'
import projectAPI from './../api/project.api'
Vue.use(Vuex)

const state = {
  waitScoreCount: 0,
  waitVoteCount: 0
}

const mutations = {
  getWaitScoreCount (state, data) {
    state.waitScoreCount = data
  },
  getWaitVoteCount (state, data) {
    state.waitVoteCount = data
  }
}

const actions = {
  getWaitScoreCount ({ commit }) {
    projectAPI.waitOperateCounts({votingType: 1}).then((res) => {
      console.log('res', res)
      if (res.code === '0000') {
        commit('getWaitScoreCount', res.data.total)
      }
    })
  },
  getWaitVoteCount ({ commit }) {
    projectAPI.waitOperateCounts({votingType: 2}).then((res) => {
      console.log('res', res)
      if (res.code === '0000') {
        commit('getWaitVoteCount', res.data.total)
      }
    })
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
