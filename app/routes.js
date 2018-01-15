var express = require('express'),
	router = express.Router(),
	loader = require('./loader'),
	rows = require('./db');

var planetArr = [],
	capTitle = function (value) {
		return value.charAt(0).toUpperCase() + value.slice(1);
	};

router.get('/', function(req, res) {
	var ua = req.headers['user-agent'];
	if (/mobile/i.test(ua)) {
		res.render('mobile', {
			'title': 'Solar System',
			'items': rows,
			'loader': loader.mobileLoader
		});
	} else {
		res.render('index', {
			'title': 'Solar System',
			'items': rows,
			'loader': loader.desktopLoader
		});
	}
});

router.get('/:planet', function(req, res) {
    //Iterate JSON and render only if name exists in JSON
    for (var row in rows){
		planetArr[row] = rows[row].name;
	}
	if(planetArr.indexOf(req.params.planet) > -1){
		res.render('planet', {
			'title': capTitle(req.params.planet),
			'planet': req.params.planet,
			'items': rows,
			'loader': loader.desktopLoader
		});
	}
	else{
		res.render('error');
	}
});

router.get('/:planet/:moon', function(req, res) {
	res.render('moon', {
		'title': capTitle(req.params.moon),
		'moon': req.params.moon,
		'planet': req.params.planet,
		'items': rows,
		'loader': loader.desktopLoader
	});
});

module.exports = router;
