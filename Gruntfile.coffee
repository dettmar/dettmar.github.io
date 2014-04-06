module.exports = (grunt) ->

	@initConfig
	
		watch:
			files: 'assets/coffee/dettmar.coffee',
			tasks: ['coffee', 'uglify']
		
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
	
	@loadNpmTasks 'grunt-contrib-watch'
	@loadNpmTasks 'grunt-contrib-coffee'
	@loadNpmTasks 'grunt-contrib-uglify'

	@registerTask 'default', [
		'coffee'
		'uglify'
		'watch'
	]