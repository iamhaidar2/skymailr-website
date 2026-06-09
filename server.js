/**
 * SkyMailr marketing site — minimal Express static server.
 *
 * Serves everything in ./public. Hostinger's Node.js hosting (and most Node
 * hosts) set the listening port via the PORT env var, so we bind to that.
 *
 *   npm install
 *   npm start        # -> http://localhost:3000  (or $PORT)
 */
const path = require("path");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

// Light security + caching headers (no extra deps).
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// Serve static files; `extensions: ["html"]` lets /features resolve to
// /features.html, and "/" serves index.html.
app.use(
  express.static(PUBLIC_DIR, {
    extensions: ["html"],
    setHeaders(res, filePath) {
      if (/\.(css|svg|png|jpg|jpeg|webp|woff2?)$/i.test(filePath)) {
        res.setHeader("Cache-Control", "public, max-age=86400");
      }
    },
  })
);

// Friendly 404.
app.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_DIR, "404.html"));
});

app.listen(PORT, () => {
  console.log(`SkyMailr website running on port ${PORT}`);
});
