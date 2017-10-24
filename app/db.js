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
		name: 'sun'
	},
	{	
		name: 'mercury'
	},
	{	
		name: 'venus'
	},
	{	
		name: 'earth',
		moons: [
			{			
				name: 'moon'
			}
		]
	},
	{	
		name: 'mars',
		moons: [
			{			
				name: 'phobos'
			},
			{			
				name: 'deimos'
			}
		]
	},
	{	
		name: 'jupiter',
		moons: [
			{			
				name: 'callisto'
			},
			{			
				name: 'europa'
			},
			{			
				name: 'ganymede'
			},
			{			
				name: 'io'
			}
		]
	},
	{	
		name: 'saturn',
		moons: [
			{			
				name: 'dione'
			},
			{			
				name: 'enceladus'
			},
			{			
				name: 'iapetus'
			},
			{			
				name: 'mimas'
			},
			{			
				name: 'rhea'
			},
			{			
				name: 'tethys'
			},
			{			
				name: 'titan'
			}
		]
	},
	{	
		name: 'uranus',
		moons: [
			{			
				name: 'ariel'
			},
			{			
				name: 'miranda'
			},
			{			
				name: 'oberon'
			},
			{			
				name: 'titania'
			},
			{			
				name: 'umbriel'
			}
		]
	},
	{	
		name: 'neptune',
		moons: [
			{			
				name: 'proteus'
			},
			{			
				name: 'triton'
			}
		]
	}
];

// module.exports = connection;
module.exports = rows;