/* Vanilla JS port of the React Bits "DotGrid" component — a canvas dot grid
   that lights up near the cursor and reacts with GSAP inertia on fast moves
   and clicks. Requires GSAP + InertiaPlugin (loaded via CDN in <head>); the
   dots still render and recolor on proximity even if those fail to load,
   just without the physics kick. */

(function () {
  "use strict";

  if (window.gsap && window.InertiaPlugin) {
    window.gsap.registerPlugin(window.InertiaPlugin);
  }

  function throttle(fn, limit) {
    var lastCall = 0;
    return function () {
      var now = performance.now();
      if (now - lastCall >= limit) {
        lastCall = now;
        fn.apply(this, arguments);
      }
    };
  }

  function hexToRgb(hex) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!m) return { r: 0, g: 0, b: 0 };
    return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
  }

  function DotGrid(container, options) {
    this.container = container;
    this.opts = Object.assign(
      {
        dotSize: 16,
        gap: 32,
        baseColor: "#5227FF",
        activeColor: "#5227FF",
        proximity: 150,
        speedTrigger: 100,
        shockRadius: 250,
        shockStrength: 5,
        maxSpeed: 5000,
        resistance: 750,
        returnDuration: 1.5
      },
      options
    );

    this.dots = [];
    this.pointer = { x: 0, y: 0, vx: 0, vy: 0, speed: 0, lastTime: 0, lastX: 0, lastY: 0 };
    this.rafId = null;
    this.hasInertia = !!(window.gsap && window.InertiaPlugin);

    this._buildDOM();
    this._updateColors();

    this._onMouseMove = throttle(this._onMouseMove.bind(this), 50);
    this._onClick = this._onClick.bind(this);
    this._buildGrid = this._buildGrid.bind(this);
    this._draw = this._draw.bind(this);

    this._buildGrid();

    if ("ResizeObserver" in window) {
      this.resizeObserver = new ResizeObserver(this._buildGrid);
      this.resizeObserver.observe(this.container);
    } else {
      window.addEventListener("resize", this._buildGrid);
    }

    window.addEventListener("mousemove", this._onMouseMove, { passive: true });
    window.addEventListener("click", this._onClick);

    this.rafId = requestAnimationFrame(this._draw);
  }

  DotGrid.prototype._buildDOM = function () {
    this.container.classList.add("dot-grid__wrap");
    this.canvas = document.createElement("canvas");
    this.canvas.className = "dot-grid__canvas";
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.circlePath = window.Path2D ? new Path2D() : null;
    if (this.circlePath) this.circlePath.arc(0, 0, this.opts.dotSize / 2, 0, Math.PI * 2);
  };

  DotGrid.prototype._updateColors = function () {
    this.baseRgb = hexToRgb(this.opts.baseColor);
    this.activeRgb = hexToRgb(this.opts.activeColor);
  };

  DotGrid.prototype._buildGrid = function () {
    var rect = this.container.getBoundingClientRect();
    var width = rect.width, height = rect.height;
    var dpr = window.devicePixelRatio || 1;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = width + "px";
    this.canvas.style.height = height + "px";
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var dotSize = this.opts.dotSize, gap = this.opts.gap;
    var cols = Math.floor((width + gap) / (dotSize + gap));
    var rows = Math.floor((height + gap) / (dotSize + gap));
    var cell = dotSize + gap;

    var gridW = cell * cols - gap;
    var gridH = cell * rows - gap;
    var extraX = width - gridW;
    var extraY = height - gridH;
    var startX = extraX / 2 + dotSize / 2;
    var startY = extraY / 2 + dotSize / 2;

    var dots = [];
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        dots.push({
          cx: startX + x * cell,
          cy: startY + y * cell,
          xOffset: 0,
          yOffset: 0,
          _inertiaApplied: false
        });
      }
    }
    this.dots = dots;
  };

  DotGrid.prototype._draw = function () {
    var ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    var p = this.opts;
    var proxSq = p.proximity * p.proximity;
    var px = this.pointer.x, py = this.pointer.y;
    var baseRgb = this.baseRgb, activeRgb = this.activeRgb;

    for (var i = 0; i < this.dots.length; i++) {
      var dot = this.dots[i];
      var ox = dot.cx + dot.xOffset;
      var oy = dot.cy + dot.yOffset;
      var dx = dot.cx - px, dy = dot.cy - py;
      var dsq = dx * dx + dy * dy;

      var style = p.baseColor;
      if (dsq <= proxSq) {
        var dist = Math.sqrt(dsq);
        var t = 1 - dist / p.proximity;
        var r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
        var g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
        var b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
        style = "rgb(" + r + "," + g + "," + b + ")";
      }

      ctx.save();
      ctx.translate(ox, oy);
      ctx.fillStyle = style;
      if (this.circlePath) {
        ctx.fill(this.circlePath);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.dotSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    this.rafId = requestAnimationFrame(this._draw);
  };

  DotGrid.prototype._settle = function (dot) {
    var p = this.opts;
    window.gsap.to(dot, {
      xOffset: 0,
      yOffset: 0,
      duration: p.returnDuration,
      ease: "elastic.out(1,0.75)"
    });
    dot._inertiaApplied = false;
  };

  DotGrid.prototype._onMouseMove = function (e) {
    var now = performance.now();
    var pr = this.pointer;
    var dt = pr.lastTime ? now - pr.lastTime : 16;
    var dx = e.clientX - pr.lastX, dy = e.clientY - pr.lastY;
    var vx = (dx / dt) * 1000, vy = (dy / dt) * 1000;
    var speed = Math.hypot(vx, vy);
    var p = this.opts;
    if (speed > p.maxSpeed) {
      var scale = p.maxSpeed / speed;
      vx *= scale;
      vy *= scale;
      speed = p.maxSpeed;
    }
    pr.lastTime = now;
    pr.lastX = e.clientX;
    pr.lastY = e.clientY;
    pr.vx = vx;
    pr.vy = vy;
    pr.speed = speed;

    var rect = this.canvas.getBoundingClientRect();
    pr.x = e.clientX - rect.left;
    pr.y = e.clientY - rect.top;

    if (!this.hasInertia) return;

    for (var i = 0; i < this.dots.length; i++) {
      var dot = this.dots[i];
      var dist = Math.hypot(dot.cx - pr.x, dot.cy - pr.y);
      if (speed > p.speedTrigger && dist < p.proximity && !dot._inertiaApplied) {
        dot._inertiaApplied = true;
        window.gsap.killTweensOf(dot);
        var pushX = dot.cx - pr.x + vx * 0.005;
        var pushY = dot.cy - pr.y + vy * 0.005;
        var self = this;
        window.gsap.to(dot, {
          inertia: { xOffset: pushX, yOffset: pushY, resistance: p.resistance },
          onComplete: (function (d) { return function () { self._settle(d); }; })(dot)
        });
      }
    }
  };

  DotGrid.prototype._onClick = function (e) {
    if (!this.hasInertia) return;
    var p = this.opts;
    var rect = this.canvas.getBoundingClientRect();
    var cx = e.clientX - rect.left, cy = e.clientY - rect.top;

    for (var i = 0; i < this.dots.length; i++) {
      var dot = this.dots[i];
      var dist = Math.hypot(dot.cx - cx, dot.cy - cy);
      if (dist < p.shockRadius && !dot._inertiaApplied) {
        dot._inertiaApplied = true;
        window.gsap.killTweensOf(dot);
        var falloff = Math.max(0, 1 - dist / p.shockRadius);
        var pushX = (dot.cx - cx) * p.shockStrength * falloff;
        var pushY = (dot.cy - cy) * p.shockStrength * falloff;
        var self = this;
        window.gsap.to(dot, {
          inertia: { xOffset: pushX, yOffset: pushY, resistance: p.resistance },
          onComplete: (function (d) { return function () { self._settle(d); }; })(dot)
        });
      }
    }
  };

  DotGrid.prototype.setColors = function (baseColor, activeColor) {
    if (baseColor) this.opts.baseColor = baseColor;
    if (activeColor) this.opts.activeColor = activeColor;
    this._updateColors();
  };

  DotGrid.prototype.destroy = function () {
    cancelAnimationFrame(this.rafId);
    if (this.resizeObserver) this.resizeObserver.disconnect();
    else window.removeEventListener("resize", this._buildGrid);
    window.removeEventListener("mousemove", this._onMouseMove);
    window.removeEventListener("click", this._onClick);
    if (this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);
  };

  window.DotGrid = DotGrid;
})();
