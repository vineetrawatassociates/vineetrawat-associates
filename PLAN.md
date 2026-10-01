# Plan: plain HTML and a Node server

Replace the Astro site with ordinary HTML, the existing CSS and browser script, and one small Node server. Render runs that server on the free web-service plan. No page copy, visual design, or public URL changes in this move.

This document is the plan only. No application code is part of this step.

## Goal

A person can open the same pages they open today:

- `/` home
- `/about/` and `/about/#team`
- `/services/`
- `/blog/`
- `/blog/understanding-statutory-audit-india/`
- `/contact/`

The server also serves `/css/style.css`, `/js/main.js`, the logo, and the team photos. Render can deploy the repo as a free Node web service and attach `vineetrawatassociates.com` later.

## What the server is responsible for

One Node process, using only the built-in `node:http` and `node:fs` modules. No Astro, no Vite, no template framework, no database, and no extra npm packages.

It does four things:

1. Map each public URL to one HTML file. `/about` and `/about/` both serve the About page.
2. Serve CSS, JavaScript, and images from a public folder.
3. Answer `GET /health` with `200` and a short body so Render’s health check can mark a deploy live.
4. Listen on `0.0.0.0` and `process.env.PORT`. Locally, when `PORT` is unset, use `3000`.

Unknown paths return a small 404 HTML page.

The enquiry form stays in the browser. Submitting it still opens WhatsApp to `+91 82873 72155` with the typed details. Render’s free plan blocks outbound mail on ports 25, 465, and 587, and the site has no mailbox integration today, so the server does not accept form posts.

## Target layout

```
server.js              URL routing and static files
package.json           name, "start": "node server.js", no dependencies
render.yaml            free Node web service
PLAN.md
public/
  css/style.css        current stylesheet, unchanged
  js/main.js           current browser script, unchanged
  images/              logo and team photos, filenames without spaces
  CNAME                kept until DNS moves; see Deploy
pages/
  index.html
  about.html
  services.html
  blog.html
  contact.html
  404.html
articles/
  understanding-statutory-audit-india.html
```

Each HTML file is a complete document: head, header, page body, footer, and the script tag. The header and footer are copied into every page. With six pages plus one article, that is easier to read than a layout engine. A nav or footer edit means updating each file in the same change.

## Pages to carry over

Take the visible markup from the current Astro pages and write it as HTML. Keep the current class names so `style.css` keeps working.

| HTML file | Source today | Notes |
|---|---|---|
| `pages/index.html` | `src/pages/index.astro` | Hero, service carousel, countries, industries, article teasers, help modal |
| `pages/about.html` | `src/pages/about.astro` | Vision, story, philosophy, seven team cards. Team section keeps `id="team"` |
| `pages/services.html` | `src/pages/services.astro` | India carousel and the UAE, Australia, and UK cards |
| `pages/blog.html` | `src/pages/blog/index.astro` | List the one published article by hand |
| `articles/understanding-statutory-audit-india.html` | `src/content/blog/understanding-statutory-audit-india.md` | Same title, date, category, and body. Render the markdown as HTML once |
| `pages/contact.html` | `src/pages/contact.astro` | Email, WhatsApp, map link, office address, hours |

Shared chrome on every page comes from `src/layouts/Base.astro`:

- Title and meta description, specific to that page
- Sticky header, logo, and nav. The current page’s link keeps the `active` class. Contact keeps `nav-cta`
- Footer: firm blurb, quick links, email, WhatsApp, office address
- ICAI disclaimer and the year span with `data-year`
- `<link rel="stylesheet" href="/css/style.css">`
- `<script src="/js/main.js"></script>` as a normal script tag. There is no bundler, so the Astro `is:inline` workaround goes away with Astro

Home article teasers: only “Understanding Statutory Audit in India” links to a real article. The GST and startup-funding cards stay as short blurbs that link to `/blog/`, matching the current page, until those articles exist.

## Assets

Move files out of the `public/` root into `public/images/` and drop spaces from the names. Update every `src` in the HTML.

