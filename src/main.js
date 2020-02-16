import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import moment from 'moment'

Vue.config.productionTip = false

Vue.use(ElementUI)

// =================axios优化
axios.defaults.baseURL = 'http://localhost:3000'
Vue.prototype.$axios = axios

// 配置时间过滤器
Vue.filter('time', (input) => {
  return moment(input).format('YYYY-MM-DD HH:mm:ss')
})

// 处理后台返回url地址的不完整
Vue.prototype.$fixUrl = function (url) {
  // 如果地址是以http开头的就直接返回出去(否则进行处理)
  if (url.startsWith('http')) return url
  return axios.defaults.baseURL + url
}

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
