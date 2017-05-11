///业务
var settings = require("../config/settings");
var utility = require("../utility/utility");
var _ = require("lodash");
var df = require("dateformat");


module.exports = {
    getActionList: function (req, res, next) {
        req.dbpool.getConnection(function (err, cn) {
            var sql = "select NCActionID,ActionName,ActionShortDsp,CreateDate,ImageName \
                        from ncaction where NCActionID in \
                         (select distinct NCActionID from ncactionref \
                         where RefID=? and InactiveDate is null)  limit ?";
            var num = 0;
            if (req.query.num > 0) {
                num = req.query.num
                console.log("req.query.num > 0 :" + num);
            } else {
                num = 1000000
            };
            cn.query(sql, [req.session.userinfo.NCUserID, parseInt(num)], function (err, data, fileds) {
                var r = utility.Base64_encode("hello");
                var l = utility.Base64_decode(r);
                console.log(r);
                console.log(l);
                var rr = _.map(data, function (d) {
                    // d.NCActionID = utility.Base64_encode(d.NCActionID)
                    d.CreateDate = df(d.CreateDate, "yyyy-mm-dd");
                    return d;
                });

                cn.release();
                res.send(rr);
            });
        });
    },
    getActionbyID: function (req, res, next) {
        req.dbpool.getConnection(function (err, cn) {

            var sql = "select * from ncaction where NCActionID=?";
            cn.query(sql, [req.query.aid], function (err, data, fileds) {
                cn.release();
                console.log(req.session.userinfo.NCUserID);
                res.send(data[0]);
            });
        });
    },
    getTwoCommentbyID: function (req, res, next) {
        req.dbpool.getConnection(function (err, cn) {

            var sql = "select * from (SELECT wu.Nickname,ncc.* FROM ncactioncomment ncc \
					                left join weuserinfo wu on ncc.UserID = wu.NCUserID \
                                 where NCActionID =? and istop =1 \
                                 order by CreateDate desc limit 1) a \
                      union all \
                      select * from (SELECT wu.Nickname,ncc.*  FROM ncactioncomment  ncc \
				                	left join weuserinfo wu on ncc.UserID = wu.NCUserID \
                                 where NCActionID =? and ifnull(IsTop,'') <> '1' \
                                 order by CreateDate desc limit 1) b";
            cn.query(sql, [req.query.aid1, req.query.aid2], function (err, data, fileds) {

                var rr = _.map(data, function (d) {
                    // d.NCActionID = utility.Base64_encode(d.NCActionID)
                    d.CreateDate = df(d.CreateDate, "yyyy-mm-dd");
                    return d;
                });
                cn.release();
                console.log(req.session.userinfo.NCUserID);
                res.send(rr);
            });
        });
    },
    getAllCommentbyID: function (req, res, next) {
        req.dbpool.getConnection(function (err, cn) {

            var sql = "SELECT wu.Nickname,ncc.* FROM sds163239206_db.ncactioncomment ncc \
                        left join sds163239206_db.weuserinfo wu \
                        on ncc.UserID = wu.NCUserID \
                        where NCActionID =? \
                        order by CreateDate desc";
            console.log(sql + ',' + req.query.aid);
            cn.query(sql, [req.query.aid], function (err, data, fileds) {

                var rr = _.map(data, function (d) {
                    // d.NCActionID = utility.Base64_encode(d.NCActionID)
                    d.CreateDate = df(d.CreateDate, "yyyy-mm-dd");
                    return d;
                });
                cn.release();
                res.send(rr);
            });
        });
    },
    getRecords: function (req, res, next) {
        req.dbpool.getConnection(function (err, cn) {

            var sql = "SELECT DATE_FORMAT(nur.CreateDate,'%Y-%m-%d %T') as RecordDate,nc.ActionName,nur.Memo \
                            FROM ncuserrefaction nur \
                            left join ncaction nc \
                            on nur.NCActionID = nc.NCActionID \
                            where nur.userid =? \
                            order by nur.CreateDate desc";
            console.log(sql + ',' + req.session.userinfo.NCUserID);
            cn.query(sql, [req.session.userinfo.NCUserID], function (err, data, fileds) {

                var rr = _.map(data, function (d) {
                    // d.NCActionID = utility.Base64_encode(d.NCActionID)
                    d.CreateDate = df(d.CreateDate, "yyyy-mm-dd");
                    return d;
                });
                cn.release();
                res.send(rr);
            });
        });
    },
    getRank: function (req, res, next) {
        req.dbpool.getConnection(function (err, cn) {
            var yearnum;
            var weeknum;
            var Redcounts=-1;
            var counts=-1;
            var todo=-1;
            var now = new Date();
            console.log("date:" + req.query.date + ";");
            if (req.query.date != "undefined") {
                yearnum = df(req.query.date, "yyyy");
                weeknum = df(req.query.date, "W");
            } else {
                //yearnum = "DATE_FORMAT(NOW(),'%Y')";
                //weeknum = "DATE_FORMAT(NOW(),'%v')";
                yearnum = df(now, "yyyy");
                weeknum = df(now, "W");
            };
            if (req.query.index == 0) {
                Redcounts = 0; //需要发红包
            } else if (req.query.index == 1) {
                counts = 1; //已完成
            } else if (req.query.index == 2) {
                todo = 0; //待审核
            } else if (req.query.index == 3) {
                //所有记录
            } else {
                //所有记录
            }
            console.log("yearnum:" + yearnum + ";");
            console.log("weeknum:" + weeknum + ";");
            console.log("req.query.index:" + req.query.index + ";");
            console.log("Redcounts:" + Redcounts + ";");
            console.log("counts:" + counts + ";");
            console.log("todo:" + todo + ";");
            var sql = "select   a.*, wu.Nickname,wu.Headimgurl,\
                                format(ifnull(b.sumvalue,0),2) as sumvalue,\
                                ifnull(b.Counts,0) as Counts,ifnull(todo.todo,0) as todo,\
                                ifnull(Redcounts.Redcounts,0) as Redcounts \
                        from ( select distinct NCActionID, RefID from ncactionref ncr \
                               where ncr.RefTypeID in (1,2,3) and ncr.InactiveDate is null \
                               and ncr.NCActionID = ?) a \
                        left join ( \
                            select sum(ifnull(TargetValue,0)) as sumValue,userid,count(TargetValue) as Counts \
                            from sds163239206_db.ncuserrefaction ncur \
                            where NCActionID =? and YearNum = ? \
                            and weeknum = ? and RecordType = 1 and status =2 \
                            group by userid \
                                  ) b on a.RefID = b.userid \
					    left join weuserinfo wu on a.RefID = wu.NCUserID\
						left join (select count(userid) as todo,userid from ncuserrefaction \
                        where NCActionID=? and yearnum=? and weeknum=? and  status=1 \
                        group by userid) todo \
                        on todo.userid = a.refid \
						left join (select count(userid) as Redcounts,userid from ncuserrefaction \
                        where NCActionID=2  and  status=1 and RecordType = 3 \
                        group by userid) Redcounts \
                        on Redcounts.userid = a.refid \
                        where ifnull(todo.todo,0) >  ? and ifnull(b.Counts,0) > ?   and ifnull(Redcounts,0) >? \
                        order by b.sumvalue desc ";
            cn.query(sql, [req.query.aid, req.query.aid, yearnum, weeknum,req.query.aid,yearnum, weeknum, todo,counts,Redcounts]
            , function (err, data, fileds) {
                console.log(sql);
                var rr = _.map(data, function (d) {
                    // d.NCActionID = utility.Base64_encode(d.NCActionID)
                    d.CreateDate = df(d.CreateDate, "yyyy-mm-dd");
                    return d;
                });
                cn.release();
                res.send(rr);
            });
        });
    },
    getName: function (req, res, next) {
        res.send('Hello,James');
        //    res.render('index', { title: 'hello,world' });
    },
    addRecord: function (req, res, next) {
        req.dbpool.getConnection(function (err, cn) {
            var sql = "insert ncuserrefaction ( Userid,NCActionid,TargetTime) value (?,?,? )";

            var aid = req.body.aid;
            var tv = req.body.tv;
            var tday = req.body.tday;
            cn.query(sql, [req.session.userinfo.NCUserID, aid, tday], function (err, data, fileds) {
                cn.release();
                res.send(data[0]);
            });
        });
    },
    addComments: function (req, res, next) {
        req.dbpool.getConnection(function (err, cn) {
            var sql = "insert ncactioncomment ( NCActionid,UserID,Content,IsTop,CreatedBy) \
             value (?,?,?,?,?)";
            var NCActionid = req.body.NCActionid;
            var Content = req.body.Content;
            var msgtype = '';
            var IsTop = req.body.IsTop;
            // console.log(sql +','+ NCActionid +','+Content+','+msgtype+','+IsTop);
            cn.query(sql, [NCActionid, req.session.userinfo.NCUserID, Content, IsTop, req.session.userinfo.NCUserID],
                function (err, data, fileds) {
                    cn.release();
                    console.log(data);
                    res.send(data[0]);
                });
        });
    },
    getActoinAttrs: function (req, res, next) {

        //获取活动属性
        req.dbpool.getConnection(function (err, cn) {

            var sql = 'select ID,Name,KName,Type,null as Kvalue from ncactionattrinfo where NCActionID=? and InactiveDate is null';
            cn.query(sql, [req.query.aid], function (err, data, fileds) {
                cn.release();
                res.send(data);
            });
        });
    },
    addUserRecord: function (req, res, next) {
        //用户打卡
        console.log(req.files);
        console.log(req.body);
        req.dbpool.getConnection(function (err, cn) {
            var now = new Date();
            var aid = req.body.aid;
            var dspt = req.body.dspt;
            var tday = req.body.tday;
            var tweek = df(tday, "W");
            var ynumb = df(tday, "yyyy");
            var mnumb = df(tday, "mm");
            var dnumb = df(tday, "dd");
            var rtype = req.body.rtype;
            var rcl = ["UserID", "NCActionID", "ActionType", "YearNum", "MonthNum", "WeekNum", "TargetTime", "status",
                "CreateDate", "CreatedBy", "RecordType", "DayNum"
            ];
            var rclv = [req.session.userinfo.NCUserID, aid, 1, "'" + ynumb + "'", mnumb, tweek, "'" + tday + "'", 1,
            "'" + df(now, "yyyy-mm-dd") + "'", req.session.userinfo.NCUserID, rtype, dnumb
            ];
            var rmsg = [];
            var atrs = JSON.parse(req.body.attrs);
            for (var i = 0; i < atrs.length; i++) {
                var c = atrs[i];
                console.log(c);
                if (c["Kvalue"] != null) {
                    rcl.push(c["KName"]);
                    rclv.push("'" + c["Kvalue"] + "'");
                    rmsg.push(c["Name"] + ":" + c["Kvalue"]);
                }

            }
            rmsg.push(dspt);
            rcl.push("Memo");
            rcl.push("ShortDespt");
            rclv.push("'" + rmsg.join(',') + "'");
            rclv.push("'" + rmsg.join(',') + "'");
            var msgt = rtype == 1 ? "打卡:" : (rtype == 2 ? "请假:" : "红包打卡:");
            var imgpath = req.files != null && req.files.length > 0 ? req.files[0].destination + "/" + req.files[0].filename : "";
            var sql = "insert ncuserrefaction ( " + rcl.join(",") + " ) value (" + rclv.join(",") + ");\
               insert ncuserrefimg set RefID= LAST_INSERT_ID(),RefType=1,Imgpath='" + imgpath + "',CreatedBy=" + req.session.userinfo.NCUserID + ";" +
                "insert into noticemsg(msg,NCActionID,fromid,touid,msgtype,uimg,msgname,refid) \
                select '" + msgt + rmsg + "'," + aid + ",-1,-1,1,headimgurl,UserName,LAST_INSERT_ID() from ncuser where ncuserid=" + req.session.userinfo.NCUserID;
            console.log(sql);
            cn.query(sql, function (err, data, fileds) {
                if (err) throw err;
                cn.release();
                res.send(data);

            });
        });
    },
    //获取用户打卡信息
    getUserRecodrs: function (req, res, next) {
        var sql = "select T1.UserID, T1.id, T1.ShortDespt,T1.TargetTime,T1.Status,T1.RecordType \
               from  ncuserrefaction T1  where T1.UserID=" + req.query.uid + " and T1.NCActionid=" + req.query.aid + " order by T1.ID desc limit " + (req.query.pindex == null ? 0 : req.query.pindex) + ",10 ;\
               select NCUserID,UserName,headimgurl from NCUser where NCUserID=" + req.query.uid + ";\
               select NCActionID,ActionName,ActionShortDsp,ImageName from ncaction where NCActionID=" + req.query.aid;
        console.log(sql);
        req.dbpool.getConnection(function (err, cn) {
            console.log(sql);
            cn.query(sql, function (err, data, fileds) {
                if (err) throw err;

                var r1 = _.map(data[0], function (d) {
                    var ur = {};
                    ur.uid = d.UserID;
                    ur.id = d.id;
                    ur.date = df(d.TargetTime, "yyyy-mm-dd");
                    ur.type = d.RecordType;
                    ur.title = d.RecordType == 1 ? "签到" : (d.RecordType == 2 ? "请假" : "红包");
                    ur.msg = d.ShortDespt;
                    ur.status = d.Status
                    return ur;
                });


                var r2 = _.map(data[1], function (d) {
                    // d.NCActionID = utility.Base64_encode(d.NCActionID)
                    // d.CreateDate = df(d.CreateDate, "yyyy-mm-dd");
                    return d;
                });

                res.send([r1, r2, data[2]]);
            });
        }); //end dbpool
    }, //end getUserRecodrs
    genRedEnvelop: function (req, res, next) {
        req.dbpool.getConnection(function (err, cn) {
            console.log(req.query.date);
            var yearnum;
            var monthnum;
            var weeknum;
            var now = df(now, "yyyy-mm-dd HH:MM:ss");
            var rcl = ["UserID", "NCActionID", "ActionType", "YearNum", "MonthNum", "WeekNum", "status",
                "CreateDate", "CreatedBy", "RecordType", "memo"
            ];
            if (req.query.date != "undefined") {
                yearnum = df(req.query.date, "yyyy");
                monthnum = df(req.query.date, "mm");
                weeknum = df(req.query.date, "W");
            } else {
                //yearnum = "DATE_FORMAT(NOW(),'%Y')";
                //weeknum = "DATE_FORMAT(NOW(),'%v')";
                yearnum = "'" + df(now, "yyyy") + "'";
                monthnum = "'" + df(now, "mm") + "'";
                weeknum = "'" + df(now, "W") + "'";
            };
            console.log(yearnum + '-' + monthnum + '-' + weeknum + ' now:' + now);
            console.log('aid:' + req.query.aid);
            var sql = "insert into ncuserrefaction(" + rcl.join(",") + ") " +
                "select userid , ?,1, ?, ?, ?, 1, ?, userid, 3 ,'本周需发红包' " +
                "from ( select distinct userid " +
                "from ncuserrefaction a \
            where a.userid in ( \
            select userid from ncuserrefaction \
            where NCActionID= ? and status = 2 and RecordType= 1 and yearnum = ? and monthnum = ? and weeknum = ? \
            group by userid having count(userid) < 2 ) \
            and not exists ( \
            select * from sds163239206_db.ncuserrefaction b \
            where b.NCActionID = ? and b.status = 2 and b.RecordType = 2 \
            and b.yearnum = ? and monthnum = ? and b.weeknum = ? \
            and b.UserID = a.userid ) \
            ) users";
            console.log('sql:' + sql);
            cn.query(sql, [req.query.aid, yearnum, monthnum, weeknum, now,
            req.query.aid, yearnum, monthnum, weeknum,
            req.query.aid, yearnum, monthnum, weeknum
            ],
                function (err, data, fileds) {
                    console.log(err);
                    cn.release();
                    console.log(req.session.userinfo.NCUserID);
                    res.send(data[0]);
                });
        });
    },


}