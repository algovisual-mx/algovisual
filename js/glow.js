/* Pauses the intro glow's animation while it is off screen. */
(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", function () {
    var el = document.querySelector("[data-glow]");
    if (!el || !("IntersectionObserver" in window)) return;
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) el.removeAttribute("data-offscreen");
      else el.setAttribute("data-offscreen", "");
    }).observe(el);
  });
})();
