var express = require('express');
var router = express.Router();
var db = require('../db');

db.query('SELECT name, link_address FROM planets_db.planets', function (err, rows, fields) {
	db.end();
  	if (err) {
  		throw err
  	}
	
	/* GET home page. */
	router.get('/', function(req, res, next) {
	  	res.render('index', { 'title': 'Solar System', 'items': rows });
	});
})

module.exports = router;
