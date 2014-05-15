window.raf = window.requestAnimationFrame or window.mozRequestAnimationFrame or window.webkitRequestAnimationFrame or window.msRequestAnimationFrame
window.cancelRaf = window.cancelAnimationFrame or window.mozCancelAnimationFrame or window.webkitCancelAnimationFrame or window.msCancelAnimationFrame

canvas = document.createElement "canvas"
canvas.setAttribute "class", "mobile_bg"
bg = document.getElementById("background")
bg.appendChild canvas
bg.setAttribute "class", "loaded"
console.log bg


ctx = canvas.getContext "2d"


canvas.width = window.innerWidth * 2
canvas.height = window.innerHeight * 2

iso = new Isomer canvas

Shape = Isomer.Shape
Point = Isomer.Point
Color = Isomer.Color
Path = Isomer.Path

#DB001A
#EBAF1C

# 219, 0, 26
# 235, 175, 28


# y   z    x
# \   |   /
#  \  |  /
#   \ | /
#    \|/

rStart = 219
gStart = 1
bStart = 26

rEnd = 235
gEnd = 175
bEnd = 28

getColor = (step, level) ->
	
	percent = (step + (level * layerSteps)) / (cubeSteps)
		
	rVal = Math.round (rEnd - rStart) * percent + rStart
	gVal = Math.round (gEnd - gStart) * percent + gStart
	bVal = Math.round (bEnd - bStart) * percent + bStart
	
	new Color rVal, gVal, bVal


getGradient = (level, step) ->
	
	percent = step / cubeSteps
	
	level = 1 + (level * 100)
	
	rVal = Math.round rStart * level * percent
	gVal = Math.round gStart * level * percent
	bVal = Math.round bStart * level * percent
	
	rVal = Math.min rVal, 255
	gVal = Math.min gVal, 255
	bVal = Math.min bVal, 255
	
	new Color rVal, gVal, bVal




getSpectra = (x, y, level, step) ->
	
	percent = step / cubeSteps
	brightness = (level / (blockSideAmount * 1)) * 255
	
	rVal = Math.round (x / blockSideAmount) * brightness
	gVal = Math.round (y / blockSideAmount) * brightness
	bVal = Math.round brightness
	
	rVal *= 1 + (Math.random() * .1) - .2
	gVal *= 1 + (Math.random() * .1) - .2
	#bVal *= Math.round brightness
	
	new Color rVal, gVal, bVal


blockSideAmount = 6
layerSteps = Math.pow blockSideAmount + 1, 2
cubeSteps = Math.pow blockSideAmount + 1, 3

x = blockSideAmount
y = blockSideAmount
z = 0


xTarget = blockSideAmount
yTarget = blockSideAmount
zTarget = blockSideAmount

xLevel = blockSideAmount
yLevel = blockSideAmount

hasTurned = false

step = 0
cubeSize = .5


cube = Shape.Prism Point.ORIGIN, cubeSize, cubeSize, cubeSize

beginning = end = Date.now()

do render = ->
	console.log "render"
	beginning = Date.now()	
	
	iso.add cube.translate(x * cubeSize, y * cubeSize, z * cubeSize),
		#getSpectra x, y, z, step
		getColor step, z 
		#getGradient z, step
	
	hasTurned = true if y is blockSideAmount and x is 0
	
	if x is 0 and y is 0
		
		if z is blockSideAmount * 8
			return
		
		hasTurned = false
		x = blockSideAmount
		y = blockSideAmount
		xTarget = blockSideAmount
		yTarget = blockSideAmount
		
		xLevel = blockSideAmount
		yLevel = blockSideAmount
		step = 0
		z++
		return setTimeout raf, 1000 / 60, render
	
	if x is xTarget and y is yTarget
		
		unless hasTurned
			x = --xLevel
			xTarget = blockSideAmount
			yTarget = x
			y = blockSideAmount
		else
			y = --yLevel
			xTarget = y
			yTarget = 0
			x = 0
	
	else
		y--
		x++
		step++
	
	end = Date.now()
	diff = Math.max end - beginning, 0
	delay = 1000 / 50 - diff

	setTimeout raf, delay, render
