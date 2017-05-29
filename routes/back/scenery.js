const express = require("express")
// 数据库
const db = require('../../modules/db')
// 上传组件
const upload = require('../../modules/upload')
//创建一个路由对象。
var router = express.Router()

const fs = require('fs')
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
// 添加景点
router.get('/scenery/add', (req, res) => {
    res.redirect('/admin/addscenery.html')
})
router.post('/scenery/add', upload.array('pic'), (req, res) => {
    var files = req.files;
    var picList = new Array()
    for (i = 0; i < files.length; i++) {
        picList.push(files[i].filename)
    }
    req.body.picList = picList

    var location = {};
    location.lat = req.body.lat || "";
    location.lon = req.body.lon || "";
    req.body.location = location;
    new db.Scenery(req.body).save(err => {
        if (err) {
            if (err.code == 11000) {
                res.json({ code: 'error', message: '景点已存在' })
            } else {
                res.json({ code: 'error', message: '添加失败,系统出错' })
            }
        } else {
            res.json({ code: 'success', message: '添加成功' })
        }
    })
})

// 景点列表
router.get('/sceneries/(:page)?/(:pageSize)?', (req, res) => {
    var page = req.params.page;
    page = page || 1;
    page = parseInt(page);
    var pageSize = req.params.pageSize;
    pageSize = pageSize || 5;
    pageSize = parseInt(pageSize);

    db.Scenery.find().count((err, total) => {
        if (err) {
            // err
        } else {
            var pageCount = Math.ceil(total / pageSize);
            page = page > pageCount ? pageCount : page;
            page = page < 1 ? 1 : page;
            db.Scenery.find().sort().skip((page - 1) * pageSize).limit(pageSize).exec((err, data) => {
                res.render('admin/sceneries', {
                    page, pageCount, pageSize, pages: getPages(page, pageCount),
                    sceneries: data.map(m => {
                        m = m.toObject();
                        m.id = m._id.toString();
                        delete m._id;
                        return m;
                    })
                });
            })
        }
    });
})

// 编辑景点
router.get('/scenery/edit/:id', (req, res) => {
    db.Scenery.findById(req.params.id, (err, data) => {
        if (err) {

        } else {
            res.render('admin/editscenery', { scenery: data })
        }
    })
})
router.post('/scenery/edit/:id', upload.array('pic'), (req, res) => {
    var files = req.files;
    var picList = undefined;
    var delPic = req.body.del_pics;
    if (typeof req.body.pics == 'string') {
        picList = new Array();
        picList.push(req.body.pics);
    } else {
        picList = req.body.pics || new Array()
    }
    for (i = 0; i < files.length; i++) {
        picList.push(files[i].filename);
    }

    req.body.picList = picList
    db.Scenery.findByIdAndUpdate(req.params.id, req.body, err => {
        if (err) {
            res.json({ code: 'error', message: '系统错误' });
        }
        else {
            // 删除本地文件
            if (typeof delPic != 'undefined') {
                if (typeof delPic == 'string') {
                    fs.unlinkSync('wwwroot/images/scenery/' + delPic);
                } else {
                    for (var i = 0; i < delPic.length; i++) {
                        fs.unlinkSync('wwwroot/images/scenery/' + delPic[i]);
                    }
                }
            }
            res.json({ code: "success", message: "更新成功" })
        }
    })
})

// 删除景点
router.get('/scenery/del/:id', (req, res) => {
    db.Scenery.findById(req.params.id, (err, data) => {
        if (data.hasOwnProperty('picList')) {
            if (data.picList) {
                for (var i = 0; i < data.picList.length; i++) {
                    fs.unlinkSync('wwwroot/images/scenery/' + data.picList[i]);
                }
            }
        }
        db.Scenery.findByIdAndRemove(req.params.id, err => {
            if (err) {
                res.json({ code: "error", message: "删除失败" })
            } else {
                res.json({ code: "success", message: "删除成功" })
            }
        })
    })
})
module.exports = router;