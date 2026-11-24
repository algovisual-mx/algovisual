/* Project detail page: reads ?slug= from the URL and fills the template
   using the shared PROJECTS data (js/projects-data.js). */

(function () {
  "use strict";

  var ARROW_SVG =
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
    "</svg>";

  var BACK_ARROW_SVG =
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M17 7L7 17M7 17H15M7 17V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
    "</svg>";

  var ICON_ROLE =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>';
  var ICON_SCOPE =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="m3 12.5 9 5 9-5"/><path d="m3 17 9 5 9-5"/></svg>';
  var ICON_STATUS =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/></svg>';
  var CHEV_L =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg>';
  var CHEV_R =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';

  function getSlug() {
    var params = new URLSearchParams(window.location.search);
    return params.get("slug");
  }

  function findProject(slug) {
    return PROJECTS.filter(function (p) { return p.slug === slug; })[0];
  }

  // The next case is always another published case (one with a case study),
  // never the current one.
  function nextProject(current) {
    var real = PROJECTS.filter(function (p) { return p.caseStudy; });
    var index = real.indexOf(current);
    return real[(index + 1) % real.length];
  }

  function renderNotFound() {
    var root = document.querySelector("[data-project-root]");
    root.innerHTML =
      '<div class="container" style="padding-top: clamp(140px, 22vh, 220px); padding-bottom: 120px; text-align:center;">' +
      '<h1 class="project-title" style="margin-inline:auto;">Project not found</h1>' +
      '<p style="margin-top:18px;">The project you’re looking for doesn’t exist or may have moved.</p>' +
      '<a class="btn btn-primary" href="index.html" style="margin-top:32px;display:inline-flex;">Back to Work</a>' +
      "</div>";
  }

  /* ---- Section builders ----------------------------------------------------
     Each returns the inner HTML of one case-study section. Headings are the
     conclusion of the section (see js/projects-data.js). */

  function list(items, tag) {
    return items.map(function (t) { return "<" + tag + ">" + t + "</" + tag + ">"; }).join("");
  }

  function sectionHead(num, label, heading) {
    return (
      '<header class="cs-head"><span class="cs-num">' + num + "</span>" +
      '<div><span class="cs-eyebrow">' + label + '</span><h2 class="cs-heading">' + heading + "</h2></div></header>"
    );
  }

  function figure(src, caption, label, extraClass, alt) {
    var text = alt != null ? alt : (caption || label || "");
    return (
      '<figure class="cs-figure' + (extraClass ? " " + extraClass : "") + '">' +
      '<div class="cs-figure__media">' +
      (label ? '<span class="cs-figure__tag">' + label + "</span>" : "") +
      (src ? '<img src="' + src + '" alt="' + text.replace(/"/g, "&quot;") + '" loading="lazy">' : "") +
      "</div>" +
      (caption ? "<figcaption>" + caption + "</figcaption>" : "") +
      "</figure>"
    );
  }

  function fact(icon, label, text) {
    return '<div class="cs-fact"><span class="cs-fact__icon">' + icon + "</span><dt>" + label + "</dt><dd>" + text + "</dd></div>";
  }

  function buildSummary(project, cs) {
    var s = cs.summary;
    return (
      '<div class="container">' +
      '<a class="project-back" href="index.html#' + project.section + '" data-wipe="">' + BACK_ARROW_SVG + " Back to Work</a>" +
      '<p class="project-kicker">' + project.title + " &middot; " + project.category + " &middot; " + project.year + "</p>" +
      '<h1 class="project-title">' + cs.outcome + "</h1>" +
      '<dl class="cs-summary">' +
      '<div><dt>Problem</dt><dd>' + s.problem + "</dd></div>" +
      (s.decision ? '<div><dt>Key decision</dt><dd>' + s.decision + "</dd></div>" : "") +
      (s.outcome ? '<div><dt>Outcome</dt><dd>' + s.outcome + "</dd></div>" : "") +
      "</dl>" +
      '<dl class="cs-facts">' +
      fact(ICON_ROLE, "Role", s.role) +
      fact(ICON_SCOPE, "Scope", s.scope || s.team + " &middot; " + s.duration) +
      (s.status ? fact(ICON_STATUS, "Status", s.status) : "") +
      "</dl>" +
      figure(project.cover, project.title + " — final design", "", "cs-hero").replace(' loading="lazy"', "").replace(/<figcaption>.*?<\/figcaption>/, "") +
      "</div>"
    );
  }

  function buildProblem(project, cs) {
    var p = cs.problem;
    var r = cs.role;
    return (
      sectionHead("01", "Problem &amp; scope", p.heading) +
      '<div class="cs-body">' +
      '<div class="cs-copy">' + list(p.text, "p") + "</div>" +
      (p.stat
        ? '<div class="cs-stat"><strong>' + p.stat.value + "</strong><span>" + p.stat.label + "</span></div>"
        : "") +
      (p.image ? figure(p.image.src, p.image.caption) : "") +
      (r.scope
        ? '<div class="cs-subsection">' +
          '<h3 class="cs-subhead">What I designed</h3>' +
          '<dl class="cs-constraints">' +
          r.scope.map(function (c) {
            return "<div><dt>" + c.label + "</dt><dd>" + c.text + "</dd></div>";
          }).join("") +
          "</dl>" +
          "</div>"
        : "") +
      "</div>"
    );
  }

  function buildDecisions(cs) {
    var d = cs.decisions;
    // The option that was chosen in each decision (its image is the one shown).
    var chosen = d.items.map(function (it) { return it[it.chosen]; });
    return (
      sectionHead("02", "Key decisions", d.heading) +
      '<div class="cs-body">' +
      '<ul class="cs-decisions">' +
      d.items.map(function (it) {
        return "<li><strong>" + it.title + ".</strong> " + it.why + "</li>";
      }).join("") +
      "</ul>" +
      '<div class="cs-used" style="--n:' + Math.min(chosen.length, 3) + '">' +
      chosen.map(function (o, i) {
        return figure(o.image, d.items[i].title, "", "cs-used__item" + (o.fit === "contain" ? " is-contain" : ""));
      }).join("") +
      "</div>" +
      "</div>"
    );
  }

  function buildSolution(cs) {
    var s = cs.solution;
    return (
      sectionHead("03", "Solution", s.heading) +
      '<div class="cs-body">' +
      s.items.map(function (it) {
        var n = it.images.length;
        // No carousels: every screen is shown, one per row at full width, so
        // nothing hides behind a swipe. Click any image to enlarge it.
        var carousel = false;
        var layout = n > 1 || it.stack ? " is-stack" : "";
        var topic = it.caption.replace(/^\d+\.\s*/, "");
        function shot(im, k) {
          var alt = im.alt || topic + (n > 1 ? " (" + (k + 1) + " of " + n + ")" : "");
          return figure(im.src, "", im.label || "", "cs-shot" + (im.fit === "contain" ? " is-contain" : ""), alt);
        }
        return (
          '<div class="cs-solution">' +
          '<h3 class="cs-solution__title">' + it.caption + "</h3>" +
          (it.text ? '<div class="cs-copy cs-solution__text"><p>' + it.text + "</p></div>" : "") +
          (carousel
            ? '<div class="cs-carousel" data-carousel role="group" aria-roledescription="carousel" aria-label="Screens">' +
              '<div class="cs-carousel__track" tabindex="0">' + it.images.map(shot).join("") + "</div>" +
              '<div class="cs-carousel__bar">' +
              '<span class="cs-carousel__count" aria-live="polite"></span>' +
              '<div class="cs-carousel__btns">' +
              '<button type="button" class="cs-carousel__btn" data-dir="-1" aria-label="Previous screen">' + CHEV_L + "</button>" +
              '<button type="button" class="cs-carousel__btn" data-dir="1" aria-label="Next screen">' + CHEV_R + "</button>" +
              "</div></div></div>"
            : (n ? '<div class="cs-solution__images' + layout + '">' + it.images.map(shot).join("") + "</div>" : "")) +
          "</div>"
        );
      }).join("") +
      "</div>"
    );
  }

  /* Results: one dashboard layout for every case (header with a short intro,
     a hero comparison card beside a column of stats and one panel, then a
     usability card with a tile per task). Each case fills the same slots. */
  function esc(t) { return String(t == null ? "" : t); }

  function dotsHtml(on, total) {
    var out = "";
    for (var i = 0; i < total; i++) out += '<i class="rs-dot' + (i < on ? " is-on" : "") + '"></i>';
    return '<span class="rs-dots" aria-hidden="true">' + out + "</span>";
  }

  function heroCard(h) {
    return (
      '<article class="rs-card rs-hero">' +
      '<h3 class="rs-title">' + esc(h.title) + "</h3>" +
      '<div class="rs-big"><strong>' + esc(h.value) + "</strong><span>" + esc(h.label) + "</span></div>" +
      '<div class="rs-rows">' + h.rows.map(function (r) {
        return '<div class="rs-row rs-row--' + (r.tone || "accent") + '">' +
          '<span class="rs-row__label">' + esc(r.label) + "</span>" +
          '<div class="rs-track" aria-hidden="true"><i style="width:' + r.pct + '%"></i></div>' +
          '<span class="rs-row__val">' + esc(r.value) + "</span></div>";
      }).join("") + "</div></article>"
    );
  }

  function panelCard(p) {
    var body = p.type === "split"
      ? '<div class="rs-split" aria-hidden="true">' + p.parts.map(function (x, i) {
          return '<i class="rs-split__part rs-split__part--' + (i % 2) + '" style="flex:' + x.pct + ' 1 0"></i>';
        }).join("") + "</div>" +
        '<ul class="rs-legend">' + p.parts.map(function (x, i) {
          return '<li><i class="rs-legend__dot rs-legend__dot--' + (i % 2) + '"></i><strong>' + esc(x.value) + "</strong> " + esc(x.label) + "</li>";
        }).join("") + "</ul>"
      : '<div class="rs-track" aria-hidden="true"><i style="width:' + p.pct + '%"></i></div>' +
        '<p class="rs-panel__text">' + esc(p.caption) + "</p>";
    return (
      '<article class="rs-card rs-panel"><div class="rs-panel__head">' +
      '<h3 class="rs-title">' + esc(p.title) + "</h3>" +
      '<span class="rs-panel__sum"><strong>' + esc(p.headline.value) + "</strong> " + esc(p.headline.label) + "</span></div>" +
      body + "</article>"
    );
  }

  function usabilityCard(u) {
    return (
      '<article class="rs-usability">' +
      '<div class="rs-usability__head"><h3 class="rs-title">' + esc(u.title) + "</h3>" +
      '<span class="rs-usability__sum"><strong>' + esc(u.summary.value) + "</strong> " + esc(u.summary.label) + "</span></div>" +
      '<ol class="rs-tiles">' + u.tiles.map(function (t) {
        return '<li class="rs-tile"><span class="rs-tile__name">' + esc(t.name) + "</span>" +
          '<div class="rs-tile__row">' +
          (t.dots ? dotsHtml(t.dots.on, t.dots.total) : t.pct != null ? '<span class="rs-mini" aria-hidden="true"><i style="width:' + t.pct + '%"></i></span>' : "") +
          '<span class="rs-tile__score">' + esc(t.score) + "</span></div>" +
          (t.sub ? '<span class="rs-tile__sub">' + esc(t.sub) + "</span>" : "") + "</li>";
      }).join("") + "</ol>" +
      (u.changes
        ? '<div class="rs-changes"><h4 class="rs-title">What testing changed</h4><ul>' +
          u.changes.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul></div>"
        : "") +
      "</article>"
    );
  }

  function metricCards(items) {
    return '<ul class="cs-results">' + items.map(function (it) {
      return "<li><strong>" + esc(it.value) + "</strong><span>" + esc(it.label) + "</span></li>";
    }).join("") + "</ul>";
  }

  function buildResults(cs) {
    var r = cs.results;
    if (!r.hero) {
      return (
        sectionHead("04", "Results", r.heading) +
        '<div class="cs-body">' +
        (r.goal ? '<p class="cs-goal"><strong>Success meant</strong> ' + esc(r.goal) + "</p>" : "") +
        metricCards(r.items) +
        (r.note ? '<p class="cs-meta">' + r.note + "</p>" : "") + "</div>"
      );
    }
    return (
      '<header class="cs-head cs-head--aside"><span class="cs-num">04</span>' +
      '<div><span class="cs-eyebrow">Results</span><h2 class="cs-heading">' + esc(r.heading) + "</h2></div>" +
      (r.intro ? '<p class="cs-head__aside">' + esc(r.intro) + "</p>" : "") + "</header>" +
      '<div class="cs-body cs-body--wide">' +
      '<div class="rs-grid">' + heroCard(r.hero) +
      '<div class="rs-side"><div class="rs-stats">' + r.stats.map(function (st) {
        return '<article class="rs-card rs-stat"><strong class="' + (st.tone === "accent" ? "is-accent" : "") + '">' + esc(st.value) +
          "</strong><span>" + esc(st.label) + "</span></article>";
      }).join("") + "</div>" + panelCard(r.panel) + "</div></div>" +
      usabilityCard(r.usability) +
      (r.note ? '<p class="cs-meta">' + r.note + "</p>" : "") +
      "</div>"
    );
  }

  function buildLearnings(cs) {
    var l = cs.learnings;
    return (
      sectionHead("05", "Learnings", l.heading) +
      '<div class="cs-body"><ul class="cs-learnings">' + list(l.items, "li") + "</ul></div>"
    );
  }

  function render(project) {
    document.title = project.title + " — Sal Gonzalez, Product Designer";

    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", project.excerpt);
    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", project.title + " — case study by Sal Gonzalez");
    var ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", project.excerpt);

    var cs = project.caseStudy;
    var next = nextProject(project);

    // id, scrollspy label, inner HTML
    var sections = [
      { id: "summary", label: "Summary", html: buildSummary(project, cs), hero: true },
      { id: "problem", label: "Problem & scope", html: buildProblem(project, cs) },
      { id: "decisions", label: "Key decisions", html: buildDecisions(cs) },
      { id: "solution", label: "Solution", html: buildSolution(cs) },
      { id: "results", label: "Results", html: buildResults(cs) },
      { id: "learnings", label: "Learnings", html: buildLearnings(cs) }
    ];

    var root = document.querySelector("[data-project-root]");
    root.innerHTML =
      '<nav class="spy" aria-label="Case study sections"><ul class="spy__list">' +
      sections.map(function (s) {
        return '<li class="spy__item"><a class="spy__dot" href="#' + s.id + '" data-spy="' + s.id + '" aria-label="' + s.label + '">' +
          '<span class="spy__label">' + s.label + "</span></a></li>";
      }).join("") +
      "</ul></nav>" +
      sections.map(function (s) {
        return s.hero
          ? '<section class="project-hero cs-section" id="' + s.id + '">' + s.html + "</section>"
          : '<section class="cs-section" id="' + s.id + '"><div class="container cs-inner">' + s.html + "</div></section>";
      }).join("") +
      '<section class="project-next" aria-label="Next case">' +
      '<div class="container">' +
      '<a class="next-card" href="project.html?slug=' + next.slug + '" data-wipe="' + next.title + '">' +
      '<div class="next-card__media"><img src="' + next.showcase + '" alt="" loading="lazy"></div>' +
      '<div class="next-card__body">' +
      '<span class="next-card__label">Next case</span>' +
      '<h2 class="next-card__title">' + next.title + "</h2>" +
      '<p class="next-card__meta">' + next.category + " &middot; " + next.year + "</p>" +
      '<p class="next-card__excerpt">' + next.excerpt + "</p>" +
      '<span class="next-card__cta">View case<span class="next-card__arrow">' + ARROW_SVG + "</span></span>" +
      "</div>" +
      "</a>" +
      "</div>" +
      "</section>";

    initCarousels();
    initLightbox();
    initScrollSpy();
    if (window.revealScan) window.revealScan();
  }

  /* ---- Carousels ------------------------------------------------------------
     Scroll-snap track (swipe works natively) + prev/next buttons, a 01 / 04
     counter and arrow keys when the track is focused. */
  function initCarousels() {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    [].slice.call(document.querySelectorAll("[data-carousel]")).forEach(function (root) {
      var track = root.querySelector(".cs-carousel__track");
      var slides = [].slice.call(track.children);
      var count = root.querySelector(".cs-carousel__count");
      var prev = root.querySelector('[data-dir="-1"]');
      var next = root.querySelector('[data-dir="1"]');

      function pad(n) { return (n < 10 ? "0" : "") + n; }
      function index() {
        var step = slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth;
        return Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / step)));
      }
      function update() {
        var i = index();
        count.textContent = pad(i + 1) + " / " + pad(slides.length);
        prev.disabled = i === 0;
        next.disabled = i === slides.length - 1;
      }
      function go(dir) {
        var i = Math.max(0, Math.min(slides.length - 1, index() + dir));
        track.scrollTo({ left: slides[i].offsetLeft - slides[0].offsetLeft, behavior: reduce ? "auto" : "smooth" });
      }

      prev.addEventListener("click", function () { go(-1); });
      next.addEventListener("click", function () { go(1); });
      track.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
        else if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
      });
      track.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      update();
    });
  }

  /* ---- Lightbox ---------------------------------------------------------------
     Any image in the case (hero, figures, decisions, carousel slides) opens
     full size in an overlay. Prev/next walk through every image of the case;
     Esc, the close button or a click anywhere else closes it. Focus moves into
     the dialog and goes back to the image that opened it. */
  function initLightbox() {
    var root = document.querySelector("[data-project-root]");
    if (!root) return;

    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var CLOSE_SVG =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';

    var box = document.createElement("div");
    box.className = "lb";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Image viewer");
    box.hidden = true;
    box.innerHTML =
      '<div class="lb__stage"><img class="lb__img" alt=""></div>' +
      '<div class="lb__bar"><span class="lb__caption" aria-live="polite"></span><span class="lb__count"></span></div>' +
      '<button type="button" class="lb__btn lb__close" aria-label="Close image">' + CLOSE_SVG + "</button>" +
      '<button type="button" class="lb__btn lb__nav lb__prev" aria-label="Previous image">' + CHEV_L + "</button>" +
      '<button type="button" class="lb__btn lb__nav lb__next" aria-label="Next image">' + CHEV_R + "</button>";
    document.body.appendChild(box);

    var img = box.querySelector(".lb__img");
    var caption = box.querySelector(".lb__caption");
    var count = box.querySelector(".lb__count");
    var btnClose = box.querySelector(".lb__close");
    var btnPrev = box.querySelector(".lb__prev");
    var btnNext = box.querySelector(".lb__next");

    var items = [];
    var index = 0;
    var opener = null;
    var isOpen = false;

    function pad(n) { return (n < 10 ? "0" : "") + n; }
    function collect() {
      items = [].slice.call(root.querySelectorAll(".cs-figure__media img"));
    }
    function show(i) {
      index = (i + items.length) % items.length;
      var el = items[index];
      var src = el.currentSrc || el.src;
      img.classList.remove("is-in");
      img.src = src;
      img.alt = el.alt || "";
      caption.textContent = el.alt || "";
      count.textContent = pad(index + 1) + " / " + pad(items.length);
      var multi = items.length > 1;
      btnPrev.hidden = !multi;
      btnNext.hidden = !multi;
      // Warm the neighbours so stepping through feels instant.
      if (multi) {
        [index - 1, index + 1].forEach(function (n) {
          var m = items[(n + items.length) % items.length];
          if (m) { var pre = new Image(); pre.src = m.currentSrc || m.src; }
        });
      }
      requestAnimationFrame(function () { img.classList.add("is-in"); });
    }

    function open(el, from) {
      collect();
      var i = items.indexOf(el);
      if (i < 0) return;
      opener = from || null;
      isOpen = true;
      box.hidden = false;
      document.documentElement.classList.add("lb-open");
      var gap = window.innerWidth - document.documentElement.clientWidth;
      if (gap > 0) document.documentElement.style.paddingRight = gap + "px";
      show(i);
      requestAnimationFrame(function () { box.classList.add("is-open"); });
      btnClose.focus({ preventScroll: true });
    }

    function close() {
      if (!isOpen) return;
      isOpen = false;
      box.classList.remove("is-open");
      var done = function () {
        box.hidden = true;
        img.removeAttribute("src");
        document.documentElement.classList.remove("lb-open");
        document.documentElement.style.paddingRight = "";
      };
      if (reduce) done(); else setTimeout(done, 200);
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    }

    // Open: any image in the case. Figures are keyboard-reachable buttons.
    [].slice.call(root.querySelectorAll(".cs-figure__media")).forEach(function (m) {
      if (!m.querySelector("img")) return;
      m.classList.add("is-zoomable");
      m.setAttribute("tabindex", "0");
      m.setAttribute("role", "button");
      m.setAttribute("aria-label", "View larger" + (m.querySelector("img").alt ? ": " + m.querySelector("img").alt : ""));
    });
    root.addEventListener("click", function (e) {
      var m = e.target.closest(".cs-figure__media.is-zoomable");
      if (!m) return;
      open(m.querySelector("img"), m);
    });
    root.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var m = e.target.closest && e.target.closest(".cs-figure__media.is-zoomable");
      if (!m || e.target !== m) return;
      e.preventDefault();
      open(m.querySelector("img"), m);
    });

    // Close: click anywhere that isn't a control.
    box.addEventListener("click", function (e) {
      if (e.target.closest(".lb__nav")) return;
      close();
    });
    btnPrev.addEventListener("click", function (e) { e.stopPropagation(); show(index - 1); });
    btnNext.addEventListener("click", function (e) { e.stopPropagation(); show(index + 1); });

    document.addEventListener("keydown", function (e) {
      if (!isOpen) return;
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); show(index - 1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); show(index + 1); }
      else if (e.key === "Tab") {
        var f = [btnClose, btnPrev, btnNext].filter(function (b) { return !b.hidden; });
        var at = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(at + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });

    // Swipe to step through on touch screens.
    var sx = null;
    box.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      sx = null;
      if (Math.abs(dx) > 60) { show(index + (dx < 0 ? 1 : -1)); box.dataset.swiped = "1"; setTimeout(function () { delete box.dataset.swiped; }, 350); }
    }, { passive: true });
    box.addEventListener("click", function (e) {
      if (box.dataset.swiped) { e.stopImmediatePropagation(); }
    }, true);
  }

  /* ---- Scrollspy ------------------------------------------------------------
     Vanilla take on the dot-nav scrollspy: the dot of the section crossing the
     reading line (35% down the viewport) is active; clicking a dot scrolls to
     its section. */
  function initScrollSpy() {
    var links = [].slice.call(document.querySelectorAll("[data-spy]"));
    var sections = links.map(function (a) { return document.getElementById(a.getAttribute("data-spy")); });
    if (!links.length) return;

    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var ticking = false;

    function update() {
      ticking = false;
      var line = window.innerHeight * 0.35;
      var active = 0;
      sections.forEach(function (sec, i) {
        if (sec && sec.getBoundingClientRect().top <= line) active = i;
      });
      var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) active = sections.length - 1;
      links.forEach(function (a, i) {
        var on = i === active;
        a.parentNode.classList.toggle("is-active", on);
        if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
    }

    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }

    links.forEach(function (a, i) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var sec = sections[i];
        if (!sec) return;
        var top = i === 0 ? 0 : sec.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: top, behavior: reduce ? "auto" : "smooth" });
      });
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  document.addEventListener("DOMContentLoaded", function () {
    var slug = getSlug();
    var project = slug ? findProject(slug) : PROJECTS[0];
    if (!project) {
      renderNotFound();
      return;
    }
    render(project);
  });
})();
