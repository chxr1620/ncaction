var fs = require("fs");
var express = require("express");
module.exports = {
    fileUpload: function (req, res, next) {
        console.log(req.file.path);
        res.send(req.file.path);
    }

}