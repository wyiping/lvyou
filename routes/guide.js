const express = require("express")
// 数据库
const db = require('../modules/db')

//创建一个路由对象。
var router = express.Router()

// 导游首页
router.get('/', (req, res) => {
    if (req.cookies.petname) {
        res.render('admin/guide', { petname: req.cookies.petname })
    } else {
        res.render('admin/login', { code: 'error', message: '请先登录' })
    }
})
// 导游登录页面
router.get('/login', (req, res) => {
    res.render('admin/login')
})
// 导游登录请求
router.post('/login', (req, res) => {
    db.User.find({ username: req.body.username }).count((err, count) => {
        if (err) {
            res.json({ code: 'error', message: '系统错误,请重试' })
        } else {
            if (count > 0) {
                db.User.findOne({ username: req.body.username }, (err, data) => {
                    // 判断是否为管理员
                    if (data.role == 'guide') {
                        if (req.body.password == data.password) {
                            // 设置cookie 15分钟
                            res.cookie('petname', data.petname, { maxAge: 900000 })
                            res.json({ code: 'success', message: '登录成功' })
                        } else {
                            res.json({ code: 'error', message: '密码错误,请重新输入' })
                        }
                    } else {
                        res.json({ code: 'error', message: '此用户不是导游' })
                    }

                })
            } else {
                res.json({ code: 'error', message: '用户未注册,请注册' })
            }
        }
    })
})

// 导游注销
router.get('/logout', (req, res) => {
    res.clearCookie('petname');
    res.render('admin/login')
})
module.exports = router;