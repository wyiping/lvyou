const express = require("express")
const db = require('../modules/db')
//创建一个路由对象。
var router = express.Router()

router.post('/add/:scenery/:user', (req, res) => {
    req.body.createTime = new Date();
    req.body.scenery = req.params.scenery;
    req.body.user = req.params.user;
    new db.Notes(req.body).save(err => {
        if (err) {
            res.json({ code: 'error', message: '添加失败,系统出错' })
        } else {
            res.json({ code: 'success', message: '添加成功' })
        }
    })
})

router.get('/list', (req, res) => {
    db.Notes.find().populate("scenery").limit(3).exec((err, data) => {
        res.render('home/notes', { notes: data });
    })
})

router.get('/:sid', (req, res) => {
    db.Notes.find({ scenery: req.params.sid }).populate("user").exec((err, data) => {
        res.render('detail/scenery_notes', { notes: data })
    })
})
module.exports = router;