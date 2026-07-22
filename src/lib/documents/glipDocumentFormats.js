export const GLIP_DOCUMENT_READ_FORMATS = Object.freeze([
  "pdf",
  "docx",
  "xlsx",
  "pptx",
  "csv",
  "txt",
  "md",
]);

export const GLIP_DOCUMENT_CREATE_FORMATS = Object.freeze([
  "pdf",
  "docx",
  "xlsx",
  "pptx",
  "csv",
  "md",
]);

export const GLIP_DOCUMENT_ACCEPT = GLIP_DOCUMENT_READ_FORMATS
  .map((extension) => `.${extension}`)
  .join(",");

const LABELS = Object.freeze({
  pdf: "PDF",
  docx: "Word",
  xlsx: "Excel",
  pptx: "PowerPoint",
  csv: "CSV",
  txt: "Texto",
  md: "Markdown",
});

export function getGlipDocumentExtension(filename = "") {
  const clean = String(filename || "").trim().toLowerCase();
  const dot = clean.lastIndexOf(".");
  return dot >= 0 ? clean.slice(dot + 1) : "";
}

export function getGlipDocumentSupport(fileOrName) {
  const filename =
    typeof fileOrName === "string"
      ? fileOrName
      : String(fileOrName?.name || "");
  const extension = getGlipDocumentExtension(filename);
  const supported = GLIP_DOCUMENT_READ_FORMATS.includes(extension);
  return {
    supported,
    extension,
    label: LABELS[extension] || extension.toUpperCase() || "Arquivo",
    filename,
  };
}

export function describeGlipReadableFormats() {
  return GLIP_DOCUMENT_READ_FORMATS.map((format) => LABELS[format] || format.toUpperCase()).join(", ");
}

export function describeGlipCreatableFormats() {
  return GLIP_DOCUMENT_CREATE_FORMATS.map((format) => LABELS[format] || format.toUpperCase()).join(", ");
}

export function formatGlipUploadResult(result, filename = "arquivo") {
  const payload = result?.data ?? result ?? {};
  const name = String(payload?.filename || filename || "arquivo").trim();
  const extractionStatus = String(payload?.extraction_status || "").trim().toLowerCase();
  const extractedChars = Number(payload?.extracted_chars || 0);
  const hasExtractedText = Boolean(payload?.has_extracted_text || extractedChars > 0);

  if (hasExtractedText || extractionStatus === "extracted") {
    return `Arquivo ${name} anexado e indexado para leitura pela Aria.`;
  }

  if (payload?.extraction_failed || extractionStatus === "failed") {
    return `O arquivo ${name} foi anexado, mas a extração de conteúdo falhou.`;
  }

  return `Arquivo ${name} anexado à conversa.`;
}
