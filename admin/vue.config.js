module.exports = {
  outputDir: __dirname + '/../server/admin',
  publicPath: process.env.NODE_ENV === 'production'
  // 生产环境时域名后面添加/admin/，也便于编译后在服务器里曝露admin这个静态接口，需要配合outputDir设置；开发环境时只使用域名如localhost:3000/
    ? '/admin/'
    : '/'
}