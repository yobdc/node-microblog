/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var MongoStore = require('connect-mongo')(express);
var flash = require('connect-flash');
var settings = require('./settings');
var logger = require('./models/log');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.set('env', 'production');
// app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(flash());
app.use(express.session({
	secret: settings.cookieSecret,
	store: new MongoStore({
		db: settings.db
	})
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

process.on('uncaughtException', function(err) {
    logger.error(err);
});

// helper
app.use(function(req, res, next) {
	res.locals.user = function(req, res) {
		return req.session.user;
	};
	res.locals.error = function(req, res) {
		var err = req.flash('error');
		if (err.length) {
			return err;
		} else {
			return null;
		}
	};
	res.locals.success = function(req, res) {
		var succ = req.flash('success');
		if (succ.length) {
			return succ;
		} else {
			return null;
		}
	};
	res.locals.zz = function(req, res) {
		return req.session.user;
	};
	next();
});

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port') + ' ' + app.get('env'));
	logger.info('info');
	logger.error('error');
});

routes(app);