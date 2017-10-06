var express = require('express');
var mysql = require('mysql');

// var connection = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : 'George01',
//     database : 'planets_db'
// });

// connection.connect(function(err){
// 	if(!err) {
// 	    console.log("Database is connected ...");    
// 	} else {
// 	    console.log("Error connecting database ...");    
// 	}
// });

var rows = [
	{
		name: 'Sun',
		url: 'sun'
	},
	{
		name: 'Mercury',
		url: 'mercury'
	},
	{
		name: 'Venus',
		url: 'venus'
	},
	{
		name: 'Earth',
		url: 'earth'
	},
	{
		name: 'Mars',
		url: 'mars'
	},
	{
		name: 'Jupiter',
		url: 'jupiter'
	},
	{
		name: 'Saturn',
		url: 'saturn'
	},
	{
		name: 'Uranus',
		url: 'uranus'
	},
	{
		name: 'Neptune',
		url: 'neptune'
	}
];

// module.exports = connection;
module.exports = rows;