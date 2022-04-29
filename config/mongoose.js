// 由於 Mongoose 連線是屬於專案的環境設定 (configuration)，所以我們習慣將其歸入一個叫 config 的資料夾
const mongoose = require('mongoose')
const MONGODB_URI = process.env.MONGODB_URI
mongoose.connect(MONGODB_URI)
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

module.exports = db
