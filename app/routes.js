var express = require('express'),
	router = express.Router(),
	rows = require('./db');

var desktopLoader, mobileLoader, planetArr = [];

var capTitle = function (value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
};

desktopLoader =	'<div class="loader hidden">'+
					'<div class="loader__wrapper">'+
						'<div class="loader__welcome welcome__message">Welcome to SolSys 3D</div>'+
						'<div class="loader__planet"></div>'+
						'<div class="loader__welcome control__message">Control the app'+
							'<div class="loader__control-buttons">'+
								'<button type="button" name="local" data-attr="redirect__local" class="loader__control-button loader__local-control loader__wrapper--input">Local</button>'+
								'<button type="button" name="remote" data-attr="redirect__remote" class="loader__control-button loader__remote-control loader__wrapper--input">Remote</button>'+
							'</div>'+
							'<div class="loader__redirect redirect__local hidden">'+
								'<div class="loader__control-buttons">'+
									'<button type="button" name="" class="loader__local-button loader__wrapper--input">Go to app</button>'+
								'</div>'+
							'</div>'+
							'<div class="loader__redirect redirect__remote hidden">Insert the code in mobile browser'+
								'<div class="loader__control-buttons">'+
									'<button type="button" name="code" class="loader__remote-button loader__wrapper--input"></button>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>';

mobileLoader =	'<div class="loader hidden">'+
					'<div class="loader__wrapper">'+
						'<div class="loader__welcome welcome__message">Welcome to SolSys 3D</div>'+
							'<div class="loader__planet"></div>'+
							'<div class="loader__welcome control__message">'+
								'<div class="loader__redirect redirect__remote">Insert the code'+
									'<div class="loader__control-buttons">'+
										'<button type="button" name="" class="loader__local-button loader__wrapper--input">Go to app</button>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
    				'</div>'+
    			'</div>';

router.get('/', function(req, res) {
	var ua = req.headers['user-agent'];
	if (/mobile/i.test(ua)) {
		res.render('mobile', {
			'title': 'Solar System',
			'items': rows,
			'loader': mobileLoader
		});
	} else {
		res.render('index', {
			'title': 'Solar System',
			'items': rows,
			'loader': desktopLoader
		});
	}
});

router.get('/:planet', function(req, res) {
	for (var row in rows){
		planetArr[row] = rows[row].name;
	}
	if(planetArr.indexOf(req.params.planet) > -1){
		res.render('planet', {
			'title': capTitle(req.params.planet),
			'planet': req.params.planet,
			'items': rows,
			'loader': desktopLoader
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
		'loader': desktopLoader
	});
});

module.exports = router;
