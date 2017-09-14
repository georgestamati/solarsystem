var express = require('express');
var router = express.Router();
var db = require('../db');

db.query('SELECT name, link_address FROM planets_db.planets', function (err, rows, fields) {
  	if (err) {
  		throw err
  	}
	
	/* GET users listing. */
	router.get('/', function(req, res, next) {
	  	res.render('planet', { title: 'Earth', 'items': rows });
	});
	// db.end();
})

module.exports = router;
