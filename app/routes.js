var express = require('express'),
	router = express.Router(),
	rows = require('./db');

var desktopLoader, mobileLoader;

var capTitle = function (value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
};

desktopLoader =	'<div class="loader hidden">'+
					'<div class="loader__wrapper">'+
						'<div class="loader__welcome welcome__message">Welcome to SolSys 3D</div>'+
						'<div class="loader__planet"></div>'+
						'<div class="loader__welcome control__message">Control the app'+
							'<div class="loader__control-buttons">'+
								'<input type="button" value="Local" data-attr="redirect__local" class="loader__control-button loader__local-control">'+
								'<input type="button" value="Remote" data-attr="redirect__remote" class="loader__control-button loader__remote-control">'+
							'</div>'+
							'<div class="loader__redirect redirect__local hidden">'+
								'<div class="loader__control-buttons">'+
									'<input type="button" value="Go to app" class="loader__local-button">'+
								'</div>'+
							'</div>'+
							'<div class="loader__redirect redirect__remote hidden">Insert the code in mobile browser'+
								'<div class="loader__control-buttons">'+
									'<input type="button" value="" class="loader__remote-button">'+
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
										'<input type="button" value="Go to app" class="loader__local-button">'+
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
	res.render('planet', {
		'title': capTitle(req.params.planet),
		'planet': req.params.planet,
		'items': rows,
		'loader': desktopLoader
	});
});

router.get('/:planet/:moon', function(req, res) {
	res.render('moon', {
		'title': capTitle(req.params.moon),
		'moon': req.params.moon,
		'planet': req.params.planet,
		'items': rows,
		'loader': desktopLoader});
});

module.exports = router;
