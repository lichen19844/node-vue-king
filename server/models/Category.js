const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {type: String}
})

// 哪里需要用到这个模型，就在哪里引用
module.exports = mongoose.model('Category', schema)