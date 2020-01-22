// 导出一个函数方法
module.exports = app => {
  const express = require('express')
  // express的子路由
  const router = express.Router()
  const Category = require('../../models/Category')
  // 加一个post方法，接口地址是/categories，async函数是写一些执行东西
  router.post('/categories', async (req, res) => {
    // 使用数据库及其模型，使用Category.create方法创建数据，数据来源是客户端提交过来的数据存进去
    const model = await Category.create(req.body)
    // 发回给客户端，让客户端知道数据库模型Category创建完成和创建的数据
    res.send(model)
  })
  app.use('/admin/api', router)
}