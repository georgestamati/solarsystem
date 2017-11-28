var rows = [
    {
        'name': 'sun',
        'description': {
            'diameter': '1,392,530 km',
            'rotation period': '25-35 days',
            'interior temperature': '15,000,000 °C',
            'surface temperature': '6,000 °C'
        },
        'moons': [
            {
                'name': 'mercury',
                'description': {
                    'diameter': '4,879.4 km',
                    'rotation period': '58.65 days',
                    'distance from sun': '57,910,000 km',
                    'orbit period': '87.97 days',
                    'number of moons': '0',
                    'axis inclination': '0.00°',
                    'orbit inclination': '7.004°'
                },
                'pos':{
                    'top': '0',
                    'left': '-50',
                    'scale': '0.15'
                }
            },
            {
                'name': 'venus',
                'description': {
                    'diameter': '12,103.6 km',
                    'rotation period': '243.02 days',
                    'distance from sun': '108,200,000 km',
                    'orbit period': '224.7 days',
                    'number of moons': '0',
                    'axis inclination': '3°',
                    'orbit inclination': '3.394°'
                },
                'pos':{
                    'top': '50',
                    'left': '0',
                    'scale': '0.3'
                }
            },
            {
                'name': 'earth',
                'description': {
                    'diameter': '12,756 km',
                    'rotation period': '0.9972 day',
                    'distance from sun': '149,600,000 km',
                    'orbit period': '365.25 days',
                    'number of moons': '1',
                    'axis inclination': '23.45°',
                    'orbit inclination': '0°'
                },
                'pos':{
                    'top': '-25',
                    'left': '60',
                    'scale': '0.305'
                }
            },
            {
                'name': 'mars',
                'description': {
                    'diameter': '6,794 km',
                    'rotation period': '24.62 days',
                    'distance from sun': '227,940,000 km',
                    'orbit period': '1.88 years',
                    'number of moons': '2',
                    'axis inclination': '23.98°',
                    'orbit inclination': '1.85°'
                },
                'pos':{
                    'top': '50',
                    'left': '120',
                    'scale': '0.20'
                }
            },
            {
                'name': 'jupiter',
                'description': {
                    'diameter': '139,822 km',
                    'rotation period': '9.84 hours',
                    'distance from sun': '778,330,000 km',
                    'orbit period': '11.86 years',
                    'number of moons': '67',
                    'axis inclination': '3.12°',
                    'orbit inclination': '1.31°'
                },
                'pos':{
                    'top': '200',
                    'left': '150',
                    'scale': '1'
                }
            },
            {
                'name': 'saturn',
                'description': {
                    'diameter': '120,536 km',
                    'rotation period': '10.23 days',
                    'distance from sun': '1,429,400,000 km',
                    'orbit period': '29.46 years',
                    'number of moons': '62',
                    'axis inclination': '26.73°',
                    'orbit inclination': '2.49°'
                },
                'pos':{
                    'top': '100',
                        'left': '400',
                        'scale': '0.85'
                },
                'rings': '.rings'
            },
            {
                'name': 'uranus',
                'description': {
                'diameter': '51,118 km',
                    'rotation period': '17.3 hours',
                    'distance from sun': '2,870,990,000 km',
                    'orbit period': '84.01 years',
                    'number of moons': '27',
                    'axis inclination': '97.86°',
                    'orbit inclination': '0.774°'
                },
                'pos':{
                    'top': '300',
                        'left': '350',
                        'scale': '0.6'
                },
                'rings': '.rings'
            },
            {
                'name': 'neptune',
                'description': {
                'diameter': '49,492 km',
                    'rotation period': '15.8 hours',
                    'distance from sun': '4,504,300,000 km',
                    'orbit period': '165 years',
                    'number of moons': '14',
                    'axis inclination': '29.31°',
                    'orbit inclination': '1.774°'
                },
                'pos':{
                    'top': '425',
                        'left': '450',
                        'scale': '0.55'
                }
            }
        ]
    },
    {
        'name': 'mercury'
    },
    {
        'name': 'venus'
    },
    {
        'name': 'earth',
        'moons': [
            {
                'name': 'moon',
                'description': {
                    'diameter': '3,476 km',
                    'rotation period': '27.32 days',
                    'distance from earth': '384,400 km',
                    'orbit period': '27.32 days',
                    'orbit inclination': '5.14°'
                },
                'pos':{
                    'top': '100',
                    'left': '100',
                    'scale': '0.6'
                }
            }
        ]
    },
    {
        'name': 'mars',
        'moons': [
            {
                'name': 'phobos',
                'description': {
                    'diameter': '27 x 21.6 x 18.8 km',
                    'rotation period': '7.66 hours',
                    'distance from mars': '9,380 km',
                    'orbit period' : '7.66 hours',
                    'orbit inclination': '1.1°'
                },
                'pos':{
                    'top': '100',
                    'left': '100',
                    'scale': '0.4'
                }
            },
            {
                'name': 'deimos',
                'description': {
                    'diameter': '15 x 12.2 x 11 km',
                    'rotation period': '30.35 hours',
                    'distance from sun': '23,460 km',
                    'orbit period': '30.35 hours',
                    'orbit inclination': '1.8°'
                },
                'pos':{
                    'top': '350',
                    'left': '150',
                    'scale': '0.3'
                }
            }
        ]
    },
    {
        'name': 'jupiter',
        'moons': [
            {
                'name': 'io',
                'description': {
                    'diameter': '3,643 km',
                    'rotation period': '1.76 days',
                    'distance from jupiter': '421,700 km',
                    'orbit period': '1.76 days',
                    'orbit inclination': '0.04°'
                },
                'pos':{
                    'top': '50',
                    'left': '-100',
                    'scale': '0.5'
                }
            },
            {
                'name': 'europa',
                'description': {
                    'diameter': '3,122 km',
                    'rotation period': '3.55 days',
                    'distance from jupiter': '671,034 km',
                    'orbit period': '3.55 days',
                    'orbit inclination': '0.47°'
                },
                'pos':{
                    'top': '450',
                    'left': '50',
                    'scale': '0.45'
                }
            },
            {
                'name': 'ganymede',
                'description': {
                    'diameter': '5,262 km',
                    'rotation period': '7.16 days',
                    'distance from jupiter': '1,070,412 km',
                    'orbit period': '7.16 days',
                    'orbit inclination': '0.195°'
                },
                'pos':{
                    'top': '150',
                    'left': '250',
                    'scale': '0.7'
                }
            },
            {
                'name': 'callisto',
                'description': {
                    'diameter': '4,821 km',
                    'rotation period': '16.689 days',
                    'distance from jupiter': '1,882,709 km',
                    'orbit period': '16.689 days',
                    'orbit inclination': '0.281°'
                },
                'pos':{
                    'top': '400',
                    'left': '400',
                    'scale': '0.6'
                }
            }
        ]
    },
    {
        'name': 'saturn',
        'rings': '.rings',
        'moons': [
            {
                'name': 'dione',
                'description': {
                    'diameter': '1,123 km',
                    'rotation period': '2.74 days',
                    'distance from saturn': '377,396 km',
                    'orbit period': '2.74 days',
                    'orbit inclination': '0.02°'
                },
                'pos':{
                    'top': '-50',
                    'left': '-100',
                    'scale': '0.4'
                }
            },
            {
                'name': 'enceladus',
                'description': {
                    'diameter': '504 km',
                    'rotation period': '1.37',
                    'distance from saturn': '237,950 km',
                    'orbit period': '1.37 days',
                    'orbit inclination': '0.02°'
                },
                'pos':{
                    'top': '100',
                    'left': '0',
                    'scale': '0.25'
                }
            },
            {
                'name': 'iapetus',
                'description': {
                    'diameter': '1,472 km',
                    'rotation period': '79.33',
                    'distance from saturn': '3,560,820 km',
                    'orbit period': '79.33 days',
                    'orbit inclination': '0.03°'
                },
                'pos':{
                    'top': '200',
                    'left': '50',
                    'scale': '0.45'
                }
            },
            {
                'name': 'mimas',
                'description': {
                    'diameter': '397 km',
                    'rotation period': '22.55 hours',
                    'distance from saturn': '185,404 km',
                    'orbit period': '22.55 hours',
                    'orbit inclination': '1.5°'
                },
                'pos':{
                    'top': '0',
                    'left': '250',
                    'scale': '0.20'
                }
            },
            {
                'name': 'rhea',
                'description': {
                    'diameter': '1,529 km',
                    'rotation period': '4.53 days',
                    'distance from saturn': '527,108 km',
                    'orbit period': '4.53 days',
                    'orbit inclination': '0.35°'
                },
                'pos':{
                    'top': '450',
                    'left': '230',
                    'scale': '0.6'
                }
            },
            {
                'name': 'tethys',
                'description': {
                    'diameter': '1,066 km',
                    'rotation period': '1.89 days',
                    'distance from saturn': '294,619 km',
                    'orbit period': '1.89 days',
                    'orbit inclination': '1.09°'
                },
                'pos':{
                    'top': '220',
                    'left': '350',
                    'scale': '0.45'
                }
            },
            {
                'name': 'titan',
                'description': {
                    'diameter': '5,151 km',
                    'rotation period': '15.9 days',
                    'distance from saturn': '1,221,930 km',
                    'orbit period': '15.9 days',
                    'orbit inclination': '0.33°'
                },
                'pos':{
                    'top': '400',
                    'left': '550',
                    'scale': '0.8'
                }
            }
        ]
    },
    {
        'name': 'uranus',
        'rings': '.rings',
        'moons': [
            {
                'name': 'ariel',
                'description': {
                    'diameter': '1,158 km',
                    'rotation period': '2.52 days',
                    'distance from uranus': '191,020 km',
                    'orbit period': '2.52 days',
                    'orbit inclination': '0.31°'
                },
                'pos':{
                    'top': '0',
                    'left': '100',
                    'scale': '0.5'
                }
            },
            {
                'name': 'miranda',
                'description': {
                    'diameter': '472 km',
                    'rotation period': '1.41 days',
                    'distance from uranus': '129,390 km',
                    'orbit period': '1.41 days',
                    'orbit inclination': '4.22°'
                },
                'pos':{
                    'top': '100',
                    'left': '50',
                    'scale': '0.3'
                }
            },
            {
                'name': 'oberon',
                'description': {
                    'diameter': '1,523 km',
                    'rotation period': '13.46 days',
                    'distance from uranus': '583,520 km',
                    'orbit period': '13.46 days',
                    'orbit inclination': '0.1°'
                },
                'pos':{
                    'top': '300',
                    'left': '450',
                    'scale': '0.6'
                }
            },
            {
                'name': 'titania',
                'description': {
                    'diameter': '1,578 km',
                    'rotation period': '8.71 days',
                    'distance from uranus': '435,910 km',
                    'orbit period': '8.71 days',
                    'orbit inclination': '0.14°'
                },
                'pos':{
                    'top': '450',
                    'left': '0',
                    'scale': '0.65'
                }
            },
            {
                'name': 'umbriel',
                'description': {
                    'diameter': '1,170 km',
                    'rotation period': '4.14 days',
                    'distance from uranus': '266,300 km',
                    'orbit period': '4.14 days',
                    'orbit inclination': '0.36°'
                },
                'pos':{
                    'top': '10',
                    'left': '450',
                    'scale': '0.55'
                }
            }
        ]
    },
    {
        'name': 'neptune',
        'moons': [
            {
                'name': 'triton',
                'description': {
                    'diameter': '2,700 km',
                    'rotation period': '5.87 days',
                    'distance from neptune': '354,759 km',
                    'orbit period': '5.87 days',
                    'orbit inclination': '157.4°'
                },
                'pos':{
                    'top': '400',
                    'left': '300',
                    'scale': '0.75'
                }
            },
            {
                'name': 'proteus',
                'description': {
                    'diameter': '400 km',
                    'rotation period': '1.12 days',
                    'distance from neptune': '117,646 km',
                    'orbit period': '1.12 days',
                    'orbit inclination': '0.04°'
                },
                'pos':{
                    'top': '50',
                    'left': '150',
                    'scale': '0.3'
                }
            }
        ]
    }
];


for (var row in rows){
    if (row > 0) {
        rows[row].description = rows[0].moons[row - 1].description;
    }
}

module.exports = rows;