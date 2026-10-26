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
      '<img src="' + src + '" alt="' + (caption || label || "") + '" loading="lazy">' +
      "</div>" +
      (caption ? "<figcaption>" + caption + "</figcaption>" : "") +
      "</figure>"
    );
  }

  function buildSummary(project, cs) {
    var s = cs.summary;
    return (
      '<div class="container">' +
      '<a class="project-back" href="index.html#' + project.section + '" data-wipe="">' + BACK_ARROW_SVG + " Back to Work</a>" +
      '<span class="cs-eyebrow">Summary</span>' +
      '<p class="project-kicker">' + project.title + " &middot; " + project.category + " &middot; " + project.year + "</p>" +
      '<h1 class="project-title">' + cs.outcome + "</h1>" +
      '<dl class="cs-summary">' +
      '<div><dt>Problem</dt><dd>' + s.problem + "</dd></div>" +
      '<div><dt>My role</dt><dd>' + s.role + "</dd></div>" +
      '<div><dt>Team &amp; timeline</dt><dd>' + s.team + " &middot; " + s.duration + "</dd></div>" +
      '<div class="cs-summary__result"><dt>Result</dt><dd><strong>' + s.result.value + "</strong> " + s.result.label + "</dd></div>" +
      "</dl>" +
      figure(project.cover, project.title + " — final design", "", "cs-hero").replace(' loading="lazy"', "") +
      "</div>"
    );
  }

  function buildProblem(project, cs) {
    var p = cs.problem;
    var r = cs.role;
    return (
      sectionHead("01", "Problem &amp; role", p.heading) +
      '<div class="cs-body">' +
      '<div class="cs-copy">' + list(p.text, "p") + "</div>" +
      (p.stat
        ? '<div class="cs-stat"><strong>' + p.stat.value + "</strong><span>" + p.stat.label + "</span></div>"
        : "") +
      (p.image ? figure(p.image.src, p.image.caption) : "") +
      '<div class="cs-subsection">' +
      '<h3 class="cs-subhead">My role &amp; constraints</h3>' +
      '<div class="cs-copy"><p>' + r.text + "</p></div>" +
      '<dl class="cs-constraints">' +
      r.constraints.map(function (c) {
        return "<div><dt>" + c.label + "</dt><dd>" + c.text + "</dd></div>";
      }).join("") +
      "</dl>" +
      '<p class="cs-meta">' + project.role + " &middot; " + project.client + " &middot; " + project.tools.join(", ") + "</p>" +
      "</div>" +
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
            "cs-option" + (chosen ? " is-chosen" : "")
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
        var two = it.images.length > 1;
        return (
          '<div class="cs-solution">' +
          '<div class="cs-solution__images' + (two ? " is-pair" : "") + '">' +
          it.images.map(function (im) { return figure(im.src, "", im.label || "", "cs-shot"); }).join("") +
          "</div>" +
          '<p class="cs-solution__caption">' + it.caption + "</p>" +
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
      { id: "problem", label: "Problem & role", html: buildProblem(project, cs) },
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
      '<section class="project-next">' +
      '<div class="container">' +
      '<div class="project-next-label">Next Project</div>' +
      '<a class="project-next-link" href="project.html?slug=' + next.slug + '" data-wipe="' + next.title + '">' +
      "<span>" + next.title + "</span>" + ARROW_SVG +
      "</a>" +
      "</div>" +
      "</section>";

    initScrollSpy();
    if (window.revealScan) window.revealScan();
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
