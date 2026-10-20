/* Hero background: "worm cursor" trail — three chains of thick, round-capped
   SVG line segments that lag behind the pointer with a spring-like ease
   (ported from the "Worm Cursor" CodePen by Walter Purcaro, GSAP-based
   mechanics kept as-is: https://codepen.io/vuolter/pen/bGJLgBd), scoped to
   the hero container and recolored to tones of the site accent.

   Each segment's tail length is the gap between where the raw pointer
   currently is and where this segment's eased position has caught up to —
   so a fast-moving pointer stretches long tails, and a pointer that's
   stopped converges the tail to ~0 within a few frames on its own. On top
   of that, whenever the pointer's been still for a beat, the whole trail
   fades out via opacity so nothing lingers as a static blob. */

(function () {
  "use strict";

  if (!window.gsap) return;

  var SVG_NS = "http://www.w3.org/2000/svg";
  var EASE = 0.7;
  var IDLE_MS = 200;

  function CursorTrail(container, options) {
    this.container = container;
    /* colors[i] pairs with lengths[i]; later entries paint on top and (with
       a shorter chain) track the raw pointer most tightly, so ordering them
       light-tint → accent front-to-back puts the full accent right at the
       cursor and lets the tail lighten as it trails further behind. */
    this.opts = Object.assign(
      {
        colors: ["#a6b2f3", "#5f72d0", "#475DD7"],
        lengths: [30, 20, 10]
      },
      options
    );

    this.bounding = container.getBoundingClientRect();
    this.pointer = { x: this.bounding.width / 2, y: this.bounding.height / 2 };
    this.lastMoveAt = 0;
    this.idle = true;
    this.svgs = [];

    this.wrap = document.createElement("div");
    this.wrap.className = "cursor-trail-wrap";
    container.appendChild(this.wrap);

    this._onPointerMove = this._onPointerMove.bind(this);
    this._onResize = this._onResize.bind(this);
    this._checkIdle = this._checkIdle.bind(this);

    window.addEventListener("pointermove", this._onPointerMove, { passive: true });
    window.addEventListener("pointerdown", this._onPointerMove, { passive: true });
    window.addEventListener("resize", this._onResize);

    this.opts.colors.forEach(
      function (color, i) {
        this._createTrail(color, this.opts.lengths[i] || 10);
      }.bind(this)
    );

    this.idleTimer = setInterval(this._checkIdle, 100);
  }

  CursorTrail.prototype._onResize = function () {
    this.bounding = this.container.getBoundingClientRect();
  };

  CursorTrail.prototype._onPointerMove = function (e) {
    var b = this.bounding;
    var x = e.clientX - b.left;
    var y = e.clientY - b.top;
    if (x < 0 || x > b.width || y < 0 || y > b.height) return;

    this.pointer.x = x;
    this.pointer.y = y;
    this.lastMoveAt = Date.now();

    if (this.idle) {
      this.idle = false;
      this.wrap.style.opacity = "1";
    }
  };

  CursorTrail.prototype._checkIdle = function () {
    if (!this.idle && Date.now() - this.lastMoveAt > IDLE_MS) {
      this.idle = true;
      this.wrap.style.opacity = "0";
    }
  };

  CursorTrail.prototype._createLine = function (getLeaderPos) {
    var line = document.createElementNS(SVG_NS, "line");
    var get = window.gsap.getProperty(line);
    var setAttr = window.gsap.quickSetter(line, "attr");

    function modifier(axis) {
      var end = axis + "2";
      return function () {
        var current = get(axis);
        var target = getLeaderPos(axis);
        var next = current + (target - current) * EASE;
        var attrs = {};
        attrs[end] = target - next;
        setAttr(attrs);
        return next;
      };
    }

    window.gsap.set(line, this.pointer);
    window.gsap.to(line, {
      x: "+=1",
      y: "+=1",
      repeat: -1,
      ease: "linear",
      modifiers: {
        x: modifier("x"),
        y: modifier("y")
      }
    });

    return line;
  };

  CursorTrail.prototype._createTrail = function (color, length) {
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "cursor-trail-svg");

    var self = this;
    var getLeaderPos = function (axis) {
      return self.pointer[axis];
    };

    for (var i = 0; i < length; i++) {
      var line = this._createLine(getLeaderPos);
      line.style.stroke = color;
      svg.appendChild(line);
      getLeaderPos = window.gsap.getProperty(line);
    }

    this.wrap.appendChild(svg);
    this.svgs.push(svg);
  };

  /* Recolor one trail (0-based, matching the colors/lengths arrays passed
     in) after construction — used to swap the frontmost trail's tone
     between themes without rebuilding the whole effect. */
  CursorTrail.prototype.setColor = function (index, color) {
    var svg = this.svgs[index];
    if (!svg) return;
    var lines = svg.querySelectorAll("line");
    for (var i = 0; i < lines.length; i++) lines[i].style.stroke = color;
  };

  CursorTrail.prototype.destroy = function () {
    clearInterval(this.idleTimer);
    window.removeEventListener("pointermove", this._onPointerMove);
    window.removeEventListener("pointerdown", this._onPointerMove);
    window.removeEventListener("resize", this._onResize);
    if (this.wrap.parentNode) this.wrap.parentNode.removeChild(this.wrap);
  };

  window.CursorTrail = CursorTrail;
})();
