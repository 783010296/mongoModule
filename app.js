var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var settings = require('./settings');
var flash = require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var app = express();

app.set('port',process.env.PORT || 8001);
app.use(flash());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    resave:false,
    saveUninitialized: true,
    secret: settings.cookieSecret,
    key: settings.db,//cookie name
    cookie: {maxAge: 1000 * 60 * 30},//30 分钟
    store: new MongoStore({
        url: settings.url,
        db: settings.db,
        host: settings.host,
        port: settings.port
    })
}));

routes(app);

app.listen(app.get('port'),function(){
    console.log("Server start listening on port"+app.get('port'));
});