const express = require("express")
// 数据库
const db = require('../modules/db')
//创建一个路由对象。
var router = express.Router()

// 留言板
router.get('/contact', (req, res) => {
    db.Contact.find((err, data) => {
        res.render('detail/contact', { contact: data })
    })
})
router.post('/contact', (req, res) => {
    req.body.createTime = new Date();
    new db.Contact(req.body).save(err => {
        if (err) {
            res.json({ code: 'error', message: '提交失败,系统出错' })
        } else {
            res.json({ code: 'success', message: '提交成功' })
        }
    })
})

// 回复留言
router.get('/answer/:id', (req, res) => {
    res.render('detail/answer', { id: req.params.id })
})
router.post('/answer/:id', (req, res) => {
    db.Contact.findByIdAndUpdate(req.params.id, { $push: { answer: req.body } }, (err, data) => {
        if (err) {
            res.json({ code: 'error', message: '提交失败,系统出错' })
        } else {
            res.json({ code: 'success', message: '提交成功' })
        }
    })
})
module.exports = router;