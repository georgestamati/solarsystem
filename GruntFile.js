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
		watch: {
			css: {
				files: '**/**/*.sass',
				tasks: ['sass', 'autoprefixer']
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-sass');
  	grunt.loadNpmTasks('grunt-contrib-watch');
  	grunt.loadNpmTasks('grunt-autoprefixer');
  	grunt.registerTask('default',['watch']);
}