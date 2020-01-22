const express = require('express')

const app = express()

// 使用跨域模块
app.use(require('cors')())

// 加上处理接收数据req.body 所需的express中间件
app.use(express.json())

// 引用过来是个函数，需要执行
require('./routes/admin')(app)
require('./plugins/db')(app)

// app.listen方法启动监听一个3000端口，同时传入一个回调函数，启动成功之后会调用后面的回调函数参数
app.listen(3000, () => {
  console.log('App listening on port 3000!');
})