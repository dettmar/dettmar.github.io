(function() {
  var Background,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Background = (function() {
    Background.prototype.container = void 0;

    Background.prototype.camera = void 0;

    Background.prototype.scene = void 0;

    Background.prototype.renderer = void 0;

    Background.prototype.objects = void 0;

    Background.prototype.particleLight = void 0;

    Background.prototype.pointLight = void 0;

    Background.prototype.skin = void 0;

    function Background() {
      this.onWindowResize = __bind(this.onWindowResize, this);
      this.loader = new THREE.ColladaLoader();
      this.loader.options.convertUpAxis = true;
      this.loadObj();
    }

    Background.prototype.loadObj = function() {
      return this.loader.load("/assets/3d/duck/duck.dae", (function(_this) {
        return function(collada) {
          var obj, skin;
          obj = collada.scene;
          skin = collada.skins[0];
          obj.scale.x = obj.scale.y = obj.scale.z = 0.0005;
          obj.position.x = 25;
          obj.position.y = -2;
          obj.position.z = -12.5;
          obj.updateMatrix();
          return _this.onLoad(obj);
        };
      })(this));
    };

    Background.prototype.onLoad = function(obj) {
      var ambLights, directionalLight;
      this.container = document.getElementById("background");
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
      this.scene = new THREE.Scene;
      this.scene.add(obj);
      this.particleLight = new THREE.Mesh(new THREE.SphereGeometry(4, 8, 8), new THREE.MeshBasicMaterial({
        color: 0x000000
      }));
      this.scene.add(new THREE.AmbientLight(0xffffff));
      ambLights = 3;
      while (ambLights--) {
        directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.y = ambLights === 1 ? 10 : -10;
        directionalLight.position.x = ambLights === 2 ? 10 : -10;
        directionalLight.position.z = ambLights === 1 ? 10 : -10;
        directionalLight.position.normalize();
        this.scene.add(directionalLight);
      }
      this.scene.add(this.pointLight);
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.container.appendChild(this.renderer.domElement);
      window.addEventListener("resize", this.onWindowResize, false);
      this.animate();
      return this.container.classList.add("loaded");
    };

    Background.prototype.onWindowResize = function() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      return this.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    Background.prototype.t = 0;

    Background.prototype.clock = new THREE.Clock;

    Background.prototype.centaah = new THREE.Vector3(0, 2, 0);

    Background.prototype.movePlz = true;

    Background.prototype.animate = function() {
      var delta, i, t;
      delta = this.clock.getDelta();
      requestAnimationFrame(this.animate.bind(this));
      if (t > 1) {
        t = 0;
      }
      if (this.skin) {
        i = 0;
        while (i < skin.morphTargetInfluences.length) {
          this.skin.morphTargetInfluences[i] = 0;
          i++;
        }
        this.skin.morphTargetInfluences[Math.floor(t * 30)] = 1;
        t += delta;
      }
      return this.render();
    };

    Background.prototype.render = function() {
      var timer;
      timer = Date.now() * 0.0005;
      if (this.movePlz) {
        this.camera.position.x = Math.cos(timer) * 10;
        this.camera.position.y = 2;
        this.camera.position.z = Math.sin(timer) * 10;
      }
      this.camera.lookAt(this.centaah);
      return this.renderer.render(this.scene, this.camera);
    };

    return Background;

  })();

  new Background();

}).call(this);

//# sourceMappingURL=duck.js.map
