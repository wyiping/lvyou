const express = require("express")
// 数据库
const db = require('../../modules/db')
//创建一个路由对象。
var router = express.Router()

router.get('/list', (req, res) => {
    db.Contact.find((err, data) => {
        res.render('admin/contact', { contact: data })
    })
})

module.exports = router;