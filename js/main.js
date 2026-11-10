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

  /* ---- Mobile menu (staggered) -------------------------------------------
     Below 700px the nav collapses to logo + a "Menu +" toggle. Opening it plays
     the React Bits StaggeredMenu transition, rebuilt without dependencies
     (CSS transitions + the Web Animations API): two colour layers and the
     panel slide in one after another, the links rise out of their masks with a
     slight rotation, the numbers and the contact block fade in, the toggle's
     label rolls Menu -> Close and its plus turns into a cross. Built from the
     existing nav so every page gets it. */
  document.addEventListener("DOMContentLoaded", function () {
    var nav = document.querySelector(".nav");
    if (!nav) return;

    var page = document.body.getAttribute("data-page");
    var logo = nav.querySelector(".nav-logo");
    var links = [].slice.call(nav.querySelectorAll(".nav-link"));
    var cta = nav.querySelector(".nav-cta");
    var themeBtn = nav.querySelector("[data-theme-toggle]");
    var mq = window.matchMedia("(max-width: 700px)");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var QUART_OUT = "cubic-bezier(0.165, 0.84, 0.44, 1)";
    var CUBIC_INOUT = "cubic-bezier(0.645, 0.045, 0.355, 1)";
    var CLOSE_MS = 340;

    function toggleInner() {
      return (
        '<span class="sm-toggle-textWrap" aria-hidden="true"><span class="sm-toggle-textInner"><span class="sm-toggle-line">Menu</span></span></span>' +
        '<span class="sm-icon" aria-hidden="true"><span class="sm-icon-line"></span><span class="sm-icon-line sm-icon-line-v"></span></span>'
      );
    }

    /* Toggle that lives in the nav bar (opens the menu). */
    var burger = document.createElement("button");
    burger.type = "button";
    burger.className = "nav-burger sm-toggle";
    burger.setAttribute("aria-label", "Open menu");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-controls", "mobile-menu");
    burger.innerHTML = toggleInner();
    nav.appendChild(burger);

    /* Overlay */
    var menu = document.createElement("div");
    menu.className = "sm";
    menu.id = "mobile-menu";
    menu.setAttribute("role", "dialog");
    menu.setAttribute("aria-modal", "true");
    menu.setAttribute("aria-label", "Menu");
    menu.setAttribute("aria-hidden", "true");

    var layers = document.createElement("div");
    layers.className = "sm-prelayers";
    layers.setAttribute("aria-hidden", "true");
    layers.innerHTML = '<div class="sm-prelayer"></div><div class="sm-prelayer"></div>';
    menu.appendChild(layers);

    var header = document.createElement("header");
    header.className = "sm-header";
    if (logo) {
      var brand = logo.cloneNode(true);
      brand.classList.add("sm-brand");
      header.appendChild(brand);
    }
    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "sm-toggle sm-toggle--overlay";
    toggle.setAttribute("aria-label", "Close menu");
    toggle.innerHTML = toggleInner();
    header.appendChild(toggle);
    menu.appendChild(header);

    var panel = document.createElement("aside");
    panel.className = "sm-panel";
    var inner = document.createElement("div");
    inner.className = "sm-panel-inner";

    var ul = document.createElement("ul");
    ul.className = "sm-panel-list";
    ul.setAttribute("role", "list");
    links.forEach(function (l, i) {
      var li = document.createElement("li");
      li.className = "sm-panel-itemWrap";
      var a = document.createElement("a");
      a.className = "sm-panel-item" + (l.getAttribute("data-nav") === page ? " is-active" : "");
      a.href = l.getAttribute("href");
      a.style.setProperty("--i", i);
      a.setAttribute("data-index", i + 1);
      var label = document.createElement("span");
      label.className = "sm-panel-itemLabel";
      label.textContent = l.textContent;
      a.appendChild(label);
      li.appendChild(a);
      ul.appendChild(li);
    });
    inner.appendChild(ul);

    var socials = document.createElement("div");
    socials.className = "sm-socials";
    var sTitle = document.createElement("h3");
    sTitle.className = "sm-socials-title";
    sTitle.textContent = "Contact";
    socials.appendChild(sTitle);
    var sList = document.createElement("ul");
    sList.className = "sm-socials-list";
    sList.setAttribute("role", "list");
    var sIndex = 0;
    function addSocial(el) {
      var li = document.createElement("li");
      li.className = "sm-socials-item";
      el.style.setProperty("--j", sIndex++);
      li.appendChild(el);
      sList.appendChild(li);
    }
    if (cta) {
      var c = document.createElement("a");
      c.className = "sm-socials-link";
      c.href = cta.getAttribute("href");
      c.textContent = cta.textContent;
      addSocial(c);
    }
    var themeRow = null;
    if (themeBtn) {
      themeRow = document.createElement("button");
      themeRow.type = "button";
      themeRow.className = "sm-socials-link";
      themeRow.setAttribute("data-theme-toggle", "");
      addSocial(themeRow);
    }
    socials.appendChild(sList);
    inner.appendChild(socials);
    panel.appendChild(inner);
    menu.appendChild(panel);
    document.body.appendChild(menu);

    function syncThemeLabel() {
      if (themeRow) themeRow.textContent = currentTheme() === "dark" ? "Light mode" : "Dark mode";
    }
    syncThemeLabel();
    document.addEventListener("algovisual:themechange", syncThemeLabel);

    /* Toggle animations: label roll + plus -> cross */
    var textInner = toggle.querySelector(".sm-toggle-textInner");
    var icon = toggle.querySelector(".sm-icon");
    var textAnim = null;
    var iconAnim = null;

    function rollLabel(opening) {
      var current = opening ? "Menu" : "Close";
      var target = opening ? "Close" : "Menu";
      var seq = [current];
      var last = current;
      for (var i = 0; i < 3; i++) {
        last = last === "Menu" ? "Close" : "Menu";
        seq.push(last);
      }
      if (last !== target) seq.push(target);
      seq.push(target);
      textInner.innerHTML = seq.map(function (l) { return '<span class="sm-toggle-line">' + l + "</span>"; }).join("");
      var n = seq.length;
      var shift = ((n - 1) / n) * 100;
      if (textAnim) textAnim.cancel();
      if (reduce) { textInner.style.transform = "translateY(-" + shift + "%)"; return; }
      textAnim = textInner.animate(
        [{ transform: "translateY(0)" }, { transform: "translateY(-" + shift + "%)" }],
        { duration: (0.5 + n * 0.07) * 1000, easing: QUART_OUT, fill: "forwards" }
      );
    }

    function spinIcon(opening) {
      if (iconAnim) iconAnim.cancel();
      if (reduce) { icon.style.transform = opening ? "rotate(225deg)" : "rotate(0deg)"; return; }
      iconAnim = icon.animate(
        [{ transform: opening ? "rotate(0deg)" : "rotate(225deg)" }, { transform: opening ? "rotate(225deg)" : "rotate(0deg)" }],
        { duration: opening ? 800 : 350, easing: opening ? QUART_OUT : CUBIC_INOUT, fill: "forwards" }
      );
    }

    function focusables() {
      return [].slice.call(menu.querySelectorAll("a[href], button"));
    }

    var isOpen = false;
    var closeTimer = 0;

    function open() {
      if (isOpen) return;
      isOpen = true;
      clearTimeout(closeTimer);
      syncThemeLabel();
      menu.classList.remove("is-closing");
      menu.classList.add("is-open");
      menu.setAttribute("aria-hidden", "false");
      burger.setAttribute("aria-expanded", "true");
      root.classList.add("menu-open");
      rollLabel(true);
      spinIcon(true);
      toggle.focus({ preventScroll: true });
    }

    function finishClose(restoreFocus) {
      menu.classList.remove("is-closing");
      root.classList.remove("menu-open");
      if (restoreFocus) burger.focus({ preventScroll: true });
    }

    function shut(restoreFocus, instant) {
      if (!isOpen) return;
      isOpen = false;
      menu.classList.remove("is-open");
      menu.setAttribute("aria-hidden", "true");
      burger.setAttribute("aria-expanded", "false");
      rollLabel(false);
      spinIcon(false);
      if (instant || reduce) { finishClose(restoreFocus); return; }
      menu.classList.add("is-closing");
      closeTimer = setTimeout(function () { finishClose(restoreFocus); }, CLOSE_MS);
    }

    burger.addEventListener("click", open);
    toggle.addEventListener("click", function () { shut(true); });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) shut(false);
    });
    document.addEventListener("keydown", function (e) {
      if (!isOpen) return;
      if (e.key === "Escape") { shut(true); return; }
      if (e.key !== "Tab") return;
      var f = focusables();
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    var onChange = function () { if (!mq.matches) shut(false, true); };
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
