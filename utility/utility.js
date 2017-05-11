module.exports = {
    Base64_encode: function (str) {
        var sb = new Buffer(str);
        return sb.toString('base64');
    },
    Base64_decode: function (str) {

        var b = new Buffer(str, "base64");
        return b.toString();
    }


}