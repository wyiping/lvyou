const express = require("express")
// 数据库
const db = require('../../modules/db')
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
router.get('/list/(:page)?', (req, res) => {
    var page = req.params.page;
    page = page || 1;
    page = parseInt(page);
    db.Contact.find().count((err, count) => {
        if (err) {

        } else {
            var pageCount = Math.ceil(count / 5);
            page = page > pageCount ? pageCount : page;
            page = page < 1 ? 1 : page;
            db.Contact.find().skip((page - 1) * 5).sort().limit(5).exec((err, data) => {
                res.render('admin/contact', {
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

// 删除留言
router.get('/del/:id', (req, res) => {
    db.Contact.findByIdAndRemove(req.params.id, err => {
        if (err) {
            res.json({ code: 'error', message: '系统错误' });
        }
        else {
            res.json({ code: 'success', message: '成功！' });
        }
    })
})
module.exports = router;