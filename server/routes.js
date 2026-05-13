var express = require('express'),
	router = express.Router(),
	rows = require('./db'),
	records = rows.records;


var planetArr = [],
	capTitle = function (value) {
		return value.charAt(0).toUpperCase() + value.slice(1);
	};

router.get('/', checkForMobileIndex, function (req, res) {
	res.render('../../views/desktop/welcome', {
		'title': rows.title
	});
});
router.get('/mobile', checkForDesktopIndex, function (req, res) {
	res.render('../../views/mobile/welcome', {
		'title': rows.title
	});
});

router.get('/galaxy', checkForMobileGalaxy, function(req, res) {
	res.render('../../views/desktop/index', {
		'title': rows.title,
		'items': records
	});
});
router.get('/mobile/galaxy', checkForDesktopGalaxy, function (req, res) {
	res.render('../../views/mobile/index', {
		'title': rows.title,
		'items': records
	});
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
		res.render('../../views/desktop/planet', {
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

function isDeviceMobile(req) {
    var ua = req.headers['user-agent'];
    return /mobile/i.test(ua);
}

function checkForMobileIndex(req, res, next) {
    var isMobile = isDeviceMobile(req);
    if (isMobile) {
        res.redirect('/mobile');
    } else {
        next();
    }
}

function checkForMobileGalaxy(req, res, next) {
    var isMobile = isDeviceMobile(req);
    if (isMobile) {
        res.redirect('/mobile/galaxy');
    } else {
        next();
    }
}

function checkForDesktopIndex(req, res, next) {
    var isMobile = isDeviceMobile(req);
    if (!isMobile) {
        res.redirect('/');
    } else {
        next();
    }
}

function checkForDesktopGalaxy(req, res, next) {
    var isMobile = isDeviceMobile(req);
    if (!isMobile) {
        res.redirect('/galaxy');
    } else {
        next();
    }
}

module.exports = router;
