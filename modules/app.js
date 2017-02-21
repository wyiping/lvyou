// const 声明创建一个只读的常量。常量的值不能通过再赋值改变。
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const  app = express()

// 使用日志
const log = require('./log')
log.use(app)

//设置静态文件目录
app.use(express.static('wwwroot'))

// 使用模板引擎art-template
const template = require('art-template')
template.config('extname', '.html');
app.engine('.html', template.__express);
app.set('view engine', 'html');

//  使用body-parser模块，当客户端发送post请求时，body-parser能够将
//  请求体中的参数解析为对象。
app.use(bodyParser.urlencoded({ extended: true }))

// 使用中间件cookieParser
app.use(cookieParser())

module.exports = app;