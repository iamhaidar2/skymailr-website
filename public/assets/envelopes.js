/**
 * SkyMailr — animated wireframe-envelope background.
 *
 * A full-viewport canvas behind the page content. Outline-only ("wireframe")
 * envelopes drift gently in the brand colors and scatter away from the cursor,
 * springing back once it passes. Honors prefers-reduced-motion (static scatter).
 */
(function () {
  "use strict";

  var REPEL_RADIUS = 170; // px around the cursor that pushes envelopes
  var REPEL_PUSH = 5.2; // strength of the shove
  var DECAY = 0.9; // how fast envelopes spring back

  // Brand palette (sky -> blue -> indigo), as "r,g,b".
  var COLORS = ["59,130,246", "56,189,248", "79,70,229", "96,165,250"];

  var canvas = document.createElement("canvas");
  canvas.id = "envelope-bg";
  canvas.setAttribute("aria-hidden", "true");
  document.body.insertBefore(canvas, document.body.firstChild);
  var ctx = canvas.getContext("2d");

  var dpr = 1, W = 0, H = 0, envs = [], t = 0, raf = null;
  var mouse = { x: -9999, y: -9999 };
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function rand(a, b) { return a + Math.random() * (b - a); }

  function build() {
    var count = Math.round((W * H) / 24000);
    count = Math.max(14, Math.min(70, count));
    envs = [];
    for (var i = 0; i < count; i++) {
      var s = rand(20, 46);
      envs.push({
        bx: rand(0, W), by: rand(0, H),
        dx: 0, dy: 0,
        size: s,
        rotBase: rand(-0.5, 0.5),
        phase: rand(0, Math.PI * 2),
        amp: rand(5, 15),
        speed: rand(0.18, 0.42),
        color: COLORS[(Math.random() * COLORS.length) | 0],
        alpha: rand(0.13, 0.30)
      });
    }
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
    if (reduced) drawFrame(); // single static render
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawEnvelope(cx, cy, s, rot, color, alpha) {
    var w = s, h = s * 0.66, r = Math.min(5, s * 0.12);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.strokeStyle = "rgba(" + color + "," + alpha + ")";
    ctx.lineWidth = 1.4;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    roundRect(-w / 2, -h / 2, w, h, r);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-w / 2, -h / 2);
    ctx.lineTo(0, -h / 2 + h * 0.52);
    ctx.lineTo(w / 2, -h / 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < envs.length; i++) {
      var e = envs[i];
      var fx = 0, fy = 0;
      if (!reduced) {
        fx = Math.sin(t * e.speed + e.phase) * e.amp;
        fy = Math.cos(t * e.speed * 0.8 + e.phase) * e.amp * 0.7;
        var cx0 = e.bx + fx + e.dx, cy0 = e.by + fy + e.dy;
        var rx = cx0 - mouse.x, ry = cy0 - mouse.y;
        var d = Math.sqrt(rx * rx + ry * ry) || 0.001;
        if (d < REPEL_RADIUS) {
          var f = 1 - d / REPEL_RADIUS;
          var p = f * f * REPEL_PUSH;
          e.dx += (rx / d) * p;
          e.dy += (ry / d) * p;
        }
        e.dx *= DECAY;
        e.dy *= DECAY;
      }
      var cx = e.bx + fx + e.dx, cy = e.by + fy + e.dy;
      var rot = e.rotBase + (reduced ? 0 : Math.sin(t * 0.3 + e.phase) * 0.14 + e.dx * 0.003);
      drawEnvelope(cx, cy, e.size, rot, e.color, e.alpha);
    }
  }

  function loop() {
    t += 0.016;
    drawFrame();
    raf = window.requestAnimationFrame(loop);
  }

  window.addEventListener("pointermove", function (ev) {
    mouse.x = ev.clientX;
    mouse.y = ev.clientY;
  }, { passive: true });
  window.addEventListener("pointerleave", function () { mouse.x = mouse.y = -9999; });
  window.addEventListener("blur", function () { mouse.x = mouse.y = -9999; });

  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(resize, 150);
  });

  resize();
  if (!reduced) loop();
})();
