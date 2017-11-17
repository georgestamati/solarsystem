var rows = [
	{	
		name: 'sun',
		moons: [
            {
                name: 'mercury'
            },
            {
                name: 'venus'
            },
            {
                name: 'earth'
            },
            {
                name: 'mars'
            },
            {
                name: 'jupiter'
            },
            {
                name: 'saturn',
				rings: '.rings'
            },
            {
                name: 'uranus',
				rings: '.rings'
            },
            {
                name: 'neptune'
            }
		]
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

module.exports = rows;