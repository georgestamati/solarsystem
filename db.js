var express = require('express');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'George01',
    database : 'planets_db'
});

connection.connect(function(err){
	if(!err) {
	    console.log("Database is connected ...");    
	} else {
	    console.log("Error connecting database ...");    
	}
});

module.exports = connection;