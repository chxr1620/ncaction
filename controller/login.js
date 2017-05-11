var settings = require("../config/settings");
var rq = require("request");
var WXBizDataCrypt = require("../utility/WXBizDataCrypt");
var whu = require("../utility/wechatul");
module.exports = {
    cklogin: function (req, res, next) {
        var as = settings.wechat.waction;
        var ses = req.session;
        if (ses.userinfo) {
            // res.send(ses.userinfo.LogName);
            next();

        } else {
            whu.getUserinfo(req.query.code, req.query.encryeddata, req.query.iv, function (unionid) {
                console.log(unionid);
                req.dbpool.getConnection(function (err, cn) {
                    var sql = "select T1.NCUserID,T1.PuserID,T1.UserType,T1.UserName,T1.LogName,T1.sex,T1.headimgurl,T2.Nickname,T2.OpenID from ncuser T1 left join weuserinfo T2 on T1.NCUserID =T2.NCUserID where T2.UnionID=? limit 1";
                   console.log(err);
                    cn.query(sql, [unionid], function (err, data, fileds) {
                         
                        cn.release();
                        req.session.userinfo = data[0];
                        next();
                    }); //cn.query
                }); //end getConnection


            });

        }


    }

}