var settings = require("../config/settings");
var utility = require("../utility/utility");
var _ = require("lodash");
var df = require("dateformat");
module.exports = {
    LatestMsg: function (req, res, next) {
        //最新消息 
        req.dbpool.getConnection(function (err, cn) {
            var sql = "select * from  noticemsg where NCActionid in (select NCActionID from ncactionref where RefTypeID in (1,2,3) and refid=?) or touid=?\
                     order by ID desc limit " + (req.query.pindex == null ? 0 : req.query.pindex) + ",10";

            cn.query(sql, [req.session.userinfo.NCUserID, req.session.userinfo.NCUserID], function (err, data, fileds) {
                cn.release();
                var rr = _.map(data, function (d) {
                    var r = {
                        img: d.Uimg,
                        name: d.MsgName,
                        memo: d.Msg,
                        datetime: df(d.CreateDate, "yyyy-mm-dd hh:mm")
                    }
                    return r;
                });
                res.send(rr);
            });
        });
    }

}