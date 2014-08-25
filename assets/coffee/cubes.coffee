window.raf = window.requestAnimationFrame or window.mozRequestAnimationFrame or window.webkitRequestAnimationFrame or window.msRequestAnimationFrame
window.cancelRaf = window.cancelAnimationFrame or window.mozCancelAnimationFrame or window.webkitCancelAnimationFrame or window.msCancelAnimationFrame
window["easterTime"] = false

Shape = Isomer.Shape
Point = Isomer.Point
Color = Isomer.Color
Path = Isomer.Path


throttle = (fn, threshhold = 100, scope) ->
	last = undefined
	deferTimer = undefined
	(args...) ->
		context = scope or this
		now = +new Date
		if last and now < last + threshhold
			
			# hold on to it
			clearTimeout deferTimer
			deferTimer = setTimeout(->
				last = now
				fn.apply context, args
				return
			, threshhold)
		else
			last = now
			fn.apply context, args
		return


class CubesBackground
	
	constructor: ->
		
		@setupElements()
		@listen()
		@tower = new Tower @
		@tower.done ->
			ga 'send', 'event', 'yolo', 'timeout'
	
	setupElements: ->
	
		@canvas = document.createElement "canvas"
		@canvas.setAttribute "class", "mobile_bg"
		@bg = document.getElementById "background"
		@bg.appendChild @canvas
		@bg.setAttribute "class", "loaded"

		@canvas.width = window.innerWidth * 2
		@canvas.height = window.innerHeight * 2

		@iso = new Isomer @canvas
	
	listen: ->

		window.onresize = throttle =>

			@canvas.width = window.innerWidth * 2
			@canvas.height = window.innerHeight * 2
			@iso.originX = @canvas.width / 2;
			@iso.originY = @canvas.height * 0.9;
	
	hide: =>

		@bg.setAttribute "class", ""
		setTimeout @canvas.parentElement.removeChild.bind(@canvas.parentElement), 500, @canvas


class Tower
	
	
	beginning: Date.now()
	end: Date.now()
	
	blockSideAmount: 6
	layerSteps: Math.pow Tower::blockSideAmount + 1, 2
	cubeSteps: Math.pow Tower::blockSideAmount + 1, 3
	
	x: Tower::blockSideAmount
	y: Tower::blockSideAmount
	z: 0
		
	xTarget: Tower::blockSideAmount
	yTarget: Tower::blockSideAmount
	zTarget: Tower::blockSideAmount
	
	xLevel: Tower::blockSideAmount
	yLevel: Tower::blockSideAmount
	
	hasTurned: false
	
	step: 0
	cubeSize: .5
	
	rStart: 219
	gStart: 1
	bStart: 26
	
	rEnd: 235
	gEnd: 175
	bEnd: 28
	
	
	constructor: (@scene) ->
		
		@cube = Shape.Prism Point.ORIGIN, @cubeSize, @cubeSize, @cubeSize
		@render()
		{ done: @done }
	
	
	getColor: (step, level) ->
	
		percent = (step + (level * @layerSteps)) / (@cubeSteps)
			
		rVal = Math.round (@rEnd - @rStart) * percent + @rStart
		gVal = Math.round (@gEnd - @gStart) * percent + @gStart
		bVal = Math.round (@bEnd - @bStart) * percent + @bStart
		
		new Color rVal, gVal, bVal
	
	
	render: => # setTimeout needs right context
		
		if window.easterTime
			return @scene.hide()
		
		@beginning = Date.now()	
		@scene.iso.add @cube.translate(@x * @cubeSize, @y * @cubeSize, @z * @cubeSize),
			@getColor @step, @z 
		
		@hasTurned = true if @y is @blockSideAmount and @x is 0
		
		# level is complete
		if @x is 0 and @y is 0
			
			if @z is @blockSideAmount * 8
				@next?()
				return
			
			@hasTurned = false
			@x = @blockSideAmount
			@y = @blockSideAmount
			@xTarget = @blockSideAmount
			@yTarget = @blockSideAmount
			
			@xLevel = @blockSideAmount
			@yLevel = @blockSideAmount
			@step = 0
			@z++
		
		# row is complete
		else if @x is @xTarget and @y is @yTarget
			
			unless @hasTurned
				@x = --@xLevel
				@xTarget = @blockSideAmount
				@yTarget = @x
				@y = @blockSideAmount
			else
				@y = --@yLevel
				@xTarget = @y
				@yTarget = 0
				@x = 0
		
		# continue
		else
			@y--
			@x++
			@step++
		
		@end = Date.now()
		@diff = Math.max @end - @beginning, 0
		@delay = 1000 / 50 - @diff
	
		setTimeout raf, @delay, @render
	
	done: (@next) ->
		

new CubesBackground()