const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Record = new Schema({
  name: {
    type: String,
    require: true
  },
  category: {
    type: String,
    require: true
  },
  date: {
    type: String,
    require: true
  },
  amount: {
    type: Number,
    require: true
  },
  userId: {
    type: String
  }
})

module.exports = mongoose.model('Record', Record)
