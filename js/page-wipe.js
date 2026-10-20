/* Page wipe transition between the separate HTML pages.
   - Links with a data-wipe attribute play the wipe before navigating; the
     attribute's value is the title shown across the screen (leave it empty
     for a wipe with no title, e.g. "Back to Work").
   - The next page picks the handoff up from sessionStorage in <head>, starts
     fully covered, then opens. Loaded in <head> (after the stylesheets) so the
     new page never flashes uncovered. */

(function () {
  "use strict";

  var KEY = "algovisual-wipe";
  var CLOSE_TIME = 540;
  var OPEN_TIME = 540;
  var DELAYS = [80, 40, 0, 40, 80];

  var root = document.documentElement;
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var wipe = null;
  var running = false;

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function build(title) {
    wipe = document.createElement("div");
    wipe.className = "page-wipe";
    wipe.setAttribute("aria-hidden", "true");
    var t = '<div class="page-wipe__title"><span>' + esc(title) + "</span></div>";
    wipe.innerHTML = DELAYS.map(function (delay, row) {
      return (
        '<div class="page-wipe__row" style="--row:' + row + ";--delay:" + delay + 'ms">' +
        '<div class="page-wipe__half page-wipe__half--start">' + t + "</div>" +
        '<div class="page-wipe__half page-wipe__half--end">' + t + "</div>" +
        "</div>"
      );
    }).join("");
    root.appendChild(wipe);
    return wipe;
  }

  function wait(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  function nextFrame() {
    return new Promise(function (resolve) {
      requestAnimationFrame(function () { requestAnimationFrame(resolve); });
    });
  }

  function reset() {
    if (wipe) wipe.classList.remove("is-covering", "is-covered", "is-opening");
    running = false;
  }

  /* Cover the screen, then navigate. */
  function leave(url, title) {
    if (running) return;
    running = true;
    if (!wipe) build(title); else {
      wipe.querySelectorAll(".page-wipe__title span").forEach(function (s) { s.textContent = title; });
    }

    nextFrame().then(function () {
      wipe.classList.add("is-covering");
      return wait(CLOSE_TIME);
    }).then(function () {
      wipe.classList.remove("is-covering");
      wipe.classList.add("is-covered");
      try { sessionStorage.setItem(KEY, JSON.stringify({ title: title, t: Date.now() })); } catch (e) {}
      window.location.href = url;
      // Safety net if the navigation is cancelled or restored from bfcache.
      setTimeout(reset, 4000);
    });
  }

  /* Arrive covered, then open. */
  var incoming = null;
  try {
    var raw = sessionStorage.getItem(KEY);
    if (raw) {
      sessionStorage.removeItem(KEY);
      var data = JSON.parse(raw);
      if (data && Date.now() - data.t < 10000) incoming = data;
    }
  } catch (e) {}

  if (incoming && !reduced) {
    build(incoming.title || "");
    wipe.classList.add("is-covered");

    var title = incoming.title || "";

    var ready = new Promise(function (resolve) {
      if (document.readyState !== "loading") resolve();
      else document.addEventListener("DOMContentLoaded", resolve);
    }).then(nextFrame).then(function () {
      return wait(title ? 120 : 0);
    }).then(function () {
      wipe.classList.remove("is-covered");
      wipe.classList.add("is-opening");
      return wait(OPEN_TIME);
    }).then(reset);
    ready.catch(reset);
  }

  window.addEventListener("pageshow", function (e) {
    if (e.persisted) reset();
  });

  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var link = e.target.closest && e.target.closest("a[data-wipe]");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
    if (reduced) return; // plain navigation
    var url = link.href;
    if (!url || url === window.location.href) return;
    e.preventDefault();
    leave(url, link.getAttribute("data-wipe") || "");
  });
})();
