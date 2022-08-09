import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

const Register = () => import('@/views/register')
const Login = () => import('@/views/login')
const Layout = () => import('@/views/layout')

Vue.use(VueRouter)

const routes = [
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  { path: '/', component: Layout }
]

const router = new VueRouter({
  routes
})

const whiteList = ['/register', '/login']

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
  const token = store.state.token
  // 有token登陆了放行
  if (token) {
    // 如果有token用户名为空发起请求获取用户信息
    if (!store.state.userInfo.username) {
      store.dispatch('getUserInfoActions')
    }
    next()
  } else {
    // 未登录
    // 数组.include(值)作用：判断值是否在数组出现过，出现过返回true
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
