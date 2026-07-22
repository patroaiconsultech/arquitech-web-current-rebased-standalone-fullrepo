import React from "react";

function formatBytes(value) {
  const bytes = Number(value || 0);
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 102.4) / 10} KB`;
  return `${Math.round(bytes / (1024 * 102.4)) / 10} MB`;
}

export default function GlipArtifactCard({ file, onDownload }) {
  if (!file) return null;

  const size = formatBytes(file.sizeBytes);
  return (
    <button
      type="button"
      onClick={() => onDownload?.(file)}
      aria-label={`Baixar ${file.name}`}
      style={{
        width: "100%",
        border: "1px solid rgba(210, 204, 190, 0.28)",
        borderRadius: 14,
        background:
          "linear-gradient(135deg, rgba(210,204,190,0.12), rgba(255,255,255,0.045))",
        color: "#fff",
        cursor: "pointer",
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 14,
        textAlign: "left",
      }}
    >
      <span style={{ minWidth: 0 }}>
        <span
          style={{
            display: "block",
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(210,204,190,0.82)",
          }}
        >
          Arquivo criado pela Aria
        </span>
        <span
          style={{
            display: "block",
            marginTop: 4,
            fontSize: 14,
            fontWeight: 900,
            overflowWrap: "anywhere",
          }}
        >
          {file.name}
        </span>
        <span
          style={{
            display: "block",
            marginTop: 3,
            fontSize: 11,
            color: "rgba(255,255,255,0.62)",
          }}
        >
          {[file.kind, size].filter(Boolean).join(" • ")}
        </span>
      </span>
      <span
        style={{
          flex: "0 0 auto",
          borderRadius: 999,
          padding: "7px 11px",
          background: "rgba(210,204,190,0.14)",
          fontSize: 12,
          fontWeight: 900,
          color: "#f5f1e7",
        }}
      >
        Baixar
      </span>
    </button>
  );
}
