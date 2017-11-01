var express = require('express'),
	router = express.Router(),
	rows = require('./db');

router.get('/', function(req, res, next) {
	var ua = req.headers['user-agent'];
	if (/mobile/i.test(ua)) {
		res.render('mobile', { 'title': 'Solar System', 'items': rows });
	} else {
		res.render('index', { 'title': 'Solar System', 'items': rows });
	}
});

router.get('/:planet', function(req, res, next) {
	res.render('planet', { 'title': req.params.planet, 'url': req.params.planet, 'items': rows});
});

router.get('/:planet/:moon', function(req, res, next) {
	res.render('moon', { 'moon': req.params.moon, 'planet': req.params.planet, 'items': rows});
});

module.exports = router;
