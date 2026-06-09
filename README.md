# SkyMailr — marketing website

The public site for **skymailr.com**. Hand-built static pages (HTML/CSS) served
by a tiny Express app, so it runs as a **Node.js** site on Hostinger (or any
Node host: Railway, Render, Fly, etc.).

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
server.js          Express static server (binds to $PORT)
package.json       start / dev scripts, express dependency
public/            the actual site
  index.html  features.html  pricing.html  docs.html  404.html
  robots.txt  sitemap.xml
  assets/  styles.css  favicon.svg
```

## Deploy on Hostinger (Node.js hosting)

1. Push this repo (done) and connect it, or upload the files.
2. In Hostinger's **Node.js app** setup:
   - **Application root:** this folder.
   - **Startup file:** `server.js`
   - Run **`npm install`**, then start with **`npm start`**.
   - Hostinger provides the port via the `PORT` env var — the server already
     reads it, so no change needed.
3. Point `skymailr.com` at the Node app.

> The app listens on `process.env.PORT` and serves everything in `public/`.
> Clean URLs work (`/features` → `features.html`); unknown paths return
> `404.html`.

## Editing content

Edit the HTML in `public/`. Shared styles live in `public/assets/styles.css`.
No build step — what's in `public/` is what ships.