| Current file | New path |
|---|---|
| `Logo.jpg` | `public/images/logo.jpg` |
| `VINEET RAWAT.jpeg` | `public/images/vineet-rawat.jpeg` |
| `UMESH CHANDER RAWAT.jpeg` | `public/images/umesh-chander-rawat.jpeg` |
| `NISHA RAWAT.jpeg` | `public/images/nisha-rawat.jpeg` |
| `Asha Rawat.jpg` | `public/images/asha-rawat.jpg` |
| `Kamal.jpeg` | `public/images/kamal-tanwar.jpeg` |
| `Pawan.jpeg` | `public/images/pawan-kumar.jpeg` |
| `Jatin Bisht.jpeg` | `public/images/jatin-bisht.jpeg` |

`public/css/style.css` and `public/js/main.js` move with their behavior unchanged: mobile nav, footer year, help modal, WhatsApp link, and carousels.

## Blog going forward

A new article is a new HTML file in `articles/` plus a link on `pages/blog.html` and, if it should be featured, a card on the home page. Pushing to the tracked branch redeploys the site. There is no in-browser editor.

The Decap CMS stub at `public/admin/` is removed. Its Git backend still has `turbo_site_id: YOUR_SITE_ID`, so it cannot save posts.

## Render

One free web service. Official free-plan behavior to design for:

- Custom domains and managed TLS are supported.
- The service spins down after 15 minutes without a request. The next visit waits about a minute on Render’s loading page while it starts. Spun-down time does not use the monthly hour allowance.
- The workspace gets 750 free instance hours per calendar month, shared by every free web service. One service that is only awake when someone visits stays inside that allowance.
- The instance is 0.1 CPU and 512 MB RAM, a single instance, with an ephemeral disk. Anything written to the server’s disk disappears on spin-down or redeploy. This site does not write files at runtime.
- Outbound SMTP ports are blocked. Enquiry delivery stays on WhatsApp from the visitor’s browser.

`render.yaml` describes that one service:

- `type: web`
- `runtime: node`
- `plan: free`
- `buildCommand`: `npm install` (no packages to install; Render still expects a Node app)
- `startCommand`: `npm start`
- `healthCheckPath`: `/health`

No database, Redis, cron job, or disk.

`package.json` keeps the project name and:

```json
"scripts": { "start": "node server.js" }
```

Dependencies list is empty. `astro` and `rehype-raw` are removed.

## Local run

From the repo root, `npm start` serves the site at `http://127.0.0.1:3000/`. Check every URL above, plus `/health`, `/css/style.css`, `/js/main.js`, and one team photo. A missing path returns the 404 page.

## Steps to implement later

1. Add `server.js`, the minimal `package.json`, and `render.yaml`.
2. Write the HTML pages and the one article from the current templates and markdown. Copy class names and visible text as they are.
3. Move CSS, JS, and images. Point image tags at the new filenames.
4. Start the server locally and open every route. Confirm the menu, carousels, help modal, and WhatsApp submit still run.
5. Delete the Astro project once those pages match: `astro.config.mjs`, `tsconfig.json`, `src/`, `public/admin/`, and the old `public/` root files that moved.
6. Leave `public/CNAME` in place until the domain is pointed at Render. It is only a GitHub Pages hint and the Node server will not use it.
7. Deploy from the GitHub repo `vineetrawatassociates/vineetrawat-associates` with the Blueprint. Confirm the `onrender.com` URL before changing DNS.
8. When that URL looks right, add `vineetrawatassociates.com` in the Render dashboard and point DNS at the Render hostname. Remove `public/CNAME` in that same change so the domain has one host.

## Files that leave

- `astro.config.mjs`
- `tsconfig.json`
- `src/layouts/Base.astro`
- `src/pages/**`
- `src/content/**`
- `public/admin/**`
- Astro entries in `package.json`

`node_modules/` stays untracked. After the switch, a fresh install pulls no packages.

## Out of scope

- Redesign, copy edits, or new articles.
- Changing the one-second carousel speed.
- A contact API, email delivery, database, or admin login.
- Keeping Astro, Decap CMS, or a second static-site service beside the Node server.
