var express = require('express'),
	router = express.Router(),
	rows = require('./db'),
	records = rows.records;


var planetArr = [],
	capTitle = function (value) {
		return value.charAt(0).toUpperCase() + value.slice(1);
	};

router.get('/', checkForMobileIndex, function (req, res) {
	res.render('../../views/welcome', {
		'title': rows.title
	});
});
router.get('/mobile', checkForDesktopIndex, function (req, res) {
	res.render('../../views/welcome-mobile', {
		'title': rows.title
	});
});

router.get('/galaxy', checkForMobileGalaxy, function(req, res) {
	res.render('../../views/index', {
		'title': rows.title,
		'items': records
	});
});
router.get('/mobile/galaxy', checkForDesktopGalaxy, function (req, res) {
	res.render('../../views/mobile', {
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

function isCallerMobile(req) {
    var ua = req.headers['user-agent'];
    return /mobile/i.test(ua);
}

// note: the next method param is passed as well
function checkForMobileIndex(req, res, next) {
    // check to see if the caller is a mobile device
    var isMobile = isCallerMobile(req);
    var ua = req.headers['user-agent'];
    console.log(/mobile/i.test(ua));
    if (isMobile) {
        res.redirect('/mobile');
    } else {
        console.log(isCallerMobile(req));

        // if we didn't detect mobile, call the next method, which will eventually call the desktop route
        next();
    }
}

function checkForMobileGalaxy(req, res, next) {
    // check to see if the caller is a mobile device
    var isMobile = isCallerMobile(req);
    console.log(isCallerMobile(req));
    if (isMobile) {
        res.redirect('/mobile/galaxy');
    } else {
        // if we didn't detect mobile, call the next method, which will eventually call the desktop route
        next();
    }
}

// note: the next method param is passed as well
function checkForDesktopIndex(req, res, next) {
    // check to see if the caller is a mobile device
    var isMobile = isCallerMobile(req);
    console.log(isCallerMobile(req));
    if (!isMobile) {
        res.redirect('/');
    } else {
        console.log(isCallerMobile(req));

        // if we didn't detect mobile, call the next method, which will eventually call the desktop route
        next();
    }
}

function checkForDesktopGalaxy(req, res, next) {
    // check to see if the caller is a mobile device
    var isMobile = isCallerMobile(req);
    console.log(isCallerMobile(req));
    if (!isMobile) {
        res.redirect('/galaxy');
    } else {
        // if we didn't detect mobile, call the next method, which will eventually call the desktop route
        next();
    }
}

module.exports = router;
