import axios from 'axios'

// 创建一个实例，在里面模拟后台接口地址
const http = axios.create({
  baseURL: 'http://localhost:3000/admin/api'
})

export default http