var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var sd = require('silly-datetime');
var md5 = require('md5');

// 设置跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

//读取配置文件config.js信息
var config = require('./config');
//获取model信息
var User = require('./models/users');

// 设置启动端口
var port = process.env.PORT || 8081;
// 连接数据库
mongoose.connect(config.database);
// 用来生成摘要的密码
app.set('superSecret', config.secret); // 设置app 的超级密码--用来生成摘要的密码

//用body parser 来解析post和url信息中的参数
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

// 使用 morgan 将请求日志打印到控制台
app.use(morgan('dev'));

// 基础路由
var router = express.Router();

// 添加用户
router.route('/user')

    .post(function (req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = md5(req.body.password);
        user.email = req.body.email;
        user.create_date = sd.format(new Date(), 'YYYY-MM-DD HH:mm');
        user.avatar = req.body.avatar;
        user.phone = req.body.phone;
        user.save(function (err) {
            if (err) {
                res.json({
                    success: false,
                    error_msg: "添加失败"
                });
            } else {
                res.json({
                    success: true,
                    success_msg: "添加成功"
                });
            }
        });
    });

// 用户信息
router.route('/user/:id')

    // 查询指定用户
    .get(function (req, res) {
        User.findById(req.params.id, function (err, user) {
            if (err) {
                res.json({
                    success: false,
                    error_msg: "用户不存在"
                });
            } else {
                res.json({
                    success: true,
                    data: user
                });
            }
        });
    })

    // 更新用户
    .put(function (req, res) {
        User.findById(req.params.id, function (err, user) {
            user.password = md5(req.body.password);
            user.email = req.body.email;
            user.avatar = req.body.avatar;
            user.phone = req.body.phone;
            user.save(function (err) {
                if (err) {
                    res.json({
                        success: false,
                        error_msg: "更新失败"
                    });
                } else {
                    res.json({
                        success: true,
                        success_msg: "更新成功"
                    });
                }
            });
        });
    })

    // 删除用户 
    .delete(function (req, res) {
        User.remove({
            _id: req.params.id
        }, function (err, user) {
            if (err) {
                res.json({
                    success: false,
                    error_msg: "删除失败"
                });
            } else {
                res.json({
                    success: true,
                    success_msg: "删除成功"
                });
            }
        });
    });

// 应用router，并在前面加前缀 /api
app.use('/api', router);

// 启动服务
app.listen(port);
console.log('Magic happens at http://localhost:' + port);