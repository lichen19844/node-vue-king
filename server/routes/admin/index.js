// 小技巧，直接导出一个函数方法
module.exports = app => {
  const express = require('express')
  // express的子路由，用于增删改查
  const router = express.Router()
  const Category = require('../../models/Category')

  // 加一个post方法，接口地址是/categories，async函数是写一些执行东西，比如把数据存进数据库
  router.post('/categories', async (req, res) => {
    // 使用数据库及其模型，使用Category.create方法创建数据，数据来源是客户端submit提交过来的数据,存进Mongodb
    const model = await Category.create(req.body)
    // 发回给前端客户端（但是客户端在哪里接收它呢？可以在rest client插件里看到返回），让客户端知道数据库模型Category创建完成和创建的数据
    res.send(model)
  })

  router.put('/categories/:id', async (req, res) => {
    console.log('req.body is ', req.body)
    const model = await Category.findByIdAndUpdate(req.params.id, req.body)
    res.send(model)
  })

  router.delete('/categories/:id', async (req, res) => {
    await Category.findByIdAndDelete(req.params.id, req.body)
    res.send({
      success: true
    })
  })

  router.get('/categories', async (req, res) => {
    const items = await Category.find().limit(10)
    // 发送给前端客户端
    res.send(items)
  })

  router.get('/categories/:id', async (req, res) => {
    const model = await Category.findById(req.params.id)
    // 发送给前端客户端
    res.send(model)
  })  

  app.use('/admin/api', router)
}