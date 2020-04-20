const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const schema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: { 
    type: String,
    select: false,
    set (val) {
      return val ? bcrypt.hashSync(val, 10) : val
    }
  }
})

module.exports = mongoose.model('AdminUer', schema) 