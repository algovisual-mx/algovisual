/* Global site behavior: theme toggle, nav active state, scroll reveal. */

(function () {
  "use strict";

  /* ---- Theme toggle -------------------------------------------------- */
  var root = document.documentElement;
  var THEME_KEY = "algovisual-theme";

  function applyTheme(theme) {
    if (theme === "light" || theme === "dark") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
  }

  function currentTheme() {
    var explicit = root.getAttribute("data-theme");
    if (explicit) return explicit;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  try {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved) applyTheme(saved);
  } catch (e) {
    /* localStorage unavailable — fall back to prefers-color-scheme */
  }

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector("[data-theme-toggle]");
    if (!toggle) return;
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {}
      document.dispatchEvent(new CustomEvent("algovisual:themechange", { detail: { theme: next } }));
    });
  });

  /* ---- Active nav link ------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    var page = document.body.getAttribute("data-page");
    document.querySelectorAll(".nav-link[data-nav]").forEach(function (link) {
      if (link.getAttribute("data-nav") === page) {
        link.classList.add("is-active");
      }
    });
  });

  /* ---- Nav scroll state ---------------------------------------------------
     Transparent over the top of the page, solid once scrolled. */
  document.addEventListener("DOMContentLoaded", function () {
    var navWrap = document.querySelector(".nav-wrap");
    if (!navWrap) return;
    function syncScrollState() {
      navWrap.classList.toggle("is-scrolled", window.scrollY > 8);
    }
    syncScrollState();
    window.addEventListener("scroll", syncScrollState, { passive: true });
  });

  /* ---- Footer year ------------------------------------------------------*/
  document.addEventListener("DOMContentLoaded", function () {
    var yearEl = document.querySelector("[data-year]");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });

  /* ---- Scroll reveal ------------------------------------------------------
     Exposed as window.revealScan() so pages that inject content after
     DOMContentLoaded (e.g. home.js rendering project cards) can bring new
     .reveal elements under observation. */
  var revealObserver = null;

  function revealScan() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
      );
    }
    document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) {
      if (el.dataset.revealObserved) return;
      el.dataset.revealObserved = "1";
      revealObserver.observe(el);
    });
  }

  window.revealScan = revealScan;
  document.addEventListener("DOMContentLoaded", revealScan);
})();
