import axios from 'axios'
import Vue from 'vue'
import router from './router';

// 创建一个实例，在里面模拟后台接口地址
const http = axios.create({
  baseURL: 'http://localhost:3000/admin/api'
})

console.log('axios is ', axios)
console.log('http is ', http)

// Add a request interceptor
http.interceptors.request.use(config => {
  // Do something before request is sent
  if (localStorage.token) {
    config.headers.Authorization = 'Bearer '+ localStorage.token
  }
  return config;
}, error => {
  // Do something with request error
  return Promise.reject(error);
});

http.interceptors.response.use(res => {
  console.log('防止撸羊毛', res)
  if(localStorage.token === res.headers.token) {
    return res
  } else {
    console.log('黑客入侵撸羊毛失败哦')
    router.push('/login')
  }
  
}, err => {
  console.log('err.name is ', err.name)
  console.log('err.response is ', err.response)
  console.log('err.response.data.message is ', err.response.data.message)
  if (err.response.data.message) {
    // Vue.prototype.$message.error(err.response.data.message)
    Vue.prototype.$message({
      type: 'error',
      showClose: true,
      message: err.response.data.message
    })
  }
  return Promise.reject(err)
})

export default http