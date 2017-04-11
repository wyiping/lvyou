const express = require("express")
// 数据库
const db = require('../modules/db')
//创建一个路由对象。
var router = express.Router()

// 主页
router.get('', (req, res) => {
    res.render('index')
})

// 介绍
router.get('/introduce', (req, res) => {
    db.Scenery.find().sort().limit(6).exec((err, data) => {
        console.log(data)
        res.render('scenery/introduce', {
            sceneries: data.map(m => {
                m = m.toObject();
                m.id = m._id.toString();
                delete m._id;
                return m;
            })
        });
    })
})
module.exports = router;