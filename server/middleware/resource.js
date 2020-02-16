// module.exports = () => {
module.exports = options => {
  
  return async (req, res, next) => {
    // 将父级接收的:resource参数转成模型的名称(首字母大写单数)
    const modelName = require('inflection').classify(req.params.resource)
    // 挂载Model到请求对象req上成为一个属性，router需要用到它时可以从全局的req上取到。不能使用const Model，因为后面的router访问不到
    req.Model = require(`../models/${modelName}`)
    console.log('req is ', req)
    console.log('req is contain Model ', req.Model)
    console.log('req is contain Model.modelName ', req.Model.modelName)
    next()
  }
}