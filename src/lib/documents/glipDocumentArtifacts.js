const GENERATED_FILE_EXTENSIONS = Object.freeze([
  "pdf",
  "docx",
  "pptx",
  "xlsx",
  "csv",
  "txt",
  "md",
]);

export function inferGlipFileNameFromUrl(url = "", fallback = "arquivo-glip") {
  try {
    const parsed = new URL(
      String(url || ""),
      typeof window !== "undefined" ? window.location.origin : "http://localhost"
    );
    const last = decodeURIComponent(
      parsed.pathname.split("/").filter(Boolean).pop() || ""
    );
    return last || fallback;
  } catch {
    const clean = String(url || "").split("?")[0].split("#")[0];
    return decodeURIComponent(
      clean.split("/").filter(Boolean).pop() || fallback
    );
  }
}

export function parseOrkioEvent(content) {
  try {
    if (!content || typeof content !== "string") return null;
    const index = content.indexOf("ORKIO_EVENT:");
    if (index < 0) return null;
    const parsed = JSON.parse(content.slice(index + "ORKIO_EVENT:".length));
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function normalizeGlipArtifactCandidate(candidate, source = "artifact") {
  if (!candidate || typeof candidate !== "object") return null;

  const fileId = candidate.file_id || candidate.fileId || null;
  const url =
    candidate.download_url ||
    candidate.downloadUrl ||
    candidate.file_url ||
    candidate.fileUrl ||
    candidate.signed_url ||
    candidate.signedUrl ||
    candidate.public_url ||
    candidate.publicUrl ||
    candidate.href ||
    candidate.url ||
    candidate.path ||
    (fileId ? `/api/files/${encodeURIComponent(String(fileId))}/download` : null);

  if (!url || typeof url !== "string") return null;

  const name =
    candidate.filename ||
    candidate.file_name ||
    candidate.fileName ||
    candidate.name ||
    candidate.title ||
    (fileId ? `arquivo-${String(fileId).slice(0, 8)}` : "") ||
    inferGlipFileNameFromUrl(url);

  const extension = String(
    candidate.format ||
    candidate.extension ||
    String(name).split(".").pop() ||
    ""
  ).toLowerCase();

  const kind =
    extension === "pdf"
      ? "PDF"
      : extension === "pptx"
        ? "Apresentação"
        : ["xlsx", "csv"].includes(extension)
          ? "Planilha"
          : ["docx", "md", "txt"].includes(extension)
            ? "Documento"
            : "Arquivo";

  return {
    id: `${source}:${fileId || url}:${name}`,
    fileId,
    url,
    name: String(name),
    kind,
    extension,
    mimeType:
      candidate.mime_type ||
      candidate.mimeType ||
      candidate.content_type ||
      candidate.contentType ||
      "",
    sizeBytes: Number(candidate.size_bytes || candidate.size || 0),
  };
}

function extractArtifactsFromText(text = "") {
  const raw = String(text || "");
  if (!raw) return [];

  const escapedExtensions = GENERATED_FILE_EXTENSIONS.join("|");
  const urlPattern = new RegExp(
    `(?:https?:\\/\\/[^\\s)\\]\"']+|\\/api\\/[^\\s)\\]\"']+|\\/files\\/[^\\s)\\]\"']+)\\.(${escapedExtensions})(?:\\?[^\\s)\\]\"']*)?`,
    "gi"
  );
  const out = [];
  let match;
  while ((match = urlPattern.exec(raw))) {
    const artifact = normalizeGlipArtifactCandidate(
      { url: match[0] },
      "text"
    );
    if (artifact) out.push(artifact);
  }
  return out;
}

function pushCandidate(out, value, source) {
  if (Array.isArray(value)) {
    value.forEach((item) => pushCandidate(out, item, source));
    return;
  }
  const normalized = normalizeGlipArtifactCandidate(value, source);
  if (normalized) out.push(normalized);
}

export function extractGlipArtifacts(message = {}) {
  const out = [];
  const event = parseOrkioEvent(message?.content);

  pushCandidate(out, message, "message");
  pushCandidate(out, message?.artifact, "message.artifact");
  pushCandidate(out, message?.artifacts, "message.artifacts");
  pushCandidate(out, message?.attachments, "message.attachments");
  pushCandidate(out, message?.files, "message.files");
  pushCandidate(out, message?.generated_files, "message.generated_files");
  pushCandidate(out, message?.generatedFiles, "message.generatedFiles");
  pushCandidate(out, message?.outputs, "message.outputs");
  pushCandidate(out, message?.data?.artifact, "message.data.artifact");
  pushCandidate(out, message?.data?.artifacts, "message.data.artifacts");
  pushCandidate(out, message?.data?.files, "message.data.files");
  pushCandidate(out, event?.artifact, "event.artifact");
  pushCandidate(out, event?.artifacts, "event.artifacts");
  pushCandidate(out, event, "event");

  extractArtifactsFromText(message?.content).forEach((item) => out.push(item));

  const seen = new Set();
  return out.filter((item) => {
    if (!item?.url) return false;
    const key = `${item.fileId || ""}|${item.url}|${item.name}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function resolveGlipArtifactEnvelope(...sources) {
  let artifact = null;
  const artifacts = [];

  sources.filter(Boolean).forEach((source) => {
    const data = source?.data ?? source;
    if (!data || typeof data !== "object") return;
    if (!artifact && data.artifact) artifact = data.artifact;
    if (Array.isArray(data.artifacts)) artifacts.push(...data.artifacts);
    if (data?.done_payload) {
      if (!artifact && data.done_payload.artifact) {
        artifact = data.done_payload.artifact;
      }
      if (Array.isArray(data.done_payload.artifacts)) {
        artifacts.push(...data.done_payload.artifacts);
      }
    }
  });

  if (artifact && !artifacts.length) artifacts.push(artifact);
  return { artifact, artifacts };
}
