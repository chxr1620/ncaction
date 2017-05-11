var controllers = require('../controller')
var express = require("express");
var multer = require("multer");
var fs = require("fs");
var df = require("dateformat");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var fp = "uploads/" + df(Date.now(), "yyyy-mm-dd");
        if (!fs.existsSync(fp)) {
            fs.mkdirSync(fp);
        }
        cb(null, fp);

    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

var upload = multer({
    storage: storage
})

module.exports = function (app) {
    app.use(function (req, res, next) {
        controllers.login.cklogin(req, res, next);
    });
    app.get('/action/getActionList', controllers.actions.getActionList);
    app.get('/action/login', controllers.login.cklogin);
    app.get('/action/getActionbyID', controllers.actions.getActionbyID);
    app.get('/action/getTwoCommentbyID', controllers.actions.getTwoCommentbyID);
    app.get('/action/getAllCommentbyID', controllers.actions.getAllCommentbyID);
    app.get('/action/getRank', controllers.actions.getRank);
    app.get('/action/getName', controllers.actions.getName);
    app.get('/action/getRecords', controllers.actions.getRecords);
    //打卡信息，无图片上传
    app.post('/action/add', controllers.actions.addUserRecord);
    app.post('/action/addComments', controllers.actions.addComments);
    app.get('/action/latestmsg', controllers.msg.LatestMsg);

    //获取活动属性，初始化用户打卡页面。
    app.get('/action/getactionattrs', controllers.actions.getActoinAttrs)
    //文件上传
    app.post('/action/upload', upload.array('imgs', 10), controllers.actions.addUserRecord);

    //用户活动相关信息
    app.get("/action/getUserRecodrs", controllers.actions.getUserRecodrs);
    //生成红包
    app.get("/action/genRedEnvelop", controllers.actions.genRedEnvelop);

};