/* Home page: renders the project galleries and boots the hero effects. */

(function () {
  "use strict";

  var ARROW_SVG =
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
    "</svg>";

  // "cards" (two-column cards, whole card is the link), "zigzag" (alternating
  // image/text rows), "accordion" (js/accordion-gallery.js) or "grid" (the
  // original image-only card grid).
  var WORK_LAYOUT = "cards";

  function renderCards(items) {
    var grid = document.createElement("div");
    grid.className = "work-cards";

    items.forEach(function (p) {
      var tags = [p.category].concat((p.tools || []).slice(0, 2));

      var card = document.createElement("a");
      card.className = "work-card reveal";
      card.href = "project.html?slug=" + encodeURIComponent(p.slug);
      card.setAttribute("data-wipe", p.title);
      card.innerHTML =
        '<div class="work-card__media">' +
        (p.previewVideo
          ? '<video class="work-card__video" src="' + p.previewVideo + '#t=0.001" muted loop playsinline preload="metadata" aria-hidden="true" tabindex="-1"></video>'
          : '<img class="work-card__img" src="' + (p.showcase || p.cover) + '" alt="" loading="lazy">') +
        "</div>" +
        '<div class="work-card__body">' +
        '<h3 class="work-card__title">' + p.title + "</h3>" +
        '<p class="work-card__desc">' + p.excerpt + "</p>" +
        '<ul class="work-card__tags">' +
        tags.map(function (t) { return "<li>" + t + "</li>"; }).join("") +
        "</ul>" +
        "</div>";
      grid.appendChild(card);
    });

    return grid;
  }

  function renderZigzag(items) {
    var list = document.createElement("div");
    list.className = "work-list";

    items.forEach(function (p, i) {
      var url = "project.html?slug=" + encodeURIComponent(p.slug);
      var tags = [p.category].concat((p.tools || []).slice(0, 2));

      var row = document.createElement("article");
      // First row: image on the right, then alternate.
      row.className = "work-row reveal" + (i % 2 === 1 ? " work-row--flip" : "");
      row.innerHTML =
        '<div class="work-row__text">' +
        '<h3 class="work-row__title">' + p.title + "</h3>" +
        '<p class="work-row__desc">' + p.excerpt + "</p>" +
        '<ul class="work-row__tags">' +
        tags.map(function (t) { return "<li>" + t + "</li>"; }).join("") +
        "</ul>" +
        '<a class="btn btn-primary work-row__cta" href="' + url + '" data-wipe="' + p.title + '">View project ' + ARROW_SVG + "</a>" +
        "</div>" +
        '<a class="work-row__media" href="' + url + '" data-wipe="' + p.title + '" tabindex="-1" aria-hidden="true">' +
        '<img class="work-row__img" src="' + (p.showcase || p.cover) + '" alt="" loading="lazy">' +
        "</a>";
      list.appendChild(row);
    });

    return list;
  }

  function renderGalleries() {
    var root = document.querySelector("[data-project-sections]");
    if (!root || typeof PROJECTS === "undefined") return;

    PROJECT_SECTIONS.forEach(function (section) {
      var items = PROJECTS.filter(function (p) { return p.section === section.id; });
      if (!items.length) return;

      var sectionEl = document.createElement("section");
      sectionEl.className = "work-section";
      sectionEl.id = section.id;

      var head = document.createElement("div");
      head.className = "section-head reveal";
      head.innerHTML = '<div><h2 class="section-title">' + section.title + "</h2></div>";
      sectionEl.appendChild(head);

      if (WORK_LAYOUT === "cards") {
        sectionEl.appendChild(renderCards(items));
        root.appendChild(sectionEl);
        return;
      }

      if (WORK_LAYOUT === "zigzag") {
        sectionEl.appendChild(renderZigzag(items));
        root.appendChild(sectionEl);
        return;
      }

      if (WORK_LAYOUT === "accordion" && window.AccordionGallery) {
        var holder = document.createElement("div");
        holder.className = "reveal";
        sectionEl.appendChild(holder);
        root.appendChild(sectionEl);
        new window.AccordionGallery(holder, {
          items: items.map(function (p) {
            return {
              image: p.cover,
              label: p.title,
              link: "project.html?slug=" + encodeURIComponent(p.slug)
            };
          }),
          defaultIndex: 0,
          accentColor: "#475DD7",
          expandRatio: 0.52,
          trigger: "hover"
        });
        return;
      }

      var grid = document.createElement("div");
      grid.className = "project-grid";

      items.forEach(function (project) {
        var card = document.createElement("a");
        card.className = "project-card reveal";
        card.href = "project.html?slug=" + encodeURIComponent(project.slug);
        card.setAttribute("data-wipe", project.title);
        card.innerHTML =
          '<div class="project-card-media">' +
          '<img src="' + project.cover + '" alt="' + project.title + '" loading="lazy">' +
          '<span class="project-card-arrow">' + ARROW_SVG + "</span>" +
          "</div>" +
          '<div class="project-card-body">' +
          '<span class="project-card-title">' + project.title + "</span>" +
          '<span class="project-card-meta"><span class="project-card-cat">' + project.category + '</span><span class="project-card-year">' + project.year + "</span></span>" +
          "</div>";
        grid.appendChild(card);
      });

      sectionEl.appendChild(grid);
      root.appendChild(sectionEl);
    });

    if (window.revealScan) window.revealScan();
    initPreviewVideos();
  }

  /* Card preview videos loop silently while on screen and rest on their first
     frame otherwise (and always, with reduced motion). */
  function initPreviewVideos() {
    var videos = document.querySelectorAll(".work-card__video");
    if (!videos.length) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) {
          var played = v.play();
          if (played && played.catch) played.catch(function () {});
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.25 });
    videos.forEach(function (v) { io.observe(v); });
  }

  /* Dot-grid hero background — disabled in favor of the cursor-trail
     effect below, kept here (and in index.html / css/home.css) commented
     out rather than deleted, in case it's wanted back.

  function dotGridColors() {
    var isLight = document.documentElement.getAttribute("data-theme") === "light" ||
      (!document.documentElement.getAttribute("data-theme") &&
        window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches);
    return isLight
      ? { base: "#c7cbe8", active: "#475DD7" }
      : { base: "#2b2f52", active: "#475DD7" };
  }

  function initDotGrid() {
    var dotHost = document.querySelector("[data-dot-grid]");
    if (dotHost && window.DotGrid) {
      var colors = dotGridColors();
      var dotGrid = new window.DotGrid(dotHost, {
        dotSize: 10,
        gap: 15,
        baseColor: colors.base,
        activeColor: colors.active,
        proximity: 120,
        shockRadius: 250,
        shockStrength: 5,
        resistance: 750,
        returnDuration: 1.5
      });

      document.addEventListener("algovisual:themechange", function () {
        var c = dotGridColors();
        dotGrid.setColors(c.base, c.active);
      });
    }
  }
  */

  function isLightTheme() {
    return document.documentElement.getAttribute("data-theme") === "light" ||
      (!document.documentElement.getAttribute("data-theme") &&
        window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches);
  }

  function trailPalette() {
    // near = right at the cursor (shortest, tightest-following chain),
    // mid, far = the longer chains trailing further behind.
    return isLightTheme()
      ? { near: "#7585E4", mid: "#ABB6F3", far: "#CED6FF" }
      : { near: "#5D6FD5", mid: "#535E9A", far: "#2A3053" };
  }

  function initCursorTrail() {
    var trailHost = document.querySelector("[data-cursor-trail]");
    if (trailHost && window.CursorTrail) {
      var p = trailPalette();
      var trail = new window.CursorTrail(trailHost, {
        colors: [p.far, p.mid, p.near],
        lengths: [30, 20, 10]
      });

      document.addEventListener("algovisual:themechange", function () {
        var c = trailPalette();
        trail.setColor(0, c.far);
        trail.setColor(1, c.mid);
        trail.setColor(2, c.near);
      });
    }
  }

  function initHero() {
    initCursorTrail();

    var typeHost = document.querySelector("[data-text-type]");
    if (typeHost && window.TextType) {
      new window.TextType(typeHost, {
        text: ["ux", "ui", "product", "digital", "web", "visual", "sexy"],
        typingSpeed: 65,
        deletingSpeed: 35,
        pauseDuration: 1500,
        initialDelay: 500,
        loop: true,
        showCursor: true,
        cursorCharacter: "|",
        offsetCursorWhenEmpty: true
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderGalleries();
    initHero();
  });
})();
