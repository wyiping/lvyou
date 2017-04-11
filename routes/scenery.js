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

// gallery
router.get('/gallery', (req, res) => {
    db.Scenery.find().limit(9).exec((err, data) => {
        var picList = new Array();
        data.map(m => {
            m = m.toObject();
            if (m.picList) {
                for (var i = 0; i < m.picList.length; i++){
                    picList.push(m.picList[i])
                }
            }
        })
        res.render('scenery/gallery', {
            pics:picList
        });
    })
})

module.exports = router;