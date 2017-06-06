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

// 最新留言
router.get('/recent', (req, res) => {
    db.Contact.find().sort({ createTime: -1 }).limit(3).exec((err, data) => {
        res.render('detail/recent_c', { contact: data })
    })
})

// 留言板
router.get('/contact/(:page)?', (req, res) => {
    var page = req.params.page;
    page = page || 1;
    page = parseInt(page);
    db.Contact.find().count((err, count) => {
        if (err) {

        } else {
            var pageCount = Math.ceil(count / 6);
            page = page > pageCount ? pageCount : page;
            page = page < 1 ? 1 : page;
            db.Contact.find().skip((page - 1) * 6).sort().limit(6).exec((err, data) => {
                res.render('detail/contact', {
                    page, pageCount, pages: getPages(page, pageCount),
                    contact: data.map(m => {
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