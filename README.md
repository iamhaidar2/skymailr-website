# SkyMailr — marketing website

The public site for **skymailr.com**. Hand-built static pages (HTML/CSS).
Hostinger serves `public/` as plain files; the tiny Express app in `server.js`
is only for previewing the site locally.

Branding: SkyMailr paper-plane logo on a **sky → blue → indigo** palette
(`#38bdf8 → #3b82f6 → #4f46e5`).

## Run locally

```bash
npm install
npm start          # http://localhost:3000
```

`PORT` is read from the environment (defaults to 3000).

## Project layout

```
server.js          Express static server for local preview (binds to $PORT)
package.json       start / dev scripts, express dependency
public/            the actual site
  .htaccess   Hostinger rules: clean URLs, 404 page, headers, caching
  index.html  features.html  pricing.html  docs.html  404.html
  robots.txt  sitemap.xml
  assets/  styles.css  favicon.svg
```

## Deploy (Hostinger, plain files)

skymailr.com is a Hostinger web app connected to this repo with
**Framework: Other**, **Build command: None**, **Output directory: `public`**
and an empty **Entry file**. Every push to `main` publishes `public/` about
15 seconds later. No Node process runs on the server: the hosting plan's
process limit is shared by every site on it, and a running Node app uses
about 11 of its 120.

`public/.htaccess` does on Hostinger what `server.js` does locally: clean URLs
(`/features` serves `features.html`), `404.html` for unknown paths, the
security headers, and cache times (pages, CSS and JS are re-checked on every
visit, so a push shows up straight away).

## Editing content

Edit the HTML in `public/`. Shared styles live in `public/assets/styles.css`.
No build step — what's in `public/` is what ships.
