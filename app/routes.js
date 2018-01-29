var express = require('express'),
	router = express.Router(),
	rows = require('./db'),
	records = rows.records;

var planetArr = [],
	capTitle = function (value) {
		return value.charAt(0).toUpperCase() + value.slice(1);
	};

router.get('/', function(req, res) {
	var ua = req.headers['user-agent'];
	if (/mobile/i.test(ua)) {
		res.render('../../views/mobile', {
			'title': rows.title,
			'items': records
		});
	} else {
		res.render('../../views/index', {
			'title': rows.title,
			'items': records
		});
	}
});

router.get('/:planet', function(req, res) {
	var planetPos,
		planetsArr = [];
    //Iterate JSON and render only if name exists in JSON
    for (var row in records){
		planetArr[row] = records[row].name;
	}

    planetPos = planetArr.indexOf(req.params.planet);
	planetsArr[0] = records[planetPos];

	if(planetPos > -1){
		res.render('../../views/planet', {
			'title': capTitle(req.params.planet),
			'planet': req.params.planet,
            'planetItems': planetsArr,
			'items': records
		});
	}
	else{
		res.render('error');
	}
});

module.exports = router;
