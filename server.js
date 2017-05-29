var app = require('./modules/app')

//----------------------------------------------

// 用户管理路由
app.use('/user', require('./routes/user'))

// 管理员路由
app.use('/admin', require('./routes/admin'))
app.use('/admin', require('./routes/back/scenery'))

// 导游路由
app.use('/guide', require('./routes/guide'))
app.use('/guide', require('./routes/back/scenery'))

// 首页路由
app.use('/', require('./routes/home'))

// 游记路由
app.use('/notes', require('./routes/notes'))

// 监听3000端口
app.listen(3000, () => console.log('Server runing at port 3000.'))