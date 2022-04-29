const bcrypt = require('bcrypt')

const User = require('../User')
const Record = require('../Record')
const Category = require('../Category')
const db = require('../../config/mongoose')

const recordJson = require('./record.json').results
const userJson = require('./user.json').results
const categoryJson = require('./category.json').results

// 完成，差加入 process.exit()
db.once('open', () => {
  // 建立 users 種子
  userJson.forEach(user => {
    bcrypt.genSalt(10)
      .then(salt => bcrypt.hash(user.password, salt))
      .then(hash =>
        User.create({
          name: user.name,
          email: user.email,
          password: hash
        })
      )
      .then(user => {
        const userId = user._id
        const userName = user.name
        // // 建立個別 user 的 records 種子
        return Promise.all(Array.from(
          { length: recordJson.length },
          (value, index) => Record.create({
            name: userName + recordJson[index].name,
            category: recordJson[index].category,
            date: recordJson[index].date,
            amount: recordJson[index].amount,
            userId: userId
          }))
        )
      })
  })

  // 建立個別 record 的類別
  Category.create(categoryJson)
    .then(() => {
      console.log('Category data load in db done.')
      console.log('mongodb disconnected!')
      return db.close()
    })
})
