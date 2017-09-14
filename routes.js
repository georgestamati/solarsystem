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

router.get('/', function(req, res, next) {
  	res.render('index', { 'title': 'Solar System', 'items': rows });
});

router.get('/:planet', function(req, res, next) {
  	res.render('planet', { 'title': req.params.planet, 'link_address': req.params.planet, 'items': rows});
});


module.exports = router;
