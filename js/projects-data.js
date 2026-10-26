/* Project data — edit this file to add, remove, or update portfolio projects.
   To add a new project, copy an object below, give it a unique "slug",
   and drop matching images in assets/images/.

   Each project has a `caseStudy` that fills the project page template
   (js/project-page.js), in this order:
     outcome    page title — the RESULT, not the project name
     summary    problem / role / team / duration / one metric (first screen)
     problem    what was broken, for whom, what it cost (stat + image optional)
     role       what you did + constraints (shown together with the problem)
     findings   findings (not methods) + one standout quote
     decisions  2–3 key decisions: option A vs B, what was chosen, why
     solution   big visuals, ideally before/after, each tied to a decision
     results    big numbers (or qualitative evidence)
     learnings  2–3 lines: what you'd do differently
   Section headings are written as the conclusion, not the stage name.
   Keep every text short. NOTE: the copy and metrics below are placeholders —
   replace them with the real ones.
   Images in `decisions` / `solution` currently reuse each project's gallery
   placeholders; swap in the real before/after and option A/B visuals. */

function galleryImg(slug, n) {
  return "assets/images/" + slug + "-0" + n + ".svg";
}

const PROJECTS = [
  {
    slug: "visicart",
    title: "Visicart",
    category: "UI/UX Design",
    section: "product",
    year: "[TBD]",
    client: "[TBD]",
    role: "Lead Product Designer",
    tools: ["Figma"],
    excerpt: "An AI tool that writes SEO descriptions for every collection in a Shopify store in one click, with roles and approvals so nothing goes live unchecked.",
    showcase: "assets/images/visicart_case_cover.png?v=2",
    cover: "assets/images/visicart-cover.png",
    gallery: [],
    caseStudy: {
      outcome: "Letting AI write store copy at scale without losing control of it",
      summary: {
        problem: "Every Shopify collection needs its own SEO description; writing them by hand did not scale, and AI text could not go live unreviewed.",
        role: "Lead product designer: account structure, permission model, and the generate-and-approve flow.",
        team: "[TBD]",
        duration: "[TBD]",
        result: {
          value: "1 click",
          label: "to draft SEO descriptions for any number of collections"
        }
      },
      problem: {
        heading: "Collection pages stayed thin because writing for each one did not scale",
        text: [
          "Collection pages are where a store groups its products, and each one needs its own search-friendly description. A store with dozens of collections means dozens of texts, written one at a time.",
          "AI could draft them in seconds, which raised a new problem: once the tool opened to the public, several people across several stores could push text to a live storefront with no one checking it."
        ]
      },
      role: {
        text: "I was the lead designer from the first internal version to the public launch. I designed the account structure, the permission model and the generate-and-approve flow, and worked with [TBD] on the build.",
        constraints: [
          {
            label: "Scope",
            text: "Built for internal use first, it had to become a multi-store public product without a rebuild."
          },
          {
            label: "Risk",
            text: "Text publishes to a live storefront, so a bad description is a public mistake, not a draft."
          },
          {
            label: "Tech",
            text: "Everything had to fit Shopify's collection structure and publish through its API."
          }
        ]
      },
      findings: {
        heading: "The real risk was not writing speed; it was who could publish",
        items: [
          {
            headline: "Owners do not run one store; they run several",
            text: "Brands and agencies managed multiple stores with different teams, so a one-store account would have broken on the first day of the public launch."
          },
          {
            headline: "Writing and publishing are different jobs",
            text: "Slack and similar tools separate the workspace owner, the people who create, and the people who decide; content teams already worked that way."
          },
          {
            headline: "Every store has its own voice",
            text: "Generic AI copy sounded the same across stores, so tone had to be set once per store instead of typed into every request."
          }
        ]
      },
      decisions: {
        heading: "Organizations own the stores, editors draft, admins publish",
        items: [
          {
            title: "Organizations that contain stores, not one account per store",
            why: "I borrowed Slack's workspace model so one owner can run every store and grant access per person; the cost was a longer first-time setup.",
            chosen: "b",
            a: {
              label: "One account per store",
              note: "Quick to set up, but owners juggle logins and cannot share teammates across stores.",
              image: "assets/images/visicart-01.png"
            },
            b: {
              label: "Organization, then stores, then people",
              note: "One login, many stores, access set per person.",
              image: "assets/images/visicart-02.png"
            }
          },
          {
            title: "Nothing AI-written goes live without an admin",
            why: "Approval adds a step between generating and publishing, but it makes a person accountable for every text on a live store.",
            chosen: "b",
            a: {
              label: "Anyone can publish",
              note: "Fastest path, but no one owns what goes live.",
              image: "assets/images/visicart-03.png"
            },
            b: {
              label: "Editors generate, admins approve",
              note: "Speed for drafting, control for publishing.",
              image: "assets/images/visicart-04.png"
            }
          },
          {
            title: "Generate in bulk, review one by one",
            why: "Bulk generation removed the bottleneck; reviewing each result kept the quality check real instead of a single \"approve all\".",
            chosen: "b",
            a: {
              label: "One collection at a time",
              note: "Full control, but too slow for large catalogs.",
              image: "assets/images/visicart-05.png"
            },
            b: {
              label: "Bulk generate, individual review",
              note: "One click for the drafts, a quick check for each.",
              image: "assets/images/visicart-06.png"
            }
          }
        ]
      },
      solution: {
        heading: "From an empty collection to approved copy in three steps",
        items: [
          {
            caption: "Decision 3: pick the collections, choose the tone, and draft them all in one click.",
            images: [
              {
                src: "assets/images/visicart-06.png"
              }
            ]
          },
          {
            caption: "Decision 2: admins approve each draft before it reaches the store.",
            images: [
              {
                src: "assets/images/visicart-04.png"
              }
            ]
          },
          {
            caption: "Decision 1: one organization holds every store, with access set per person.",
            images: [
              {
                src: "assets/images/visicart-02.png"
              }
            ]
          }
        ]
      },
      results: {
        heading: "An internal tool became a public product without a rebuild",
        items: [
          {
            value: "1 click",
            label: "to draft SEO copy for any number of collections"
          },
          {
            value: "[TBD]",
            label: "stores using Visicart"
          },
          {
            value: "[TBD]",
            label: "[TBD]"
          }
        ]
      },
      learnings: {
        heading: "Design the permission model before the screens",
        items: [
          "I would define roles with engineering in the first week, since every screen depended on who could see and do what.",
          "I would test the approval queue with a real multi-store team before the public launch, not after."
        ]
      }
    }
  },
  {
    slug: "shift-dashboard",
    title: "Shift Analytics Dashboard",
    category: "Product Design",
    section: "product",
    year: "2024",
    client: "Shift Logistics",
    role: "Product & UX Designer",
    tools: ["Figma", "React", "D3.js"],
    excerpt: "A real-time operations dashboard that turns fleet data into decisions in under a second.",
    showcase: "assets/images/showcase-sample.png", // placeholder — swap per project
    cover: "assets/images/shift-dashboard-cover.svg",
    gallery: [
      "assets/images/shift-dashboard-01.svg",
      "assets/images/shift-dashboard-02.svg",
      "assets/images/shift-dashboard-03.svg"
    ],
    caseStudy: {
      outcome: "Cut dispatch response time by 32% by surfacing exceptions first",
      summary: {
        problem: "Dispatchers dug through spreadsheets to find late or idle vehicles.",
        role: "Product and UX designer, research through hand-off.",
        team: "1 PM, 3 engineers, 4 dispatchers as advisors",
        duration: "4 months",
        result: { value: "-32%", label: "dispatch response time after rollout" }
      },
      problem: {
        heading: "Problems were buried inside averages",
        text: [
          "The old tool showed fleet-wide averages. A late shipment or an idle truck only showed up when someone went looking for it.",
          "Dispatchers kept private spreadsheets to catch what the tool missed."
        ],
        stat: { value: "5+", label: "tools and spreadsheets used per shift" }
      },
      role: {
        text: "I ran shadowing sessions, defined the information hierarchy and designed the dashboard. I worked with engineers on the chart components.",
        constraints: [
          { label: "Time", text: "4 months, before the winter peak season." },
          { label: "Tech", text: "React and D3 on a streaming API that updates every few seconds." },
          { label: "Users", text: "Dispatchers work on shared wall monitors and small laptops." }
        ]
      },
      findings: {
        heading: "Dispatchers need exceptions in five seconds, not charts",
        items: [
          { headline: "The first five seconds of a shift decide the day", text: "Dispatchers checked late and idle vehicles first, then everything else." },
          { headline: "Averages hid the vehicles that mattered", text: "Three of four dispatchers ignored the summary charts entirely." }
        ],
        quote: { text: "Don’t show me the average. Show me what’s on fire.", who: "Dispatcher, shadowing session" }
      },
      decisions: {
        heading: "Exceptions first, charts second",
        items: [
          {
            title: "Lead with an exceptions list instead of summary charts",
            a: { label: "Summary charts first", note: "Familiar, but needs interpretation.", image: galleryImg("shift-dashboard", 1) },
            b: { label: "Exceptions list first", note: "Late, idle and conflicting routes on top.", image: galleryImg("shift-dashboard", 2) },
            chosen: "b",
            why: "Dispatchers found the problem vehicle in under 5 seconds, against 20+ with the old layout."
          },
          {
            title: "Color only for exceptions",
            a: { label: "Color-coded everything", note: "Looked rich; nothing stood out.", image: galleryImg("shift-dashboard", 3) },
            b: { label: "Neutral by default", note: "Color appears only when action is needed.", image: galleryImg("shift-dashboard", 2) },
            chosen: "b",
            why: "Wall-monitor tests showed exceptions were readable from across the room."
          }
        ]
      },
      solution: {
        heading: "A dashboard where only what needs action is loud",
        items: [
          {
            caption: "Decision 1: exceptions lead; charts support them.",
            images: [
              { src: galleryImg("shift-dashboard", 1), label: "Before" },
              { src: galleryImg("shift-dashboard", 2), label: "After" }
            ]
          },
          {
            caption: "Decision 2: neutral by default, color only for exceptions.",
            images: [{ src: galleryImg("shift-dashboard", 3) }]
          }
        ]
      },
      results: {
        heading: "Faster response, and a system reused across the company",
        items: [
          { value: "-32%", label: "dispatch response time" },
          { value: "3", label: "other internal tools now built on the design system" },
          { value: "<5s", label: "to find the problem vehicle in testing" }
        ]
      },
      learnings: {
        heading: "Test on the real screens earlier",
        items: [
          "I would test on the wall monitors from the first prototype, not at the end.",
          "I would agree on exception thresholds with dispatchers before designing the list."
        ]
      }
    }
  },
  {
    slug: "pulse-studio",
    title: "Pulse Studio Website",
    category: "Web Design",
    section: "product",
    year: "2024",
    client: "Pulse Creative Studio",
    role: "Web Designer & Front-End Developer",
    tools: ["Figma", "HTML/CSS", "GSAP"],
    excerpt: "A portfolio site for a motion studio that had to move like their reels do.",
    showcase: "assets/images/showcase-sample.png", // placeholder — swap per project
    cover: "assets/images/pulse-studio-cover.svg",
    gallery: [
      "assets/images/pulse-studio-01.svg",
      "assets/images/pulse-studio-02.svg",
      "assets/images/pulse-studio-03.svg"
    ],
    caseStudy: {
      outcome: "Doubled time on site for a motion studio with a hand-built, fast portfolio",
      summary: {
        problem: "A strong reel had no website that showed the work properly.",
        role: "Web designer and front-end developer.",
        team: "Solo, with the studio’s two directors as reviewers",
        duration: "10 weeks",
        result: { value: "2x", label: "average time on site since launch" }
      },
      problem: {
        heading: "The old site hid the work behind slow, static pages",
        text: [
          "Case studies were PDFs and a video grid. Visitors could not scan the work, and the site did not feel like a motion studio.",
          "Inbound leads rarely mentioned the site; they mentioned Instagram."
        ]
      },
      role: {
        text: "I designed and built the whole front end. The studio’s directors reviewed weekly.",
        constraints: [
          { label: "Time", text: "10 weeks, with a fixed launch alongside a new reel." },
          { label: "Tech", text: "Plain HTML, CSS and GSAP so the studio can edit case studies without a build step." },
          { label: "Budget", text: "No custom CMS; content lives in simple files." }
        ]
      },
      findings: {
        heading: "Visitors leave if the reel does not play within seconds",
        items: [
          { headline: "Leads come from the first two case studies", text: "Analytics showed most visitors never scrolled past the second project." },
          { headline: "Heavy motion hurt on mobile", text: "Early prototypes dropped frames on mid-range phones." }
        ],
        quote: { text: "If the site doesn’t move like our reel, why would anyone trust us?", who: "Studio director, kickoff" }
      },
      decisions: {
        heading: "Fast first, motion where it earns its place",
        items: [
          {
            title: "Scroll-driven case study transitions over full video backgrounds",
            a: { label: "Full video backgrounds", note: "Impressive, but heavy and slow to start.", image: galleryImg("pulse-studio", 1) },
            b: { label: "Scroll-driven transitions", note: "Light, with stills that animate on scroll.", image: galleryImg("pulse-studio", 2) },
            chosen: "b",
            why: "Pages loaded in under 2 seconds on mid-range phones."
          },
          {
            title: "Hand-coded pages over a site builder",
            a: { label: "Site builder", note: "Faster to start; limited motion control.", image: galleryImg("pulse-studio", 3) },
            b: { label: "Hand-coded", note: "Full control of timing and cursor states.", image: galleryImg("pulse-studio", 2) },
            chosen: "b",
            why: "Only a hand-built site could match the reel’s pacing."
          }
        ]
      },
      solution: {
        heading: "A site that moves like the reel, and loads like a document",
        items: [
          {
            caption: "Decision 1: stills animate on scroll instead of autoplaying video.",
            images: [
              { src: galleryImg("pulse-studio", 1), label: "Before" },
              { src: galleryImg("pulse-studio", 2), label: "After" }
            ]
          },
          {
            caption: "Decision 2: hand-coded cursor states and transitions.",
            images: [{ src: galleryImg("pulse-studio", 3) }]
          }
        ]
      },
      results: {
        heading: "Case studies became the top entry point for new leads",
        items: [
          { value: "2x", label: "average time on site" },
          { value: "#1", label: "case study pages as inbound entry point" },
          { value: "<2s", label: "load time on mid-range phones" }
        ]
      },
      learnings: {
        heading: "Set a motion budget early",
        items: [
          "I would set a performance budget for motion before designing the first transition.",
          "I would document the editing steps for the studio as I build, not at the end."
        ]
      }
    }
  },
  {
    slug: "terra-branding",
    title: "Terra Coffee Identity",
    category: "Brand Identity",
    section: "product",
    year: "2023",
    client: "Terra Coffee Co.",
    role: "Art Director",
    tools: ["Illustrator", "Photoshop", "InDesign"],
    excerpt: "A full identity system for a coffee roaster rooted in origin, not trend.",
    showcase: "assets/images/showcase-sample.png", // placeholder — swap per project
    cover: "assets/images/terra-branding-cover.svg",
    gallery: [
      "assets/images/terra-branding-01.svg",
      "assets/images/terra-branding-02.svg",
      "assets/images/terra-branding-03.svg"
    ],
    caseStudy: {
      outcome: "Rolled a new identity out to 40+ stores and anchored Terra’s first national campaign",
      summary: {
        problem: "Terra’s brand looked like every other kraft-paper coffee roaster.",
        role: "Art director: strategy, identity, packaging, guidelines.",
        team: "1 designer, 1 illustrator, Terra’s marketing lead",
        duration: "6 months",
        result: { value: "40+", label: "retail locations rebranded" }
      },
      problem: {
        heading: "Terra looked like every other roaster",
        text: [
          "The existing brand leaned on kraft paper and hand-drawn beans. Nothing told shoppers that Terra sources single-origin coffee.",
          "That difference was the company’s main selling point, and it was invisible on the shelf."
        ]
      },
      role: {
        text: "I led the art direction from positioning to guidelines and directed an illustrator and a designer.",
        constraints: [
          { label: "Time", text: "6 months, matched to a packaging print run." },
          { label: "Production", text: "Six single-origin lines printed on existing packaging formats." },
          { label: "Budget", text: "Two-color print on most packaging." }
        ]
      },
      findings: {
        heading: "Shoppers cared about where the coffee came from, not how it looked",
        items: [
          { headline: "Origin was the deciding factor in interviews", text: "Customers picked bags by country and farm, then by price." },
          { headline: "Competitors all used the same visual cues", text: "Kraft paper, earth tones and hand lettering were everywhere on the shelf." }
        ],
        quote: { text: "I read the origin first. The rest I skip.", who: "Customer interview" }
      },
      decisions: {
        heading: "Origin is the system: a map-based identity",
        items: [
          {
            title: "Build the identity on origin maps, not on beans",
            a: { label: "Bean illustration", note: "Familiar, and indistinguishable from competitors.", image: galleryImg("terra-branding", 1) },
            b: { label: "Origin-map iconography", note: "Each line gets its own map from soil to cup.", image: galleryImg("terra-branding", 2) },
            chosen: "b",
            why: "It makes each origin recognizable and the system flexible for new lines."
          },
          {
            title: "A custom wordmark instead of a script font",
            a: { label: "Script font", note: "Warm, but common in the category.", image: galleryImg("terra-branding", 3) },
            b: { label: "Custom wordmark", note: "Sturdier, and legible at small sizes.", image: galleryImg("terra-branding", 2) },
            chosen: "b",
            why: "It reads clearly on small bags and in the store."
          }
        ]
      },
      solution: {
        heading: "A system where each bag tells you where it is from",
        items: [
          {
            caption: "Decision 1: origin maps replace bean illustrations across all six lines.",
            images: [
              { src: galleryImg("terra-branding", 1), label: "Before" },
              { src: galleryImg("terra-branding", 2), label: "After" }
            ]
          },
          {
            caption: "Decision 2: the custom wordmark across packaging and signage.",
            images: [{ src: galleryImg("terra-branding", 3) }]
          }
        ]
      },
      results: {
        heading: "In stores, and the base for the first national campaign",
        items: [
          { value: "40+", label: "retail locations rebranded" },
          { value: "6", label: "single-origin lines on the new packaging" },
          { value: "1st", label: "national campaign built on the system" }
        ]
      },
      learnings: {
        heading: "Show print tests sooner",
        items: [
          "I would show printed samples to the client earlier; screens made the colors look safer than they were.",
          "I would write the guidelines alongside the design, not after."
        ]
      }
    }
  },
  {
    slug: "kite-editorial",
    title: "Kite Editorial System",
    category: "Graphic Design",
    section: "brand",
    year: "2023",
    client: "Kite Magazine",
    role: "Graphic Designer",
    tools: ["InDesign", "Illustrator", "Grid Systems"],
    excerpt: "A modular editorial grid built to hold ninety-plus pages of independent journalism.",
    showcase: "assets/images/showcase-sample.png", // placeholder — swap per project
    cover: "assets/images/kite-editorial-cover.svg",
    gallery: [
      "assets/images/kite-editorial-01.svg",
      "assets/images/kite-editorial-02.svg",
      "assets/images/kite-editorial-03.svg"
    ],
    caseStudy: {
      outcome: "Made a 90-page magazine faster to lay out with a modular twelve-column grid",
      summary: {
        problem: "Every issue was laid out from scratch and drifted from the last.",
        role: "Graphic designer: grid, type system, style guide.",
        team: "1 editor, 1 designer",
        duration: "3 months",
        result: { value: "3", label: "issues laid out on the system without me in the room" }
      },
      problem: {
        heading: "Each issue started from a blank page",
        text: [
          "Essays, photo spreads and data visualizations each had their own layout rules, so issues looked inconsistent and took long to produce.",
          "Only the original designer could lay out an issue."
        ]
      },
      role: {
        text: "I designed the grid, the type pairing and the style guide, and handed it to the editor.",
        constraints: [
          { label: "Format", text: "Quarterly print, 90+ pages, fixed trim size." },
          { label: "Tools", text: "InDesign with paragraph and object styles." },
          { label: "Budget", text: "One designer and an editor with limited layout experience." }
        ]
      },
      findings: {
        heading: "The layouts differed, but the structure underneath did not",
        items: [
          { headline: "Most pages used three layout patterns", text: "Long text, image-led spreads and data pages covered nearly everything." },
          { headline: "Inconsistency came from spacing, not from the grid", text: "Margins and baselines were chosen by eye on every page." }
        ],
        quote: { text: "I don’t need more freedom. I need to know where things go.", who: "Editor, kickoff" }
      },
      decisions: {
        heading: "Twelve columns, restrained type, documented rules",
        items: [
          {
            title: "A twelve-column modular grid over a simple two-column layout",
            a: { label: "Two-column layout", note: "Easy, but too rigid for photo spreads.", image: galleryImg("kite-editorial", 1) },
            b: { label: "Twelve-column grid", note: "Handles text, images and data on one structure.", image: galleryImg("kite-editorial", 2) },
            chosen: "b",
            why: "One grid covered every page type in the sample issue."
          },
          {
            title: "A restrained type pairing",
            a: { label: "Several display fonts", note: "Expressive, but inconsistent between issues.", image: galleryImg("kite-editorial", 3) },
            b: { label: "Two typefaces", note: "One serif for text, one sans for data.", image: galleryImg("kite-editorial", 2) },
            chosen: "b",
            why: "It kept issues consistent while images carried the variety."
          }
        ]
      },
      solution: {
        heading: "One structure, many layouts",
        items: [
          {
            caption: "Decision 1: the twelve-column grid across text, image and data pages.",
            images: [
              { src: galleryImg("kite-editorial", 1), label: "Before" },
              { src: galleryImg("kite-editorial", 2), label: "After" }
            ]
          },
          {
            caption: "Decision 2: two typefaces documented in a living style guide.",
            images: [{ src: galleryImg("kite-editorial", 3) }]
          }
        ]
      },
      results: {
        heading: "Three issues in, layout no longer depends on me",
        items: [
          { value: "3", label: "issues produced on the system" },
          { value: "12", label: "columns, three core page patterns" },
          { value: "0", label: "layout questions needed from me in the last issue" }
        ]
      },
      learnings: {
        heading: "Train the editor while building the system",
        items: [
          "I would run a layout session with the editor mid-project, not at hand-off.",
          "I would build template files, not just a guide."
        ]
      }
    }
  },
  {
    slug: "aether-motion",
    title: "Aether Motion Reel",
    category: "Art Direction",
    section: "brand",
    year: "2022",
    client: "Aether Collective",
    role: "Art Director",
    tools: ["After Effects", "Cinema 4D", "Figma"],
    excerpt: "Art direction and storyboarding for a generative motion reel exploring light and noise.",
    showcase: "assets/images/showcase-sample.png", // placeholder — swap per project
    cover: "assets/images/aether-motion-cover.svg",
    gallery: [
      "assets/images/aether-motion-01.svg",
      "assets/images/aether-motion-02.svg",
      "assets/images/aether-motion-03.svg"
    ],
    caseStudy: {
      outcome: "Directed a 90-second generative reel that became the studio’s pitch opener",
      summary: {
        problem: "The studio’s reel had no opening piece that set the tone.",
        role: "Art director: storyboards, palette, shot pacing.",
        team: "3 animators, 1 sound designer",
        duration: "8 weeks",
        result: { value: "90s", label: "reel now used to open every studio pitch" }
      },
      problem: {
        heading: "The reel had great work but no opening statement",
        text: [
          "Aether’s reel started with its most recent project, so the first seconds depended on whatever that client wanted.",
          "The studio wanted a piece that sets the tone before any client work."
        ]
      },
      role: {
        text: "I directed storyboards, palette and pacing, and worked with the animators on turning noise studies into finished shots.",
        constraints: [
          { label: "Time", text: "8 weeks, to premiere at a regional design festival." },
          { label: "Tech", text: "Generative studies in Cinema 4D, composited in After Effects." },
          { label: "Budget", text: "Studio time only; no external rendering." }
        ]
      },
      findings: {
        heading: "Abstract work holds attention only with clear pacing",
        items: [
          { headline: "Early cuts lost viewers after 20 seconds", text: "Every shot had the same energy and the same palette." },
          { headline: "Tension needs contrast", text: "Quiet frames made the loud ones read as intentional." }
        ],
        quote: { text: "It looked amazing in stills and boring in motion.", who: "Studio feedback on the first cut" }
      },
      decisions: {
        heading: "Contrast in pace and palette keeps it moving",
        items: [
          {
            title: "Build the reel in three tempo chapters",
            a: { label: "One constant tempo", note: "Cohesive, but flat.", image: galleryImg("aether-motion", 1) },
            b: { label: "Three tempo chapters", note: "Slow, building and peak, with quiet frames between.", image: galleryImg("aether-motion", 2) },
            chosen: "b",
            why: "Viewers stayed through the full 90 seconds in the review screening."
          },
          {
            title: "Limit the palette to light and noise",
            a: { label: "Full-color palette", note: "More variety; less identity.", image: galleryImg("aether-motion", 3) },
            b: { label: "Restricted palette", note: "Cool light and grain, one warm accent.", image: galleryImg("aether-motion", 2) },
            chosen: "b",
            why: "The reel became recognizable from a single frame."
          }
        ]
      },
      solution: {
        heading: "A reel that builds, breaks and resolves",
        items: [
          {
            caption: "Decision 1: three tempo chapters instead of one constant pace.",
            images: [
              { src: galleryImg("aether-motion", 1), label: "Before" },
              { src: galleryImg("aether-motion", 2), label: "After" }
            ]
          },
          {
            caption: "Decision 2: a restricted palette of light, grain and one warm accent.",
            images: [{ src: galleryImg("aether-motion", 3) }]
          }
        ]
      },
      results: {
        heading: "Premiered at a festival, now opens every pitch",
        items: [
          { value: "90s", label: "finished sequence" },
          { value: "1", label: "festival premiere" },
          { value: "100%", label: "of studio pitches now open with it" }
        ]
      },
      learnings: {
        heading: "Pace on paper before animating",
        items: [
          "I would test pacing with an animatic before building any shots.",
          "I would lock sound earlier; tempo followed it in the end."
        ]
      }
    }
  }
];

const PROJECT_SECTIONS = [
  { id: "product", title: "Some of my Work...", subtitle: "Product, UI & UX design" }
  // Hidden for now — uncomment (and add the comma above) to bring it back:
  // { id: "brand", title: "Brand & Art Direction", subtitle: "Identity, print & motion" }
];
