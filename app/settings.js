var express = require('express');
var path = require('path');
var redis = require('redis').createClient();
var RedisStore = require('connect-redis')(express);

module.exports = function(app, config) {
  app.set('views', path.resolve(__dirname, '..', 'views'));
  app.set('view engine', 'jade');
  app.set('view options', { layout: false });
  app.use(express.static(path.resolve(__dirname, '..', 'public')));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({
    secret: config.get('COOKIE_SECRET'),
    key: config.get('COOKIE_KEY'),
    store: new RedisStore({ client: redis })
  }));
  require('./auth')(app, config, redis);
  app.use(app.router);
};
