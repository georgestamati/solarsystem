var express = require('express');
var router = express.Router();
var rows = require('./db');

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


module.exports = router;
