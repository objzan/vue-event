import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedstate from 'vuex-persistedstate'
import { getUserInfoAPI } from '@/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 登陆token
    token: '',
    // 用户信息
    userInfo: {}
  },
  getters: {
    // username(state) {
    //   return state.userInfo.username
    // }
    // username: state => {
    //   return state.userInfo.username
    // }
    username: state => state.userInfo.username, // 用户名
    nickname: state => state.userInfo.nickname, // 用户昵称
    user_pic: state => state.userInfo.user_pic // 用户头像
  },
  mutations: {
    // 获取token
    updateToken(state, newToken) {
      state.token = newToken
    },
    // 获取用户信息
    updateUserInfo(state, newUserInfo) {
      state.userInfo = newUserInfo
    }
  },
  actions: {
    // 发起网络请求获取用户信息
    async getUserInfoActions(store) {
      const { data: res } = await getUserInfoAPI()
      console.log(res)
      if (res.code !== 0) return
      store.commit('updateUserInfo', res.data)
    }
  },
  modules: {},
  // 持久化存储token
  plugins: [createPersistedstate()]
})
