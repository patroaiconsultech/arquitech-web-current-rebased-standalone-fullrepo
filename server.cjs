const express = require("express");
const path = require("path");
const { Readable } = require("stream");

const app = express();
const PORT = process.env.PORT || 8080;

function normalizeEnvUrl(value) {
  return String(value || "")
    .trim()
    .replace(/^["']+|["']+$/g, "")
    .replace(/\/+$/, "");
}

const API_BASE_URL = normalizeEnvUrl(process.env.API_BASE_URL || process.env.VITE_API_BASE_URL || "");

if (!API_BASE_URL) {
  console.error("[ARQUITECH_WEB_PROXY] Missing required env API_BASE_URL or VITE_API_BASE_URL");
  process.exit(1);
}

const distDir = path.join(__dirname, "dist");

const HOP_BY_HOP_RESPONSE_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",

  // Critical proxy fix:
  // Node fetch/undici may transparently decode upstream gzip/br responses
  // while preserving the original content-encoding header.
  // If we forward content-encoding after streaming a decoded body,
  // Chrome tries to decode it again and throws:
  // net::ERR_CONTENT_DECODING_FAILED 200 (OK)
  "content-encoding",
  "content-length",
]);

const HOP_BY_HOP_REQUEST_HEADERS = new Set([
  "host",
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

function buildUpstreamHeaders(req) {
  const headers = {};

  for (const [key, value] of Object.entries(req.headers || {})) {
    const normalizedKey = key.toLowerCase();

    if (HOP_BY_HOP_REQUEST_HEADERS.has(normalizedKey)) continue;
    if (value === undefined || value === null) continue;

    headers[key] = value;
  }

  // Ask upstream for an identity response to avoid compressed proxy edge cases.
  headers["accept-encoding"] = "identity";

  return headers;
}

function copySafeResponseHeaders(upstream, res) {
  upstream.headers.forEach((value, key) => {
    const normalizedKey = key.toLowerCase();

    if (HOP_BY_HOP_RESPONSE_HEADERS.has(normalizedKey)) return;
    if (value === undefined || value === null) return;

    res.setHeader(key, value);
  });
}

app.disable("x-powered-by");

app.get("/healthz", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "arquitech-web",
    api_base_configured: Boolean(API_BASE_URL),
  });
});

app.get("/env.js", (_req, res) => {
  res.type("application/javascript").send(
    `window.__ORKIO_ENV__ = Object.assign({}, window.__ORKIO_ENV__ || {}, { API_BASE_URL: "/api", VITE_API_BASE_URL: "/api" });`,
  );
});

app.get("/sw.js", (_req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Service-Worker-Allowed", "/");
  res.type("application/javascript").sendFile(path.join(distDir, "sw.js"));
});

app.use(express.static(distDir, { index: false }));

app.use("/api", async (req, res) => {
  const target = `${API_BASE_URL}${req.originalUrl}`;

  try {
    const upstream = await fetch(target, {
      method: req.method,
      headers: buildUpstreamHeaders(req),
      body: ["GET", "HEAD"].includes(req.method) ? undefined : req,
      duplex: "half",
    });

    res.status(upstream.status);
    copySafeResponseHeaders(upstream, res);

    if (!upstream.body) {
      res.end();
      return;
    }

    Readable.fromWeb(upstream.body).pipe(res);
  } catch (err) {
    console.error("[ARQUITECH_WEB_PROXY_UPSTREAM_ERROR]", {
      message: err?.message || String(err),
      name: err?.name,
      code: err?.code,
      target,
    });

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
