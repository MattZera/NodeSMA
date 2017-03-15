var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
//var apiRouter = require("./api/apiRouter");

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Default api catchall
//app.use('/api',apiRouter);

//Default route to Angular
app.use('/', express.static(__dirname + '/WebApp/dist/'))

//Route all not found to Angular too
app.use(function(req, res) {
  // Use res.sendFile, as it streams instead of reading the file into memory.
  res.sendFile(__dirname + '/WebApp/dist/index.html');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.json({message:'error'});
});

module.exports = app;
