const express = require("express");
const path = require("path");
const { Readable } = require("stream");

const app = express();

const PORT = process.env.PORT || 8080;
const API_BASE_URL = (process.env.API_BASE_URL || process.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

if (!API_BASE_URL) {
  console.error("[ARQUITECH_WEB_PROXY] Missing required env API_BASE_URL or VITE_API_BASE_URL");
  process.exit(1);
}

const distDir = path.join(__dirname, "dist");

app.disable("x-powered-by");

app.get("/healthz", (_req, res) => {
  res.status(200).json({ ok: true, service: "arquitech-web" });
});

app.get("/env.js", (_req, res) => {
  res.type("application/javascript").send(
    `window.__ORKIO_ENV__ = Object.assign({}, window.__ORKIO_ENV__ || {}, { API_BASE_URL: "/api", VITE_API_BASE_URL: "/api" });`
  );
});

app.use(express.static(distDir, { index: false }));

app.use("/api", async (req, res) => {
  const target = `${API_BASE_URL}${req.originalUrl}`;

  try {
    const upstream = await fetch(target, {
      method: req.method,
      headers: { ...req.headers },
      body: ["GET", "HEAD"].includes(req.method) ? undefined : req,
      duplex: "half",
    });

    res.status(upstream.status);

    upstream.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    if (!upstream.body) {
      res.end();
      return;
    }

    Readable.fromWeb(upstream.body).pipe(res);
  } catch (err) {
    console.error("[ARQUITECH_WEB_PROXY_UPSTREAM_ERROR]", err);

    res.status(502).json({
      detail: "ARQUITECH_WEB_PROXY_UPSTREAM_ERROR",
    });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`ARQUITECH WEB running on ${PORT}`);
});
