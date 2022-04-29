// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
const { authenticator } = require('../middleware/auth') // 驗證登入狀態

// 引用路由模組
const home = require('./modules/home')
const record = require('./modules/record')
const users = require('./modules/users')
const auth = require('./modules/auth')

// 路由模組
router.use('/record', authenticator, record)
router.use('/users', users)
router.use('/auth', auth)
router.use('/', authenticator, home)

// 匯出路由模組
module.exports = router
