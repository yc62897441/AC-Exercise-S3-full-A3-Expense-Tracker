// 載入套件
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 定義伺服器參數
const app = express()
const PORT = process.env.PORT

// 使用 session
const session = require('express-session')
// 載入設定檔，要寫在 express-session 以後
const usePassport = require('./config/passport')

// 載入自定義套件
const db = require('./config/mongoose')
// const Record = require('./models/Record')
const handlebarsSelfDefined = require('./config/handlebars')
// const { redirect } = require('express/lib/response')
const routes = require('./routes/index')

// use 路由前處理
// view engine
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
// body-parser
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(express.urlencoded({ extended: true }))
// method-override
app.use(methodOverride('_method'))

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
usePassport(app)

app.use(flash())

// 設定本地變數 res.locals
// 放在 res.locals 裡的資料，所有的 view 都可以存取
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  // req.user 是在反序列化的時候，取出的 user 資訊，之後會放在 req.user 裡以供後續使用
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg') // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg') // 設定 warning_msg 訊息
  next()
})

// 導向總路由
app.use(routes)

// 啟動、監聽伺服器
app.listen(PORT, () => {
  console.log(`Express server is running on http://localhost:${PORT}`)
})
