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
router.get('/introduce/(:page)?', (req, res) => {
    var page = req.params.page;
    page = page || 1;
    page = parseInt(page);
    db.Scenery.find().count((err, count) => {
        if (err) {
            
        } else {
            var pageCount = Math.ceil(count / 6);
            page = page > pageCount ? pageCount : page;
            page = page < 1 ? 1 : page;
            db.Scenery.find().skip((page - 1) * 6).sort().limit(6).exec((err, data) => {
                res.render('scenery/introduce', {
                    page, pageCount,
                    sceneries: data.map(m => {
                        m = m.toObject();
                        m.id = m._id.toString();
                        delete m._id;
                        return m;
                    })
                });
            });
        }
    });
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