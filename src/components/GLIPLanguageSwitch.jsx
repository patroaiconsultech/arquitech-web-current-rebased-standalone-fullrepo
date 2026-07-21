import React from "react";
import {
  GLIP_LANDING_LOCALES,
  normalizeGlipLandingLocale,
  readGlipLandingLocale,
  setGlipLandingLocaleEverywhere,
} from "../lib/glipLandingLocale.js";

export default function GLIPLanguageSwitch({ locale, onChange }) {
  const activeLocale = normalizeGlipLandingLocale(locale || readGlipLandingLocale());

  function selectLocale(next) {
    const normalized = setGlipLandingLocaleEverywhere(next, { replaceUrl: true });
    if (typeof onChange === "function") onChange(normalized);
  }

  return (
    <nav className="glip-language-switch" aria-label={activeLocale === "en" ? "Select language" : "Selecionar idioma"}>
      {GLIP_LANDING_LOCALES.map((item) => (
        <button
          key={item.value}
          type="button"
          title={item.title}
          aria-pressed={activeLocale === item.value}
          onClick={() => selectLocale(item.value)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
