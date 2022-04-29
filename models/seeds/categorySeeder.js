// 載入套件
const db = require('../../config/mongoose')
const Category = require('../Category')

const categoryJson = require('./category.json').results

db.once('open', () => {
  console.log('categories data, mongodb connected!')
  Category.create(categoryJson)
    .then(() => {
      console.log('Category data load in db done.')
      console.log('mongodb disconnected!')
      return db.close()
    })
})
