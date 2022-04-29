const bcrypt = require('bcrypt')

const User = require('../User')
const Record = require('../Record')
const db = require('../../config/mongoose')

const recordJson = require('./record.json').results
const userJson = require('./user.json').results

// 完成，差加入 process.exit()
db.once('open', () => {
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
        return Promise.all(Array.from(
          { length: 3 },
          (value, index) => Record.create({
            name: recordJson[index].name,
            category: recordJson[index].category,
            date: recordJson[index].date,
            amount: recordJson[index].amount,
            userId: userId
          }))
        )
      })
  })
})
