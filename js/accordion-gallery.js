/* Vanilla JS port of the React Bits "AccordionGallery" component — a row of
   image panels where one is expanded and the rest squeeze down (tilted,
   desaturated, dimmed). Panels expand on hover/focus/tap, animated with GSAP
   (loaded via CDN on the page). Does nothing if GSAP isn't available. */

(function () {
  "use strict";

  function AccordionGallery(root, options) {
    if (!window.gsap) return;

    this.root = root;
    this.opts = Object.assign(
      {
        items: [],
        defaultIndex: 0,
        accentColor: "#ffffff",
        overlayColor: "#060010",
        textColor: "#ffffff",
        height: 460,
        gap: 10,
        radius: 16,
        expandRatio: 0.52,
        orientation: "horizontal",
        duration: 0.6,
        ease: "power3.out",
        parallax: 0.5,
        tilt: 8,
        stagger: 0.06,
        trigger: "hover",
        showLabels: true,
        grayscale: true
      },
      options
    );

    var o = this.opts;
    this.vertical = o.orientation === "vertical";
    this.count = o.items.length;
    this.active = Math.min(Math.max(o.defaultIndex, 0), this.count - 1);
    this.mediaSize = 320;
    this.timeline = null;
    this.firstRun = true;
    this.prefersReduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    this.panels = [];
    this.medias = [];
    this.bars = [];
    this.texts = [];

    this._build();
    this._measure = this._measure.bind(this);
    this._measure();
    this.firstRun = false;

    if ("ResizeObserver" in window) {
      this.resizeObserver = new ResizeObserver(this._measure);
      this.resizeObserver.observe(this.root);
    } else {
      window.addEventListener("resize", this._measure);
    }
  }

  AccordionGallery.prototype._build = function () {
    var self = this;
    var o = this.opts;
    var root = this.root;

    root.classList.add("accordion-gallery");
    if (this.vertical) root.classList.add("accordion-gallery--vertical");
    root.style.setProperty("--ag-accent", o.accentColor);
    root.style.setProperty("--ag-overlay", o.overlayColor);
    root.style.setProperty("--ag-text", o.textColor);
    root.style.setProperty("--ag-gap", o.gap + "px");
    root.style.setProperty("--ag-radius", o.radius + "px");
    root.style.height = (this.vertical ? Math.round(o.height * 1.6) : o.height) + "px";
    root.setAttribute("role", "list");
    root.setAttribute("aria-label", "Project gallery");

    o.items.forEach(function (item, i) {
      var panel = document.createElement(item.link ? "a" : "div");
      panel.className = "ag-panel" + (i === self.active ? " ag-panel--active" : "");
      panel.style.borderRadius = o.radius + "px";
      if (item.link) panel.href = item.link;
      panel.setAttribute("role", "listitem");
      panel.tabIndex = 0;
      if (item.label) panel.setAttribute("aria-label", item.label);
      if (i === self.active) panel.setAttribute("aria-current", "true");

      var frame = document.createElement("span");
      frame.className = "ag-panel__frame";

      var media = document.createElement("span");
      media.className = "ag-panel__media";
      var img = document.createElement("img");
      img.src = item.image;
      img.alt = item.alt || item.label || "";
      img.draggable = false;
      media.appendChild(img);

      var overlay = document.createElement("span");
      overlay.className = "ag-panel__overlay";
      overlay.setAttribute("aria-hidden", "true");

      frame.appendChild(media);
      frame.appendChild(overlay);
      panel.appendChild(frame);

      if (o.showLabels) {
        var label = document.createElement("span");
        label.className = "ag-panel__label";
        label.setAttribute("aria-hidden", "true");
        var bar = document.createElement("span");
        bar.className = "ag-panel__bar";
        var text = document.createElement("span");
        text.className = "ag-panel__text";
        text.textContent = item.label || "";
        label.appendChild(bar);
        label.appendChild(text);
        panel.appendChild(label);
        self.bars[i] = bar;
        self.texts[i] = text;
      }

      panel.addEventListener("mouseenter", function () {
        if (o.trigger === "hover") self.setActive(i);
      });
      panel.addEventListener("focus", function () {
        self.setActive(i);
      });
      panel.addEventListener("click", function (e) {
        if (i !== self.active) {
          e.preventDefault();
          self.setActive(i);
        }
      });
      panel.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          self.setActive((i + 1) % self.count);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          self.setActive((i - 1 + self.count) % self.count);
        }
      });

      root.appendChild(panel);
      self.panels[i] = panel;
      self.medias[i] = media;
    });
  };

  AccordionGallery.prototype._measure = function () {
    var o = this.opts;
    var rect = this.root.getBoundingClientRect();
    var total = this.vertical ? rect.height : rect.width;
    var usable = Math.max(total - o.gap * (this.count - 1), 120);
    var size = Math.max(140, usable * Math.min(Math.max(o.expandRatio, 0.2), 0.9) * 1.22);
    this.mediaSize = size;
    this.root.style.setProperty("--ag-media-size", size + "px");
    this._applyLayout(!this.firstRun);
  };

  AccordionGallery.prototype.setActive = function (i) {
    if (i === this.active) return;
    this.active = i;
    for (var k = 0; k < this.panels.length; k++) {
      var on = k === i;
      this.panels[k].classList.toggle("ag-panel--active", on);
      if (on) this.panels[k].setAttribute("aria-current", "true");
      else this.panels[k].removeAttribute("aria-current");
    }
    this._applyLayout(true);
  };

  AccordionGallery.prototype._applyLayout = function (animate) {
    var o = this.opts;
    var gsap = window.gsap;
    var active = this.active;
    var count = this.count;
    var vertical = this.vertical;

    var r = Math.min(Math.max(o.expandRatio, 0.2), 0.9);
    var grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;

    if (this.timeline) this.timeline.kill();
    var dur = animate && !this.prefersReduced ? o.duration : 0;
    var tl = gsap.timeline();

    for (var i = 0; i < this.panels.length; i++) {
      var panel = this.panels[i];
      var isActive = i === active;
      var media = this.medias[i];
      var bar = this.bars[i];
      var text = this.texts[i];

      var rot = isActive ? 0 : i < active ? o.tilt : -o.tilt;
      var panelVars = { flexGrow: isActive ? grow : 1, duration: dur, ease: o.ease };
      if (vertical) panelVars.rotateX = -rot;
      else panelVars.rotateY = rot;
      tl.to(panel, panelVars, 0);

      if (media) {
        var drift = Math.max(-1.5, Math.min(1.5, active - i));
        var shift = drift * o.parallax * this.mediaSize * 0.06;
        var gray = o.grayscale ? (isActive ? 0 : 1) : 0;
        tl.to(
          media,
          {
            xPercent: -50,
            yPercent: -50,
            x: vertical ? 0 : isActive ? 0 : shift,
            y: vertical ? (isActive ? 0 : shift) : 0,
            "--ag-gray": gray,
            "--ag-dim": isActive ? 0 : 0.35,
            duration: dur,
            ease: o.ease
          },
          0
        );
      }

      if (o.showLabels && bar && text) {
        if (isActive) {
          tl.to([bar, text], { opacity: 1, x: 0, duration: dur, ease: o.ease, stagger: this.prefersReduced ? 0 : o.stagger }, 0);
        } else {
          tl.to([bar, text], { opacity: 0, x: -14, duration: dur * 0.6, ease: o.ease }, 0);
        }
      }
    }

    this.timeline = tl;
  };

  AccordionGallery.prototype.destroy = function () {
    if (this.timeline) this.timeline.kill();
    if (this.resizeObserver) this.resizeObserver.disconnect();
    else window.removeEventListener("resize", this._measure);
    this.root.innerHTML = "";
  };

  window.AccordionGallery = AccordionGallery;
})();
