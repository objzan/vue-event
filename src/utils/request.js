import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'

const myAxios = axios.create({
  baseURL: 'http://big-event-vue-api-t.itheima.net'
})

// 请求拦截器
myAxios.interceptors.request.use(
  config => {
    // 判断vuex是否有token值，注册和登录页面无需token
    if (store.state.token) {
      config.headers.Authorization = store.state.token
    }
    return config
  },
  // 原地留下一个新的promise对象（状态为失败）
  error => Promise.reject(error)
)

// 响应拦截器
myAxios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // console.dir(error)
    // 判断token是否过期
    if (error.response.status === 401) {
      // 清空token
      store.commit('updateToken', '')
      // 清空用户信息
      store.commit('updateUserInfo', {})
      // 强制跳转登录
      router.push('/login')
      Message.error('用户身份过期')
    }
    return Promise.reject(error)
  }
)

export default myAxios
