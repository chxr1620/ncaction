var path = require('path');

var settings = {
    database: {
        host: 'localhost',
        user: 'root',
        password: 'afei123',
        database: 'sds163239206_db',
        multipleStatements:true
    },
    wechat: {
        waction: {
            //小程序 wwaction
            appid: 'wx3ebc73a619e0770e',
            secret: '32266e261597b32c23b9c37cd65437af',
            grant_type: 'authorization_code',
            sesskey_url:"https://api.weixin.qq.com/sns/jscode2session"
        }
    }
};

module.exports = settings;