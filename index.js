// dotenv để che lại các thứ quan trọng
require('dotenv').config()
const database = require ("./config/database")
const express = require("express");
const methodOverride = require('method-override')
const routeAdmin = require("./routes/admin/index_route");
const routeClient = require("./routes/client/index_route");
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('express-flash')
const app = express()
const path = require("path")

app.use(methodOverride('_method'))

// bien toan cuc

app.locals.prefixAdmin = require("./config/system").prefixAdmin

// sử dụng folder public để lưu tài nguyên
app.use(express.static(`${__dirname}/public`))

// lấy PORT từ file .env
const port = process.env.PORT;
// kết nối data base theo URL 
database.connect(process.env.MONGO_URL)


app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))



app.use(cookieParser('COOK'))
app.use(session({ cookie: { maxAge: 60000 }}))
app.use(flash())


app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));


// gọi hàm index truyền vào app
routeAdmin(app)
routeClient(app)





app.listen(port, () => {
  console.log(`website đang chạy localhot: http://localhost:${port}`)
})