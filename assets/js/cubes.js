(function() {
  var Color, Path, Point, Shape, bEnd, bStart, beginning, bg, blockSideAmount, canvas, ctx, cube, cubeSize, cubeSteps, end, gEnd, gStart, getColor, getGradient, getSpectra, hasTurned, iso, layerSteps, rEnd, rStart, render, step, x, xLevel, xTarget, y, yLevel, yTarget, z, zTarget;

  window.raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  window.cancelRaf = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;

  window["easterTime"] = false;

  canvas = document.createElement("canvas");

  canvas.setAttribute("class", "mobile_bg");

  bg = document.getElementById("background");

  bg.appendChild(canvas);

  bg.setAttribute("class", "loaded");

  ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth * 2;

  canvas.height = window.innerHeight * 2;

  iso = new Isomer(canvas);

  Shape = Isomer.Shape;

  Point = Isomer.Point;

  Color = Isomer.Color;

  Path = Isomer.Path;

  rStart = 219;

  gStart = 1;

  bStart = 26;

  rEnd = 235;

  gEnd = 175;

  bEnd = 28;

  getColor = function(step, level) {
    var bVal, gVal, percent, rVal;
    percent = (step + (level * layerSteps)) / cubeSteps;
    rVal = Math.round((rEnd - rStart) * percent + rStart);
    gVal = Math.round((gEnd - gStart) * percent + gStart);
    bVal = Math.round((bEnd - bStart) * percent + bStart);
    return new Color(rVal, gVal, bVal);
  };

  getGradient = function(level, step) {
    var bVal, gVal, percent, rVal;
    percent = step / cubeSteps;
    level = 1 + (level * 100);
    rVal = Math.round(rStart * level * percent);
    gVal = Math.round(gStart * level * percent);
    bVal = Math.round(bStart * level * percent);
    rVal = Math.min(rVal, 255);
    gVal = Math.min(gVal, 255);
    bVal = Math.min(bVal, 255);
    return new Color(rVal, gVal, bVal);
  };

  getSpectra = function(x, y, level, step) {
    var bVal, brightness, gVal, percent, rVal;
    percent = step / cubeSteps;
    brightness = (level / (blockSideAmount * 1)) * 255;
    rVal = Math.round((x / blockSideAmount) * brightness);
    gVal = Math.round((y / blockSideAmount) * brightness);
    bVal = Math.round(brightness);
    rVal *= 1 + (Math.random() * .1) - .2;
    gVal *= 1 + (Math.random() * .1) - .2;
    return new Color(rVal, gVal, bVal);
  };

  blockSideAmount = 6;

  layerSteps = Math.pow(blockSideAmount + 1, 2);

  cubeSteps = Math.pow(blockSideAmount + 1, 3);

  x = blockSideAmount;

  y = blockSideAmount;

  z = 0;

  xTarget = blockSideAmount;

  yTarget = blockSideAmount;

  zTarget = blockSideAmount;

  xLevel = blockSideAmount;

  yLevel = blockSideAmount;

  hasTurned = false;

  step = 0;

  cubeSize = .5;

  cube = Shape.Prism(Point.ORIGIN, cubeSize, cubeSize, cubeSize);

  beginning = end = Date.now();

  (render = function() {
    var delay, diff;
    if (window.easterTime) {
      bg.setAttribute("class", "");
      setTimeout(function() {
        return canvas.parentElement.removeChild(canvas);
      }, 500);
      return;
    }
    beginning = Date.now();
    iso.add(cube.translate(x * cubeSize, y * cubeSize, z * cubeSize), getColor(step, z));
    if (y === blockSideAmount && x === 0) {
      hasTurned = true;
    }
    if (x === 0 && y === 0) {
      if (z === blockSideAmount * 8) {
        return;
      }
      hasTurned = false;
      x = blockSideAmount;
      y = blockSideAmount;
      xTarget = blockSideAmount;
      yTarget = blockSideAmount;
      xLevel = blockSideAmount;
      yLevel = blockSideAmount;
      step = 0;
      z++;
      return setTimeout(raf, 1000 / 60, render);
    }
    if (x === xTarget && y === yTarget) {
      if (!hasTurned) {
        x = --xLevel;
        xTarget = blockSideAmount;
        yTarget = x;
        y = blockSideAmount;
      } else {
        y = --yLevel;
        xTarget = y;
        yTarget = 0;
        x = 0;
      }
    } else {
      y--;
      x++;
      step++;
    }
    end = Date.now();
    diff = Math.max(end - beginning, 0);
    delay = 1000 / 50 - diff;
    return setTimeout(raf, delay, render);
  })();

}).call(this);

//# sourceMappingURL=cubes.js.map
