/* Custom cursor: a purple rounded arrow that follows the pointer.
   - Over a card component (.project-card): the arrow hides and a solid
     circle labelled "View" grows in its place.
   - Everywhere else (nav items, buttons, plain links): no special state —
     the arrow just stays put, same as it would over empty page.
   Desktop only (fine pointer + hover support) — untouched on touch devices. */

(function () {
  "use strict";

  if (!window.matchMedia || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    return;
  }

  var ARROW_SVG =
    '<svg class="cursor-dot__arrow" viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M30 8C20 2 8 9 8 20c0 0 6 58 6 58 1 10 10 12 16 4 0 0 12-16 12-16 4-5 10-6 16-3 0 0 18 8 18 8 10 5 18-6 11-15 0 0-51-44-51-44C34 10 32 9 30 8Z"/>' +
    "</svg>";

  document.addEventListener("DOMContentLoaded", function () {
    var dot = document.createElement("div");
    dot.className = "cursor-dot";
    dot.setAttribute("aria-hidden", "true");
    dot.innerHTML =
      ARROW_SVG +
      '<span class="cursor-dot__circle"><span class="cursor-dot__label">View</span></span>';

    document.body.appendChild(dot);
    document.documentElement.classList.add("has-custom-cursor");

    var rafId = null;
    var pendingX = 0, pendingY = 0;

    function render() {
      dot.style.left = pendingX + "px";
      dot.style.top = pendingY + "px";
      rafId = null;
    }

    window.addEventListener(
      "mousemove",
      function (e) {
        pendingX = e.clientX;
        pendingY = e.clientY;
        dot.classList.add("is-active");
        if (!rafId) rafId = requestAnimationFrame(render);
      },
      { passive: true }
    );

    document.addEventListener(
      "mouseover",
      function (e) {
        var card = e.target.closest(".project-card, .ag-panel, .work-row__media, .work-card");
        dot.classList.toggle("is-view", !!card);
      },
      { passive: true }
    );

    document.addEventListener(
      "mouseout",
      function (e) {
        var card = e.target.closest(".project-card, .ag-panel, .work-row__media, .work-card");
        if (!card) return;
        var toCard = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest(".project-card, .ag-panel, .work-row__media, .work-card");
        if (toCard === card) return;
        dot.classList.remove("is-view");
      },
      { passive: true }
    );

    document.addEventListener("mouseleave", function () {
      dot.classList.remove("is-active", "is-view");
    });
  });
})();
