import React, { useEffect, useMemo, useState } from "react";

const APP_URL = "/app?source=arquitech&agent=aria&product=arquitech&onboarding=1";

function safeNavigator() {
  try {
    return typeof navigator !== "undefined" ? navigator : null;
  } catch {
    return null;
  }
}

function safeWindow() {
  try {
    return typeof window !== "undefined" ? window : null;
  } catch {
    return null;
  }
}

function isStandalone() {
  const win = safeWindow();
  const nav = safeNavigator();

  try {
    return (
      win?.matchMedia?.("(display-mode: standalone)")?.matches ||
      win?.matchMedia?.("(display-mode: fullscreen)")?.matches ||
      win?.matchMedia?.("(display-mode: minimal-ui)")?.matches ||
      nav?.standalone === true
    );
  } catch {
    return false;
  }
}

function detectInstallSurface() {
  const ua = String(safeNavigator()?.userAgent || "");
  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const isAndroid = /android/i.test(ua);
  const isSamsung = /SamsungBrowser/i.test(ua);
  const isChrome = /Chrome|Chromium|CriOS/i.test(ua) && !/Edg|OPR|SamsungBrowser/i.test(ua);
  const isEdge = /Edg/i.test(ua);
  const isSafari = /Safari/i.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|SamsungBrowser/i.test(ua);

  if (isIOS && isSafari) return "ios-safari";
  if (isIOS) return "ios-browser";
  if (isSamsung) return "samsung";
  if (isAndroid && isChrome) return "android-chrome";
  if (isAndroid) return "android-browser";
  if (isChrome || isEdge) return "desktop-chromium";
  return "generic";
}

function getManualInstructions(locale, surface) {
  const pt = locale !== "en";

  if (pt) {
    if (surface === "ios-safari" || surface === "ios-browser") {
      return {
        title: "Instalar no iPhone ou iPad",
        body: "Abra esta página no Safari, toque em compartilhar e escolha Adicionar à Tela de Início.",
        steps: ["Abra esta página no Safari.", "Toque no ícone de compartilhar.", "Escolha Adicionar à Tela de Início."],
      };
    }

    if (surface === "android-chrome") {
      return {
        title: "Instalar no Chrome Android",
        body: "Abra o menu do Chrome e escolha Instalar app ou Adicionar à tela inicial.",
        steps: ["Toque nos três pontos do navegador.", "Escolha Instalar app ou Adicionar à tela inicial.", "Confirme a instalação."],
      };
    }

    return {
      title: "Instalar app GLIP",
      body: "Use o menu do navegador para adicionar o app GLIP à tela inicial.",
      steps: ["Abra o menu do navegador.", "Procure por Instalar app ou Adicionar à tela inicial.", "Confirme a instalação."],
    };
  }

  if (surface === "ios-safari" || surface === "ios-browser") {
    return {
      title: "Install on iPhone or iPad",
      body: "Open this page in Safari, tap Share and choose Add to Home Screen.",
      steps: ["Open this page in Safari.", "Tap the share icon.", "Choose Add to Home Screen."],
    };
  }

  return {
    title: "Install GLIP app",
    body: "Use your browser menu to install the GLIP app or add it to your home screen.",
    steps: ["Open the browser menu.", "Choose Install app or Add to Home screen.", "Confirm installation."],
  };
}

function updateDebugStatus(extra = {}) {
  const win = safeWindow();
  if (!win) return;

  try {
    win.__GLIP_PWA_INSTALL_BUTTON__ = {
      at: new Date().toISOString(),
      standalone: isStandalone(),
      surface: detectInstallSurface(),
      hasDeferredPrompt: Boolean(win.__GLIP_DEFERRED_INSTALL_PROMPT__),
      ...extra,
    };
  } catch {}
}

