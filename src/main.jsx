import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

function BootFallback({ error }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "#f6f0e6",
        color: "#1f211c",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          width: "min(680px, 100%)",
          border: "1px solid rgba(31, 33, 28, 0.14)",
          borderRadius: 24,
          padding: 28,
          background: "rgba(255, 255, 255, 0.72)",
          boxShadow: "0 24px 80px rgba(31, 33, 28, 0.12)",
        }}
      >
        <p
          style={{
            margin: "0 0 10px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontSize: 12,
            opacity: 0.72,
          }}
        >
          Arquitech
        </p>
        <h1 style={{ margin: "0 0 12px", fontSize: 32, lineHeight: 1.1 }}>
          Não foi possível iniciar a interface agora.
        </h1>
        <p style={{ margin: "0 0 18px", fontSize: 16, lineHeight: 1.6 }}>
          O serviço web está ativo, mas houve uma falha no boot do React. Recarregue a página
          ou verifique o console do navegador.
        </p>
        {error ? (
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
              borderRadius: 16,
              padding: 16,
              background: "rgba(31, 33, 28, 0.08)",
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            {String(error?.stack || error?.message || error)}
          </pre>
        ) : null}
      </div>
    </div>
  );
}

try {
  console.info("[ARQUITECH_BOOT]", {
    path: window.location.pathname,
    search: window.location.search,
  });

  const rootEl = document.getElementById("root");

  if (!rootEl) {
    throw new Error("ROOT_ELEMENT_NOT_FOUND");
  }

  createRoot(rootEl).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("[ARQUITECH_BOOT_ERROR]", error);
  const rootEl = document.getElementById("root");
  if (rootEl) {
    createRoot(rootEl).render(<BootFallback error={error} />);
  }
}
