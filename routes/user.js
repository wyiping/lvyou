const express = require("express")
const db = require('../modules/db')
//创建一个路由对象。
var router = express.Router()

//--------------------------------------------

//接口的回调函数有三个参数，req表示客户端发来的请求，res表示将要返给客户端的
//响应。next表示下一个回调函数，如果没有下一个回调函数，则会得到一个空函数。

//每次请求的多个回调函数组成了一个请求处理管线，管线中的每一个函数都可以得到
//这次请求的数据，也可以修改响应中的数据，对于请求的某种通用的梳理，可以单独
//写在一个函数中，然后把该函数放入某些请求的处理管线。

//app.use() 默认处理管线（所有接口的处理管线）中添加一个回调函数，每次请求
//都会先执行默认处理管线中的回调函数，然后再执行各接口自己的处理管线中的函数。

// 会员注册
router.post('/register', (req, res) => {
    req.body.isAdmin = false
    new db.User(req.body).save(err => {
        if (err) {
            if (err.code == 11000) {
                res.json({ code: 'error', message: '用户名已存在' })
            } else {
                res.json({ code: 'error', message: '注册失败,系统出错' })
            }
        } else {
            res.json({ code: 'success', message: '注册成功' })
        }
    })
})

// 会员登录
router.post('/login', (req, res) => {
    db.User.find({ username: req.body.username }).count((err, count) => {
        if (err) {
            res.json({ code: 'error', message: '系统错误,请重试' })
        } else {
            if (count > 0) {
                db.User.findOne({ username: req.body.username }, (err, data) => {
                    if (req.body.password == data.password) {
                        res.cookie('user', data)
                        res.json({ code: 'success', message: '登录成功' })
                    } else {
                        res.json({ code: 'error', message: '密码错误,请重新输入' })
                    }
                })
            } else {
                res.json({ code: 'error', message: '用户未注册,请注册' })
            }
        }
    })
})

// 会员注销
router.get('/logout', (req, res) => {
    res.clearCookie('user');
    res.render('home')
})

// 会员中心
router.get('/info/:id', (req, res) => {
    db.User.findById(req.params.id, (err, data) => {
        res.render('detail/user', { user: data })
    })
})

module.exports = router;