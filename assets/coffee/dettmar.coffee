# http://sketchup.google.com/3dwarehouse/details?mid=b22e101d86f50bcb89a16ec098e81015

class Background
	
	container: undefined
	stats: undefined
	camera: undefined
	scene: undefined
	renderer: undefined
	objects: undefined
	particleLight: undefined
	pointLight: undefined
	skin: undefined
	
	constructor: ->
		
		@loader = new THREE.ColladaLoader()
		@loader.options.convertUpAxis = true
		
		@loadObj()

	loadObj: ->
		
		@loader.load "/assets/3d/duck/duck.dae", (collada) =>
			obj = collada.scene
			skin = collada.skins[0]
			obj.scale.x = obj.scale.y = obj.scale.z = 0.0005
			obj.position.x = 25
			obj.position.y = -2
			obj.position.z = -12.5
			obj.updateMatrix()
			@onLoad(obj)
	
	onLoad: (obj) ->
	
		@container = document.getElementById "duck"
		@camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000)
		@scene = new THREE.Scene
		
		# Add the COLLADA
		@scene.add obj
		@particleLight = new THREE.Mesh(new THREE.SphereGeometry(4, 8, 8), new THREE.MeshBasicMaterial(color: 0x000000))
		#@scene.add @particleLight
		
		# Lights
		@scene.add new THREE.AmbientLight 0xffffff
		lampor = 3
		while lampor--
			directionalLight = new THREE.DirectionalLight(0xffffff) #Math.random() * 0xffffff
			directionalLight.position.y = if lampor is 1 then 10 else -10
			#directionalLight.position.y = Math.random() - 0.5
			directionalLight.position.x = if lampor is 2 then 10 else -10
			directionalLight.position.z = if lampor is 1 then 10 else -10
			directionalLight.position.normalize()
			@scene.add directionalLight
		#@pointLight = new THREE.PointLight(0xffffff, 4)
		#@pointLight.position = @particleLight.position
		
		@scene.add @pointLight
		@renderer = new THREE.WebGLRenderer()
		@renderer.setSize window.innerWidth, window.innerHeight
		@container.appendChild @renderer.domElement
		@stats = new Stats()
		@stats.domElement.style.position = "absolute"
		@stats.domElement.style.top = "0px"
		@container.appendChild @stats.domElement
		
		#
		window.addEventListener "resize", @onWindowResize, false
		@animate()
	
	
	onWindowResize: =>
		@camera.aspect = window.innerWidth / window.innerHeight
		@camera.updateProjectionMatrix()
		@renderer.setSize window.innerWidth, window.innerHeight

	t: 0
	clock: new THREE.Clock
	centaah: new THREE.Vector3 0, 2, 0
	movePlz: true

	animate: ->
		delta = @clock.getDelta()
		requestAnimationFrame @animate.bind @
		t = 0 if t > 1
		if @skin
			i = 0
			while i < skin.morphTargetInfluences.length
				@skin.morphTargetInfluences[i] = 0
				i++
			@skin.morphTargetInfluences[Math.floor(t * 30)] = 1
			t += delta
		@render()
		@stats.update()


	render: ->
		timer = Date.now() * 0.0005
		if @movePlz
			@camera.position.x = Math.cos(timer) * 10
			@camera.position.y = 2
			@camera.position.z = Math.sin(timer) * 10
		
		#@camera.lookAt( @scene.position );
		@camera.lookAt @centaah
		#@particleLight.position.x = Math.sin(timer * 4) * 3009
		#@particleLight.position.y = Math.cos(timer * 5) * 4000
		#@particleLight.position.z = Math.cos(timer * 4) * 3009
		@renderer.render @scene, @camera


new Background()