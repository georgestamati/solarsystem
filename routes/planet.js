var express = require('express');
var router = express.Router();
// var db = require('../db');

var rows = [{
		name: 'Sun',
		link_address: 'sun'
	},{
		name: 'Mercury',
		link_address: 'mercury'
	},{
		name: 'Venus',
		link_address: 'venus'
	},{
		name: 'Earth',
		link_address: 'earth'
	},{
		name: 'Mars',
		link_address: 'mars'
	},{
		name: 'Jupiter',
		link_address: 'jupiter'
	},{
		name: 'Saturn',
		link_address: 'saturn'
	},{
		name: 'Uranus',
		link_address: 'uranus'
	},{
		name: 'Neptune',
		link_address: 'neptune'
	}
];

// db.query('SELECT name, link_address FROM planets_db.planets', function (err, rows, fields) {
//   	if (err) {
//   		throw err
//   	}
	
// 	 GET users listing. 
// 	router.get('/', function(req, res, next) {
// 	  	res.render('planet', { title: 'Earth', 'items': rows });
// 	});
// 	// db.end();
// })

router.get('/:planet', function(req, res, next) {
	// res.send(req.params.planet);
  	res.render('planet', { 'title': req.params.planet, 'link_address': req.params.planet, 'items': rows});
});

module.exports = router;
