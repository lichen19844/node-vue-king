// 连接数据库
module.exports = app => {
  const mongoose = require('mongoose')
  mongoose.connect('mongodb://127.0.0.1:27017/node-vue-king', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })

  // 引用指定文件夹下的所有文件
  require('require-all')(__dirname + '/../models')
}