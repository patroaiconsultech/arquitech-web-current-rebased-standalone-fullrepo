import { useEffect } from "react";
import {
  GLIP_LANDING_LOCALE_EVENT,
  normalizeGlipLandingLocale,
  readGlipLandingLocale,
} from "./glipLandingLocale.js";

const SITE_URL = "https://www.gliparquitetura.com.br";
const LOGO_URL = `${SITE_URL}/arquitech-assets/glip-logo-horizontal.jpeg`;

const SEO = {
  pt: {
    title: "GLIP Intelligence Architecture | Arquitetura comercial, corporativa e médica",
    description:
      "Arquitetura humana, autoral e inteligente para projetos comerciais, corporativos e médicos, com briefing, proposta, contrato, projeto e obra apoiados pela Aria.",
    lang: "pt-BR",
    locale: "pt_BR",
    imageAlt: "GLIP Intelligence Architecture",
  },
  en: {
    title: "GLIP Intelligence Architecture | Commercial, corporate and healthcare architecture",
    description:
      "Human, authored and intelligent architecture for commercial, corporate and healthcare projects, with briefing, proposal, contract, design and construction supported by Aria.",
    lang: "en-US",
    locale: "en_US",
    imageAlt: "GLIP Intelligence Architecture",
  },
};

function buildLocalizedUrl(locale) {
  const url = new URL("/", SITE_URL);
  if (normalizeGlipLandingLocale(locale) === "en") {
    url.searchParams.set("lang", "en");
  }
  return url.toString();
}

function getSeo(localeOverride) {
  const locale = normalizeGlipLandingLocale(
    localeOverride || (typeof window === "undefined" ? "pt" : readGlipLandingLocale())
  );

  return {
    ...SEO[locale],
    localeKey: locale,
    canonical: buildLocalizedUrl(locale),
    alternatePt: buildLocalizedUrl("pt"),
    alternateEn: buildLocalizedUrl("en"),
    xDefault: buildLocalizedUrl("pt"),
    logo: LOGO_URL,
  };
}

function upsertMeta(selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
}

function upsertLink(selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("link");
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
}

function upsertJsonLd(id, payload) {
  let el = document.head.querySelector(`script[data-seo-id="${id}"]`);
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.setAttribute("data-seo-id", id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(payload);
}

export function applyGlipSeoIdentity(localeOverride) {
  if (typeof document === "undefined") return;

  const seo = getSeo(localeOverride);
  document.documentElement.setAttribute("lang", seo.lang);
  document.title = seo.title;

  upsertMeta('meta[name="description"]', { name: "description", content: seo.description });
  upsertLink('link[rel="canonical"]', { rel: "canonical", href: seo.canonical });
  upsertLink('link[rel="alternate"][hreflang="en"]', { rel: "alternate", hreflang: "en", href: seo.alternateEn });
  upsertLink('link[rel="alternate"][hreflang="pt-BR"]', { rel: "alternate", hreflang: "pt-BR", href: seo.alternatePt });
  upsertLink('link[rel="alternate"][hreflang="x-default"]', { rel: "alternate", hreflang: "x-default", href: seo.xDefault });

  upsertMeta('meta[property="og:title"]', { property: "og:title", content: seo.title });
  upsertMeta('meta[property="og:description"]', { property: "og:description", content: seo.description });
  upsertMeta('meta[property="og:url"]', { property: "og:url", content: seo.canonical });
  upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
  upsertMeta('meta[property="og:locale"]', { property: "og:locale", content: seo.locale });
  upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: "GLIP Intelligence Architecture" });
  upsertMeta('meta[property="og:image"]', { property: "og:image", content: seo.logo });
  upsertMeta('meta[property="og:image:alt"]', { property: "og:image:alt", content: seo.imageAlt });

  upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
  upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: seo.title });
  upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: seo.description });
  upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: seo.logo });
  upsertMeta('meta[name="twitter:image:alt"]', { name: "twitter:image:alt", content: seo.imageAlt });

  upsertJsonLd("glip-organization", {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GLIP Intelligence Architecture",
    alternateName: ["GLIP Arquitetura", "GLIP"],
    url: `${SITE_URL}/`,
    logo: LOGO_URL,
    email: "gliparquitetura@gmail.com",
    telephone: "+55 51 98460-0089",
    founder: {
      "@type": "Person",
      name: "Sabrina Hasse",
      jobTitle: "CEO e founder",
    },
    areaServed: ["BR"],
    knowsAbout: [
      "arquitetura comercial",
      "arquitetura corporativa",
      "arquitetura médica",
      "execução de obras",
      "design de interiores",
      "gestão de projetos",
    ],
    description: seo.description,
  });

  upsertJsonLd("glip-architectural-service", {
    "@context": "https://schema.org",
    "@type": "ArchitecturalService",
    name: "GLIP Intelligence Architecture",
    url: `${SITE_URL}/`,
    image: LOGO_URL,
    serviceType:
      seo.localeKey === "en"
        ? "Commercial, corporate and healthcare architecture"
        : "Arquitetura comercial, corporativa e médica",
    areaServed: ["Porto Alegre", "Rio Grande do Sul", "Brasil"],
  });
}

export default function useGlipSeo() {
  useEffect(() => {
    const syncSeo = (event) => applyGlipSeoIdentity(event?.detail?.locale);

    applyGlipSeoIdentity();
    window.addEventListener(GLIP_LANDING_LOCALE_EVENT, syncSeo);
    window.addEventListener("popstate", syncSeo);

    return () => {
      window.removeEventListener(GLIP_LANDING_LOCALE_EVENT, syncSeo);
      window.removeEventListener("popstate", syncSeo);
    };
  }, []);
}
