var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require("./config/routes");
var settings = require("./config/settings");
var mysql = require("mysql");
var app = express();
var session=require("express-session");
var FileStore = require('session-file-store')(session);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set("views",path.join(__dirname,"views/mytest"));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({ 
  store:new FileStore(),
  secret: 'keyboard cat', 
  cookie: { maxAge: 60000 }}))
 

//数据库连接池
var dbpool = mysql.createPool(settings.database);
app.use(function (req, res, next) {
  if (!dbpool) {
    console.log('no dbpool')
    dbpool = mysql.createPool(settings.database);
  } else {
    console.log("set req.dbpool");
    req.dbpool = dbpool;
  }
  next();
});




//add routes
routes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;