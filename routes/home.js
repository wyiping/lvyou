const express = require("express")
// 数据库
const db = require('../modules/db')
//创建一个路由对象。
var router = express.Router()

// 主页
router.get('', (req, res) => {
    res.render('home')
})

// banner
router.get('/banner', (req, res) => {
    db.Home.find({ type: 'banner' }, (err, data) => {
        res.render('home/banner', { pics: data })
    })
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
                res.render('home/introduce', {
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
    db.Home.find({ type: 'gallery' }, (err, data) => {
        res.render('home/gallery', { pics: data });
    })
})

// 景点详情
router.get('/detail/:id', (req, res) => {
    db.Scenery.findById(req.params.id, (err, data) => {
        res.render('detail/scenery', { scenery: data })
    })
})

// 留言板
router.get('/contact', (req, res) => {
    db.Contact.find((err, data) => {
        console.log(data)
        res.render('detail/contact', { contact: data })
    })
})
router.post('/contact', (req, res) => {
    new db.Contact(req.body).save(err => {
        if (err) {
            res.json({ code: 'error', message: '提交失败,系统出错' })
        } else {
            res.json({ code: 'success', message: '提交成功' })
        }
    })
})
module.exports = router;