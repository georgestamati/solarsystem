var express = require('express'),
	path = require('path'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	compression = require('compression'),
    memoryCache = require('memory-cache'),
	route = require('./app/routes'),
    loader = require('./app/loader'),
	app = express();

// enable compression
app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view cache', true);

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// use memory cache
var cache = function (duration) {
    return function (req, res, next) {
        var url = '__express__' + req.originalUrl || req.url,
        	cachedBody = memoryCache.get(url);

        if (cachedBody) {
            res.send(cachedBody);
        }
        else {
            res.sendResponse = res.send;
            res.send = function (html) {
                memoryCache.put(url, html, duration * 1000);
                res.sendResponse(html);
            };
            next();
        }
    };
};

// setup routes
app.use('/', cache(10), route);

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
  	res.render('error', {
  		'title': '404 - Page not found',
  		'loader': loader.desktopLoader
	});
});

module.exports = app;