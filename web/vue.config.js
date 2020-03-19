module.exports = {
  outputDir: __dirname + '/../server/web',
  // 前端访问时通过根路径/而不是子文件名/web，可以不配置publichPath，系统会默认根路径
  // publicPath: process.env.NODE_ENV === 'production'
  //   ? '/'
  //   : '/'
}