//Express
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var path = require('path');

//Database
var mongoose = require('mongoose');

//Authentication
var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');

//GUI
var flash = require('connect-flash');
var bodyParser = require('body-parser');

//Developer tools
var logger = require('morgan');

//Database
var  configDB = require('./config/database.js');

// ========= Configuration

//Database
mongoose.connect(configDB.url);

//Authentication
require('./config/passport')(passport);

//Express
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser());
app.set('view engine', 'ejs');

//Passport
app.use(session({ secret: 'UnoDostr3sTEQUILA-SalsaTequila_AndersNilsen'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Routes
require('./app/routes.js')(app, passport);

//Launch
app.listen(port);
console.log('Server has started on port ' + port);



//End of app.js