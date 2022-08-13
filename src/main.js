import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/global.less'
import '@/elementUI'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import dayjs from 'dayjs'

Vue.config.productionTip = false

Vue.use(VueQuillEditor /* { default global options } */)

Vue.prototype.$formatDate = dataObj => {
  return dayjs(dataObj).format('YYYY-MM-DD HH:MM:ss')
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
