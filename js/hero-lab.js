/* Hero lab (hero-lab.html):
   - the head tilts toward the pointer like a 3D model (layers stacked in Z),
   - the wordmark is designed live by js/tech-text.js, then the line below and
     the meta row come in. */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Head tilt ----------------------------------------------------------
     Pointer position across the viewport → rotateY/rotateX, eased. Without a
     recent pointer it idles with a slow sway. */
  function initHead() {
    var head = document.querySelector("[data-lab-head]");
    var model = head && head.querySelector(".lab-head__model");
    if (!model || reduceMotion) return;

    var MAX_Y = 30;
    var MAX_X = 18;
    var target = { y: 0, x: 0 };
    var current = { y: 0, x: 0 };
    var lastMove = -Infinity;
    var visible = true;
    var raf = 0;
    var last = performance.now();

    function onMove(e) {
      var rect = head.getBoundingClientRect();
      var nx = (e.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2);
      var ny = (e.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2);
      target.y = Math.max(-1, Math.min(1, nx)) * MAX_Y;
      target.x = -Math.max(-1, Math.min(1, ny)) * MAX_X;
      lastMove = performance.now();
      wake();
    }

    function frame(now) {
      raf = 0;
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      var idle = now - lastMove > 2800;
      if (idle) {
        target.y = Math.sin(now / 1900) * 11;
        target.x = Math.cos(now / 2500) * 4;
      }
      var k = 1 - Math.exp(-dt / 0.12);
      current.y += (target.y - current.y) * k;
      current.x += (target.x - current.x) * k;
      model.style.transform = "rotateX(" + current.x.toFixed(2) + "deg) rotateY(" + current.y.toFixed(2) + "deg)";
      if (visible) raf = requestAnimationFrame(frame);
    }

    function wake() {
      if (raf || !visible) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      wake();
    }).observe(head);
    wake();
  }

  /* ---- Wordmark ---------------------------------------------------------- */
  function initWord() {
    var hero = document.querySelector("[data-lab-hero]");
    var el = document.querySelector("[data-lab-word]");
    if (!hero || !el || !window.TechText) return;

    var ready = function () {
      hero.classList.add("is-ready");
    };
    el.addEventListener("techtext:introend", ready, { once: true });
    setTimeout(ready, 9000);

    window.TechText(el, {
      text: "UX Designer",
      fontWeight: 700,
      fontSize: 200,
      letterSpacing: -0.03,
      rest: el.getAttribute("data-rest") || "fill",
      reveal: "letter",
      intro: "design",
      introDelay: 1.1,
      introDuration: 5,
      ghostName: "Sal",
      specks: 15
    });
  }

  initHead();
  initWord();
})();
