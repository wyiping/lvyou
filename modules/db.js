//导入mongoose模块
const mongoose = require('mongoose')

//设置数据库连接地址
mongoose.connect('mongodb://localhost:27017/lvyou')

//连接数据库
var db = mongoose.connection;

// 数据库连接失败的提示
db.on('error', err => console.error('mongodb connection error...', err));
// 数据库连接成功的提示
db.once('open', () => console.log('mongodb connection success...'));

var Schema = mongoose.Schema;

// 定义一个Schema,创建数据集合（表）的描述对象。
// 第一个参数是表的结构，第二个参数是指定集合的名称。
var UserSchema = new Schema({
    username: { type: String, unique: true },
    petname: String,
    password: String,
    email: String,
    role: String
})

// mongoose.model()创建一个数据模型（类或构造函数）
// mongoose为MongoDB增加了很多很强大的功能
// 大部分功能以model为基础
// 第1个参数：模型的名称，也是数据库中集合的名称
// 第2个参数：Schema，模式，描述了数据的形状，即
// 数据中有哪些属性，属性的类型，属性的默认值，属性的验证等
var User = mongoose.model('user', UserSchema)

// 景点Schema
var ScenerySchema = new Schema({
    name: { type: String, unique: true },
    location: {
        lat: String,
        lon: String
    },
    address: String,
    summary: String,
    content: String,
    picList: Array
})

var Scenery = mongoose.model('scenery', ScenerySchema)

// 游记Schema
var NotesSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "user" },
    scenery: { type: Schema.Types.ObjectId, ref: "scenery" },
    title: String,
    content: String,
    createTime: Date
})
var Notes = mongoose.model('notes', NotesSchema)

// 首页
var HomeSchema = new Schema({
    name: String,
    type: String
})
var Home = mongoose.model('home', HomeSchema)

// 留言板
var ContactSchema = new Schema({
    name: String,
    email: String,
    phone: String,
    comments: String,
    answer: [{
        name: String,
        comments: String
    }]
})
var Contact = mongoose.model('contact', ContactSchema)

// 导出模块
module.exports = { User, Scenery, Notes, Home, Contact };