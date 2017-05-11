
var express = require('express');
var router = express.Router();
var orm = require("orm");
/* GET home page. */
router.get('/index', function (req, res, next) {

    console.log(1);
    orm.connect("mysql://bevan:chen6752163@localhost/world", function (err, db) {
        if (err) throw err;
        // db.driver.execQuery("select * from world.city where id < ?", [req.query.page], function (err, data) {
        //     console.log(req.query.page);
        //     console.log(data);
        //     res.send(data);
        // })

        var city = db.define("city", {
            ID: Number,
            Name: String,
            CountryCode: String, // FLOAT
            District: String
           // Population: Number // JSON encoded
        }, {
            methods: {
                fullName: function () {
                    return this.name;
                }
            }
        });
        city.find({
            id: req.query.id
        }, function (err, data) {
            if (err) throw err;
           res.send(data);

        });
    });
    //连接数据库
    // var mysql = require('mysql');
    // var connection = mysql.createConnection({
    //     host: 'localhost',
    //     user: 'bevan',
    //     password: 'chen6752163',
    //     database: 'world'
    // });

    // connection.connect();
    // //查询
     var rl = [];
    // console.log(1);
    // connection.query('select * from world.city order by id desc limit 0,10', function (err, rows, fields) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log(rows);
    //         rl = rows;
    //     }
    //     console.log(2);
    // });
    // //关闭连接
    // connection.end();
    console.log(3);
    var as = [{
        id: '1001',
        todo: 0,
        name: 'Bevan',
        img: 'http://wx.qlogo.cn/mmopen/hRRsfp8oo6F0SKpzXGYDnNibrgwjApK9BB9ZbpCAmFkInER5qk3C4QlwT3gsSSibNz3FpRj34Bukj3ETZmy1j5ypjEOz7IFUL8/0',
        memo: '已报名'
    }, {
        id: '1002',
        todo: 2,
        name: 'Jupiter',
        img: 'http://wx.qlogo.cn/mmopen/gucichwpHvib8044fA1xwn0xQzO5LOgnO5qgMZbqxzILfnXww04AibbyfRYY7BUA9B26XPdHN4hYXNhOePgQUxpSWzuzXkbnbx1/0',
        memo: '保持纵横比缩放图片，只保证图片的短边能完全显示出来保持纵横比缩放图片，只保证图片的短边能完全显示出来保持纵横比缩放图片，只保证图片的短边能完全显示出来'
    }];
    // res.send(rl);

});


module.exports = router;