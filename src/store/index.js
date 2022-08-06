import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedstate from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: ''
  },
  getters: {},
  mutations: {
    updateToken(state, newToken) {
      state.token = newToken
    }
  },
  actions: {},
  modules: {},
  // 持久化存储token
  plugins: [createPersistedstate()]
})
