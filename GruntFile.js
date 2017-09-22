module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			dist: {
				options:{
		          	style:'compressed'
		        },
				files: {
					'public/css/style.css' : 'public/css/sass/style.sass'
				}
			}
		},
		autoprefixer: {
            dist: {
                files: {
                    'public/css/style.css': 'public/css/style.css'
                }
            }
        },
        concat: {
		    js: {
		      	src: ['public/css/*.css'],
		      	dest: 'public/css/style.css',
		    },
		    css: {
		      	src: ['public/js/**/*.js'],
		      	dest: 'public/js/min.js',
		    },
		},
		uglify: {
			dist: {
				files: {
					'public/js/min.js': ['public/js/min.js']
				}
				// src: 'public/js/min.js',
    //     		dest: 'public/js/min.js'
			}
		},
		watch: {
			css: {
				files: '**/**/*.sass',
				tasks: ['sass', 'autoprefixer']
			},
			scripts: {
				files: 'public/js/scripts/*.js',
				tasks: ['concat', 'uglify']
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-sass');
  	grunt.loadNpmTasks('grunt-contrib-watch');
  	grunt.loadNpmTasks('grunt-autoprefixer');
  	grunt.loadNpmTasks('grunt-contrib-concat');
  	grunt.loadNpmTasks('grunt-contrib-uglify');

  	grunt.registerTask('default',['watch']);
}