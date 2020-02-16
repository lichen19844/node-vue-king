// module.exports = () => {
module.exports = options => {

  const jwt = require('jsonwebtoken')
  const assert = require('http-assert')
  // const ok = require('assert')
  const AdminUser = require('../models/AdminUser')

  return async (req, res, next) => {
    // 获取用户信息，校验信息
    console.log('req.headers.authorization', req.headers.authorization)
    const token = String(req.headers.authorization || '').split(' ').pop()
    // 该格式也正确 assert(token, 401, {message: '请先提供 jwt token'})
    assert(token, 401, '请先提供 jwt token')
    const { id } = jwt.verify(token, req.app.get('secret'))
    assert(id, 401, '无效的 jwt token')
    req.user = await AdminUser.findById(id)
    assert(req.user, 401, '请先登录')
    await res.setHeader("Token",token); //等同于 res.header("Token",token);
    // res.setHeader("Access-Control-Expose-Headers","Token");
    await next()
  }
}