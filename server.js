var app = require('./modules/app')

//----------------------------------------------
app.get('/', (res, req) => {
    res.redirect('/index');
})
// 用户管理路由
app.use('/user',require('./routes/user'))

// 管理员路由
app.use('/admin',require('./routes/admin'))

// 监听3000端口
app.listen(3000, () => console.log('Server runing at port 3000.'))