/* TechText — vanilla port of the React Bits <TechText /> component.

   A wordmark drawn on a <canvas>. The letter under the pointer turns into a
   dashed vector outline inside a selection frame (specks, size label, drag
   to move, click to kick). Extras on top of the original:
   - intro "design": a ghost Figma-style cursor drags out a text frame,
     types the word into it and scales it with a corner handle.
   - rest "outline": letters rest as hollow outlines instead of solid fill.
   - fires "techtext:introend" on the container when the intro is done.

   Usage:  var tt = TechText(el, { text: "UX Designer", intro: "design" });
           tt.update({ reveal: "area" });  tt.destroy();
   Sizing comes from the container (give it a width and a height).
   Colours follow the container's CSS `color` unless color/accentColor are set. */

(function () {
  "use strict";

  var LABEL_FONT = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
  var FALLOFF_STEPS = 8;
  var SPRING = 320;
  var INHERIT = /^(currentcolor|inherit)$/i;
  var KICK_DECAY = 0.62;

  var DEFAULTS = {
    text: "TechText",
    fontFamily: "",
    fontWeight: 600,
    fontSize: 150,
    letterSpacing: -0.05,
    color: "currentColor",
    accentColor: "currentColor",
    align: "center",
    reach: 200,
    softness: 0.7,
    dashLength: 4,
    dashGap: 2,
    strokeWidth: 1.5,
    lineStyle: "dashed",
    reveal: "letter",
    rest: "fill",
    specks: 15,
    selection: true,
    labels: true,
    draggable: true,
    bounce: 0.4,
    sweep: true,
    speed: 1,
    clickKick: true,
    intro: "none",
    introDuration: 2,
    introDelay: 0.15,
    ghostName: "Sal",
    guides: false
  };

  function approach(current, target, dt, seconds) {
    return current + (target - current) * (1 - Math.exp(-dt / seconds));
  }

  function clamp01(value) {
    return Math.min(1, Math.max(0, Number(value) || 0));
  }

  function smoothstep(edge0, edge1, value) {
    var t = clamp01((value - edge0) / (edge1 - edge0));
    return t * t * (3 - 2 * t);
  }

  function easeOut(t) {
    return 1 - Math.pow(1 - clamp01(t), 3);
  }

  function easeInOut(t) {
    t = clamp01(t);
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function noise() {
    var h = 2166136261;
    for (var i = 0; i < arguments.length; i++) {
      h = Math.imul(h ^ (arguments[i] | 0), 16777619);
      h ^= h >>> 13;
      h = Math.imul(h, 0x5bd1e995);
      h ^= h >>> 15;
    }
    return (h >>> 0) / 4294967296;
  }

  function signed(value) {
    return value > 0 ? "+" + value : value < 0 ? "−" + -value : "0";
  }

  function TechText(container, options) {
    var s = Object.assign({}, DEFAULTS, options);
    var canvas = document.createElement("canvas");
    canvas.className = "tech-text-canvas";
    container.classList.add("tech-text");
    container.setAttribute("role", "img");
    container.setAttribute("aria-label", s.text);
    container.appendChild(canvas);

    var ctx = canvas.getContext("2d");
    var scratch = document.createElement("canvas");
    var scratchCtx = scratch.getContext("2d");
    if (!ctx || !scratchCtx) {
      return { update: function () {}, destroy: function () {} };
    }

    var reducedMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    var width = 1;
    var height = 1;
    var dpr = 1;
    var raf = 0;
    var last = performance.now();
    var visible = false;
    var alive = true;
    var layoutKey = "";
    var requestedFont = "";
    var word = null;
    var glyphs = [];
    var presence = 0;
    var clock = 0;
    var pulse = 0;
    var placed = false;
    var dragging = -1;
    var cursor = "";
    var introClock = 0;
    var introKind = "";
    var introducing = false;
    var introFinished = false;
    var fontsReady = !document.fonts;
    var guideAlpha = 0;
    var kicks = [];
    var press = { x: 0, y: 0, time: 0, index: -1 };
    var pointer = { x: 0, y: 0, inside: false };
    var grab = { x: 0, y: 0 };
    var lens = { x: 0, y: 0 };
    var frame = { x1: 0, y1: 0, x2: 0, y2: 0, alpha: 0, index: -1 };

    /* getComputedStyle forces a style recalculation, so read it once and
       only again when the theme, fonts or size change — not every frame. */
    var styleCache = null;
    var calm = false;
    var lastDraw = 0;

    function styles() {
      if (!styleCache) {
        var cs = getComputedStyle(container);
        styleCache = { color: cs.color || "#000000", family: cs.fontFamily || "sans-serif" };
      }
      return styleCache;
    }

    function refreshFonts() {
      styleCache = null;
      layoutKey = "";
      wake();
    }

    function fontsLoaded() {
      fontsReady = true;
      refreshFonts();
    }

    function family() {
      return s.fontFamily || styles().family;
    }

    function fontFor(size) {
      return s.fontWeight + " " + size + "px " + family();
    }

    function palette() {
      var current = styles().color;
      function pick(value) {
        return !value || INHERIT.test(String(value).trim()) ? current : value;
      }
      return { ink: pick(s.color), accent: pick(s.accentColor) };
    }

    function setFont(target, size) {
      target.font = fontFor(size);
      if ("letterSpacing" in target) target.letterSpacing = s.letterSpacing * size + "px";
      target.textAlign = "left";
      target.textBaseline = "alphabetic";
    }

    /* mode: "fill" solid letter, "dash" dashed outline (lineStyle), "line" solid hollow outline */
    function sprite(view, glyph, mode, ink) {
      var pad = Math.ceil(s.strokeWidth * 2 + 4);
      var left = glyph.box.x1 - pad;
      var top = glyph.box.y1 - pad;
      var w = glyph.box.x2 - glyph.box.x1 + pad * 2;
      var h = glyph.box.y2 - glyph.box.y1 + pad * 2;
      var image = document.createElement("canvas");
      image.width = Math.max(1, Math.ceil(w * dpr));
      image.height = Math.max(1, Math.ceil(h * dpr));
      var c = image.getContext("2d");
      if (!c) return { image: image, left: left, top: top };
      c.setTransform(dpr, 0, 0, dpr, -left * dpr, -top * dpr);
      setFont(c, view.size);
      if (mode !== "fill") {
        c.lineJoin = "round";
        c.lineWidth = s.strokeWidth * 2;
        c.lineCap = "butt";
        c.strokeStyle = ink;
        if (mode === "dash" && s.lineStyle !== "solid") {
          c.setLineDash([Math.max(1, s.dashLength), Math.max(1, s.dashGap)]);
        }
        c.strokeText(glyph.char, glyph.x, view.baseline);
        c.setLineDash([]);
        c.globalCompositeOperation = "destination-out";
        c.fillStyle = "#000000";
        c.fillText(glyph.char, glyph.x, view.baseline);
        c.globalCompositeOperation = "source-over";
      } else {
        c.fillStyle = ink;
        c.fillText(glyph.char, glyph.x, view.baseline);
      }
      return { image: image, left: left, top: top };
    }

    function ensureLayout(ink) {
      var key = [
        s.text, family(), s.fontWeight, s.fontSize, s.letterSpacing, s.align, s.rest, ink,
        s.dashLength, s.dashGap, s.strokeWidth, s.lineStyle, width, height, dpr
      ].join("|");
      if (key === layoutKey && word) return word;
      layoutKey = key;
      var wanted = fontFor(64);
      if (document.fonts && wanted !== requestedFont) {
        requestedFont = wanted;
        document.fonts.load(wanted, s.text).then(refreshFonts, refreshFonts);
      }

      var probe = scratchCtx;
      setFont(probe, s.fontSize);
      var m = probe.measureText(s.text);
      var fit = Math.min(
        1,
        (width * 0.9) / Math.max(m.actualBoundingBoxLeft + m.actualBoundingBoxRight, 1),
        (height * 0.66) / Math.max(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent, 1)
      );
      var size = s.fontSize * fit;
      setFont(probe, size);
      m = probe.measureText(s.text);
      var inkWidth = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
      var inkHeight = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
      var margin = width * 0.05;
      var start =
        s.align === "left" ? margin : s.align === "right" ? width - margin - inkWidth : (width - inkWidth) / 2;
      var x = start + m.actualBoundingBoxLeft;
      var baseline = (height - inkHeight) / 2 + m.actualBoundingBoxAscent;
      var xHeight = baseline - probe.measureText("x").actualBoundingBoxAscent;
      var capHeight = baseline - probe.measureText("H").actualBoundingBoxAscent;
      var ascender = baseline - probe.measureText("d").actualBoundingBoxAscent;
      var descender = baseline + probe.measureText("p").actualBoundingBoxDescent;
      var top = baseline - m.actualBoundingBoxAscent;
      var bottom = baseline + m.actualBoundingBoxDescent;
      var next = {
        size: size,
        baseline: baseline,
        capHeight: capHeight,
        left: x - m.actualBoundingBoxLeft,
        right: x + m.actualBoundingBoxRight,
        top: top,
        bottom: bottom,
        lines: [
          { y: baseline, label: "baseline" },
          { y: xHeight, label: "x-height" },
          { y: capHeight, label: "cap height" }
        ]
      };
      if (capHeight - ascender > Math.max(11, size * 0.06)) next.lines.push({ y: ascender, label: "ascender" });
      next.lines.push({ y: descender, label: "descender" });
      word = next;

      var chars = Array.from(s.text);
      var previous = glyphs;
      glyphs = [];
      var prefix = "";
      chars.forEach(function (char, i) {
        prefix += char;
        var own = probe.measureText(char);
        var gx = x + probe.measureText(prefix).width - own.width;
        if (!char.trim()) return;
        var base = {
          char: char,
          x: gx,
          box: {
            x1: gx - own.actualBoundingBoxLeft,
            y1: baseline - own.actualBoundingBoxAscent,
            x2: gx + own.actualBoundingBoxRight,
            y2: baseline + own.actualBoundingBoxDescent
          }
        };
        var kept = previous[glyphs.length];
        glyphs.push({
          char: char,
          x: gx,
          box: base.box,
          offset: kept && kept.char === char ? kept.offset : { x: 0, y: 0 },
          velocity: { x: 0, y: 0 },
          outline: 0,
          shown: 1,
          index: i,
          fill: sprite(next, base, s.rest === "outline" ? "line" : "fill", ink),
          dashes: sprite(next, base, "dash", ink)
        });
      });
      dragging = -1;
      frame.index = -1;
      return next;
    }

    function glyphAt(x, y) {
      if (!word || y < word.top - 24 || y > word.bottom + 24) return -1;
      var best = -1;
      var bestDistance = Infinity;
      glyphs.forEach(function (glyph, i) {
        var x1 = glyph.box.x1 + glyph.offset.x;
        var x2 = glyph.box.x2 + glyph.offset.x;
        var d = x < x1 ? x1 - x : x > x2 ? x - x2 : 0;
        if (d < bestDistance) {
          bestDistance = d;
          best = i;
        }
      });
      return bestDistance < 28 ? best : -1;
    }

    function falloff(target, cx, cy, radius, strength, softness) {
      var inner = Math.min(1, Math.max(0, 1 - softness));
      var gradient = target.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, "rgba(0, 0, 0, " + strength + ")");
      if (inner > 0.995) {
        gradient.addColorStop(0.995, "rgba(0, 0, 0, " + strength + ")");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        return gradient;
      }
      for (var i = 0; i <= FALLOFF_STEPS; i++) {
        var t = i / FALLOFF_STEPS;
        var eased = t * t * (3 - 2 * t);
        gradient.addColorStop(inner + (1 - inner) * t, "rgba(0, 0, 0, " + strength * (1 - eased) + ")");
      }
      return gradient;
    }

    function blit(target, art, dx, dy, originX, originY) {
      target.drawImage(
        art.image,
        Math.round((art.left + dx) * dpr - originX),
        Math.round((art.top + dy) * dpr - originY)
      );
    }

    function drawReveal() {
      var radius = s.reach * dpr;
      var cx = lens.x * dpr;
      var cy = lens.y * dpr;
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = falloff(ctx, cx, cy, radius, presence, s.softness);
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
      ctx.globalCompositeOperation = "source-over";

      var x0 = Math.max(0, Math.floor(cx - radius));
      var y0 = Math.max(0, Math.floor(cy - radius));
      var x1 = Math.min(canvas.width, Math.ceil(cx + radius));
      var y1 = Math.min(canvas.height, Math.ceil(cy + radius));
      if (x1 <= x0 || y1 <= y0) return;
      var w = x1 - x0;
      var h = y1 - y0;
      if (scratch.width < w || scratch.height < h) {
        scratch.width = Math.max(scratch.width, w);
        scratch.height = Math.max(scratch.height, h);
      }
      scratchCtx.setTransform(1, 0, 0, 1, 0, 0);
      scratchCtx.globalCompositeOperation = "source-over";
      scratchCtx.clearRect(0, 0, w, h);
      glyphs.forEach(function (glyph) {
        blit(scratchCtx, glyph.dashes, glyph.offset.x, glyph.offset.y, x0, y0);
      });
      scratchCtx.globalCompositeOperation = "destination-in";
      scratchCtx.fillStyle = falloff(scratchCtx, cx - x0, cy - y0, radius, 1, s.softness);
      scratchCtx.fillRect(0, 0, w, h);
      scratchCtx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = presence;
      ctx.drawImage(scratch, 0, 0, w, h, x0, y0, w, h);
      ctx.globalAlpha = 1;
    }

    function crisp(value) {
      return (Math.round(value * dpr) + 0.5) / dpr;
    }

    function perimeterPoint(distance, w, h) {
      var total = 2 * (w + h);
      var d = ((distance % total) + total) % total;
      if (d < w) return [frame.x1 + d, frame.y1, 0, -1];
      d -= w;
      if (d < h) return [frame.x2, frame.y1 + d, 1, 0];
      d -= h;
      if (d < w) return [frame.x2 - d, frame.y2, 0, 1];
      d -= w;
      return [frame.x1, frame.y2 - d, -1, 0];
    }

    function drawSpecks(a, accent) {
      var w = frame.x2 - frame.x1;
      var h = frame.y2 - frame.y1;
      if (w < 2 || h < 2) return;
      var perimeter = 2 * (w + h);
      var seed = frame.index + 1;
      var grid = 3;
      ctx.fillStyle = accent;
      ctx.strokeStyle = accent;

      for (var k = 0; k < s.specks; k++) {
        var period = 0.5 + noise(seed, k, 11) * 1.2;
        var t = pulse / period + noise(seed, k, 17);
        var cycle = Math.floor(t);
        var life = t - cycle;
        if (life > 0.7) continue;
        var p = perimeterPoint(noise(seed, k, cycle) * perimeter, w, h);
        var pick = noise(seed, k, cycle, 2);
        var size = pick < 0.46 ? 2 : pick < 0.7 ? 3 : pick < 0.84 ? 5 : pick < 0.94 ? 8 : 11;
        var large = size >= 8;
        var out = (large ? 9 : 4) + Math.floor(noise(seed, k, cycle, 1) * 5) * grid;
        var x = frame.x1 + Math.round((p[0] + p[2] * out - frame.x1) / grid) * grid;
        var y = frame.y1 + Math.round((p[1] + p[3] * out - frame.y1) / grid) * grid;
        var tone = noise(seed, k, cycle, 3);
        var blink = life < 0.06 || (life > 0.32 && life < 0.36) ? 0.35 : 1;
        var alpha = a * (large ? 0.3 + 0.4 * tone : 0.3 + 0.6 * tone) * blink;
        var left = Math.round(x - size / 2);
        var top = Math.round(y - size / 2);
        ctx.globalAlpha = alpha;
        if (tone < 0.26 || (large && tone < 0.78)) {
          ctx.strokeRect(left + 0.5, top + 0.5, size, size);
          if (large && tone > 0.5) ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
        } else {
          ctx.fillRect(left, top, size, size);
        }
      }

      for (var j = 0; j < 2; j++) {
        var head = (pulse * 0.42 * s.speed + j * 0.5) * perimeter;
        for (var i = 0; i < 4; i++) {
          var q = perimeterPoint(head - i * 6, w, h);
          var dot = i === 0 ? 3 : 2;
          ctx.globalAlpha = a * [0.95, 0.55, 0.32, 0.16][i];
          ctx.fillRect(Math.round(q[0] - dot / 2), Math.round(q[1] - dot / 2), dot, dot);
        }
      }
      ctx.globalAlpha = 1;
    }

    function drawFrame(accent) {
      var glyph = glyphs[frame.index];
      if (!glyph || frame.alpha < 0.01) return;
      var a = frame.alpha;
      var x1 = crisp(frame.x1);
      var y1 = crisp(frame.y1);
      var x2 = crisp(frame.x2);
      var y2 = crisp(frame.y2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = accent;
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1;

      var moved = Math.hypot(glyph.offset.x, glyph.offset.y);
      if (moved > 1) {
        var hx = (glyph.box.x1 + glyph.box.x2) / 2;
        var hy = (glyph.box.y1 + glyph.box.y2) / 2;
        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.lineTo(hx + glyph.offset.x, hy + glyph.offset.y);
        ctx.setLineDash([3, 4]);
        ctx.globalAlpha = 0.45 * a;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.rect(Math.round(hx) - 2, Math.round(hy) - 2, 4, 4);
        ctx.globalAlpha = 0.7 * a;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.rect(x1, y1, x2 - x1, y2 - y1);
      ctx.globalAlpha = 0.5 * a;
      ctx.stroke();

      ctx.beginPath();
      [[x1, y1], [x2, y1], [x2, y2], [x1, y2]].forEach(function (c) {
        ctx.rect(Math.round(c[0]) - 2, Math.round(c[1]) - 2, 5, 5);
      });
      ctx.globalAlpha = 0.95 * a;
      ctx.fill();
      ctx.globalAlpha = 1;

      if (s.specks > 0) drawSpecks(a, accent);

      if (!s.labels) return;
      ctx.font = LABEL_FONT;
      ctx.textAlign = "left";
      ctx.textBaseline = "bottom";
      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.62 * a;
      var label =
        moved > 1
          ? signed(Math.round(glyph.offset.x)) + ", " + signed(Math.round(-glyph.offset.y))
          : glyph.char + "  " + Math.round(glyph.box.x2 - glyph.box.x1) + " × " + Math.round(glyph.box.y2 - glyph.box.y1);
      ctx.fillText(label, Math.round(frame.x1), Math.round(frame.y1) - 7);
      ctx.globalAlpha = 1;
    }

    function drawLines(view, accent, alpha) {
      var pad = Math.max(12, view.size * 0.12);
      var x1 = Math.round(view.left - pad);
      var x2 = Math.round(view.right + pad);
      var room = width - x2 > x1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.strokeStyle = accent;
      ctx.fillStyle = accent;
      ctx.lineWidth = 1;
      ctx.font = LABEL_FONT;
      ctx.textBaseline = "middle";
      ctx.textAlign = room ? "left" : "right";
      view.lines.forEach(function (line) {
        var y = crisp(line.y);
        ctx.globalAlpha = alpha * 0.4;
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();
        ctx.globalAlpha = alpha * 0.9;
        ctx.fillRect(x1 - 1, Math.round(line.y) - 1, 3, 3);
        ctx.fillRect(x2 - 1, Math.round(line.y) - 1, 3, 3);
        if (s.labels) {
          ctx.globalAlpha = alpha * 0.62;
          ctx.fillText(line.label, room ? x2 + 8 : x1 - 8, Math.round(line.y));
        }
      });
      ctx.textAlign = "left";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
    }

    /* ---- "design" intro: a ghost cursor builds the word like in Figma ------
       1  cursor travels in, 2 drags out a text frame, 3 types the word into it
       (undersized), 4 drags the corner handle until it fits, 5 lets go and
       leaves while the frame fades. Returns where everything is at `p`. */
    var DESIGN_SCALE = 0.86;
    var DESIGN_PAD = 14;

    function designState(view, p) {
      var ax = view.left - DESIGN_PAD;
      var ay = view.top - DESIGN_PAD;
      var bx = view.right + DESIGN_PAD;
      var by = view.bottom + DESIGN_PAD;
      var sx = ax + (bx - ax) * DESIGN_SCALE;
      var sy = ay + (by - ay) * DESIGN_SCALE;
      var start = { x: view.left - Math.min(160, width * 0.12), y: view.bottom + 80 };
      var d = { ax: ax, ay: ay, scale: DESIGN_SCALE, frame: null, handles: false, ghost: 1, pressed: false, x: 0, y: 0 };

      if (p < 0.14) {
        var u = easeOut(p / 0.14);
        d.x = lerp(start.x, ax, u);
        d.y = lerp(start.y, ay, u);
        d.ghost = smoothstep(0, 0.05, p);
      } else if (p < 0.34) {
        var v = easeInOut((p - 0.14) / 0.2);
        d.x = lerp(ax, sx, v);
        d.y = lerp(ay, sy, v);
        d.frame = { x1: ax, y1: ay, x2: d.x, y2: d.y, alpha: 1 };
        d.pressed = true;
      } else if (p < 0.72) {
        d.x = sx + Math.sin(p * 18) * 1.5;
        d.y = sy + Math.cos(p * 14) * 1.5;
        d.frame = { x1: ax, y1: ay, x2: sx, y2: sy, alpha: 1 };
        d.handles = true;
      } else if (p < 0.88) {
        var w = easeInOut((p - 0.72) / 0.16);
        d.scale = lerp(DESIGN_SCALE, 1, w);
        d.x = ax + (bx - ax) * d.scale;
        d.y = ay + (by - ay) * d.scale;
        d.frame = { x1: ax, y1: ay, x2: d.x, y2: d.y, alpha: 1 };
        d.handles = true;
        d.pressed = true;
      } else {
        var o = easeInOut((p - 0.88) / 0.12);
        d.scale = 1;
        d.x = bx + 90 * o;
        d.y = by - 130 * o;
        d.frame = { x1: ax, y1: ay, x2: bx, y2: by, alpha: 1 - smoothstep(0, 0.7, o) };
        d.handles = true;
        d.ghost = 1 - smoothstep(0.35, 1, o);
      }
      return d;
    }

    function pill(x, y, w, h) {
      var r = h / 2;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    function drawDesignFrame(d, accent) {
      var f = d.frame;
      if (!f || f.alpha < 0.01) return;
      var x1 = crisp(Math.min(f.x1, f.x2));
      var y1 = crisp(Math.min(f.y1, f.y2));
      var x2 = crisp(Math.max(f.x1, f.x2));
      var y2 = crisp(Math.max(f.y1, f.y2));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineWidth = 1;
      ctx.strokeStyle = accent;
      ctx.globalAlpha = f.alpha;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

      if (d.handles) {
        ctx.fillStyle = "#ffffff";
        [[x1, y1], [x2, y1], [x2, y2], [x1, y2]].forEach(function (c) {
          ctx.fillRect(Math.round(c[0]) - 3, Math.round(c[1]) - 3, 7, 7);
          ctx.strokeRect(Math.round(c[0]) - 2.5, Math.round(c[1]) - 2.5, 6, 6);
        });
      }

      var label = Math.round(x2 - x1) + " × " + Math.round(y2 - y1);
      ctx.font = "600 10px " + family();
      var lw = ctx.measureText(label).width + 14;
      ctx.fillStyle = accent;
      pill((x1 + x2) / 2 - lw / 2, y2 + 9, lw, 17);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, (x1 + x2) / 2, y2 + 9 + 9);
      ctx.textAlign = "left";
      ctx.globalAlpha = 1;
    }

    function drawCaret(view, d, glyph, accent, alpha) {
      var gx = glyph ? glyph.box.x2 + 4 : view.left - 3;
      var top = view.capHeight - view.size * 0.04;
      var bottom = view.baseline + view.size * 0.04;
      var map = function (x, y) {
        return [d.ax + (x - d.ax) * d.scale, d.ay + (y - d.ay) * d.scale];
      };
      var a = map(gx, top);
      var b = map(gx, bottom);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = accent;
      ctx.globalAlpha = alpha;
      ctx.fillRect(Math.round(a[0]), Math.round(a[1]), 2, Math.round(b[1] - a[1]));
      ctx.globalAlpha = 1;
    }

    function drawGhost(d, accent) {
      if (d.ghost < 0.01) return;
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = d.ghost;
      ctx.translate(d.x, d.y);
      if (d.pressed) ctx.scale(0.88, 0.88);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 17);
      ctx.lineTo(4.4, 13.1);
      ctx.lineTo(7.3, 19.6);
      ctx.lineTo(10.1, 18.4);
      ctx.lineTo(7.3, 12);
      ctx.lineTo(13, 12);
      ctx.closePath();
      ctx.lineJoin = "round";
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = "#ffffff";
      ctx.fillStyle = accent;
      ctx.stroke();
      ctx.fill();
      ctx.font = "600 11px " + family();
      var w = ctx.measureText(s.ghostName).width + 16;
      pill(11, 19, w, 19);
      ctx.fillStyle = accent;
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(s.ghostName, 19, 29);
      ctx.restore();
    }

    function kick(index) {
      var strength = (word ? word.size : 120) * 11;
      kicks.push({ index: index, at: pulse, velocity: strength });
      for (var d = 1; d < glyphs.length; d++) {
        var velocity = strength * Math.pow(KICK_DECAY, d);
        if (velocity < 30) break;
        [index - d, index + d].forEach(function (j) {
          if (j >= 0 && j < glyphs.length) kicks.push({ index: j, at: pulse + d * 0.055, velocity: velocity });
        });
      }
      wake();
    }

    function tick(now) {
      raf = 0;
      /* Nothing but the slow idle sweep is moving: 30fps is plenty. */
      if (calm && now - lastDraw < 30) {
        raf = requestAnimationFrame(tick);
        return;
      }
      lastDraw = now;
      var dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      var colors = palette();
      var ink = colors.ink;
      var accent = colors.accent;
      var view = ensureLayout(ink);
      var damping = 2 * Math.sqrt(SPRING) * (1 - clamp01(s.bounce) * 0.96);

      if (s.intro !== introKind) {
        introKind = s.intro;
        introClock = 0;
      }
      var introOn = introKind !== "none" && !reducedMotion && glyphs.length > 0;
      if (introOn && fontsReady) introClock += dt;
      var progress = introOn ? clamp01((introClock - s.introDelay) / Math.max(0.3, s.introDuration)) : 1;
      introducing = introOn && progress < 1;
      if (!introducing && !introFinished && fontsReady && glyphs.length) {
        introFinished = true;
        container.dispatchEvent(new CustomEvent("techtext:introend"));
      }

      var sweeping = !introducing && s.sweep && !reducedMotion && !pointer.inside && dragging < 0;
      if (sweeping) clock += dt * s.speed;
      pulse += dt;
      var targetX = pointer.x;
      var targetY = pointer.y;
      if (sweeping) {
        targetX = view.left + (view.right - view.left) * (0.5 - 0.5 * Math.cos(clock * 0.45));
        targetY = view.top + (view.bottom - view.top) * (0.45 + 0.1 * Math.sin(clock * 0.8));
      }
      var active = !introducing && (pointer.inside || sweeping || dragging >= 0);
      if (active && !placed) {
        lens.x = targetX;
        lens.y = targetY;
      }
      if (active) {
        var lag = pointer.inside ? 0.05 : 0.22;
        lens.x = approach(lens.x, targetX, dt, lag);
        lens.y = approach(lens.y, targetY, dt, lag);
      }
      placed = active;
      var wantsArea = s.reveal === "area" && active && dragging < 0;
      presence = approach(presence, wantsArea ? 1 : 0, dt, 0.16);

      for (var k = kicks.length - 1; k >= 0; k--) {
        if (kicks[k].at > pulse) continue;
        var kicked = glyphs[kicks[k].index];
        if (kicked) kicked.velocity.y -= kicks[k].velocity;
        kicks.splice(k, 1);
      }

      var moving = false;
      glyphs.forEach(function (glyph, i) {
        if (i === dragging) {
          glyph.offset.x = approach(glyph.offset.x, pointer.x - grab.x, dt, 0.03);
          glyph.offset.y = approach(glyph.offset.y, pointer.y - grab.y, dt, 0.03);
          glyph.velocity.x = 0;
          glyph.velocity.y = 0;
          moving = true;
          return;
        }
        var offset = glyph.offset;
        var velocity = glyph.velocity;
        if (Math.abs(offset.x) < 0.05 && Math.abs(offset.y) < 0.05 && Math.hypot(velocity.x, velocity.y) < 0.5) {
          offset.x = 0;
          offset.y = 0;
          velocity.x = 0;
          velocity.y = 0;
          return;
        }
        velocity.x += (-SPRING * offset.x - damping * velocity.x) * dt;
        velocity.y += (-SPRING * offset.y - damping * velocity.y) * dt;
        offset.x += velocity.x * dt;
        offset.y += velocity.y * dt;
        moving = true;
      });

      /* Typing: "type" runs across the whole intro, "design" types inside its
         0.36–0.70 window. */
      var typing = -1;
      var cursorAt = -1;
      var design = introducing && introKind === "design" ? designState(view, progress) : null;
      if (introducing && (introKind === "type" || design)) {
        var from = design ? 0.36 : 0;
        var span = design ? 0.34 : 0.86;
        var local = (progress - from) / span;
        var step = 1 / glyphs.length;
        cursorAt = local < 0 ? -1 : Math.min(glyphs.length - 1, Math.floor(local / step));
        typing = local >= 0 && local < (design ? 1 : 1.08) ? cursorAt : -1;
        glyphs.forEach(function (glyph, i) {
          glyph.shown = i < cursorAt ? 1 : i === cursorAt ? smoothstep(0, step * 0.3, local - i * step) : 0;
        });
      } else {
        glyphs.forEach(function (glyph) {
          glyph.shown = 1;
        });
      }

      var focus = introducing ? (design ? -1 : typing) : dragging >= 0 ? dragging : active ? glyphAt(lens.x, lens.y) : -1;
      if (focus >= 0 && s.selection) {
        var f = glyphs[focus];
        var bx1 = f.box.x1 + f.offset.x - 6;
        var by1 = f.box.y1 + f.offset.y - 6;
        var bx2 = f.box.x2 + f.offset.x + 6;
        var by2 = f.box.y2 + f.offset.y + 6;
        if (frame.index < 0 || frame.alpha < 0.02) {
          frame.x1 = bx1;
          frame.y1 = by1;
          frame.x2 = bx2;
          frame.y2 = by2;
        }
        var glide = focus === dragging ? 0.02 : 0.08;
        frame.x1 = approach(frame.x1, bx1, dt, glide);
        frame.y1 = approach(frame.y1, by1, dt, glide);
        frame.x2 = approach(frame.x2, bx2, dt, glide);
        frame.y2 = approach(frame.y2, by2, dt, glide);
        frame.index = focus;
      }
      frame.alpha = approach(frame.alpha, focus >= 0 && s.selection ? 1 : 0, dt, 0.1);

      glyphs.forEach(function (glyph, i) {
        var target = introducing
          ? (introKind === "type" || design) && (i === typing || (typing >= 0 && i > typing))
            ? 1
            : 0
          : s.reveal === "letter" && i === focus && i !== dragging
            ? 1
            : 0;
        if (introducing && glyph.shown === 0) glyph.outline = target;
        glyph.outline = approach(glyph.outline, target, dt, 0.09);
        if (Math.abs(glyph.outline - target) > 0.002) moving = true;
        else glyph.outline = target;
      });

      guideAlpha = approach(guideAlpha, s.guides && !introducing && (focus >= 0 || presence > 0.4) ? 1 : 0, dt, 0.14);

      var hovering = !introducing && focus >= 0 && pointer.inside;
      var nextCursor =
        dragging >= 0 ? "grabbing" : hovering && s.draggable ? "grab" : hovering && s.clickKick ? "pointer" : "";
      if (document.documentElement.classList.contains("has-custom-cursor")) nextCursor = "";
      if (nextCursor !== cursor) {
        cursor = nextCursor;
        container.style.cursor = nextCursor;
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      glyphs.forEach(function (glyph) {
        var moved = Math.hypot(glyph.offset.x, glyph.offset.y);
        if (moved > 1) {
          ctx.globalAlpha = Math.min(1, moved / 24) * 0.55;
          blit(ctx, glyph.dashes, 0, 0, 0, 0);
          ctx.globalAlpha = 1;
        }
      });
      if (guideAlpha > 0.005) drawLines(view, accent, guideAlpha * 0.6);

      /* The design intro draws the word at DESIGN_SCALE → 1 around the
         frame's top-left corner. */
      if (design && design.scale < 1) {
        var m = design.scale;
        ctx.setTransform(m, 0, 0, m, design.ax * dpr * (1 - m), design.ay * dpr * (1 - m));
      }
      glyphs.forEach(function (glyph) {
        if (glyph.shown < 0.001) return;
        if (glyph.outline < 0.999) {
          ctx.globalAlpha = (1 - glyph.outline) * glyph.shown;
          blit(ctx, glyph.fill, glyph.offset.x, glyph.offset.y, 0, 0);
        }
        if (glyph.outline > 0.001) {
          ctx.globalAlpha = glyph.outline * glyph.shown;
          blit(ctx, glyph.dashes, glyph.offset.x, glyph.offset.y, 0, 0);
        }
        ctx.globalAlpha = 1;
      });
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      if (presence > 0.001) drawReveal();
      drawFrame(accent);

      if (design) {
        drawDesignFrame(design, accent);
        if (progress >= 0.34 && progress < 0.72) {
          var steady = typing >= 0 || Math.floor(pulse * 2.2) % 2 === 0;
          if (steady) drawCaret(view, design, cursorAt >= 0 ? glyphs[cursorAt] : null, accent, 1);
        }
        drawGhost(design, accent);
      }

      var settling =
        moving ||
        introducing ||
        kicks.length > 0 ||
        (guideAlpha > 0.005 && guideAlpha < 0.995) ||
        Math.abs(presence - (wantsArea ? 1 : 0)) > 0.002 ||
        (frame.alpha > 0.01 && frame.alpha < 0.99);
      calm = sweeping && !pointer.inside && dragging < 0 && !moving && kicks.length === 0;
      if ((active || settling) && visible && alive) raf = requestAnimationFrame(tick);
    }

    function wake() {
      if (raf || !visible || !alive) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }

    function resize() {
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      styleCache = null;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      layoutKey = "";
      wake();
    }

    function locate(e) {
      var rect = container.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    }

    function onMove(e) {
      locate(e);
      pointer.inside = true;
      wake();
    }

    function onLeave() {
      if (dragging >= 0) return;
      pointer.inside = false;
      wake();
    }

    function onDown(e) {
      locate(e);
      pointer.inside = true;
      var primary = e.pointerType !== "mouse" || e.button === 0;
      var index = introducing || !primary ? -1 : glyphAt(pointer.x, pointer.y);
      press.x = pointer.x;
      press.y = pointer.y;
      press.time = performance.now();
      press.index = index;
      if (s.draggable && index >= 0) {
        dragging = index;
        grab.x = pointer.x - glyphs[index].offset.x;
        grab.y = pointer.y - glyphs[index].offset.y;
        if (container.setPointerCapture) container.setPointerCapture(e.pointerId);
      }
      wake();
    }

    function onUp(e) {
      if (dragging >= 0) {
        dragging = -1;
        if (container.releasePointerCapture) container.releasePointerCapture(e.pointerId);
        var rect = container.getBoundingClientRect();
        pointer.inside =
          e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      }
      if (e.type === "pointerup" && press.index >= 0 && s.clickKick && !reducedMotion && performance.now() - press.time < 450) {
        var box = container.getBoundingClientRect();
        if (Math.hypot(e.clientX - box.left - press.x, e.clientY - box.top - press.y) < 6) kick(press.index);
      }
      press.index = -1;
      wake();
    }

    container.addEventListener("pointermove", onMove, { passive: true });
    container.addEventListener("pointerenter", onMove, { passive: true });
    container.addEventListener("pointerdown", onDown, { passive: true });
    container.addEventListener("pointerup", onUp, { passive: true });
    container.addEventListener("pointercancel", onUp, { passive: true });
    container.addEventListener("pointerleave", onLeave, { passive: true });

    var resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    var intersectionObserver = new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      wake();
    });
    intersectionObserver.observe(container);
    var themeObserver = new MutationObserver(function () {
      styleCache = null;
      wake();
    });
    [document.documentElement, document.body].forEach(function (node) {
      if (node) themeObserver.observe(node, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    });
    if (document.fonts) document.fonts.ready.then(fontsLoaded, fontsLoaded);

    resize();

    return {
      update: function (next) {
        Object.assign(s, next);
        if (next && next.text != null) container.setAttribute("aria-label", s.text);
        styleCache = null;
        layoutKey = "";
        wake();
      },
      destroy: function () {
        alive = false;
        cancelAnimationFrame(raf);
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        themeObserver.disconnect();
        container.style.cursor = "";
        container.removeEventListener("pointermove", onMove);
        container.removeEventListener("pointerenter", onMove);
        container.removeEventListener("pointerdown", onDown);
        container.removeEventListener("pointerup", onUp);
        container.removeEventListener("pointercancel", onUp);
        container.removeEventListener("pointerleave", onLeave);
        canvas.remove();
      }
    };
  }

  window.TechText = TechText;
})();
