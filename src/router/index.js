import Vue from 'vue'
import VueRouter from 'vue-router'

const Register = () => import('@/views/register')
const Login = () => import('@/views/login')

Vue.use(VueRouter)

const routes = [
  { path: '/register', component: Register },
  { path: '/login', component: Login }
]

const router = new VueRouter({
  routes
})

export default router
