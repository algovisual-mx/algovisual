/* Project data — edit this file to add, remove, or update portfolio projects.
   To add a new project, copy an object below, give it a unique "slug",
   and drop matching images in assets/images/.

   Each project has a `caseStudy` that fills the project page template
   (js/project-page.js), in this order:
     outcome    page title — the RESULT, not the project name
     summary    problem / role / team / duration / one metric (first screen)
     problem    what was broken, for whom, what it cost (stat + image optional)
     role       what you did + constraints (shown together with the problem)
     decisions  2–3 key decisions shown as bullets (title + why); only the chosen option's image is shown
     solution   big visuals, ideally before/after, each tied to a decision
     results    big numbers (or qualitative evidence)
     learnings  2–3 lines: what you'd do differently
   Section headings are written as the conclusion, not the stage name.
   Keep every text short. */

const PROJECTS = [
  {
    slug: "visicart",
    coverAlt: "Preview of the Visicart interface",
    title: "Visicart",
    category: "UI/UX Design",
    section: "product",
    year: "2026",
    client: "Captivate · internal tool, now a product",
    role: "Product & Design Lead",
    tools: [
      "Figma"
    ],
    card: { role: "Product & design lead", type: "AI tool for Shopify stores", result: "One click instead of 3 to 5 minutes per description" },
    excerpt: "An AI tool for Shopify stores that replaces 3 to 5 minutes of writing per description with one click.",
    showcase: "assets/images/visicart_case_cover.png?v=2",
    previewVideo: "assets/videos/Thumb_visi.mp4?v=3", // looping muted preview shown in the home card instead of the image
    cover: "assets/images/visicart-cover.jpg?v=1",
    gallery: [],
    caseStudy: {
      outcome: "One click for a single person was easy. Then we scaled it.",
      summary: {
        problem: "Visicart writes SEO titles and meta descriptions for Shopify collections with one click. It began as an internal tool at Captivate, a search marketing agency, and is now being built as a commercial product for e-commerce teams and Shopify-focused agencies. The hard part was deciding who gets access to what.",
        role: "Product & design lead",
        scope: "The whole product, end to end \u00b7 8 months \u00b7 with the agency owner and two developers",
        team: "Agency owner + 2 developers",
        duration: "8 months",
        result: {
          value: "1 click",
          label: "still all it takes to generate descriptions, now for teams"
        }
      },
      problem: {
        heading: "A tool built for one click had to work for a whole team",
        text: [
          "Visicart began as an internal tool at Captivate, a search marketing agency. It is now being built as a commercial product for e-commerce teams and Shopify-focused agencies. The team was one designer, two developers and the agency owner.",
          "Visicart connects to a Shopify store, syncs its collections and uses AI to write an SEO title and meta description for each one. A person adds keywords, picks a tone and length, checks the result against a Google preview, and publishes it back to the store.",
          "It started simple: one click and every collection in a Shopify store got its SEO description. Then we decided it had to work for teams, and that's where the problem started.",
          "A team needs an owner, people with different roles, and sometimes several stores or organizations at once. The hard part wasn't the dashboard layout. It was deciding who gets access to what, and how far that access goes in each store."
        ]
      },
      role: {
        text: "I led product and design. I designed the whole product end to end, every screen, flow and state in this case, while the two developers built it and the agency owner was the stakeholder.",
        scope: [
          { label: "Sign-up and login", text: "Email and code sign-up, login with a password or a code, and Google sign-in." },
          { label: "Organization setup", text: "A guided start: name the organization, connect a Shopify store and invite the team." },
          { label: "AI connection", text: "Bring your own AI provider: choose it, add the API key, verify it and switch later." },
          { label: "Dashboard and collections", text: "Store stats, the collections table with status filters, and bulk actions with progress states." },
          { label: "Review panel", text: "Keywords, tone and length, the generated text and a Google preview, ending in reject, approve or publish." },
          { label: "Teams and settings", text: "Roles, per-store access, invites, brand voice, organization settings and notifications." },
          { label: "Internal user tests", text: "Tests with the people who use the tool, inside the team." }
        ],
        constraints: [
          {
            label: "Starting point",
            text: "It began as a single-user tool, so the team structure had to fit on top without breaking the one-click flow."
          },
          {
            label: "Scope",
            text: "The whole product, built from scratch while it was still taking shape."
          }
        ]
      },
      decisions: {
        heading: "One clear structure, and access you can read at a glance",
        items: [
          {
            title: "Organizations contain stores, stores contain people",
            why: "After reviewing how similar tools organize teams, three levels let one owner run several stores and organizations without mixing them up. The cost was one more setup step for new owners.",
            chosen: "b",
            a: {
              label: "Each store on its own",
              note: "Simple, but an owner with five stores manages five separate teams.",
              image: "assets/images/visicart-option1.jpg",
              fit: "contain"
            },
            b: {
              label: "Organization, then stores, then people",
              note: "One owner, one place, every store.",
              image: "assets/images/visicart-option2.jpg",
              fit: "contain"
            }
          },
          {
            title: "Show access by person, not buried in each store",
            why: "The owner sees everything one person can do in a single view, instead of opening every store to find out.",
            chosen: "b",
            a: {
              label: "Permissions inside each store's settings",
              note: "Complete, but you have to open every store to get the full picture.",
              image: "assets/images/visicart-option3.jpg"
            },
            b: {
              label: "One view per person",
              note: "Who they are, which stores, and their role in each.",
              image: "assets/images/visicart-option4.jpg"
            }
          },
          {
            title: "The current store is always on screen",
            why: "With several stores and organizations, the worst mistake is generating or approving in the wrong one.",
            chosen: "b",
            a: {
              label: "Switch from a settings menu",
              note: "Clean, but easy to lose track of where you are.",
              image: "assets/images/visicart-option5.jpg"
            },
            b: {
              label: "Switcher always in the navigation",
              note: "You always know which store you're working in.",
              image: "assets/images/visicart-option6.jpg"
            }
          }
        ]
      },
      solution: {
        heading: "Same one click, now a complete product for teams",
        items: [
          {
            caption: "1. Sign-up and login",
            text: "New users enter their email and confirm it with a six-digit code, or continue with Google. Returning users log in with a password, or choose \u201cI prefer a code\u201d. The code field has empty and filled states, and a way to send a new code if it doesn\u2019t arrive.",
            images: [
              { src: "assets/images/visicart-flow-signup-1.jpg" },
              { src: "assets/images/visicart-flow-signup-2.jpg" },
              { src: "assets/images/visicart-flow-signup-3.jpg" },
              { src: "assets/images/visicart-flow-signup-4.jpg" }
            ]
          },
          {
            caption: "2. Setting up an organization and connecting a store",
            text: "The setup explains what an organization is and asks for agreement to the terms. Then the owner names it, connects a Shopify store with its URL and an Admin API token, and invites teammates with a role and a store. The connection shows its progress while the store syncs, and each step can be skipped and finished later.",
            images: [
              { src: "assets/images/visicart-flow-org-1.jpg" },
              { src: "assets/images/visicart-flow-org-2.jpg" },
              { src: "assets/images/visicart-flow-org-3.jpg" },
              { src: "assets/images/visicart-flow-org-4.jpg" }
            ]
          },
          {
            caption: "3. Connecting your own AI provider",
            text: "The owner picks a provider (Claude by Anthropic is recommended, OpenAI and Google are also available), follows a three-step guide to create an API key, then pastes it and chooses a model. The key is verified before it is saved, with clear verifying and error states, and the screen says that usage is billed to the provider account. A banner and a sidebar warning show until AI is connected, with a different version for editors, and the provider can be switched later from the organization settings.",
            stack: true,
            images: [
              { src: "assets/images/visicart-flow-ai-1.jpg", fit: "contain" },
              { src: "assets/images/visicart-flow-ai-2.jpg", fit: "contain" }
            ]
          },
          {
            caption: "4. Dashboard, collections and settings",
            text: "The dashboard counts the collections that were synced, generated, approved and published, and lists recent activity. The collections table filters by status (pending, generated, approved, published, rejected) and has one action per row. Sync store, Generate all and Publish approved handle the bulk work, with progress screens while they run. Each store also keeps its own brand voice, description length and meta description setting.",
            images: [
              { src: "assets/images/visicart-flow-generate-1.jpg", fit: "contain" },
              { src: "assets/images/visicart-flow-generate-2.jpg", fit: "contain" },
              { src: "assets/images/visicart-flow-settings-1.jpg", fit: "contain" },
              { src: "assets/images/visicart-flow-settings-2.jpg", fit: "contain" }
            ]
          },
          {
            caption: "5. Reviewing, approving and publishing",
            text: "Inside each collection, the person adds keywords from Semrush or writes their own, sets the tone and length, and generates a title and meta description. A character counter and a Google search preview show how the result will look. Then they reject, approve or publish it, and a message confirms what happened.",
            stack: true,
            images: [
              { src: "assets/images/visicart-flow-generate-3.jpg" }
            ]
          },
          {
            caption: "6. Teams, roles and access",
            text: "An owner sets up the organization, adds stores and invites people with a role. One view shows everyone with access and their role in each store. Editing a person, assigning stores and removing or deleting users and stores each have their own panel and confirmation.",
            stack: true,
            images: [
              { src: "assets/images/visicart-solution1.jpg?v=2" },
              { src: "assets/images/visicart-solution2.jpg?v=2" }
            ]
          },
          {
            caption: "7. Always knowing which store you\u2019re in",
            text: "The organization menu and the store dropdown live in the navigation, next to notifications, so the current store and organization are always on screen. Switching never goes through a settings menu.",
            stack: true,
            images: [
              { src: "assets/images/visicart-solution3.jpg" }
            ]
          },
          {
            caption: "8. Accessibility check",
            text: "I measured text contrast on the review panel, the screen where people spend the most time. Titles, labels and body text measure 5.4:1 to 20:1, above the WCAG AA minimum of 4.5:1. Two things fall short: placeholder text in inputs measures 3.0:1, and the disabled Reject, Approve and Publish buttons measure 2.0:1. WCAG exempts disabled controls, but they are hard to read. Next, I\u2019d darken the placeholder to pass.",
            images: []
          }
        ]
      },
      results: {
        heading: "Compared with writing by hand, one click and a team of ten",
        items: [
          {
            value: "3\u20135 min \u2192 1 click",
            label: "to write an SEO title and meta description for a collection, instead of writing each one by hand"
          },
          {
            value: "100 collections",
            label: "processed so far, about 5 to 8 hours of writing nobody had to do by hand (an estimate: 100 collections \u00d7 3\u20135 minutes)"
          },
          {
            value: "10 people",
            label: "on the team use it today"
          }
        ],
        note: "No comparable tool existed, so the baseline is doing the work by hand. The time saved is an estimate based on the manual time per description. The product is still in development; launch numbers will be added here."
      },
      learnings: {
        heading: "Decide who sees what before designing any screen",
        items: [
          "I'd map access with the stakeholder before the first screen, because that structure shaped every page after it.",
          "Internal user tests helped shape the flows, and I'd start them earlier, with the access view, because that's where confusion shows up first."
        ]
      }
    }
  },
  {
    slug: "page-plucker",
    coverAlt: "Preview of the Page Plucker interface",
    title: "Page Plucker",
    category: "UI/UX Design",
    section: "product",
    year: "2026",
    client: "Captivate · internal tool, now a product",
    role: "Product & Design Lead",
    tools: [
      "Figma"
    ],
    card: { role: "Product & design lead", type: "Content-extraction tool for SEO teams", result: "Used by a 10-person SEO team" },
    excerpt: "A content-extraction tool that spares SEO teams the copy and paste of pulling a whole site into documents.",
    showcase: "assets/images/pageplucker_case_cover.png",
    previewVideo: "assets/videos/Thumb_pageplucker.mp4", // looping muted preview shown in the home card instead of the image
    cover: "assets/images/pageplucker-header.jpeg",
    gallery: [],
    caseStudy: {
      outcome: "Hundreds of pages, extracted and organized without copy and paste.",
      summary: {
        problem: "Page Plucker extracts the pages of a website into cloud documents, text files, PDFs and image folders. It began as an internal tool at Captivate, a search marketing agency, and is now being built as a commercial product for SEO, content-generation and content-analysis teams and agencies that work with large, complex sites. The real design challenge was not the extraction, it was how to organize and show everything that comes out.",
        role: "Product & design lead",
        scope: "Workflows, design system and the full product · 6 months · with the agency owner and two developers",
        team: "Agency owner + 2 developers",
        duration: "6 months",
        result: {
          value: "6 months",
          label: "from the first flow to the full product"
        }
      },
      problem: {
        heading: "One page produces a pile of files. Hundreds of pages bury you.",
        text: [
          "Page Plucker began as an internal tool at Captivate, a search marketing agency, and is being built as a commercial product for SEO and content teams and agencies that work with large, complex sites. The team was one designer, two developers and the agency owner.",
          "Before this tool there was no tool. To get a page into a document, someone opened it, copied the text, pasted it into a doc and then downloaded each image, one at a time. Doing that for a whole website could take up to a day.",
          "Extracting a page is easy to describe. What comes out is the hard part: for every page there is a Google Doc, a Word file, a text file, several PDFs and often dozens of images. Multiply that by hundreds of pages and several projects, and the output becomes the product.",
          "The challenge was deciding how all of it is stored, named and shown, so anyone can find a file in seconds and a team can work in the same space without stepping on each other."
        ]
      },
      role: {
        text: "I led product and design. I defined the workflows, built the design system and designed every screen, working side by side with the two developers and the agency owner.",
        scope: [
          { label: "Workflows", text: "The end-to-end flow, from signing in to finding a file, defined with the stakeholders and the developers." },
          { label: "Plucker Tool", text: "One screen to choose the destination, add the URLs and pick what to extract, plus the progress and results views." },
          { label: "File structure", text: "Projects, folders and pages, shown the same way in the sidebar, the lists and every file path." },
          { label: "Document lists", text: "A list and a grid view built for hundreds of documents, with a badge for every format." },
          { label: "Team Manager", text: "Users, roles, per-person permissions and an activity log of every extraction." },
          { label: "Design system", text: "Colors, type, icons and a component library, so every screen is built from the same pieces." }
        ]
      },
      decisions: {
        heading: "One structure for every file, and one row for every page",
        items: [
          {
            title: "Set up an extraction on one screen, in three numbered steps",
            why: "Project, URLs and formats are all visible at once, so nothing hides behind a wizard. Someone who has done it once can do it again without reading anything.",
            chosen: "b",
            a: {
              label: "A step-by-step wizard",
              note: "One decision per screen: simple the first time, slow every time after."
            },
            b: {
              label: "Three steps, one screen",
              note: "Everything visible, and the destination is always explicit.",
              image: "assets/images/pageplucker-decision1.jpg"
            }
          },
          {
            title: "One row per page, with every format visible",
            why: "Each page can have a Google Doc, a Word file, a text file, PDFs and images. Badges on a single row, with counts for PDFs and images and a disabled look for what is missing, make a page readable at a glance.",
            chosen: "b",
            a: {
              label: "A separate list for each file type",
              note: "Tidy per type, but one page ends up scattered across five places."
            },
            b: {
              label: "One row, all the formats",
              note: "The page is the unit, and its files hang from it.",
              image: "assets/images/pageplucker-decision2.jpg"
            }
          },
          {
            title: "Project, then folder, then page, everywhere",
            why: "The same three levels appear in the sidebar, in the lists, in every file path and in the permissions. Learn it once and you can find anything, even with hundreds of documents.",
            chosen: "b",
            a: {
              label: "Free tags and a flat list",
              note: "Flexible, but it falls apart as soon as the volume grows."
            },
            b: {
              label: "A fixed hierarchy",
              note: "Always the same path, always in the same place.",
              image: "assets/images/pageplucker-decision3.jpg"
            }
          }
        ]
      },
      solution: {
        heading: "A tool that gets the content out, and a structure that keeps it findable",
        items: [
          {
            caption: "1. The whole journey, from sign-in to a file in the right folder",
            text: "Before drawing any screen I mapped the flow with the stakeholders: sign in, set up the extraction, watch it run, review the results, and browse and organize them later. Team management sits apart, for the people who run the workspace.",
            stack: true,
            images: [
              { src: "assets/images/pageplucker-flow.jpg?v=3" }
            ]
          },
          {
            caption: "2. Setting up an extraction",
            text: "The Plucker Tool puts three numbered steps on a single screen. The person picks or creates the project and folder where the files will live, pastes any number of URLs, one per line, and chooses what to extract: text as a Google Doc, a Word file or a TXT, images and PDFs. A progress screen shows what the engine is doing, and when it finishes the results appear right away.",
            images: [
              { src: "assets/images/pageplucker-s-plucker.jpg" },
              { src: "assets/images/pageplucker-s-progress.jpg" },
              { src: "assets/images/pageplucker-s-ready.jpg" }
            ]
          },
          {
            caption: "3. A file structure that mirrors the work",
            text: "Every page belongs to a folder and every folder belongs to a project. That path is the backbone of the product: the sidebar opens projects and folders in place, every row shows its path, and breadcrumbs and permissions use the same levels. Each page keeps all its files together: the Google Doc, the Word and text versions, the PDFs and the images.",
            stack: true,
            images: [
              { src: "assets/images/pageplucker-structure.jpg?v=2" },
              { src: "assets/images/pageplucker-s-sidebar.jpg" }
            ]
          },
          {
            caption: "4. Browsing hundreds of documents",
            text: "My Projects opens with the numbers that matter, then the projects, the most recent folders and the latest plucked documents. Documents can be shown as a list or a grid, sorted, selected in bulk and downloaded together. Each one carries badges for its Google Doc, Word and text versions, and counts for its PDFs and images. A format that wasn’t extracted looks disabled, and a page that is still empty offers a Pluck action instead.",
            images: [
              { src: "assets/images/pageplucker-s-projects-list.jpg" },
              { src: "assets/images/pageplucker-s-projects-grid.jpg" },
              { src: "assets/images/pageplucker-s-states.jpg" }
            ]
          },
          {
            caption: "5. Teams, roles and permissions",
            text: "The Team Manager lists everyone with a role (owner, admin or member), a status and the projects they can reach. A panel of toggles sets what each person can do: create projects, delete projects, invite users and edit content. The activity view totals extractions, items and storage, and logs every extraction by user, project and URL.",
            images: [
              { src: "assets/images/pageplucker-s-team-users.jpg" },
              { src: "assets/images/pageplucker-s-team-perms.jpg" },
              { src: "assets/images/pageplucker-s-team-activity.jpg" }
            ]
          },
          {
            caption: "6. A design system built for the product",
            text: "Before the screens multiplied I built the component library: logo and icons, a purple base with an orange accent for actions, Montserrat and Red Hat Display for type, and components for navigation, document rows and cards, badges, buttons, inputs, progress and toasts. They come with their states (complete, incomplete, hover, disabled), list and grid variants, and mobile versions. Developers built from it, and new screens were assembled instead of drawn.",
            images: [
              { src: "assets/images/pageplucker-ds-1.jpg" },
              { src: "assets/images/pageplucker-ds-2.jpg" },
              { src: "assets/images/pageplucker-ds-3.jpg" },
              { src: "assets/images/pageplucker-ds-4.jpg" }
            ]
          },
          {
            caption: "7. Accessibility check",
            text: "I measured contrast on the Plucker Tool, the screen people use most. Text on white measures 4.5:1 to 21:1 and sidebar text on the purple 8:1 to 12.7:1, all above the WCAG AA minimum of 4.5:1. Two pairs fall short: the white label on the orange Start Plucking button measures 2.3:1, and the selected Google Doc chip 4.3:1. A dark label on the same orange would measure about 7:1.",
            images: []
          }
        ]
      },
      results: {
        heading: "Compared with copy and paste, a simpler way to extract a whole site",
        items: [
          {
            value: "Up to 1 day",
            label: "was the manual cost of extracting a whole website by copy and paste, the only option before the tool existed"
          },
          {
            value: "10 people",
            label: "on an SEO marketing team use it today"
          },
          {
            value: "A simpler process",
            label: "The team reports time saved and a simpler extraction and documentation process."
          }
        ],
        note: "No comparable tool existed, so the baseline is doing the work by hand. Feedback comes from internal use at Captivate. The time saved has not been measured, so no speed-up figure is given."
      },
      learnings: {
        heading: "Design what comes out before designing how it goes in",
        items: [
          "Once the structure of projects, folders and pages was settled, every screen got simpler. I’d fix it with the stakeholders before drawing anything else.",
          "A page with no images is as common as one with 23, so empty and partial states deserve as much attention as the full ones.",
          "I’d test lists with realistic volumes from the start. A row that works with ten documents can break with a thousand."
        ]
      }
    }
  },
  {
    "slug": "vinylmapper",
    "coverAlt": "Preview of the redesigned VinylMapper app screens",
    "title": "VinylMapper",
    "category": "UI/UX Design",
    "section": "product",
    "year": "2025–2026",
    "client": "Startup client",
    "role": "UX/UI Designer",
    "tools": [
      "Figma"
    ],
    "card": {
      "role": "UX/UI designer",
      "type": "Social app for record collectors",
      "result": "Navigation rebuilt from audience research"
    },
    "excerpt": "A social app for record collectors, with its navigation rebuilt from audience research.",
    "showcase": "assets/images/vinylmapper_case_cover.png?v=3",
    "cover": "assets/images/vinylmapper-header.jpg?v=3",
    "gallery": [],
    "caseStudy": {
      "outcome": "Turning feedback from five audience groups into a clearer, more useful VinylMapper.",
      "summary": {
        "problem": "VinylMapper is a startup’s social app where record collectors find stores, follow them, review them and share what they find. The team handed it to me already “designed”, but it was incomplete and poorly built: no flows, no style and no coherence between screens, an improvised design with no research behind it. I interviewed five audience groups, built the flows and a new system from that research, and rebuilt the app around it.",
        "role": "UX/UI designer",
        "scope": "Research, flows, navigation, design system and interface · 2025–2026",
        "team": "Startup client",
        "duration": "2025–2026",
        "result": {
          "value": "5 groups",
          "label": "interviewed on the original prototype, then the app was rebuilt around what they said"
        }
      },
      "problem": {
        "heading": "A “finished” design with no flows, no style and no research",
        "text": [
          "VinylMapper is a startup’s app for record collectors: they find stores on a map, follow them, review them, check in and share what they find, and store owners claim and manage their listing.",
          "The team handed it to me already “designed”, but it was incomplete and poorly built: no flows, no style and no coherence between screens. It reflected what the owner wanted rather than what worked, with no research or testing behind it, and a navigation that had grown screen by screen: five equal tabs, three icon-only tab sets and a More menu with eleven tiles.",
          "I started with research: I interviewed five audience groups on the original prototype, veteran store owners, newer store owners, crate diggers, traveling collectors and release chasers. Only one of the five groups would have used it as it was. The others said Maybe or No, for reasons that pointed to the same few problems.",
          "The goal became to act on those problems in order of impact: pick a front door, use the data the app already collects, give owners a reason to stay, earn their trust and stop making people learn the app by tapping."
        ],
        "image": {
          "src": "assets/images/vm-map-before.jpg",
          "caption": "The navigation of the original app, mapped."
        }
      },
      "role": {
        "text": "The startup handed me an app that was already “designed” but incomplete. I ran the research, built the flows and the new system, and redesigned the product around what the research showed, from the navigation to the owner tools.",
        "scope": [
          {
            "label": "Group research",
            "text": "Five audience groups, covering owners and collectors, each taking the original prototype for a walkthrough."
          },
          {
            "label": "Findings and priorities",
            "text": "Seven findings, each traced to the group that raised it and ranked from P0 to P2."
          },
          {
            "label": "Navigation",
            "text": "A new bar with the map first and Create within reach of every screen."
          },
          {
            "label": "Trust and wording",
            "text": "Ownership disclosure, verified reviews, neutral claim copy and a vocabulary that speaks vinyl."
          },
          {
            "label": "Find, owners and records",
            "text": "Filters, owner tools, wantlist matching and releases, around 40 screens of changes in total."
          },
          {
            "label": "Validation plan",
            "text": "A usability test across the five groups, owner interviews and a first-click test, planned before building."
          }
        ]
      },
      "decisions": {
        "heading": "Three changes, each traced to what the groups said",
        "items": [
          {
            "title": "Make the map the front door, and keep Create one tap away",
            "why": "Collector groups came for Find and owner groups came to post. Meanwhile the most useful content, guides, collectables and claiming a store, sat in More. The bar is now Map, Feed, Create, Messages and Profile: the map opens after login, Create works from any screen, city guides appear on the map for whatever city you browse, and More is gone, replaced by Settings behind the profile gear.",
            "chosen": "b",
            "a": {
              "label": "Social Home as the front door",
              "note": "Discovery was one tab among five."
            },
            "b": {
              "label": "Map first, Create everywhere",
              "note": "The front door matches why people download the app.",
              "image": "assets/images/vk-decision1.jpg"
            }
          },
          {
            "title": "Turn the data we already collect into filters",
            "why": "Stores already fill in genres, formats, buy, sell or trade and a used-to-new mix, but Find only offered a name and a distance. Crate diggers’ first reaction was that every store on the map was rated 5.0, which told them nothing about which shop was worth the drive. Find now filters by open now, genre, format, buy-sell-trade and used or new, sorts by distance, rating, Selection or Price, and shows every rating with its review count, so 5.0 (2) reads honestly.",
            "chosen": "b",
            "a": {
              "label": "A name search and a distance",
              "note": "Collected data that nobody could use."
            },
            "b": {
              "label": "Filters, sort and honest cards",
              "note": "Search by what collectors actually look for.",
              "image": "assets/images/vk-decision2.jpg"
            }
          },
          {
            "title": "Give owners control, proof and trust",
            "why": "The veteran owners could not reply to a review, saw no numbers on what the app did for the shop and could not even find Store Manager, hidden behind a small icon in the top bar. They also read a prefilled unclaimed page with a “spread the word” banner as Yelp’s playbook, and wanted to know who owns the platform that ranks the shop. Owners now switch stores from the top of Profile, see views, followers, direction and call taps and check-ins, and reply publicly to reviews. The claim screen says who runs the app and links to how ratings work, and only visitors who checked in can review.",
            "chosen": "b",
            "a": {
              "label": "Edit Store and Store Profile",
              "note": "Nothing to show it was working, or who was behind it."
            },
            "b": {
              "label": "A switcher, insights, replies and disclosure",
              "note": "Control, proof and trust for the people who feed the app.",
              "image": "assets/images/vk-decision3.jpg"
            }
          }
        ]
      },
      "solution": {
        "heading": "From verdicts to a ranked set of changes",
        "items": [
          {
            "caption": "1. Five audience groups, one list of findings",
            "text": "I researched five audience groups: veteran store owners, newer store owners with a bar, crate diggers and DJs, collectors who travel, and release chasers with a collection on Discogs. Each group walked through the original prototype and gave a verdict. Seven findings came out of it, from having no main job to small details like mixed units. I ranked them from P0 to P2, and every change in the redesign points back to one of them.",
            "images": [
              {
                "src": "assets/images/vk-panel.jpg?v=5"
              },
              {
                "src": "assets/images/vk-findings.jpg?v=3"
              }
            ]
          },
          {
            "caption": "2. What changed, by priority",
            "text": "P0 puts the map first with Create on every screen, labels every tab, explains Coins, renames “Repress” to Share and adds the ownership and ratings disclosure. P1 adds filters and honest cards to Find, a switcher, insights, a team and events for owners, and reviews that need a real visit. P2 adds wantlist matches, record search and releases from Discogs, one Follow model, group chats of up to 12 and a first run for collectors and owners.",
            "images": [
              {
                "src": "assets/images/vk-s-nav.jpg"
              },
              {
                "src": "assets/images/vk-s-trust.jpg?v=2"
              },
              {
                "src": "assets/images/vk-s-profile.jpg?v=2"
              },
              {
                "src": "assets/images/vk-s-find.jpg"
              },
              {
                "src": "assets/images/vk-s-owner.jpg?v=2"
              },
              {
                "src": "assets/images/vk-s-reviews.jpg"
              },
              {
                "src": "assets/images/vk-s-records.jpg"
              },
              {
                "src": "assets/images/vk-s-social.jpg"
              },
              {
                "src": "assets/images/vk-s-first.jpg"
              }
            ]
          },
          {
            "caption": "3. Accessibility check",
            "text": "I measured more than a dozen text and control pairs on the redesigned screens. All clear the WCAG AA minimum of 4.5:1: secondary text on white measures 5.4:1 to 9.5:1, dark labels on the yellow chips about 7:1, and white on the red Create button 4.7:1, the lowest. Replacing rows of icon-only tabs with labelled ones also removed a barrier for anyone who can’t decode icons.",
            "images": []
          },
          {
            "caption": "4. Validate before building",
            "text": "The redesign is a set of bets, and I wrote down how to check them. A usability test across the five groups, covering owners, diggers or release chasers and travelers, on tasks like finding an open used-soul shop within 10 miles, claiming a store and posting an event. Owner interviews before any owner tool is built, asking what proof would make them post weekly. And a first-click test comparing a Map-first with a Feed-first landing, to ship the order that wins on discovery tasks.",
            "images": [
              {
                "src": "assets/images/vk-validation.jpg?v=4"
              }
            ]
          }
        ]
      },
      "results": {
        "heading": "From an untested handoff to a redesign the research supports",
        "items": [
          {
            "value": "1 of 5",
            "label": "groups said they would use the original app as it was. The other four said Maybe or No."
          },
          {
            "value": "Traceable",
            "label": "Every change in the redesign points back to a ranked finding, and every finding to the group that raised it."
          },
          {
            "value": "Not yet tested",
            "label": "There is no usage data yet. A usability test, owner interviews and a first-click test are planned to check whether the changes work."
          }
        ],
        "note": "The baseline is the app as it was handed over: no flows, no style and no research. Each of the five groups was explored through a small qualitative sample, so the verdicts and findings are directional until the validation plan is run."
      },
      "learnings": {
        "heading": "Pick a front door, then earn the rest",
        "items": [
          "An app that tries to be a map, a network, a collection viewer and a magazine ends up convincing no one. Choosing the map as the front door made every other decision easier.",
          "The cheapest high-value fix was already in the data. Genres, formats and buy-sell-trade were collected and never used.",
          "Owners judge a platform on control and proof. Replies, numbers and a clear answer to who owns the app mattered more to them than any visual change.",
          "In a niche, vocabulary is part of the interface. A word like “repress” already means something to collectors."
        ]
      }
    }
  },
  {
    slug: "mibici",
    coverAlt: "Preview of the redesigned MiBici app screens",
    title: "MiBici",
    category: "UI/UX Design",
    section: "product",
    year: "2025",
    client: "Personal project",
    role: "UX/UI Designer",
    tools: [
      "Figma"
    ],
    card: { role: "UX/UI designer", type: "Bike-share app redesign", result: "A personal project, from research to a high-fidelity prototype" },
    excerpt: "A bike-share app redesign, a personal project from research to a high-fidelity prototype.",
    showcase: "assets/images/mibici_case_cover.png",
    previewVideo: "assets/videos/Thumb_mibici.mp4?v=2", // looping muted preview shown in the home card instead of the image
    cover: "assets/images/mibici-header.jpg",
    gallery: [],
    caseStudy: {
      outcome: "Redesigning MiBici so renting a bike feels simple and reliable.",
      summary: {
        problem: "MiBici is Guadalajara’s public bike system, and it works well on the street. The app does not. Unreliable payments, confusing navigation and scattered information make a simple ride feel bumpy and wear down trust in the service. I redesigned it as a personal project, from research to a high-fidelity prototype.",
        role: "UX/UI designer",
        scope: "Research, flows, wireframes and a high-fidelity prototype · June 2025",
        team: "Solo",
        duration: "June 2025",
        result: {
          value: "End to end",
          label: "from research to a high-fidelity prototype"
        }
      },
      problem: {
        heading: "The bikes are easy to use. The app isn’t.",
        text: [
          "When I moved to Guadalajara, MiBici became part of my daily routine: you take a bike at one station, ride across town and leave it at another. It’s practical, affordable and sustainable. In theory, it’s simple.",
          "The app doesn’t keep up with the service. A few failed unlocks, a payment that didn’t go through on the first try and that nagging worry when returning a bike (did it lock, or will I be charged extra?) made me think it could be much friendlier. Interviews and store reviews showed it wasn’t bad luck: payments are unreliable, navigation is confusing and the essential information is scattered.",
          "The goal was a more intuitive, reliable app that streamlines registration and payment, brings the key information together and removes friction from the core tasks, so people trust the service and use it more."
        ],
        image: {
          src: "assets/images/mibici-station.jpg",
          caption: "A MiBici station in Guadalajara."
        }
      },
      role: {
        text: "This was a personal project, so I did every part of it: I used the app in real situations, interviewed riders, mapped the flows and took the design from paper sketches to a clickable high-fidelity prototype in Figma.",
        scope: [
          { label: "Field research", text: "I used the app on a rushed Monday morning, a relaxed Sunday ride and under the midday sun with 15% battery." },
          { label: "Interviews and reviews", text: "30 interviews with frequent and occasional riders, plus more than 20 reviews on the App Store and Google Play." },
          { label: "Personas and user flow", text: "Two personas, and a flow chart of every path from onboarding to returning a bike or changing a plan." },
          { label: "Sketches and wireframes", text: "Paper sketches first, then a fast low-fidelity prototype in Figma to test layout and flow." },
          { label: "High-fidelity design", text: "A cleaner interface with clear iconography and colors that convey security and ease of use." },
          { label: "Prototype and feedback", text: "A clickable prototype that I showed to people who ride MiBici regularly." }
        ]
      },
      decisions: {
        heading: "Put the map first, and reassure people at every step",
        items: [
          {
            title: "Make the map the main screen, with availability you can read at a glance",
            why: "Many people couldn’t tell where to start, and some preferred Google Maps because it was faster. Opening on a live map, with bikes and docks color-coded and shown as large numbers, answers the first question before anyone has to look for it.",
            chosen: "b",
            a: {
              label: "The map as one section among many",
              note: "Leaves the first question unanswered."
            },
            b: {
              label: "A live map as the home screen",
              note: "Availability is visible before any tap.",
              image: "assets/images/mibici-decision1.jpg"
            }
          },
          {
            title: "One floating button to start a trip, straight to the QR scan",
            why: "Many users didn’t understand how to start a trip. A permanent “New trip” button in the center of the navigation opens the scanner directly, so the most common action is always one tap away.",
            chosen: "b",
            a: {
              label: "Start a trip from a menu or a station screen",
              note: "Extra taps for the task people do most."
            },
            b: {
              label: "A floating New trip button",
              note: "Always visible, always the same place.",
              image: "assets/images/mibici-decision2.jpg"
            }
          },
          {
            title: "Say what is happening: the clock, the limit and the charge",
            why: "The anxiety was never about riding. It was about the unknowns: how much time is left, what happens after 30 minutes, whether the bike locked and when the card gets charged. The timer, the limit reminder, the return confirmation and the plan’s charge date answer each one on screen.",
            chosen: "b",
            a: {
              label: "Minimal screens with less text",
              note: "Cleaner, but it leaves people guessing."
            },
            b: {
              label: "Explicit status and reminders",
              note: "Every uncertain moment gets a clear message.",
              image: "assets/images/mibici-decision3.jpg"
            }
          }
        ]
      },
      solution: {
        heading: "A map you can trust and a trip you can follow",
        items: [
          {
            caption: "1. Listening before drawing",
            text: "I used the app in different situations, interviewed 30 riders, frequent and occasional, and read more than 20 App Store and Google Play reviews. The same things kept coming up: the app is slow and unintuitive, it isn’t clear how to start a trip, bike and dock availability is confusing, and some riders open Google Maps instead because it is faster. Behind all of it were a cluttered interface, a poorly functional map, no real-time information and unnecessary steps for common actions. From that I defined two personas: Mariana, who commutes every day and wants speed and clarity, and Roberto, who rides on weekends and needs step-by-step guidance.",
            images: [
              { src: "assets/images/mibici-s-current.jpg" },
              { src: "assets/images/mibici-s-personas.jpg" }
            ]
          },
          {
            caption: "2. Mapping the whole journey",
            text: "Before drawing screens I mapped what a person actually does: sign in or register, find a station on the map, unlock a bike, ride, return it, then take another or finish. Help, account and station search hang off the home map. Seeing it all in one picture made it clear which screens the design needed and which steps could go.",
            stack: true,
            images: [
              { src: "assets/images/mibici-flow.jpg" }
            ]
          },
          {
            caption: "3. From paper to wireframes",
            text: "The sketches explored four ideas: the map as the main screen, clear availability with colors and large numbers, a simpler rental and return flow with confirmation screens, and trip information together with account status. I moved them into rough wireframes in Figma, kept deliberately plain, to check the overall experience quickly.",
            images: [
              { src: "assets/images/mibici-s-sketches.jpg" },
              { src: "assets/images/mibici-s-wireframes.jpg" }
            ]
          },
          {
            caption: "4. Finding and unlocking a bike",
            text: "The high-fidelity design keeps the same structure with a cleaner look, clear iconography and colors that convey security and ease of use. Signing in is a short form with a clear way to register instead. The map is the home screen, and every station shows its bikes and free docks with color codes and big numbers. Tapping a station gives the distance and starts navigation. The New trip button sits in the middle of the bar and opens the QR scanner, with an Unlock button and Help one tap away.",
            images: [
              { src: "assets/images/mibici-s-find.jpg" }
            ]
          },
          {
            caption: "5. Riding, returning and paying",
            text: "During the ride a countdown and a progress bar show the time left, with a plain reminder that trips are limited to 30 minutes and that returning the bike to any station avoids extra charges. The ride ends with an explicit “I’ve returned the bike” step. The account section shows the plan, the date and amount of the next charge and the card used, with a clear way to change the plan or cancel it, while history and balance stay one tap away.",
            images: [
              { src: "assets/images/mibici-s-ride.jpg" }
            ]
          },
          {
            caption: "6. Accessibility check",
            text: "MiBici is a public service, and people use it outdoors, in daylight, on the move. I measured contrast on the final screens, and this is where the design falls short: white labels on the green buttons measure 2.5:1 and on the yellow buttons 1.5:1, well under the WCAG AA minimum of 4.5:1. Secondary text passes at 4.7:1. The fix is a darker green, about #388636 for white text (4.5:1), and dark labels on the yellow (about 11:1).",
            images: []
          }
        ]
      },
      results: {
        heading: "Regular riders saw a clearer app",
        items: [
          {
            value: "A clearer flow",
            label: "People who ride MiBici regularly noticed the improvement in how the app moves from finding a bike to returning it."
          },
          {
            value: "A better design",
            label: "They noticed the improvement in the overall design as well."
          },
          {
            value: "The right direction",
            label: "Their feedback confirmed that simplifying the core tasks was the right call."
          }
        ],
        note: "The 30 interviews were research before designing. After the prototype I only collected informal feedback from acquaintances who ride MiBici regularly, and I did not run a structured usability test. This is a concept project, so there are no usage metrics."
      },
      learnings: {
        heading: "Small reassurances matter as much as big features",
        items: [
          "The interviews shaped the design, but I never tested it. I\u2019d run a usability test with five riders on unlocking and returning a bike before calling it done.",
          "Even a small change, like a clear confirmation message, lowers anxiety and builds trust in the service.",
          "Registration and payment come first. If people can’t join easily, they won’t use the system at all.",
          "Visual polish makes an app pleasant, but design proves its value in the moments when people feel stuck, unsure or anxious."
        ]
      }
    }
  }
];

const PROJECT_SECTIONS = [
  { id: "product", title: "Some of my Work...", subtitle: "Product, UI & UX design" }
];
