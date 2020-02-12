// 小技巧，直接导出一个函数方法
module.exports = app => {
  const express = require('express')
  // express的子路由，用于增删改查
  const router = express.Router({
    mergeParams: true
  })
  /*
  req.Model 就是 mongoose.model('req.Model', schema)  即
  
  mongoose.model('req.Model', new mongoose.Schema({
    name: { type: String },
    parent: { type: mongoose.SchemaTypes.ObjectId, ref: 'req.Model' }
  })).create({ parent: xxxxid, name: xxxname })

	最后返回的数据结构如下：
  { _id: xxxnewid, name: xxxname, parent: xxxxid }
  */

  // const req.Model = require('../../models/req.Model')

  // 加一个post方法，接口地址是，async函数是写一些执行东西，比如把数据存进数据库
  router.post('/', async (req, res) => {
    // const Model = require(`../../models/${req.params.resource}`)
    // 使用数据库及其模型，使用req.Model.create方法创建数据，数据来源是客户端submit提交过来的数据,存进Mongodb
    // const model = await req.Model.create(req.body)
    const model = await req.Model.create(req.body)
    console.log(model)
    // 发回给前端客户端（但是客户端在哪里接收它呢？可以在rest client插件里看到返回），让客户端知道数据库模型req.Model创建完成和创建的数据
    res.send(model)
  })

  router.put('/:id', async (req, res) => {
    console.log('req.body is ', req.body)
    // req.params.id能拿到/categories/:id接到的id值
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
    // res.send(model)
    model
    res.send('model')
  })

  router.delete('/:id', async (req, res) => {
    await req.Model.findByIdAndDelete(req.params.id, req.body)
    res.send({
      success: true
    })
  })

  router.get('/', async (req, res) => {
    let queryOptions = {}
    if (req.Model.modelName === 'Category') {
      queryOptions.populate = 'parent'
      // queryOptions.populate = {path: 'parent'}
    }
    // const items = await req.Model.find().populate('parent').limit(10)
    // const items = await req.Model.find().populate({path: 'parent'}).limit(10)
    const items = await req.Model.find().setOptions(queryOptions).limit(10)
    console.log('queryOptions is ', queryOptions)
    res.send(items)
  })

  router.get('/:id', async (req, res) => {
    const model = await req.Model.findById(req.params.id)
    res.send(model)
  })  

  // app.use是这个文件中第一个执行的方法，先匹配路径，再执行后面的中间件，再执行next即router
  app.use('/admin/api/rest/:resource', async (req, res, next) => {
    // 将父级接收的:resource参数转成模型的名称(首字母大写单数)
    const modelName = require('inflection').classify(req.params.resource)
    // 挂载Model到请求对象req上成为一个属性，router需要用到它时可以从全局的req上取到。不能使用const Model，因为后面的router访问不到
    req.Model = require(`../../models/${modelName}`)
    console.log(req)
    console.log('req is contain Model ', req.Model)
    console.log('req is contain Model ', req.Model.modelName)
    next()
  } ,router)

  const multer = require('multer')
  // 定义中间件upload
  const upload = multer({dest: __dirname + '/../../uploads'})
  // express本身是获取不到上传数据的，所以需要使用一个中间件来处理获取上传文件
  app.post('/admin/api/upload', upload.single('file'), async (req, res, next) => {
    const file = req.file
    console.log('file is ', file)
    // 前端无法直接访问后端，后端可以将某些资源处理成静态文件供前端访问
    file.url = `http://localhost:3000/uploads/${file.filename}`
    res.send(file)
  })

  app.post('/admin/api/login', async (req, res, next) => {
    // res.send('ok')
    const { username, password } = req.body
    // 1. 根据用户名找用户
    // 2. 校验密码
    // 3. 返回token
  })
}