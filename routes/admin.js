const express = require("express")
const db = require('../modules/db')
//创建一个路由对象。
var router = express.Router()

// 获取显示的页数，最多10页
function getPages(page, pageCount){
    var pages = [page];

    var left = page - 1;
    var right = page + 1;

    // 左右两边各加1个页码,直到页码够10个或左边到1 右边到总页数
    while(pages.length < 10 && (left >= 1 || right <= pageCount) ) {
        if(left > 0) pages.unshift(left--);
        if(right <= pageCount) pages.push(right++);
    }

    return pages;
}

// 管理员首页
router.get('/',(req,res)=>{
    if(req.cookies.petname){
        res.render('admin/admin',{petname:req.cookies.petname})
    }else{
        res.render('admin/login',{ code: 'error' , message:'请先登录'})
    }
})

// 管理员登录页面
router.get('/login',(req,res)=>{
    res.render('admin/login')
})
// 处理管理员登录请求
router.post('/login', (req,res)=>{
    db.User.find({ username: req.body.username }).count((err, count) => {
        if (err) {
            res.json({ code: 'error' , message:'系统错误,请重试'})
        } else {
            if (count > 0) {
                db.User.findOne({ username: req.body.username }, (err, data) => {
                    // 判断是否为管理员
                    if(data.isAdmin){
                        if (req.body.password == data.password) {
                            // 设置cookie 15分钟
                            res.cookie('petname', data.petname ,{maxAge:900000})
                            res.json({ code: 'success' , message:'登录成功'})
                        } else {
                            res.json({ code: 'error' , message:'密码错误,请重新输入'})
                        }
                    }else{
                        res.json({ code: 'error' , message:'此用户不是管理员'})
                    }
                   
                })
            } else {
                res.json({ code: 'error' , message:'用户未注册,请注册'})
            }
        }
    })
})

// 管理员注销
router.get('/logout', (req,res)=>{
    res.clearCookie('petname');
    res.render('admin/login')
})


/*------------------------
/:page表示/后必须有字符
/(:page)?表示/后可以有字符，也可以没有字符
有字符串时可以通过page得到，没有字符时page是undefined
-------------------------*/
// 用户列表
// 第一个参数(:page)表示页数
// 第二个参数(:pageSize)表示每页显示数
router.get('/users/(:page)?/(:pageSize)?',(req,res)=>{
    var filter = {};
    var username = req.body.username;
    if(username){
        username = username.trim();
        filter.username = {
            // 正则表达式
            // .表示除回车换行外的任意字符
            // *表示0个或多个
            // ?表示可以有也可以没有
            '$regex': `.*${username}.*?`
        }
    }
    // 排序
    var order = {}
    // 向order中放入一对值,
    // 属性名是:req.body.sortProperty
    // 属性值是:req.body.sortDir
    order[req.body.sortProperty] = req.body.sortDir
    
    var page = req.params.page;
    // page是undefined时，(page || 1)是1
    // page是数字时，(page || 1)是page
    page = page || 1;
    page = parseInt(page);

    var pageSize = req.params.pageSize;
    // 默认每页显示5条数据
    pageSize = pageSize || 5;
    pageSize = parseInt(pageSize);

    db.User.find(filter).count((err,total)=>{
        if(err){
            console.log(err)
        }else{
            // 总页数，向上取整
            var pageCount = Math.ceil(total / pageSize);
            page = page > pageCount ? pageCount :page
            page = page < 1 ? 1 :page ;

            // select对数据属性进行筛选，属性名之间用空格分隔
            db.User.find(filter).sort().skip((page - 1) * pageSize).limit(pageSize).exec((err,data) =>{
                res.render('admin/users',{page, pageCount, pageSize, pages: getPages(page, pageCount),
                    users:data.map(m => {
                    m = m.toObject()
                    m.id = m._id.toString()
                    delete m._id
                    return m
                })})
            })
        }
    })
})
// 添加用户
router.get('/user/add',(req,res)=>{
    res.redirect('/admin/adduser.html')
})
router.post('/user/add',(req,res)=>{
    new db.User(req.body).save(err =>{
        if (err) {
            if(err.code==11000){
                res.json({ code: 'error' , message:'用户名已存在'})
            }else{
                res.json({ code: 'error' , message:'添加失败,系统出错'})
            }
        } else {
            res.json({ code: 'success', message: '添加成功' })
        }
    })
})
// 删除用户
router.post('/user/remove/:name', (req, res) => {
    // 通过用户名找到要删除的用户
    db.User.remove({username:req.params.name}, err => {
        if(err){
            res.json({code: 'error', message: '系统错误'});
        }
        else{
            res.json({code: 'success', message: '成功！'});
        }
    })
})

// 导出路由
module.exports = router;