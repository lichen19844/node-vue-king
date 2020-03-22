// 小技巧，直接导出一个函数方法
module.exports = app => {
  const express = require('express')
  // express的子路由，用于增删改查
  const router = express.Router({
    mergeParams: true
  })
  const bcrypt = require('bcrypt')
  const jwt = require('jsonwebtoken')
  const assert = require('http-assert')
  // const ok = require('assert')
  const AdminUser = require('../../models/AdminUser')

  // 登录校验中间件
  const authMiddleware = require('../../middleware/auth')
  // 资源中间件
  const resourceMiddleware = require('../../middleware/resource')

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

  // 创建资源
  // 加一个post方法，接口地址是，async函数是写一些执行东西，比如把数据存进数据库
  router.post('/', async (req, res) => {
    // const Model = require(`../../models/${req.params.resource}`)
    // 使用数据库及其模型，使用req.Model.create方法创建数据，数据来源是客户端submit提交过来的数据,存进Mongodb
    const model = await req.Model.create(req.body)
    console.log(model)
    // 发回给前端客户端（但是客户端在哪里接收它呢？可以在rest client插件里看到返回），让客户端知道数据库模型req.Model创建完成和创建的数据
    res.send(model)
  })

  // 更新资源
  router.put('/:id', async (req, res) => {
    console.log('req.body is ', req.body)
    // req.params.id能拿到/categories/:id接到的id值
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
    // res.send(model)
    model
    res.send(model)
  })

  // 删除资源
  router.delete('/:id', async (req, res) => {
    await req.Model.findByIdAndDelete(req.params.id, req.body)
    res.send({
      success: true
    })
  })

  // 资源列表
  router.get('/', async (req, res) => {
    console.log('req.app is true ? ', req.app === res.app === app)
    let queryOptions = {}
    if (req.Model.modelName === 'Category') {
      queryOptions.populate = 'parent'
      // queryOptions.populate = {path: 'parent'}
    }
    if (req.Model.modelName === 'Hero') {
      queryOptions.populate = 'categories'
    }
    // const items = await req.Model.find().populate('parent').limit(10)
    // const items = await req.Model.find().populate({path: 'parent'}).limit(10)
    const items = await req.Model.find().setOptions(queryOptions).limit(200).lean()
    console.log('queryOptions is ', queryOptions)
    console.log('lean is', req.Model.find().lean())
    res.send(items)
  })

  // 资源详情
  router.get('/:id', async (req, res) => {
    const model = await req.Model.findById(req.params.id)
    res.send(model)
    console.log('res.statusCode is ', res.statusCode)
  })

  // app.use是这个文件中第一个执行的方法，先匹配路径，再执行后面的中间件，再执行next即router
  app.use(
    '/admin/api/rest/:resource',
    authMiddleware(),
    resourceMiddleware(),
    router
  )

  // multer能够处理获取的上传文件，以便express获取上传数据做进一步处理
  const multer = require('multer')
  const MAO = require('multer-aliyun-oss');

  // 定义中间件upload
  const upload = multer({

    // 阿里云OSS云存储
    storage: MAO({
      config: {
        region: 'oss-cn-hongkong',
        accessKeyId: 'LTAI4FvEU3mcHYkR9fT9iDk7',
        accessKeySecret: 'rII2AXbs47gxg8ZySSzHJ3rsfmtBho',
        bucket: 'node-vue-king'
      }
    })
  })
  // express本身是获取不到上传数据的，所以需要使用一个中间件来处理获取上传文件
  app.post('/admin/api/upload', authMiddleware(), upload.single('file'), async (req, res, next) => {
    // 通过阿里云OSS直接拿到的就是一段url内容
    const file = req.file
    console.log('file is ', file)
    // 前端无法直接访问后端，后端可以将某些资源处理成静态文件供前端访问
    res.send(file)
  })

  // 注册逻辑
  app.post('/admin/api/register', async (req, res, next) => {
    // 注册
    const model = await AdminUser.create(req.body)
    console.log(model)
    // 继续登录，返回token给前端
    const { username, password } = req.body
    const user = await AdminUser.findOne({
      username: username
    }).select('+password')
    console.log('user info is, ', user)
    assert(user, 422, '用户不存在')
    const isValid = bcrypt.compareSync(password, user.password)
    assert(isValid, 422, '密码不正确，请重新输入')
    const token = jwt.sign({
      id: String(user._id)
    },
      app.get('secret')
    )
    res.send({ token })
  })

  // 登录逻辑
  app.post('/admin/api/login', async (req, res, next) => {
    // res.send('ok')
    // 接收数据并解构
    const { username, password } = req.body
    // 1. 根据用户名找用户
    const user = await AdminUser.findOne({
      username: username
    }).select('+password')
    console.log('user info is, ', user)
    // 判断用户不存在
    // assert(user, 422, {message: '用户不存在'})
    assert(user, 422, '用户不存在')
    // try {
    //   assert(user, 422, '用户不存在')
    // } catch (err) {
    //   ok(err.status === 422)
    //   ok(err.message === '用户不存在')
    //   ok(err.expose)
    // }
    // if (!user) {
    //   return res.status(422).send({
    //     message: '用户不存在'
    //   })
    // }
    // 2. 数据库里的用户存在，则校验密码
    const isValid = bcrypt.compareSync(password, user.password)
    // 密码不对
    assert(isValid, 422, '密码不正确，请重新输入')
    // if (!isValid) {
    //   return res.status(422).send({
    //     message: '密码不正确，请重新输入'
    //   })
    // }
    // 3. 返回token
    // jwt.sign({
    //   id: user._id,
    //   _id: user._id,
    //   username: user.username
    // })
    const token = jwt.sign({
      id: String(user._id)
    },
      app.get('secret')
    )
    res.send({ token })
  })

  // 处理错误模块
  app.use(async (err, req, res, next) => {
    // 有时候报错可能没有状态码，我们就用500代替
    res.status(err.statusCode || 500).send({
      message: err.message
    })
  })
}