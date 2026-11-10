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

  /* Delegated, so the toggle in the mobile menu works too. */
  document.addEventListener("click", function (e) {
    if (!e.target.closest || !e.target.closest("[data-theme-toggle]")) return;
    var next = currentTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (err) {}
    document.dispatchEvent(new CustomEvent("algovisual:themechange", { detail: { theme: next } }));
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

  /* ---- Mobile menu ----------------------------------------------------------
     Below 700px the nav collapses to logo + hamburger. The button opens a
     full-screen panel with the same links, the CTA and the theme switch, and
     a large close button. Built from the existing nav so every page gets it. */
  document.addEventListener("DOMContentLoaded", function () {
    var nav = document.querySelector(".nav");
    if (!nav) return;

    var page = document.body.getAttribute("data-page");
    var logo = nav.querySelector(".nav-logo");
    var links = [].slice.call(nav.querySelectorAll(".nav-link"));
    var cta = nav.querySelector(".nav-cta");
    var themeBtn = nav.querySelector("[data-theme-toggle]");
    var mq = window.matchMedia("(max-width: 700px)");

    var ICON_BURGER =
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    var ICON_CLOSE =
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>';

    var burger = document.createElement("button");
    burger.type = "button";
    burger.className = "nav-burger";
    burger.setAttribute("aria-label", "Open menu");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-controls", "mobile-menu");
    burger.innerHTML = ICON_BURGER;
    nav.appendChild(burger);

    var menu = document.createElement("div");
    menu.className = "mobile-menu";
    menu.id = "mobile-menu";
    menu.setAttribute("role", "dialog");
    menu.setAttribute("aria-modal", "true");
    menu.setAttribute("aria-label", "Menu");
    menu.setAttribute("aria-hidden", "true");

    var top = document.createElement("div");
    top.className = "mobile-menu__top";
    if (logo) {
      var brand = logo.cloneNode(true);
      brand.classList.add("mobile-menu__brand");
      top.appendChild(brand);
    }
    var close = document.createElement("button");
    close.type = "button";
    close.className = "mobile-menu__close";
    close.setAttribute("aria-label", "Close menu");
    close.innerHTML = ICON_CLOSE;
    top.appendChild(close);
    menu.appendChild(top);

    var list = document.createElement("nav");
    list.className = "mobile-menu__links";
    list.setAttribute("aria-label", "Mobile");
    links.forEach(function (l) {
      var a = document.createElement("a");
      a.className = "mobile-menu__link" + (l.getAttribute("data-nav") === page ? " is-active" : "");
      a.href = l.getAttribute("href");
      a.textContent = l.textContent;
      list.appendChild(a);
    });
    menu.appendChild(list);

    var foot = document.createElement("div");
    foot.className = "mobile-menu__foot";
    if (cta) {
      var c = document.createElement("a");
      c.className = "btn btn-primary mobile-menu__cta";
      c.href = cta.getAttribute("href");
      c.innerHTML = cta.innerHTML;
      foot.appendChild(c);
    }
    var themeRow = null;
    if (themeBtn) {
      themeRow = document.createElement("button");
      themeRow.type = "button";
      themeRow.className = "mobile-menu__theme";
      themeRow.setAttribute("data-theme-toggle", "");
      themeRow.innerHTML = themeBtn.innerHTML + '<span class="mobile-menu__theme-label"></span>';
      foot.appendChild(themeRow);
    }
    menu.appendChild(foot);
    document.body.appendChild(menu);

    function syncThemeLabel() {
      if (!themeRow) return;
      themeRow.querySelector(".mobile-menu__theme-label").textContent =
        currentTheme() === "dark" ? "Switch to light mode" : "Switch to dark mode";
    }
    syncThemeLabel();
    document.addEventListener("algovisual:themechange", syncThemeLabel);

    function focusables() {
      return [].slice.call(menu.querySelectorAll("a[href], button"));
    }

    function open() {
      syncThemeLabel();
      menu.classList.add("is-open");
      menu.setAttribute("aria-hidden", "false");
      burger.setAttribute("aria-expanded", "true");
      root.classList.add("menu-open");
      close.focus();
    }

    function shut(restoreFocus) {
      if (!menu.classList.contains("is-open")) return;
      menu.classList.remove("is-open");
      menu.setAttribute("aria-hidden", "true");
      burger.setAttribute("aria-expanded", "false");
      root.classList.remove("menu-open");
      if (restoreFocus) burger.focus();
    }

    burger.addEventListener("click", open);
    close.addEventListener("click", function () { shut(true); });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) shut(false);
    });
    document.addEventListener("keydown", function (e) {
      if (!menu.classList.contains("is-open")) return;
      if (e.key === "Escape") { shut(true); return; }
      if (e.key !== "Tab") return;
      var f = focusables();
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    var onChange = function () { if (!mq.matches) shut(false); };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
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
