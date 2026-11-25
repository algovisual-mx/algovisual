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
    tags: ["B2B SaaS", "In daily use", "Permissions & IA"],
    cropVideo: true, // trims the corner watermark of the exported preview video
    coverAlt: "Preview of the Visicart interface",
    title: "Visicart",
    category: "Product Design",
    section: "product",
    year: "2026",
    client: "Captivate · internal tool, now a product",
    role: "Product & Design Lead",
    tools: [
      "Figma"
    ],
    card: { role: "Product & design lead", type: "AI tool for Shopify stores", result: "Cut product copywriting from minutes to a single click" },
    excerpt: "An AI tool for Shopify stores that turns writing a collection description into one click.",
    showcase: "assets/images/visicart_case_cover.png?v=2",
    previewVideo: "assets/videos/Thumb_visi.mp4?v=3", // looping muted preview shown in the home card instead of the image
    cover: "assets/images/visicart-cover.jpg?v=1",
    gallery: [],
    caseStudy: {
      outcome: "One click for a single person was easy. Then we scaled it.",
      summary: {
        decision: "Three roles, not two: an owner who controls access, an admin who can run almost everything and an editor who does the day-to-day work, inside organizations that contain stores.",
        outcome: "9 of 10 testers switched stores without trouble. The product is in use by an SEO team, and 80% of its generated descriptions are approved without editing.",
        problem: "Visicart writes SEO titles and meta descriptions for Shopify collections with one click. It began as an internal tool at Captivate, a search marketing agency, and is now being built as a commercial product for e-commerce teams and Shopify-focused agencies. The hard part was deciding who gets access to what.",
        role: "Product & design lead",
        scope: "The whole product, end to end \u00b7 8 months \u00b7 with the agency owner and two developers",
        team: "Product & design lead, with 2 developers and the agency owner",
        status: "A working product, not a prototype, used by an SEO team at Captivate. Its launch as a product is next.",
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
        text: "I led product and design. I designed the whole product end to end, every screen, flow and state in this case, while the two developers built it and the agency owner was the stakeholder. Where the team weighed two roles against three, the research with the SEO team settled it. I designed it in parallel with Page Plucker.",
        scope: [
          { label: "Team research", text: "Talked with the SEO team about how they work before drawing the first screen." },
                  { label: "Sign-up and login", text: "Email and code sign-up, login with a password or a code, and Google sign-in." },
          { label: "Organization setup", text: "A guided start: name the organization, connect a Shopify store and invite the team." },
          { label: "AI connection", text: "Bring your own AI provider: choose it, add the API key, verify it and switch later." },
          { label: "Dashboard and collections", text: "Store stats, the collections table with status filters, and bulk actions with progress states." },
          { label: "Review panel", text: "Keywords, tone and length, the generated text and a Google preview, ending in reject, approve or publish." },
          { label: "Teams and settings", text: "Roles, per-store access, invites, brand voice, organization settings and notifications." },
          { label: "Wireframe reviews", text: "Walkthroughs with the team who use the tool, which moved store navigation from the sidebar to the top bar." }
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
            why: "With several stores and organizations, the worst mistake is generating or approving in the wrong one. When I showed the team wireframes with the store navigation in the sidebar, they got confused. With it in the top bar, they understood it better.",
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
          },
          {
            title: "Three roles, not two",
            why: "I talked with the SEO team before drawing anything. Their work fell into three jobs: the day-to-day work, running almost everything, and deciding who has access to what. So the roles are three: an owner, who controls access to every organization, store and person; an admin, who can run almost everything; and an editor, the operational role, who does the daily work. A two-level model would have squeezed two of those jobs into one role. A person's role is set store by store.",
            chosen: "b",
            a: {
              label: "Two levels",
              note: "Simpler to explain, but two of the three jobs would share one role."
            },
            b: {
              label: "Owner, admin and editor",
              note: "Each job gets its own level of access."
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
              { src: "assets/images/visicart-flow-generate-3.jpg?v=2" }
            ]
          },
          {
            caption: "6. Teams, roles and access",
            text: "An owner sets up the organization, adds stores and invites people with a role. There are three roles: the owner controls access to every organization, store and person; the admin can run almost everything; the editor does the day-to-day work. One view shows everyone with access and their role in each store. Editing a person, assigning stores and removing or deleting users and stores each have their own panel and confirmation.",
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
            caption: "8. Contrast check",
            text: "I measured text contrast on the review panel, the screen where people spend the most time. Titles, labels and body text measure 5.4:1 to 20:1, above the WCAG AA minimum of 4.5:1. Two things fall short: placeholder text in inputs measures 3.0:1, and the disabled Reject, Approve and Publish buttons measure 2.0:1. WCAG exempts disabled controls, but they are hard to read. Next, I\u2019d darken the placeholder to pass.",
            images: []
          }
        ]
      },
      results: {
        "heading": "Descriptions in seconds, and stores that are easy to switch",
        "goal": "a person could switch between stores easily and write a description in seconds.",
        "items": [
          {
            "value": "9 of 10",
            "label": "e-commerce team members switched between stores without trouble when testing the prototype (task: switch to another store)."
          },
          {
            "value": "80%",
            "label": "of the generated descriptions are approved without editing."
          },
          {
            "value": "1,500+",
            "label": "collections analyzed and written for, across more than 20 e-commerce stores."
          },
          {
            "value": "1 click",
            "label": "to write an SEO title and meta description for a collection, instead of 3 to 5 minutes writing each one by hand."
          }
        ],
        "note": "The time saved is an estimate based on the manual time per description."
      },
      learnings: {
        heading: "Decide who sees what before designing any screen",
        items: [
          "I'd map access with the stakeholder before the first screen, because that structure shaped every page after it.",
          "Showing wireframes to the team caught a real problem: they got lost with store navigation in the sidebar, so it moved to the top bar. I'd start those reviews earlier, with the access view, because that's where confusion shows up first."
        ]
      }
    }
  },
  {
    slug: "page-plucker",
    tags: ["B2B SaaS", "In daily use", "IA & design system"],
    coverAlt: "Preview of the Page Plucker interface",
    title: "Page Plucker",
    category: "Product Design",
    section: "product",
    year: "2026",
    client: "Captivate · internal tool, now a product",
    role: "Product & Design Lead",
    tools: [
      "Figma"
    ],
    card: { role: "Product & design lead", type: "Content-extraction tool for SEO teams", result: "Replacing manual scraping with a workflow an SEO team actually uses" },
    excerpt: "A content-extraction tool that spares SEO teams the copy and paste of pulling a whole site into documents.",
    showcase: "assets/images/pageplucker_case_cover.png",
    previewVideo: "assets/videos/Thumb_pageplucker.mp4", // looping muted preview shown in the home card instead of the image
    cover: "assets/images/pageplucker-header.jpeg",
    gallery: [],
    caseStudy: {
      outcome: "Hundreds of pages, extracted and organized without copy and paste.",
      summary: {
        decision: "Design what comes out before how it goes in: project, folder and page everywhere, so hundreds of documents stay findable.",
        outcome: "Used every day by an SEO team, with 1,200+ documents extracted a day. A link that took about 12 minutes by hand (an estimate, never timed) now takes one click, about 90 seconds.",
        problem: "Page Plucker extracts the pages of a website into cloud documents, text files, PDFs and image folders. It began as an internal tool at Captivate, a search marketing agency, and is now being built as a commercial product for SEO, content-generation and content-analysis teams and agencies that work with large, complex sites. The real design challenge was not the extraction, it was how to organize and show everything that comes out.",
        role: "Product & design lead",
        scope: "Workflows, design system and the full product · 6 months · with the agency owner and two developers",
        team: "Product & design lead, with 2 developers and the agency owner",
        status: "A working product used every day by an SEO team at Captivate. Its commercial launch is in progress.",
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
        text: "I led product and design. I defined the workflows, built the design system and designed every screen, working side by side with the two developers and the agency owner. I designed it in parallel with Visicart.",
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
            caption: "7. Contrast check",
            text: "I measured contrast on the Plucker Tool, the screen people use most. Text on white measures 4.5:1 to 21:1 and sidebar text on the purple 8:1 to 12.7:1, all above the WCAG AA minimum of 4.5:1. Two pairs fall short: the white label on the orange Start Plucking button measures 2.3:1, and the selected Google Doc chip 4.3:1. A dark label on the same orange would measure about 7:1.",
            images: []
          }
        ]
      },
      results: {
        "heading": "From 12 minutes to one click, in daily use by an SEO team",
        "goal": "replacing the manual copy and paste with one click that anyone on the team could use.",
        "items": [
          {
            "value": "10 of 10",
            "label": "of the 10 people who tested it knew how to use it."
          },
          {
            "value": "12 → 1.5 min",
            "label": "per link: 12 minutes extracting the elements by hand, about 90 seconds with one click in Page Plucker."
          },
          {
            "value": "1,200+",
            "label": "documents extracted per day, from more than 100 links."
          },
          {
            "value": "~17 h / day",
            "label": "of manual work saved across the team, estimated from 100 links a day at about 10.5 minutes saved each."
          }
        ],
        "note": "No comparable tool existed, so the baseline is the manual process. The manual time is a team average that was not timed, and the hours saved are calculated from it."
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
    "tags": ["Mobile app", "Research-led", "Redesign launching"],
    "coverAlt": "Preview of the redesigned VinylMapper app screens",
    "title": "VinylMapper",
    "category": "Product Design",
    "section": "product",
    "year": "2025–2026",
    "client": "Startup client",
    "role": "Product designer",
    "tools": [
      "Figma"
    ],
    "card": {
      "role": "Product designer",
      "type": "Social app for record collectors",
      "result": "Turning research insights into frictionless discovery for record collectors"
    },
    "excerpt": "A social app for record collectors, with its navigation rebuilt from audience research.",
    "previewVideo": "assets/videos/Thumb_vinylmapper.mp4",
    "showcase": "assets/images/vinylmapper_case_cover.png?v=3",
    "cover": "assets/images/vinylmapper-header.jpg?v=3",
    "gallery": [],
    "caseStudy": {
      "outcome": "Turning feedback from five audience groups into a clearer, more useful VinylMapper.",
      "summary": {
        "decision": "Make the map the front door and keep Create one tap away: finding stores is the one main thing, everything else is secondary.",
        "outcome": "8 of 10 interviewees could not find the map or the blogs menu in the original app. All 10 did in the redesigned prototype (directional). The redesign launches next.",
        "problem": "VinylMapper is a startup’s social app where record collectors find stores, follow them, review them and share what they find. The team handed it to me as a first build, made quickly before any research: it had no flows, no shared style and little coherence between screens. I ran 10 interviews across five audience groups, built the flows and a new system from that research, and rebuilt the app around it.",
        "role": "Product designer",
        "scope": "Research, flows, navigation, design system and interface · 2025–2026",
        "team": "Product designer, with 1 developer",
        "status": "A real app, live today. The redesign I led is about to launch.",
        "duration": "2025–2026",
        "result": {
          "value": "10 interviews",
          "label": "across 5 audience groups on the original prototype, then the app was rebuilt around what they said"
        }
      },
      "problem": {
        "heading": "A first build with no flows, no style and no research",
        "text": [
          "VinylMapper is a startup’s app for record collectors: they find stores on a map, follow them, review them, check in and share what they find, and store owners claim and manage their listing.",
          "The team handed it to me as a first build, made quickly before any research: it had no flows, no shared style and little coherence between screens. It had not been tested with users, and its navigation had grown screen by screen: five equal tabs, three icon-only tab sets and a More menu with eleven tiles.",
          "I started with research: 10 interviews across five audience groups on the original prototype, veteran store owners, newer store owners, crate diggers, traveling collectors and release chasers. Only one of the five groups would have used it as it was. The others said Maybe or No, for reasons that pointed to the same few problems.",
          "The goal became to act on those problems in order of impact: pick a front door, use the data the app already collects, give owners a reason to stay, earn their trust and stop making people learn the app by tapping."
        ],
        "image": {
          "src": "assets/images/vm-map-before.jpg",
          "caption": "The navigation of the original app, mapped."
        }
      },
      "role": {
        "text": "The startup handed me an early build of the app. I ran the research, built the flows and the new system, and redesigned the product around what the research showed, from the navigation to the owner tools. VinylMapper is its own startup and the app’s owner made the product decisions, so my job was to bring the research to those decisions, working with one developer. It ran alongside Visicart and Page Plucker.",
        "scope": [
          {
            "label": "Group research",
            "text": "10 interviews across five audience groups, owners and collectors, each walking through the original prototype."
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
            "caption": "1. Before and after",
            "text": "In the original app the home screen was a feed, the map sat behind the second tab, and City Guides and Vinyl Buzz were inside More. In the sessions, 8 of 10 people could not find the map or the blogs menu. The redesign opens on the map, keeps Create one tap away from every screen and shows the city guide on the map itself.",
            "stack": true,
            "images": [
              {
                "src": "assets/images/vk-before-after.jpg",
                "alt": "Before and after. The original app has a feed home, a map behind the Find tab and guides inside the More menu. The redesign opens on the map and shows the city guide on it."
              }
            ]
          },
          {
            "caption": "2. Five audience groups, one list of findings",
            "text": "I ran 10 interviews across five audience groups: veteran store owners, newer store owners with a bar, crate diggers and DJs, collectors who travel, and release chasers with a collection on Discogs. Each group walked through the original prototype and gave a verdict. Seven findings came out of it, from having no main job to small details like mixed units. I ranked them from P0 to P2, and every change in the redesign points back to one of them.",
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
            "caption": "3. What changed, by priority",
            "text": "P0 puts the map first with Create on every screen, labels every tab, explains Coins, renames “Repress” to Share and adds the ownership and ratings disclosure. P1 adds filters and honest cards to Find, a switcher, insights, a team and events for owners, and reviews that need a real visit. P2 adds wantlist matches, record search and releases from Discogs, one Follow model, group chats of up to 12 and a first run for collectors and owners.",
            "visible": 1,
            "moreLabel": "P1 and P2 changes",
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
            "caption": "4. Contrast check",
            "text": "I measured more than a dozen text and control pairs on the redesigned screens. All clear the WCAG AA minimum of 4.5:1: secondary text on white measures 5.4:1 to 9.5:1, dark labels on the yellow chips about 7:1, and white on the red Create button 4.7:1, the lowest. Replacing rows of icon-only tabs with labelled ones also removed a barrier for anyone who can’t decode icons.",
            "images": []
          }
        ]
      },
      "results": {
        "heading": "8 of 10 people could not find the map or the blogs menu in the original app",
        "goal": "people could find stores and interact with them.",
        "items": [
          {
            "value": "8 of 10",
            "label": "people could not find the map or the blogs menu in the original app."
          },
          {
            "value": "~40 screens",
            "label": "of changes, each traced to a ranked finding and to the group that raised it."
          },
          {
            "value": "10 interviews",
            "label": "two people from each of five audience groups, on a prototype."
          },
          {
            "value": "10 of 10",
            "label": "found their way in the redesigned prototype. The same people took part in both rounds, so treat this as directional."
          }
        ],
        "note": "The baseline is the app as it was handed over, a quick first build with a structure that did not work. The sessions are a small qualitative sample, so the findings are directional."
      },
      "learnings": {
        "heading": "Pick a front door, then earn the rest",
        "items": [
          "An app that tries to be a map, a network, a collection viewer and a magazine ends up convincing no one. Finding stores had to be the one main thing, and everything else secondary. Choosing the map as the front door made every other decision easier.",
          "We assumed the More menu and the blogs did not matter. In the sessions they turned out to hold information people needed, so they stayed and got clearer labels.",
          "People look for specific records as well as for stores, so search had to find the records a store has.",
          "The cheapest high-value fix was already in the data. Genres, formats and buy-sell-trade were collected and never used.",
          "Owners judge a platform on control and proof. Replies, numbers and a clear answer to who owns the app mattered more to them than any visual change.",
          "In a niche, vocabulary is part of the interface. A word like “repress” already means something to collectors."
        ]
      }
    }
  },
  {
    "slug": "mibici",
    "tags": ["Mobile app", "Research-led", "Proposal"],
    "title": "MiBici",
    "category": "Product Design",
    "section": "product",
    "year": "2025–2026",
    "client": "GDL en Bici · social proposal",
    "role": "Sole designer",
    "tools": [
      "Figma"
    ],
    "coverAlt": "Preview of the redesigned MiBici app screens",
    "card": {
      "role": "Sole designer",
      "type": "Reform proposal for the MiBici app",
      "result": "Redesigning a station to station bike share app around real user needs"
    },
    "excerpt": "A reform proposal for the official MiBici app, made for the GDL en Bici collective: research, a redesign and 19 screens.",
    "previewVideo": "assets/videos/Thumb_mibici.mp4?v=2",
    "showcase": "assets/images/mibici_case_cover.png?v=4",
    "cover": "assets/images/mibici-header.jpg?v=4",
    "gallery": [],
    "caseStudy": {
      "outcome": "A reform proposal that makes renting a MiBici simple, clear and trustworthy.",
      "summary": {
        "decision": "Show prices and payment before the first ride, let the dock confirm the return, and explain every uncertain moment while riding.",
        "outcome": "30 riders tested the prototype and 80% preferred it to the current app. It was presented but not adopted in the official app.",
        "problem": "GDL en Bici, a Guadalajara cycling collective, asked me to research, redesign and present a reform proposal for the official MiBici app, as a social proposal to improve the experience of the people who use it. I studied the app, redesigned it and interviewed 30 riders about the first version. Their objections shaped a second version of 19 screens.",
        "role": "Sole designer",
        "scope": "Research, redesign, 30 rider interviews and 19 screens · 2025–2026",
        "team": "Sole designer, for GDL en Bici",
        "status": "Tested with 30 riders on a prototype and presented, but not adopted in the official app.",
        "duration": "2025–2026",
        "result": {
          "value": "19 screens",
          "label": "in the second version, built from the objections of 30 riders interviewed"
        }
      },
      "problem": {
        "heading": "The bikes work. The app makes people doubt the service.",
        "text": [
          "MiBici is Guadalajara’s public bike system: you take a bike at one station, ride across town and leave it at another. It is practical, affordable and sustainable. The app is where it breaks. A failed unlock, a payment that doesn’t go through and that nagging worry when returning a bike (did it lock, or will I be charged extra?) wear down trust in the service.",
          "GDL en Bici, a cycling collective in Guadalajara, asked me to research the app, redesign it and present a reform proposal for the official app. It is a social proposal to improve the experience of the people who use it.",
          "I started from my own use of the app and more than 20 store reviews, then designed a first version. To check it, I interviewed 30 riders of different ages, jobs and needs and walked each of them through it. The result: 5 would use the app, 15 maybe and 10 would not. They liked the look. Prices, payment and the return step made them distrust it.",
          "The goal of the second version was to fix what made them doubt, in order of severity."
        ],
        "image": {
          "src": "assets/images/mibici-station.jpg",
          "caption": "A MiBici station in Guadalajara."
        }
      },
      "role": {
        "text": "I did every part of it: I used the app in real situations, read its reviews, designed a first version, interviewed 30 riders, ranked what it found and designed the second version in Figma. I was the only designer, and evidence from riders, not opinion, decided what changed.",
        "scope": [
          {
            "label": "Field research",
            "text": "I used the app on a rushed Monday morning, a relaxed Sunday ride and under the midday sun with 15% battery."
          },
          {
            "label": "Store reviews",
            "text": "More than 20 reviews on the App Store and Google Play."
          },
          {
            "label": "First redesign",
            "text": "A live map as the home screen, a floating New trip button and explicit timer and return screens."
          },
          {
            "label": "Rider interviews",
            "text": "30 riders walked through every screen and gave a verdict."
          },
          {
            "label": "Findings",
            "text": "Eight blind spots, ranked from most to least severe."
          },
          {
            "label": "Second version",
            "text": "19 screens, from sign-up and payment to receipts, reports and help."
          }
        ]
      },
      "decisions": {
        "heading": "Make money and trust clear before, during and after the ride",
        "items": [
          {
            "title": "Show the prices and the payment before the first ride",
            "why": "Three users caught prices that contradicted each other across screens, and three more could not find where to pay before the first unlock. The second version has consistent prices with a cost per day, a payment step inside sign-up that accepts cards, Apple Pay and cash at OXXO, and a published charge for going over 30 minutes.",
            "chosen": "b",
            "a": {
              "label": "Sign-up straight to the map",
              "note": "No plan or card was asked before the first unlock."
            },
            "b": {
              "label": "Plan and payment inside sign-up",
              "note": "Consistent prices, a cost per day and cash as an option.",
              "image": "assets/images/mibici-v2-decision1.jpg"
            }
          },
          {
            "title": "Let the dock confirm the return, not a button",
            "why": "The first version had a Return bike button, but a bike is returned by docking it. Two users asked what the button did and whether they would be charged if it wasn’t docked, and three missed a history or a receipt to dispute a charge. Now the dock confirms the return with the bike number, station and time, the ride ends in a receipt, and reporting a problem is one tap away, including a dock that didn’t register the bike.",
            "chosen": "b",
            "a": {
              "label": "A Return bike button",
              "note": "It was unclear which action ended the trip."
            },
            "b": {
              "label": "The dock confirms, with a receipt and a way to report",
              "note": "Proof for every ride, and a way out when it fails.",
              "image": "assets/images/mibici-v2-decision2.jpg"
            }
          },
          {
            "title": "Explain every uncertain moment while riding",
            "why": "The anxiety was never about riding. Users didn’t know what going over 30 minutes costs, got no warning before the limit and found no help to find a free dock or to understand what Emergency does. The ride screen now shows elapsed time with a friendlier tone, a push notification at 25 minutes, the nearest station with free docks, and an Emergency button that says it calls 911 and shares the location.",
            "chosen": "b",
            "a": {
              "label": "A countdown and a warning",
              "note": "Pressure, without the information."
            },
            "b": {
              "label": "Elapsed time, a warning and next steps",
              "note": "Every unknown gets an answer on screen.",
              "image": "assets/images/mibici-v2-decision3.jpg"
            }
          }
        ]
      },
      "solution": {
        "heading": "From a first redesign to a 19-screen proposal",
        "items": [
          {
            "caption": "1. A first redesign from real use",
            "text": "I used the app in different situations and read more than 20 App Store and Google Play reviews. The same things kept coming up: the app is slow and unintuitive, it isn’t clear how to start a trip, bike and dock availability is confusing, and some riders open Google Maps instead because it is faster. The first version answered with a live map on the home screen, a floating New trip button that opens the scanner, and explicit timer and return screens.",
            "images": [
              {
                "src": "assets/images/mibici-s-current.jpg"
              },
              {
                "src": "assets/images/mibici-s-find.jpg"
              }
            ]
          },
          {
            "caption": "2. Interviewing 30 riders about it",
            "text": "I interviewed 30 riders, among them a student, a retiree, a tourist, a delivery rider, a rider with low vision and a data-protection lawyer. Each walked through every screen and gave a first impression, objections and a verdict: 5 yes, 15 maybe, 10 no. I grouped the objections into eight blind spots and ranked them.",
            "stack": true,
            "images": [
              {
                "src": "assets/images/mibici-v2-panel.jpg?v=2"
              }
            ]
          },
          {
            "caption": "3. Joining and paying",
            "text": "Sign-up now ends with a plan and a payment, not at the map. The welcome screen states the passes and how to pay, with an ES/EN switch. Sign-up accepts a foreign phone number, shows the password requirements and explains why it asks for location and camera. Login gets Google, Apple and Face ID. Plans have consistent prices, their own duration and a cost per day, and publish the extra charge. Payment takes cards, including foreign ones, Apple Pay, Google Pay and cash at OXXO. A short tutorial explains that the dock confirms the return.",
            "images": [
              {
                "src": "assets/images/mibici-v2-join-1.jpg"
              },
              {
                "src": "assets/images/mibici-v2-join-2.jpg"
              }
            ]
          },
          {
            "caption": "4. Finding a bike and unlocking it",
            "text": "The map has a pin legend, bike counts inside the pins and a live indicator. Stations filter by favorites and free docks, say free docks instead of ports and show real data on every card. The station detail adds walking time, a bike route, an hourly trend and a way to hold a bike for 10 minutes. Unlocking scans the bike’s code, not the station’s, so it is clear which bike is released, with a flashlight, manual code entry, vibration on a good scan and a +1 bike option for companions.",
            "stack": true,
            "images": [
              {
                "src": "assets/images/mibici-v2-find.jpg"
              }
            ]
          },
          {
            "caption": "5. Riding, returning and reporting",
            "text": "While riding, the screen shows elapsed time, what the pass includes and the cost of going over, plus the nearest station with free docks and a Take me there button. Report bike, Share trip and Emergency 911 stay visible. A push arrives at minute 25 even with the app closed. The dock confirms the return, and the ride ends in a receipt with duration, route and cost, plus distance, CO₂ saved and a card to share. If something goes wrong, the report screen covers a dock that didn’t take the bike, a damaged bike, free in the first minute, and an overcharge, with a photo as evidence.",
            "stack": true,
            "images": [
              {
                "src": "assets/images/mibici-v2-ride.jpg"
              }
            ]
          },
          {
            "caption": "6. Account and help",
            "text": "The account shows the right plan price and adds My trips, Payment methods, Invoicing, Language and Privacy, with account deletion inside it. My trips lists every ride with its receipt and the status of open reports. Invoicing handles tax data and automatic invoices, with a link to company plans. Help says what Emergency does, offers an optional trusted contact and a FAQ built from the riders’ questions. In the chat, the rider writes first and End chat becomes a secondary action.",
            "images": [
              {
                "src": "assets/images/mibici-v2-account-1.jpg"
              },
              {
                "src": "assets/images/mibici-v2-account-2.jpg"
              }
            ]
          },
          {
            "caption": "7. Contrast check",
            "text": "I measured contrast on the second version. One thing is fixed: the yellow buttons now carry dark text at 10.9:1, where white measured 1.5:1. Three still fall short of the WCAG AA minimum of 4.5:1: white labels on the green buttons (2.5:1), secondary gray text (about 3.8:1) and green text on white (3.9:1). Next, I’d darken the green to about #388636, which gives 4.5:1 with white, and the gray text.",
            "images": []
          }
        ]
      },
      "results": {
        "heading": "From 8 ranked blind spots to a 19-screen redesign riders preferred",
        "goal": "testing with riders and getting better feedback than the current app.",
        "items": [
          {
            "value": "8 blind spots",
            "label": "ranked by severity, with every change in the redesign traced to one of them."
          },
          {
            "value": "19 screens",
            "label": "from sign-up and payment to receipts, reports and help."
          },
          {
            "value": "30 riders",
            "label": "the same riders who gave feedback on the first version used the interactive prototype."
          },
          {
            "value": "80%",
            "label": "of riders preferred the redesign to the current app and found it more usable, with more useful, friendlier information. This is a preference check with the same riders who shaped it, so it is directional."
          }
        ],
        "note": "The same 30 riders saw both rounds. On the first version, 5 said they would use the app, 15 maybe and 10 no. After the redesign, 80% preferred it to the current app. The prices in the prototype are example values, not official fares."
      },
      "learnings": {
        "heading": "Walking riders through a design shows what I can’t see",
        "items": [
          "Money and trust decide whether people use a service. Riders liked the look and still said no because of prices, payment and the return step.",
          "Many findings were mistakes in my own first version, like prices that contradicted each other across screens. Walking riders through the design caught those before anything shipped.",
          "If docking the bike is what ends a ride, the app shouldn’t ask for a button. It should confirm what the dock already did."
        ]
      }
    }
  }
];

const PROJECT_SECTIONS = [
  { id: "product", title: "Selected work", subtitle: "Product, UI & UX design" }
];
