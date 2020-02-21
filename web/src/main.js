import Vue from 'vue'
import App from './App.vue'
import './assets/scss/style.scss'
import router from './router'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper)
import './assets/iconfont/iconfont.css'

Vue.config.productionTip = false

// 注册卡片Card到全局
import Card from './components/Card'
Vue.component('m-card', Card)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
