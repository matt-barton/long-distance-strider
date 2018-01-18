const express = require('express'),
  bodyParser = require('body-parser'),
  passport = require('passport'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  config = require('./lib/config'),
  api = require('./lib/api'),
  app = express(),
  port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('./client/public'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({ url: process.env.MONGODB_URI }),
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', api);

app.listen(port, () => console.log('Application listening on port ' + port));