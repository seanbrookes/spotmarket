var loopback = require('loopback');
var boot = require('loopback-boot');
var express = require('express');
var path = require('path');
var http = require('http');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var app = module.exports = loopback();

function genuuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

app.use(express.static(path.join(__dirname, '../client/www')));
app.use(session({
  genid: function(req) {
    return genuuid(); // use UUIDs for session IDs
  },
  secret: 'stoney wall',
  name: 'smTraceId'
}));

app.use(cookieParser());
app.disable('x-powered-by');


app.start = function() {
  // start the web server
  return app.listen(app.get('port'), function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }

  });
};




// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module) {
    app.start();

  }
});
