import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
// import './assets/styles/reset.css'
// import './assets/styles/border.css'
import './assets/styles/style.css'
import router from './router'

Vue.config.productionTip = false
/*
把http.js加载到Vue实例（原型）上的自定义$http属性上，
就可以在任意页面组件上使用this.$http访问数据请求接口
*/
import http from './http'
Vue.prototype.$http = http

// 全局混入，可以在任意页面直接调用getAuthorization方法了
Vue.mixin({
  computed: {
    mixUploadUrl () {
      return this.$http.defaults.baseURL + '/upload'
    }
  },
  methods: {
    mixGetAuthHeaders () {
      return {
        Authorization: `Bearer ${localStorage.token || ''}`
      }
    }
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
