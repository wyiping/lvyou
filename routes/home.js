const express = require("express")
// 数据库
const db = require('../modules/db')
//创建一个路由对象。
var router = express.Router()

// 获取显示的页数，最多5页
function getPages(page, pageCount) {
    var pages = [page];
    var left = page - 1;
    var right = page + 1;
    // 左右两边各加1个页码,直到页码够5个或左边到1 右边到总页数
    while (pages.length < 5 && (left >= 1 || right <= pageCount)) {
        if (left > 0) pages.unshift(left--);
        if (right <= pageCount) pages.push(right++);
    }
    return pages;
}

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
router.get('/introduce/list/(:page)?', (req, res) => {
    var page = req.params.page;
    page = page || 1;
    page = parseInt(page);

    var filter = {};
    var search = req.query.search;
    if (search) {
        search = search.trim();
        if (search.length > 0) {
            filter.name = {
                '$regex': `.*${search}.*?`
            }
        }
    }
    db.Scenery.find(filter).count((err, count) => {
        if (err) {

        } else {
            var pageCount = Math.ceil(count / 6);
            page = page > pageCount ? pageCount : page;
            page = page < 1 ? 1 : page;
            db.Scenery.find(filter).skip((page - 1) * 6).sort().limit(6).exec((err, data) => {
                res.render('detail/introduce', {
                    page, pageCount, pages: getPages(page, pageCount),
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

// 热门景点
router.get('/hot', (req, res) => {
    db.Scenery.find().limit(5).exec((err, data) => {
        res.render('detail/hot', { sceneries: data })
    })
})
module.exports = router;