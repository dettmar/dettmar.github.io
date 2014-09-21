(function() {
  var Color, CubesBackground, Path, Point, Shape, Tower, debounce, throttle,
    __slice = [].slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  window.cancelRaf = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;

  window["easterTime"] = false;

  Shape = Isomer.Shape;

  Point = Isomer.Point;

  Color = Isomer.Color;

  Path = Isomer.Path;

  throttle = function(fn, threshhold, scope) {
    var deferTimer, last;
    if (threshhold == null) {
      threshhold = 100;
    }
    last = void 0;
    deferTimer = void 0;
    return function() {
      var args, context, now;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      context = scope || this;
      now = +(new Date);
      if (last && now < last + threshhold) {
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function() {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  };

  debounce = function(func, wait, immediate) {
    var timeout;
    timeout = void 0;
    return function() {
      var args, callNow, context, later;
      context = this;
      args = arguments;
      later = function() {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  };

  CubesBackground = (function() {
    function CubesBackground() {
      this.hide = __bind(this.hide, this);
      this.setupElements();
      this.listen();
      this.tower = new Tower(this);
      this.tower.done(function() {
        return ga('send', 'event', 'yolo', 'timeout');
      });
    }

    CubesBackground.prototype.setupElements = function() {
      this.canvas = document.createElement("canvas");
      this.canvas.setAttribute("class", "mobile_bg");
      this.bg = document.getElementById("background");
      this.bg.appendChild(this.canvas);
      this.bg.setAttribute("class", "loaded");
      this.canvas.width = window.innerWidth * 2;
      this.canvas.height = window.innerHeight * 2;
      return this.iso = new Isomer(this.canvas);
    };

    CubesBackground.prototype.listen = function() {
      return window.onresize = debounce((function(_this) {
        return function() {
          clearTimeout(_this.tower.timer);
          console.log("kill timer");
          return setTimeout(function() {
            var recoverStep;
            console.log("window.onresize deb");
            _this.tower.x = Tower.prototype.blockSideAmount;
            _this.tower.y = Tower.prototype.blockSideAmount;
            _this.tower.z = 0;
            _this.tower.step = 0;
            _this.tower.xTarget = Tower.prototype.blockSideAmount;
            _this.tower.yTarget = Tower.prototype.blockSideAmount;
            _this.tower.zTarget = Tower.prototype.blockSideAmount;
            _this.tower.xLevel = Tower.prototype.blockSideAmount;
            _this.tower.yLevel = Tower.prototype.blockSideAmount;
            recoverStep = _this.tower.totalStep;
            _this.tower.totalStep = 0;
            console.log("recoverStep", recoverStep);
            _this.tower.render(true, recoverStep);
            _this.canvas.width = window.innerWidth * 2;
            _this.canvas.height = window.innerHeight * 2;
            _this.iso.originX = _this.canvas.width / 2;
            return _this.iso.originY = _this.canvas.height * 0.9;
          }, 1000);
        };
      })(this), 250);
    };

    CubesBackground.prototype.hide = function() {
      this.bg.setAttribute("class", "");
      return setTimeout(this.canvas.parentElement.removeChild.bind(this.canvas.parentElement), 500, this.canvas);
    };

    return CubesBackground;

  })();

  Tower = (function() {
    var restoreState;

    Tower.prototype.beginning = Date.now();

    Tower.prototype.end = Date.now();

    Tower.prototype.blockSideAmount = 6;

    Tower.prototype.layerSteps = Math.pow(Tower.prototype.blockSideAmount + 1, 2);

    Tower.prototype.cubeSteps = Math.pow(Tower.prototype.blockSideAmount + 1, 3);

    Tower.prototype.x = Tower.prototype.blockSideAmount;

    Tower.prototype.y = Tower.prototype.blockSideAmount;

    Tower.prototype.z = 0;

    Tower.prototype.xTarget = Tower.prototype.blockSideAmount;

    Tower.prototype.yTarget = Tower.prototype.blockSideAmount;

    Tower.prototype.zTarget = Tower.prototype.blockSideAmount;

    Tower.prototype.xLevel = Tower.prototype.blockSideAmount;

    Tower.prototype.yLevel = Tower.prototype.blockSideAmount;

    Tower.prototype.hasTurned = false;

    Tower.prototype.step = 0;

    Tower.prototype.totalStep = 0;

    Tower.prototype.cubeSize = .5;

    Tower.prototype.rStart = 219;

    Tower.prototype.gStart = 1;

    Tower.prototype.bStart = 26;

    Tower.prototype.rEnd = 235;

    Tower.prototype.gEnd = 175;

    Tower.prototype.bEnd = 28;

    function Tower(scene) {
      this.scene = scene;
      this.render = __bind(this.render, this);
      this.cube = Shape.Prism(Point.ORIGIN, this.cubeSize, this.cubeSize, this.cubeSize);
      this.render(false);
      ({
        done: this.done
      });
    }

    Tower.prototype.getColor = function(step, level) {
      var bVal, gVal, percent, rVal;
      percent = (step + (level * this.layerSteps)) / this.cubeSteps;
      rVal = Math.round((this.rEnd - this.rStart) * percent + this.rStart);
      gVal = Math.round((this.gEnd - this.gStart) * percent + this.gStart);
      bVal = Math.round((this.bEnd - this.bStart) * percent + this.bStart);
      return new Color(rVal, gVal, bVal);
    };

    restoreState = [];

    Tower.prototype.render = function(restore, step) {
      if (window.easterTime) {
        return this.scene.hide();
      }
      this.beginning = Date.now();
      console.log("dew", this.x * this.cubeSize, this.y * this.cubeSize, this.z * this.cubeSize);
      this.scene.iso.add(this.cube.translate(this.x * this.cubeSize, this.y * this.cubeSize, this.z * this.cubeSize), this.getColor(this.step, this.z));
      if (this.y === this.blockSideAmount && this.x === 0) {
        this.hasTurned = true;
      }
      if (this.x === 0 && this.y === 0) {
        if (this.z === this.blockSideAmount * 8) {
          return typeof this.next === "function" ? this.next() : void 0;
        }
        this.hasTurned = false;
        this.x = this.blockSideAmount;
        this.y = this.blockSideAmount;
        this.xTarget = this.blockSideAmount;
        this.yTarget = this.blockSideAmount;
        this.xLevel = this.blockSideAmount;
        this.yLevel = this.blockSideAmount;
        this.step = 0;
        this.z++;
      } else if (this.x === this.xTarget && this.y === this.yTarget) {
        if (!this.hasTurned) {
          this.x = --this.xLevel;
          this.xTarget = this.blockSideAmount;
          this.yTarget = this.x;
          this.y = this.blockSideAmount;
        } else {
          this.y = --this.yLevel;
          this.xTarget = this.y;
          this.yTarget = 0;
          this.x = 0;
        }
      } else {
        this.y--;
        this.x++;
        this.step++;
      }
      this.totalStep++;
      this.end = Date.now();
      this.diff = Math.max(this.end - this.beginning, 0);
      this.delay = 1000 / 50 - this.diff;
      if (restore === true) {
        if (this.totalStep === step) {
          return console.log("restore reached", this.totalStep);
        } else {
          return this.render(true, step);
        }
      } else {
        return this.timer = setTimeout(raf, this.delay, this.render);
      }
    };

    Tower.prototype.done = function(next) {
      this.next = next;
    };

    return Tower;

  })();

  new CubesBackground();

}).call(this);

//# sourceMappingURL=cubes.js.map
