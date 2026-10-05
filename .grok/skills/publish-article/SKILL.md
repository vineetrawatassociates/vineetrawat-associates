---
name: publish-article
description: >
  Write a Vineet Rawat & Associates article as a static HTML page, list it on
  the articles page and the homepage, commit it, and push to GitHub main so
  the Render web service redeploys. Use when someone asks to write, draft,
  publish, post, or deploy a blog or article for this website, including
  phrases like "new article", "put this on the site", "blog post", or
  /publish-article.
when-to-use: >
  write a blog, new article, publish an article, post to the website, deploy
  the blog, push an article to GitHub, /publish-article
argument-hint: "topic or draft text"
metadata:
  short-description: "Write an HTML article and publish it"
---

# Publish an article

This site is static HTML served by `server.js`. An article is a file in `articles/`. Pushing `main` to GitHub redeploys the Render web service `vineetrawat-associates` at https://vineetrawat-associates.onrender.com. There is no writing page and no Render API key in this workflow. The service already redeploys on every push to `main`.

If the user only wants a draft, write the files and stop before `git commit`. Publish when they ask to publish, push, or deploy, or when they invoke this skill with a topic and do not say "draft only".

## Write the page

1. Pull `origin/main` before editing so a second writer does not overwrite a newer article.
2. Copy `articles/understanding-statutory-audit-india.html` to `articles/<slug>.html`. If that example is gone, copy the newest file in `articles/`.
3. Change only the title tag, meta description, banner `h1`, banner paragraph, the `post-meta` line, and the paragraphs between `post-meta` and the disclaimer blockquote. Leave the header, footer, script, disclaimer, and "Back to Articles" link as they are. Those match the rest of the site.
4. The slug is the filename without `.html`. Use lowercase English words separated by single hyphens, matching `^[a-z0-9]+(?:-[a-z0-9]+)*$`. `server.js` serves `articles/<slug>.html` at `/blog/<slug>/`. A file that does not match that pattern will not be routed.
5. Escape HTML in titles and descriptions: `&amp;` for `&`, and `&#8377;` for the rupee sign. Do not put raw `<` in text.

Use the date the user gives. Otherwise use today's date.

- In the article: `Published on 5 October 2026 &middot; Category: GST`
- On the articles page, the same date is split as day `5`, month `Oct`, year `2026`. Month abbreviations are Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec. The day has no leading zero.

The category is a short label such as Audit & Assurance, GST, Income Tax, Accounting, or Compliance.

## What the article may say

The firm is Vineet Rawat & Associates, Chartered Accountants, Vikaspuri, New Delhi. Articles explain tax, audit, GST, accounting, or compliance for a business reader. They are information, not a pitch for work. The site footer already states that the site is not meant to solicit work under the ICAI Code of Ethics. Keep the disclaimer blockquote that the template already contains.

Before publishing a section number, threshold, due date, or rate, check a current official source (Income-tax Act, CGST Act, Companies Act, or a government notification). If you cannot confirm a figure, leave it out or say that the threshold should be checked against the current law. Do not invent citations.

Body markup that already has styles: `h2`, `p`, `ul`/`ol` with `li`, `strong`, and `blockquote`. Keep the article long enough to answer the topic, usually a few sections, and stop when the point is made.

## List the article

Insert this block as the first `article.post-item` inside the articles section of `pages/blog.html`, above older posts:

```html
<article class="post-item">
  <div class="post-date">
    <span class="day">5</span>
    <span class="mon">Oct</span>
    <span class="yr">2026</span>
  </div>
  <div>
    <h3><a href="/blog/your-slug/">Article title</a></h3>
    <p class="excerpt">The meta description, one or two sentences.</p>
    <span class="cat">Category</span>
  </div>
</article>
```

On the homepage, the Knowledge Centre grid holds three cards. Replace the first card whose link is only `/blog/` (those are placeholders). If every card is a real article, put the new card first and remove the last card so three remain.

```html
<div class="card">
  <h3>Article title</h3>
  <p>One sentence on what the article covers.</p>
  <p style="margin-top:12px;"><a href="/blog/your-slug/">Read article &rarr;</a></p>
</div>
```

## Check, then push

Start the site with `npm start` if nothing is already listening on port 3000. Confirm these return 200 and contain the new title:

- `http://127.0.0.1:3000/blog/<slug>/`
- `http://127.0.0.1:3000/blog/`
- `http://127.0.0.1:3000/`

Then commit only the new article, `pages/blog.html`, and `pages/index.html`. Do not commit `.env`, API keys, or unrelated files.

```bash
git add articles/<slug>.html pages/blog.html pages/index.html
git commit -m "Publish article: <title>."
git push origin main
```

If the push is rejected, pull with rebase and push again. Do not force-push.

After the push, request `https://vineetrawat-associates.onrender.com/blog/<slug>/` until the new title is there. The free service builds for a minute or two, and a sleeping instance can take about a minute more to wake. Tell the user the live URL when it responds. The dashboard for this service is https://dashboard.render.com/web/srv-db1tih8u01pc73fvlgo0.
