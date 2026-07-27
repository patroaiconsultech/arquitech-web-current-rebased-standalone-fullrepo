import React, { useEffect, useState } from "react";
import { apiFetch } from "./api.js";
import { fetchCurrentTermsVersion, getToken, markPendingTermsAccepted } from "../lib/auth.js";

/**
 * Blocking modal for first-login Terms acceptance.
 * Props:
 *   onAccepted: () => void — called after successful acceptance
 */
export default function TermsModal({ onAccepted, productLabel = "Orkio", initialError = "" }) {
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState(String(initialError || ""));
  const [acknowledged, setAcknowledged] = useState(false);
  const safeProductLabel = String(productLabel || "Orkio").trim() || "Orkio";

  useEffect(() => {
    if (initialError) setError(String(initialError));
  }, [initialError]);

  const accept = async () => {
    if (!acknowledged) {
      setError("Marque a confirmação de leitura e concordância para continuar.");
      return;
    }
    setAccepting(true);
    setError("");
    try {
      const token = getToken();
      const termsVersion = await fetchCurrentTermsVersion();

      if (!token) {
        markPendingTermsAccepted(termsVersion);
        onAccepted?.({ localOnly: true, termsVersion });
        if (typeof window !== "undefined") {
          const url = new URL(window.location.href);
          url.pathname = "/auth";
          if (!url.searchParams.get("mode")) url.searchParams.set("mode", "login");
          url.searchParams.set("accepted_terms", "1");
          window.location.href = `${url.pathname}${url.search}`;
        }
        return;
      }

      await apiFetch("/api/me/accept-terms", {
        method: "POST",
        token,
        body: { accepted: true, terms_version: termsVersion },
      });
      onAccepted?.({ persisted: true, termsVersion });
    } catch (e) {
      setError(e.message || "Failed to accept. Please try again.");
    } finally {
      setAccepting(false);
    }
  };



  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-3xl border border-white/10 bg-[#0d1117] p-8 shadow-2xl">
        <h2 className="text-xl font-black text-white">Aceite necessário</h2>
        <p className="mt-3 text-sm leading-6 text-white/70">
          Para continuar usando {safeProductLabel}, revise e aceite os Termos de Uso e a Política de Privacidade.
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-white/80">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(event) => {
              setAcknowledged(event.target.checked);
              if (event.target.checked) setError("");
            }}
            className="mt-1 h-4 w-4 accent-cyan-400"
          />
          <span>
            Li e concordo com os{" "}
            <a href="/legal/terms" target="_blank" rel="noopener noreferrer" className="font-bold text-cyan-300 hover:text-cyan-200">
              Termos de Uso
            </a>{" "}
            e com a{" "}
            <a href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="font-bold text-cyan-300 hover:text-cyan-200">
              Política de Privacidade
            </a>.
          </span>
        </label>

        <div className="mt-4 space-y-3">
          <button
            onClick={accept}
            disabled={accepting || !acknowledged}
            className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 px-6 py-3 text-sm font-bold text-black hover:brightness-110 disabled:opacity-50"
          >
            {accepting ? "Processando..." : "Aceitar e continuar"}
          </button>

          <div className="flex gap-3">
            <a
              href="/legal/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-center text-sm font-semibold text-white/80 hover:bg-white/10"
            >
              Ver termos
            </a>
            <a
              href="/legal/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-center text-sm font-semibold text-white/80 hover:bg-white/10"
            >
              Ver política de privacidade
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
