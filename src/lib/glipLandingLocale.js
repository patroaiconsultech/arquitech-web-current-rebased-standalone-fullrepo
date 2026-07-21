import { useCallback, useEffect, useMemo, useState } from "react";

export const GLIP_LANDING_LOCALE_KEY = "glip_landing_locale";
export const GLIP_LANDING_LOCALE_EVENT = "glip:landing-locale-change";

export const GLIP_LANDING_LOCALES = [
  { value: "pt", label: "PT", title: "Português" },
  { value: "en", label: "EN", title: "English" },
];

export function normalizeGlipLandingLocale(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (raw === "en" || raw === "en-us" || raw === "english") return "en";
  return "pt";
}

function writeDocumentLocale(locale) {
  if (typeof document === "undefined") return;

  const normalized = normalizeGlipLandingLocale(locale);
  const htmlLang = normalized === "en" ? "en-US" : "pt-BR";

  try {
    document.documentElement.lang = htmlLang;
    document.documentElement.dataset.glipLandingLocale = normalized;
    document.body?.setAttribute("data-glip-landing-locale", normalized);
  } catch {}
}

function writeStoredLocale(locale) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage?.setItem(GLIP_LANDING_LOCALE_KEY, normalizeGlipLandingLocale(locale));
  } catch {}
}

function writeUrlLocale(locale, { replace = true } = {}) {
  if (typeof window === "undefined") return;

  const normalized = normalizeGlipLandingLocale(locale);

  try {
    const url = new URL(window.location.href);

    if (normalized === "en") {
      url.searchParams.set("lang", "en");
    } else {
      url.searchParams.delete("lang");
    }

    const next = `${url.pathname}${url.search}${url.hash}`;
    if (replace && window.history?.replaceState) {
      window.history.replaceState({}, "", next);
    }
  } catch {}
}

export function readGlipLandingLocale() {
  if (typeof window === "undefined") return "pt";

  let normalized = "pt";

  try {
    const query = new URLSearchParams(window.location.search);
    const urlLang = query.get("lang");
    normalized = urlLang ? normalizeGlipLandingLocale(urlLang) : "pt";
  } catch {
    normalized = "pt";
  }

  writeStoredLocale(normalized);
  writeUrlLocale(normalized, { replace: true });
  writeDocumentLocale(normalized);

  return normalized;
}

export function setGlipLandingLocaleEverywhere(locale, { replaceUrl = true } = {}) {
  const normalized = normalizeGlipLandingLocale(locale);

  writeStoredLocale(normalized);
  writeUrlLocale(normalized, { replace: replaceUrl });
  writeDocumentLocale(normalized);

  try {
    window.dispatchEvent(
      new CustomEvent(GLIP_LANDING_LOCALE_EVENT, {
        detail: { locale: normalized },
      })
    );
  } catch {}

  return normalized;
}

export function useGlipLandingLocale() {
  const [locale, setLocaleState] = useState(() => readGlipLandingLocale());

  const setLocale = useCallback((nextLocale) => {
    const normalized = setGlipLandingLocaleEverywhere(nextLocale, { replaceUrl: true });
    setLocaleState(normalized);
  }, []);

  useEffect(() => {
    const sync = () => setLocaleState(readGlipLandingLocale());
    const onCustom = (event) => {
      const next = normalizeGlipLandingLocale(event?.detail?.locale);
      writeDocumentLocale(next);
      setLocaleState(next);
    };

    window.addEventListener("popstate", sync);
    window.addEventListener(GLIP_LANDING_LOCALE_EVENT, onCustom);
    writeDocumentLocale(locale);

    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener(GLIP_LANDING_LOCALE_EVENT, onCustom);
    };
  }, [locale]);

  return useMemo(
    () => ({
      locale,
      setLocale,
      isEnglish: locale === "en",
      isPortuguese: locale !== "en",
    }),
    [locale, setLocale]
  );
}
