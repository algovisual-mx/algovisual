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

  function nextProject(current) {
    var index = PROJECTS.indexOf(current);
    return PROJECTS[(index + 1) % PROJECTS.length];
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

  function figure(src, caption, label, extraClass) {
    return (
      '<figure class="cs-figure' + (extraClass ? " " + extraClass : "") + '">' +
      '<div class="cs-figure__media">' +
      (label ? '<span class="cs-figure__tag">' + label + "</span>" : "") +
      (src ? '<img src="' + src + '" alt="' + (caption || label || "") + '" loading="lazy">' : "") +
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
      "</dl>" +
      '<dl class="cs-facts">' +
      fact(ICON_ROLE, "Role", s.role) +
      fact(ICON_SCOPE, "Scope", s.scope || s.team + " &middot; " + s.duration) +
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

  function buildFindings(cs) {
    var f = cs.findings;
    return (
      sectionHead("02", "Findings", f.heading) +
      '<div class="cs-body">' +
      '<ol class="cs-findings">' +
      f.items.map(function (it) {
        return "<li><h3>" + it.headline + "</h3><p>" + it.text + "</p></li>";
      }).join("") +
      "</ol>" +
      (f.quote
        ? '<blockquote class="cs-quote"><p>“' + f.quote.text + '”</p><cite>' + f.quote.who + "</cite></blockquote>"
        : "") +
      "</div>"
    );
  }

  function buildDecisions(cs) {
    var d = cs.decisions;
    return (
      sectionHead("03", "Key decisions", d.heading) +
      '<div class="cs-body">' +
      d.items.map(function (it, i) {
        function option(o, key) {
          var chosen = it.chosen === key;
          return figure(
            o.image,
            "<strong>" + o.label + ".</strong> " + o.note,
            chosen ? "Chosen" : "Discarded",
            "cs-option" + (chosen ? " is-chosen" : "") + (o.fit === "contain" ? " is-contain" : "")
          );
        }
        return (
          '<article class="cs-decision">' +
          '<h3><span>Decision ' + (i + 1) + "</span>" + it.title + "</h3>" +
          '<p class="cs-why"><strong>Why:</strong> ' + it.why + "</p>" +
          '<div class="cs-compare">' + option(it.a, "a") + option(it.b, "b") + "</div>" +
          "</article>"
        );
      }).join("") +
      "</div>"
    );
  }

  function buildSolution(cs) {
    var s = cs.solution;
    return (
      sectionHead("04", "Solution", s.heading) +
      '<div class="cs-body">' +
      s.items.map(function (it) {
        var n = it.images.length;
        var carousel = n > 1 && !it.images.some(function (im) { return im.label; });
        var layout = it.stack ? " is-stack" : n === 2 ? " is-pair" : n > 2 ? " is-grid" : "";
        function shot(im) {
          return figure(im.src, "", im.label || "", "cs-shot" + (im.fit === "contain" ? " is-contain" : ""));
        }
        return (
          '<div class="cs-solution">' +
          '<p class="cs-solution__caption">' + it.caption + "</p>" +
          (it.problem
            ? '<dl class="cs-constraints cs-ps">' +
              "<div><dt>Problem</dt><dd>" + it.problem + "</dd></div>" +
              "<div><dt>Solution</dt><dd>" + it.solution + "</dd></div>" +
              "</dl>"
            : "") +
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
            : '<div class="cs-solution__images' + layout + '">' + it.images.map(shot).join("") + "</div>") +
          "</div>"
        );
      }).join("") +
      "</div>"
    );
  }

  function buildResults(cs) {
    var r = cs.results;
    return (
      sectionHead("05", "Results", r.heading) +
      '<div class="cs-body">' +
      '<ul class="cs-results">' +
      r.items.map(function (it) {
        return "<li><strong>" + it.value + "</strong><span>" + it.label + "</span></li>";
      }).join("") +
      "</ul>" +
      (r.note ? '<p class="cs-meta">' + r.note + "</p>" : "") +
      "</div>"
    );
  }

  function buildLearnings(cs) {
    var l = cs.learnings;
    return (
      sectionHead("06", "Learnings", l.heading) +
      '<div class="cs-body"><ul class="cs-learnings">' + list(l.items, "li") + "</ul></div>"
    );
  }

  function render(project) {
    document.title = project.title + " — Algovisual";

    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", project.excerpt);

    var cs = project.caseStudy;
    var next = nextProject(project);

    // id, scrollspy label, inner HTML
    var sections = [
      { id: "summary", label: "Summary", html: buildSummary(project, cs), hero: true },
      { id: "problem", label: "Problem & scope", html: buildProblem(project, cs) },
      { id: "findings", label: "Findings", html: buildFindings(cs) },
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
