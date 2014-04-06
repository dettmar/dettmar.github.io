module.exports = (grunt) ->

	@initConfig
		
		'http-server':
			dev:
				root: './'
				port: 8080
				runInBackground: true
				cache: 1
		
		watch:
			scripts:
				files: 'assets/coffee/dettmar.coffee'
				tasks: ['coffee', 'uglify']
			css:
				files: 'assets/stylus/dettmar.styl'
				tasks: ['stylus']
		
		coffee:
			options:
				sourceMap: true
			compile:
				files:
					'assets/js/dettmar.js': 'assets/coffee/dettmar.coffee'
		
		uglify:
			options:
				report: 'gzip'
				sourceMap: true
				sourceMapName: 'assets/js/dettmar.min.js.map'
			my_target:
				files:
					'assets/js/dettmar.min.js': ['assets/js/dettmar.js']
	
		stylus:
			compile:
				files:
					'assets/css/dettmar.css': 'assets/stylus/dettmar.styl'

	
	@loadNpmTasks 'grunt-contrib-watch'
	@loadNpmTasks 'grunt-contrib-coffee'
	@loadNpmTasks 'grunt-contrib-uglify'
	@loadNpmTasks 'grunt-contrib-stylus'
	@loadNpmTasks 'grunt-http-server'

	@registerTask 'default', [
		'coffee'
		'uglify'
		'stylus'
		'http-server:dev'
		'watch'
	]