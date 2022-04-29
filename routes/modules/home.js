// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

const Record = require('../../models/Record')
const Category = require('../../models/Category')

// 顯示首頁
router.get('/', (req, res) => {
  const userId = req.user._id
  const name = req.user.name

  Record.find({ userId })
    .lean()
    .then(records => {
      console.log('1', records)
      Category.find()
        .lean()
        .then(categories => {
          console.log('2', categories)
          // 將各類別之 icon 存入到 record 中
          for (let i = 0; i < records.length; i++) {
            const icon = categories.find(category => category.name === records[i].category).icon
            records[i].categoryIcon = icon
          }
          console.log('3', records)
          return records
        })
        .then(records => {
          console.log('4', records)
          // 計算總金額
          let totalAmount = 0
          for (let i = 0; i < records.length; i++) {
            totalAmount += records[i].amount
          }
          console.log('5', totalAmount)
          const qq = []
          records.forEach(record => qq.push(record.categoryIcon))
          res.render('index', { records: records, totalAmount: totalAmount, name: name, qq: qq })
        })
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
})

router.post('/filter', (req, res) => {
  const userId = req.user._id
  const name = req.user.name

  // 取得使用者選擇之 category
  const filterCategory = req.body.category

  Record.find({ userId })
    .lean()
    .then(records => {
      Category.find()
        .lean()
        .then(categories => {
          // 將各類別之 icon 存入到 record 中
          for (let i = 0; i < records.length; i++) {
            const icon = categories.find(category => category.name === records[i].category).icon
            records[i].categoryIcon = icon
          }

          // 篩選特定類別資料
          let filterRecord = []
          // filterCategory 為空字串，表示選取"全部類別"；若否，則為某特定之 category
          if (filterCategory === '') {
            filterRecord = [...records]
          } else {
            filterRecord = records.filter(item => item.category === filterCategory)
          }

          return filterRecord
        })
        .then(filterRecord => {
          // 計算總金額
          let totalAmount = 0
          for (let i = 0; i < filterRecord.length; i++) {
            totalAmount += filterRecord[i].amount
          }

          res.render('index', { records: filterRecord, totalAmount: totalAmount, name: name })
        })
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
})

module.exports = router
