const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const User = require('../../models/User')

// 登入頁
router.get('/login', (req, res) => {
  res.render('login')
})

// 處理登入資訊
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

// 註冊頁
router.get('/register', (req, res) => {
  res.render('register')
})

// 處理註冊資訊
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []

  if (!name || !email || !password || !confirmPassword) {
    errors.push('name, email, password, confirmPassword 均需要填寫')
  }
  if (password !== confirmPassword) {
    errors.push('密碼不一致')
  }
  if (errors.length > 0) {
    return res.render('register', { name, email, errors })
  }

  User.findOne({ email })
    .then(user => {
      if (user) {
        errors.push('此 email 已經註冊過了')
        return res.render('register', { name, email, errors })
      }
      bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => {
          User.create({
            name: name,
            email: email,
            password: hash
          })
            .then(user => {
              return res.render('login')
            })
            .catch(error => comnsole.log(error))
        })
    })
})

// 處理登出
router.get('/logout', (req, res) => {
  delete req.session.email
  delete req.session.passport

  req.logout()
  req.flash('seccess_msg', '成功登出')
  res.redirect('/users/login')
})

module.exports = router
