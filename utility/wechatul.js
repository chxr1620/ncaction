var settings = require("../config/settings");
var rq = require("request");
var WXBizDataCrypt = require("./WXBizDataCrypt");

module.exports = {
    getUserinfo: function (code, encryptedData, iv, fn) {
        var as = settings.wechat.waction;
        var uinfo = "";
        var skurl = as.sesskey_url + "?" + "appid=" + as.appid + "&secret=" + as.secret + "&js_code=" + code + "&grant_type=authorization_code"
        var uinid="oMjk7v0GVZl-6BHy14lewkVkzGA0";//NC unionid
         fn(uinid);
        // rq(skurl, function (er, rs, data) {
        //     var jsd = JSON.parse(data);
        //     var iv = "hhpNi0kb6xCHExFMUXn9mQ=="
        //     var encryptedData = "WH6flu7M6U5DreiOs0seAlNvMRq27zWNpmKn7E5WwySAaX5uzI89un4nAO0qsxLJkEIkVEZCi2+Cpl+GtKP8MyCEv4hDqY7ez1sl3FSbFnbUuC5yD4Ojp0I6jD1MaNKOl6VQkikzJEsoli0UvbdwH/efZjiz93BDtE1X9nIFQzidaKHHiqct/Sa65TIkDHNuZdBXPZ4N8xICdsMin96mX3drdjfdZz+mpPHFQatesT1Bo28/NTmOF9JYq4JOmp6x+4OIMzhKJpsxWFEh7mIyU7gKQmozikXF7WrfkBeClqFzUSKeU1L1nd8gMMWbH7oM9xGcXgI5Asm3Wy9iuRvPYRVu3HI4Z5vgZQw/kz6agRbViyS6y5Vzi4JjBsUpKGCnYO2JRFR4QApSxKCF+2wf295QKph979zG3rU+K5DCaIQN5wLq48gvkGm9l4CUD1i6zbch+yXFBtqduOaGls4f0jF33h5Ka8GDrOgc6IrmZVgf7BxcsMAKywged3s5d9IoTJS55rsKuiic8Jw1+7iPjA=="
        //     var sk = "PnVTdvwGemxaqz\/DKDAdSw==";
        //     // var pc = new WXBizDataCrypt(as.appid, jsd.session_key)
        //     var pc = new WXBizDataCrypt(as.appid, sk);
        //     uinfo = pc.decryptData(encryptedData, iv);
        //     var uinid="oMjk7v0GVZl-6BHy14lewkVkzGA0";//NC unionid
        //     fn(uinid);
        // });

    }



}