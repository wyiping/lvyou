var app = require('./modules/app')

//----------------------------------------------
app.get('/', (res, req) => {
    res.redirect('/index');
})
app.use('/user',require('./routes/user'))

// 监听3000端口
app.listen(3000, () => console.log('Server runing at port 3000.'))