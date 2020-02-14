import axios from 'axios'
import Vue from 'vue'

// 创建一个实例，在里面模拟后台接口地址
const http = axios.create({
  baseURL: 'http://localhost:3000/admin/api'
})

// Add a request interceptor
http.interceptors.request.use(config => {
  // Do something before request is sent
  config.headers.Authorization = 'Bearer '+ localStorage.token
  return config;
}, error => {
  // Do something with request error
  return Promise.reject(error);
});

http.interceptors.response.use(res => {
  // console.log('撸羊毛', res)
  return res
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