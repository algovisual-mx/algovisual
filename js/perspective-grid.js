/* Perspective grid: an endless floor grid that scrolls toward the horizon.
   Vanilla canvas version, written for this site (no dependencies).
   Usage: <canvas data-perspective-grid aria-hidden="true"></canvas>
   - Lines use the site's accent colour (--accent-rgb) and follow the theme.
   - Runs only while visible and while the tab is open.
   - With "reduce motion" it draws one still frame instead of animating. */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function init(canvas) {
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var W = 0, H = 0, dpr = 1;
    var rgb = "71, 93, 215";
    var phase = 0;          // 0..1, how far the rows have travelled
    var last = 0;
    var raf = 0;
    var visible = true;

    var HORIZON = 0.4;      // horizon height, as a share of the canvas
    var ROWS = 46;          // rows drawn toward the horizon
    var SPEED = 0.32;       // rows per second

    function readColor() {
      var v = getComputedStyle(document.documentElement).getPropertyValue("--accent-rgb").trim();
      if (v) rgb = v;
    }

    function resize() {
      var r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(r.width));
      H = Math.max(1, Math.round(r.height));
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      var vx = W / 2;
      var vy = H * HORIZON;
      var floor = H - vy;

      // Columns: straight lines from the vanishing point to the bottom edge.
      var gap = Math.max(84, W / 11);
      var grad = ctx.createLinearGradient(0, vy, 0, H);
      grad.addColorStop(0, "rgba(" + rgb + ", 0)");
      grad.addColorStop(1, "rgba(" + rgb + ", 0.5)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      var n = Math.ceil(W / gap) + 2;
      ctx.beginPath();
      for (var i = -n; i <= n; i++) {
        ctx.moveTo(vx, vy);
        ctx.lineTo(vx + i * gap, H);
      }
      ctx.stroke();

      // Rows: depth d moves toward the viewer; screen y = horizon + floor / d.
      for (var k = 1; k <= ROWS; k++) {
        var d = k - phase;
        if (d < 0.15) continue;
        var y = vy + floor / d;
        if (y > H + 2) continue;
        var depth = (y - vy) / floor;           // 0 at the horizon, 1 at the bottom
        var a = Math.pow(depth, 0.85) * 0.5;
        ctx.strokeStyle = "rgba(" + rgb + ", " + a.toFixed(3) + ")";
        ctx.lineWidth = 0.6 + depth * 0.9;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
    }

    function frame(now) {
      raf = 0;
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      phase = (phase + dt * SPEED) % 1;
      draw();
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    }

    function wake() {
      if (reduceMotion || raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    readColor();
    new ResizeObserver(resize).observe(canvas);
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      wake();
    }).observe(canvas);
    document.addEventListener("visibilitychange", wake);
    document.addEventListener("algovisual:themechange", function () {
      // The new theme's variables apply a frame later.
      requestAnimationFrame(function () { readColor(); draw(); });
    });
    resize();
    wake();
  }

  document.addEventListener("DOMContentLoaded", function () {
    [].slice.call(document.querySelectorAll("[data-perspective-grid]")).forEach(init);
  });
})();