export default function GLIPInstallButton({
  locale = "pt",
  label,
  compactLabel,
  title,
  variant = "default",
}) {
  const [deferredPrompt, setDeferredPrompt] = useState(() => safeWindow()?.__GLIP_DEFERRED_INSTALL_PROMPT__ || null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [installState, setInstallState] = useState("idle");

  const isEnglish = locale === "en";
  const surface = useMemo(() => detectInstallSurface(), []);
  const instructions = useMemo(() => getManualInstructions(locale, surface), [locale, surface]);
  const isHero = variant === "hero";

  const buttonLabel = label || (isEnglish ? "Install app" : "Instalar app");
  const buttonCompactLabel = compactLabel || "App";
  const buttonTitle = title || (isEnglish ? "Install the GLIP app" : "Instalar o app GLIP");

  useEffect(() => {
    const win = safeWindow();
    if (!win) return undefined;

    updateDebugStatus({ source: "mount" });

    const onBeforeInstallPrompt = (event) => {
      try {
        event.preventDefault?.();
      } catch {}

      win.__GLIP_DEFERRED_INSTALL_PROMPT__ = event;
      setDeferredPrompt(event);
      updateDebugStatus({ source: "beforeinstallprompt" });
    };

    const onAppInstalled = () => {
      setInstallState("installed");
      setDialogOpen(false);
      setDeferredPrompt(null);
      try {
        win.__GLIP_DEFERRED_INSTALL_PROMPT__ = null;
      } catch {}
      updateDebugStatus({ source: "appinstalled" });
    };

    win.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    win.addEventListener("appinstalled", onAppInstalled);
    win.__GLIP_TRY_INSTALL_PWA__ = tryInstall;

    return () => {
      win.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      win.removeEventListener("appinstalled", onAppInstalled);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deferredPrompt]);

  async function tryInstall() {
    const win = safeWindow();
    const prompt = deferredPrompt || win?.__GLIP_DEFERRED_INSTALL_PROMPT__;

    if (isStandalone()) {
      setInstallState("installed");
      setDialogOpen(true);
      updateDebugStatus({ source: "already_standalone" });
      return;
    }

    if (!prompt) {
      setInstallState("manual");
      setDialogOpen(true);
      updateDebugStatus({ source: "manual_no_prompt" });
      return;
    }

    try {
      setInstallState("prompting");
      await prompt.prompt?.();
      const choice = await prompt.userChoice;

      setDeferredPrompt(null);
      try {
        win.__GLIP_DEFERRED_INSTALL_PROMPT__ = null;
      } catch {}

      if (choice?.outcome === "accepted") {
        setInstallState("accepted");
        setDialogOpen(false);
      } else {
        setInstallState("manual");
        setDialogOpen(true);
      }

      updateDebugStatus({ source: "prompt_result", outcome: choice?.outcome || "unknown" });
    } catch {
      setInstallState("manual");
      setDialogOpen(true);
      updateDebugStatus({ source: "prompt_failed" });
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={tryInstall}
        title={buttonTitle}
        className={isHero ? "glip-install-button glip-install-button-hero" : "glip-install-button"}
      >
        <span className="glip-install-label">{buttonLabel}</span>
        <span className="glip-install-compact-label">{buttonCompactLabel}</span>
      </button>

      {dialogOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={instructions.title}
          className="glip-install-dialog-backdrop"
          onClick={() => setDialogOpen(false)}
        >
          <div className="glip-install-dialog" onClick={(event) => event.stopPropagation()}>
            <p className="arquitech-kicker">{isEnglish ? "GLIP app" : "App GLIP"}</p>
            <h2>
              {installState === "installed"
                ? isEnglish
                  ? "App already installed"
                  : "App já instalado"
                : instructions.title}
            </h2>
            <p>
              {installState === "installed"
                ? isEnglish
                  ? "GLIP is already open in app mode or installed on this device."
                  : "A GLIP já está aberta em modo app ou instalada neste dispositivo."
                : instructions.body}
            </p>

            {installState !== "installed" ? (
              <ol>
                {instructions.steps.map((step, index) => (
                  <li key={step}>
                    <span>{index + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            ) : null}

            <div className="glip-install-dialog-actions">
              <a href={APP_URL}>{isEnglish ? "Open app" : "Abrir app"}</a>
              {deferredPrompt ? (
                <button type="button" onClick={tryInstall}>
                  {isEnglish ? "Install now" : "Instalar agora"}
                </button>
              ) : null}
              <button type="button" onClick={() => setDialogOpen(false)}>
                {isEnglish ? "Got it" : "Entendi"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
