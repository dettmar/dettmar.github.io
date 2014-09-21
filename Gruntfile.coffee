module.exports = (grunt) ->

	@initConfig
		
		'http-server':
			dev:
				root: './'
				port: 8080
				runInBackground: true
				cache: 1
			prod:
				root: './'
				port: 8080
				runInBackground: false
				cache: 1
		
		watch:
			scripts:
				files: 'assets/coffee/*.coffee'
				tasks: ['coffee', 'uglify', 'concat']
			css:
				files: 'assets/stylus/dettmar.styl'
				tasks: ['stylus']
		
		coffee:
			options:
				sourceMap: true
			compile:
				files:
					'assets/js/duck.js': 'assets/coffee/duck.coffee'
					'assets/js/cubes.js': 'assets/coffee/cubes.coffee'
		
		uglify:
			options:
				report: 'gzip'
				sourceMap: true
				sourceMapName: 'assets/js/duck.min.js.map'
			my_target:
				files:
					'assets/js/duck.min.js': ['assets/js/duck.js']
					'assets/js/cubes.min.js': ['assets/js/cubes.js']
		
		concat:
			webgl:
				src: ['assets/js/libs/three.js', 'assets/js/duck.min.js']
				dest: 'assets/js/webgl.js'
			mobile:
				src: ['assets/js/libs/isomer.min.js', 'assets/js/cubes.min.js', 'assets/js/libs/sssl.js']
				dest: 'assets/js/mobile.js'

	
		stylus:
			compile:
				files:
					'assets/css/dettmar.css': 'assets/stylus/dettmar.styl'
		
		inline:
			dist:
				src: ["dev.html"]
				dest: ["index.html"]
		
		htmlmin:
			dist:
				options:
					removeComments: true
					collapseWhitespace: true
					minifyJS:
						mangle: false
				files:
					"index.html": "index.html"

	
	@loadNpmTasks 'grunt-contrib-concat'
	@loadNpmTasks 'grunt-contrib-watch'
	@loadNpmTasks 'grunt-contrib-coffee'
	@loadNpmTasks 'grunt-contrib-uglify'
	@loadNpmTasks 'grunt-contrib-stylus'
	@loadNpmTasks 'grunt-http-server'
	@loadNpmTasks 'grunt-inline'
	@loadNpmTasks 'grunt-contrib-htmlmin'

	@registerTask 'default', [
		'coffee'
		'uglify'
		'stylus'
		'concat'
		'http-server:dev'
		'watch'
	]
	
	@registerTask 'prod', [
		'coffee'
		'uglify'
		'stylus'
		'concat'
		'inline'
		'htmlmin'
		'http-server:prod'
	]