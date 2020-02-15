const express = require('express')

const app = express()
app.all('*', function(req, res, next) {
  res.setHeader("Access-Control-Expose-Headers","Token");;
  next();
});

app.set('secret', 'jsdru395fnsd9348u5ew43h543k')

// 使用跨域模块
app.use(require('cors')())

// 加上处理接收(json)数据req.body 所需的express中间件
app.use(express.json())

// 托管静态文件，让uploads里的所有文件可以通过/uploads来访问
app.use('/uploads', express.static(__dirname + '/uploads'))

// 子路由功能，引用过来是个函数，需要执行
require('./routes/admin')(app)

// 数据库功能，app这个参数暂时传入进去没用
require('./plugins/db')(app)

// app.listen方法启动监听一个3000端口，同时传入一个回调函数，启动成功之后会调用后面的回调函数参数
app.listen(3000, () => {
  console.log('App listening on port 3000!');
})