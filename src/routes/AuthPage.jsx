import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { apiFetch } from "../ui/api.js";
import {
  setTenant,
  savePendingOtpContext,
  getPendingOtpContext,
  completeOtpLogin,
  getToken,
  getUser,
  isApproved,
  isAdmin,
  getPendingTermsAccepted,
  clearPendingTermsAccepted,
  getAcceptedTermsVersion,
} from "../lib/auth.js";
import { consumeReturnTo, DEFAULT_AFTER_LOGIN_PATH } from "../lib/authReturn";

const palette = {
  ink: "#f8fafc",
  muted: "rgba(248,250,252,0.68)",
  faint: "rgba(248,250,252,0.46)",
  line: "rgba(255,255,255,0.12)",
  lineGold: "rgba(247,200,98,0.24)",
  goldSoft: "#ffe29c",
  input: "rgba(255,255,255,0.07)",
  inputBorder: "rgba(255,255,255,0.13)",
};

const ARQUITECH_REGISTER_CODE =
  String(import.meta.env.VITE_ARQUITECH_REGISTER_CODE || "ARQUITECH777").trim() ||
  "ARQUITECH777";

const ARQUITECH_APP_PATH =
  "/app?source=arquitech&agent=aria&product=arquitech&onboarding=1";

const ARQUITECH_GATE_STORAGE_KEY = "arquitech_access_gate_passed";
const AUTH_REQUEST_TIMEOUT_MS = 20000;
const POST_LOGIN_REDIRECT_FALLBACK_MS = 900;
const PRECHAT_KEY = "orkio_prechat_context";
const PRECHAT_LEGACY_KEY = "orkio_prechat_context_v1";
const PRECHAT_IMPORT_KEY = "orkio_prechat_import_pending_v1";
const ADMIN_ALLOWED_EMAILS = new Set(["daniel@patroai.com", "daniel@patroai.com.br"]);

/**
 * AO-GLIP01-NO-ASAAS
 *
 * Objetivo:
 * - Desabilitar checkout/billing/Asaas no AuthPage.
 * - Não chamar /api/billing/public/checkout.
 * - Criar conta e seguir direto para /api/auth/register + /api/auth/login.
 * - Preservar contexto Arquitech/Aria: source=arquitech, product=arquitech, agent=aria.
 * - Não tocar backend, runtime, orchestrator, billing backend ou banco.
 */

function markArquitechAccessPassed() {
  try {
    localStorage.setItem(ARQUITECH_GATE_STORAGE_KEY, "1");
  } catch {}
}

function normalizeIdentityEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function isAuthorizedAdminEmail(value) {
  return ADMIN_ALLOWED_EMAILS.has(normalizeIdentityEmail(value));
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeAccessCode(value) {
  return String(value || "").trim().toUpperCase();
}

function readPrechatContext() {
  try {
    const raw =
      window.localStorage?.getItem(PRECHAT_KEY) ||
      window.sessionStorage?.getItem(PRECHAT_KEY) ||
      window.localStorage?.getItem(PRECHAT_LEGACY_KEY) ||
      window.sessionStorage?.getItem(PRECHAT_LEGACY_KEY) ||
      "";
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function stagePrechatImport(extra = {}) {
  try {
    const ctx = readPrechatContext();
    if (!ctx) return;
    window.localStorage?.setItem(
      PRECHAT_IMPORT_KEY,
      JSON.stringify({
        ...ctx,
        ...extra,
        staged_at: new Date().toISOString(),
      }),
    );
  } catch {}
}

function readAuthJourneyContext(search = "") {
  try {
    const params = new URLSearchParams(search || window.location.search || "");
    const source = String(params.get("source") || "").trim();
    const product = String(params.get("product") || "").trim();
    const agent = String(params.get("agent") || "").trim();
    const entry = String(params.get("entry") || "").trim();
    const mode = String(params.get("mode") || "").trim();
    const onboarding = params.get("onboarding") === "1";
    const prechat = params.get("prechat") === "1";
    const beta = params.get("beta") === "1";
    const returnTo = String(params.get("returnTo") || params.get("next") || "").trim();

    const normalizedSource = source.toLowerCase();
    const normalizedProduct = product.toLowerCase();
    const normalizedAgent = agent.toLowerCase();

    const fromArquitech =
      normalizedSource.includes("arquitech") ||
      normalizedProduct.includes("arquitech") ||
      normalizedAgent === "aria";

    return {
      source,
      product,
      agent,
      entry,
      mode,
      onboarding,
      prechat,
      beta,
      returnTo,
      fromArquitech,
      fromAvatar: entry === "avatar" || prechat,
      fromDemo: normalizedSource.includes("demo"),
      fromPatroai: normalizedSource.includes("patroai"),
      fromOrkio: normalizedSource.includes("orkio"),
    };
  } catch {
    return {
      source: "",
      product: "",
      agent: "",
      entry: "",
      mode: "",
      onboarding: false,
      prechat: false,
      beta: false,
      returnTo: "",
      fromArquitech: false,
      fromAvatar: false,
      fromDemo: false,
      fromPatroai: false,
      fromOrkio: false,
    };
  }
}

function resolvePostAuthPath({ journey, location, user }) {
  if (journey?.fromArquitech) {
    markArquitechAccessPassed();
    return ARQUITECH_APP_PATH;
  }

  const redirect = sessionStorage.getItem("post_auth_redirect");

  return (
    consumeReturnTo(location) ||
    (isAdmin(user) && isAuthorizedAdminEmail(user?.email)
      ? "/admin"
      : redirect || DEFAULT_AFTER_LOGIN_PATH || "/app")
  );
}

function getAuthPresentation({ mode, otpMode, journey }) {
  const safeMode = otpMode ? "otp" : mode || "login";

  if (safeMode === "otp") {
    return {
      badge: "Acesso seguro",
      title: "Confirme seu acesso",
      subtitle:
        "Digite o código enviado para seu e-mail. Essa etapa protege sua sessão e preserva a continuidade da jornada.",
      panelTitle: "Validação com segurança",
      panelBody:
        "A Aria mantém o contexto preparado enquanto você conclui a verificação. Depois disso, seguimos para o ambiente certo.",
      steps: ["Código por e-mail", "Sessão validada", "Continuidade preservada"],
    };
  }

  if (safeMode === "forgot") {
    return {
      badge: "Recuperação",
      title: "Recupere seu acesso",
      subtitle: "Informe seu e-mail para receber instruções de recuperação de senha.",
      panelTitle: "Sem perder o caminho",
      panelBody:
        "A recuperação foi desenhada para ser simples: você confirma o e-mail, redefine a senha e volta para a jornada original.",
      steps: ["E-mail confirmado", "Senha redefinida", "Retorno seguro"],
    };
  }

  if (safeMode === "reset") {
    return {
      badge: "Nova senha",
      title: "Defina sua nova senha",
      subtitle: "Crie uma nova senha para recuperar seu acesso à plataforma.",
      panelTitle: "Acesso restaurado",
      panelBody:
        "Após atualizar a senha, você poderá entrar novamente e continuar sua jornada.",
      steps: ["Nova senha", "Conta protegida", "Login liberado"],
    };
  }

  if (safeMode === "register" && journey?.fromArquitech) {
    return {
      badge: "GLIP · Aria",
      title: "Crie sua conta para conversar com a Aria",
      subtitle:
        "Acesse a GLIP Intelligence Architecture com Aria como coordenadora inteligente do fluxo arquitetônico: briefing, propostas, contratos, projetos e obras.",
      panelTitle: "A GLIP preserva o contexto",
      panelBody:
        "Origem, intenção e retorno pós-login são mantidos para abrir o console diretamente no modo GLIP + Aria.",
      steps: ["Conta segura", "Aria conduz", "Diagnóstico inicial"],
    };
  }

  if (safeMode === "register") {
    return {
      badge: "Novo acesso",
      title: "Crie sua conta",
      subtitle:
        "Comece com um acesso gratuito para conhecer a jornada de inteligência operacional.",
      panelTitle: "Comece com clareza",
      panelBody:
        "A criação da conta prepara seu espaço para conversas, diagnósticos e evolução operacional.",
      steps: ["Conta criada", "Contexto inicial", "Ambiente liberado"],
    };
  }

  return {
    badge: "Bem-vindo de volta",
    title: "Continue de onde parou",
    subtitle:
      "Entre com e-mail e senha. Se a governança exigir, o código OTP será solicitado na próxima etapa.",
    panelTitle: "Memória e continuidade",
    panelBody:
      "O login recupera sua sessão, seu contexto e o próximo passo da jornada.",
    steps: ["Sessão recuperada", "Contexto preservado", "Próximo passo retomado"],
  };
}

function normalizeAuthErrorMessage(err, fallbackMessage) {
  if (!err) return fallbackMessage;
  if (err?.name === "AbortError" || err?.code === "AUTH_REQUEST_TIMEOUT") {
    return "A solicitação demorou demais. Tente novamente em instantes.";
  }

  const raw = String(err?.message || fallbackMessage || "Falha no acesso.").trim();
  if (!raw || raw === "[object Object]") return fallbackMessage || "Falha no acesso.";
  if (/failed to fetch|network|load failed/i.test(raw)) {
    return "Não consegui conectar ao servidor de autenticação. Tente novamente em instantes.";
  }
  if (/invalid session payload/i.test(raw)) {
    return "O servidor respondeu, mas a sessão não veio completa. Tente novamente.";
  }
  if (/checkout|asaas|billing/i.test(raw)) {
    return "O checkout está temporariamente desabilitado. Vamos seguir pelo acesso direto.";
  }
  return raw;
}

async function apiFetchWithTimeout(path, options = {}, timeoutMs = AUTH_REQUEST_TIMEOUT_MS) {
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timer = controller
    ? window.setTimeout(() => {
        try {
          controller.abort();
        } catch {}
      }, Math.max(1000, Number(timeoutMs || AUTH_REQUEST_TIMEOUT_MS)))
    : null;

  try {
    return await apiFetch(path, {
      ...options,
      signal: controller?.signal,
    });
  } catch (err) {
    if (controller?.signal?.aborted) {
      const timeoutErr = new Error("Authentication request timed out.");
      timeoutErr.name = "AbortError";
      timeoutErr.code = "AUTH_REQUEST_TIMEOUT";
      throw timeoutErr;
    }
    throw err;
  } finally {
    if (timer) window.clearTimeout(timer);
  }
}

const shell = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: 20,
  color: palette.ink,
  background:
    "radial-gradient(900px 580px at 12% 0%, rgba(247,200,98,0.16), transparent 58%), radial-gradient(760px 500px at 88% 10%, rgba(111,132,255,0.16), transparent 48%), linear-gradient(180deg, #02050a 0%, #050914 48%, #02050a 100%)",
};

const pageGrid = {
  width: "100%",
  maxWidth: 1180,
  display: "grid",
  gridTemplateColumns: "minmax(300px, 0.92fr) minmax(320px, 1fr)",
  gap: 24,
  alignItems: "stretch",
};

const card = {
  width: "100%",
  borderRadius: 34,
  border: `1px solid ${palette.line}`,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.095), rgba(255,255,255,0.045))",
  color: palette.ink,
  boxShadow: "0 30px 100px rgba(0,0,0,0.45)",
  padding: 28,
  boxSizing: "border-box",
  backdropFilter: "blur(20px)",
};

const sidePanel = {
  width: "100%",
  borderRadius: 34,
  border: `1px solid ${palette.line}`,
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.025))",
  color: palette.ink,
  boxShadow: "0 30px 100px rgba(0,0,0,0.38)",
  padding: 28,
  boxSizing: "border-box",
  backdropFilter: "blur(20px)",
  overflow: "hidden",
  position: "relative",
};

const sideChip = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 14px",
  borderRadius: 999,
  border: `1px solid ${palette.lineGold}`,
  background: "rgba(247,200,98,0.06)",
  fontSize: 11,
  fontWeight: 900,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: palette.goldSoft,
};

const label = {
  display: "block",
  marginBottom: 8,
  fontSize: 13,
  fontWeight: 850,
  color: "rgba(248,250,252,0.78)",
};

const input = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 18,
  border: `1px solid ${palette.inputBorder}`,
  background: palette.input,
  color: palette.ink,
  outline: "none",
  fontSize: 15,
  boxSizing: "border-box",
};

const btn = {
  width: "100%",
  border: 0,
  borderRadius: 20,
  padding: "15px 18px",
  fontWeight: 950,
  fontSize: 15,
  cursor: "pointer",
  background: "linear-gradient(135deg, #fff1cb 0%, #f7c862 48%, #a66f16 100%)",
  color: "#05070d",
  boxShadow: "0 22px 52px rgba(247,200,98,0.22)",
};

const secondaryBtn = {
  width: "100%",
  border: `1px solid ${palette.line}`,
  borderRadius: 20,
  padding: "15px 18px",
  fontWeight: 850,
  fontSize: 15,
  cursor: "pointer",
  background: "rgba(255,255,255,0.055)",
  color: "rgba(248,250,252,0.86)",
};

const linkBtn = {
  border: 0,
  background: "transparent",
  padding: 0,
  margin: 0,
  color: palette.goldSoft,
  fontWeight: 850,
  cursor: "pointer",
  textAlign: "left",
};

const adminChip = {
  border: `1px solid ${palette.lineGold}`,
  background: "rgba(247,200,98,0.08)",
  color: palette.goldSoft,
  fontSize: 12,
  padding: "7px 11px",
  borderRadius: 999,
  cursor: "pointer",
  fontWeight: 900,
};

const eyeBtn = {
  position: "absolute",
  right: 10,
  top: "50%",
  transform: "translateY(-50%)",
  border: 0,
  background: "transparent",
  color: palette.goldSoft,
  cursor: "pointer",
  fontWeight: 850,
};

const statusBox = {
  marginTop: 16,
  borderRadius: 20,
  border: `1px solid ${palette.lineGold}`,
  background: "rgba(247,200,98,0.08)",
  color: palette.goldSoft,
  padding: "12px 14px",
  fontSize: 14,
  lineHeight: 1.55,
};

function PasswordField({
  labelText,
  placeholder,
  value,
  onChange,
  show,
  onToggle,
  autoComplete,
}) {
  return (
    <label style={{ display: "block" }}>
      <span style={label}>{labelText}</span>
      <div style={{ position: "relative" }}>
        <input
          style={{ ...input, paddingRight: 92 }}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
        />
        <button type="button" onClick={onToggle} style={eyeBtn}>
          {show ? "Ocultar" : "Mostrar"}
        </button>
      </div>
    </label>
  );
}

export default function AuthPage() {
  const nav = useNavigate();
  const location = useLocation();
  const [tenant] = useState("public");

  const initialMode = (() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get("mode");
      if (["register", "login", "forgot", "reset"].includes(raw || "")) return raw;

      const entry = String(params.get("entry") || "").toLowerCase();
      const source = String(params.get("source") || "").toLowerCase();
      const onboarding = params.get("onboarding");
      const prechat = params.get("prechat");
      const product = String(params.get("product") || "").toLowerCase();
      const agent = String(params.get("agent") || "").toLowerCase();

      if (
        entry === "avatar" ||
        onboarding === "1" ||
        prechat === "1" ||
        source.includes("demo") ||
        source.includes("arquitech") ||
        product.includes("arquitech") ||
        agent === "aria"
      ) {
        return "register";
      }

      return "login";
    } catch {
      return "login";
    }
  })();

  const [mode, setMode] = useState(initialMode);
  const [otpMode, setOtpMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("free_trial");
  const [otpCode, setOtpCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetPasswordConfirm, setShowResetPasswordConfirm] = useState(false);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const loginWatchdogRef = useRef(null);
  const redirectedAfterLoginRef = useRef(false);

  const journey = useMemo(() => readAuthJourneyContext(location.search), [location.search]);
  const presentation = useMemo(
    () => getAuthPresentation({ mode, otpMode, journey }),
    [mode, otpMode, journey],
  );

  useEffect(() => {
    if (!journey?.fromArquitech) return;

    setMode((prev) => (prev === "register" ? prev : "register"));
    setAccessCode((prev) => prev || ARQUITECH_REGISTER_CODE);
    setSelectedPlan("free_trial");

    try {
      const url = new URL(window.location.href);
      if (!url.searchParams.get("mode")) {
        url.searchParams.set("mode", "register");
        window.history.replaceState({}, "", `${url.pathname}${url.search}`);
      }
    } catch {}
  }, [journey?.fromArquitech]);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlMode = params.get("mode");
      const urlToken = params.get("token");

      if (["register", "login", "forgot", "reset"].includes(urlMode || "")) {
        setMode(urlMode);
      }

      if (urlMode === "reset" && urlToken) {
        setResetToken(urlToken);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const existingToken = getToken();
    const user = getUser();

    if (existingToken && user && isApproved(user) && !redirectedAfterLoginRef.current) {
      const next = resolvePostAuthPath({ journey, location, user });
      sessionStorage.removeItem("post_auth_redirect");
      nav(next, { replace: true });
    }
  }, [journey, location, nav]);

  useEffect(() => {
    return () => {
      try {
        if (loginWatchdogRef.current) window.clearTimeout(loginWatchdogRef.current);
      } catch {}
    };
  }, []);

  const token = getToken();
  const currentUser = getUser();
  const showAdminShortcut =
    !!token &&
    !!currentUser &&
    isApproved(currentUser) &&
    isAdmin(currentUser) &&
    isAuthorizedAdminEmail(currentUser?.email);

  function setAuthMode(nextMode) {
    setMode(nextMode);
    setOtpMode(false);
    setOtpCode("");
    setStatus("");

    const url = new URL(window.location.href);
    url.searchParams.set("mode", nextMode);

    if (nextMode !== "reset") {
      url.searchParams.delete("token");
      setResetToken("");
    }

    window.history.replaceState({}, "", `${url.pathname}${url.search}`);
  }

  function goToAdminDirect() {
    nav("/admin");
  }

  async function fetchCurrentTermsVersion() {
    try {
      const { data } = await apiFetch("/api/public/legal/terms-version", {
        method: "GET",
        org: tenant,
        skipAuthRedirect: true,
      });

      return data?.terms_version || data?.version || getAcceptedTermsVersion() || null;
    } catch {
      return getAcceptedTermsVersion() || null;
    }
  }

  async function finalizeSession(data, resolvedTenant) {
    const nextTenant = resolvedTenant || tenant || "public";

    setTenant(nextTenant);

    if (!data?.access_token || !data?.user) {
      throw new Error("Invalid session payload.");
    }

    completeOtpLogin({
      ...data,
      tenant: nextTenant,
    });

    const pendingTerms = getPendingTermsAccepted();

    if (pendingTerms?.accepted) {
      try {
        const currentTermsVersion = await fetchCurrentTermsVersion();

        await apiFetchWithTimeout(
          "/api/me/accept-terms",
          {
            method: "POST",
            token: getToken(),
            org: nextTenant,
            skipAuthRedirect: true,
            body: {
              accepted: true,
              terms_version:
                pendingTerms.terms_version ||
                currentTermsVersion ||
                getAcceptedTermsVersion(),
            },
          },
          20000,
        );

        clearPendingTermsAccepted();
      } catch (err) {
        console.warn("terms acceptance sync failed", err);
      }
    }

    const storedUser = getUser();
    const next = resolvePostAuthPath({ journey, location, user: storedUser });

    sessionStorage.removeItem("post_auth_redirect");
    redirectedAfterLoginRef.current = true;

    setStatus("Acesso validado. Redirecionando com segurança...");

    try {
      if (loginWatchdogRef.current) window.clearTimeout(loginWatchdogRef.current);
    } catch {}

    loginWatchdogRef.current = window.setTimeout(() => {
      try {
        if (window.location.pathname !== next) {
          window.location.assign(next);
        }
      } catch {}
    }, POST_LOGIN_REDIRECT_FALLBACK_MS);

    nav(next, { replace: true });
  }

  async function completeRegistration({
    nameValue,
    emailValue,
    passwordValue,
    accessCodeValue = "",
  }) {
    const isArquitechFlow = !!journey?.fromArquitech;

    const registerPayload = {
      tenant,
      email: emailValue,
      name: nameValue,
      password: passwordValue,
      access_code: accessCodeValue || (isArquitechFlow ? ARQUITECH_REGISTER_CODE : undefined),
      accept_terms: acceptTerms,
      marketing_consent: false,
      source: isArquitechFlow ? "arquitech" : journey?.source || undefined,
      product: isArquitechFlow ? "arquitech" : journey?.product || undefined,
      agent: isArquitechFlow ? "aria" : journey?.agent || undefined,
    };

    stagePrechatImport({
      email: emailValue,
      name: nameValue,
      trial_days: 7,
      source: journey?.fromArquitech ? "arquitech-register" : "auth-register",
    });

    await apiFetch("/api/auth/register", {
      method: "POST",
      org: tenant,
      body: registerPayload,
    });

    setStatus("Conta criada. Verificando necessidade de código...");

    savePendingOtpContext({
      email: emailValue,
      tenant,
      name: nameValue,
      accessCode: accessCodeValue || (isArquitechFlow ? ARQUITECH_REGISTER_CODE : ""),
    });

    setPendingEmail(emailValue);
    setOtpMode(true);

    const { data: loginData } = await apiFetchWithTimeout(
      "/api/auth/login",
      {
        method: "POST",
        org: tenant,
        skipAuthRedirect: true,
        body: {
          tenant,
          email: emailValue,
          password: passwordValue,
          access_code:
            accessCodeValue || (journey?.fromArquitech ? ARQUITECH_REGISTER_CODE : undefined),
          source: journey?.fromArquitech ? "arquitech" : journey?.source || undefined,
          product: journey?.fromArquitech ? "arquitech" : journey?.product || undefined,
          agent: journey?.fromArquitech ? "aria" : journey?.agent || undefined,
        },
      },
      AUTH_REQUEST_TIMEOUT_MS,
    );

    if (loginData?.pending_otp) {
      savePendingOtpContext({
        email: loginData.email || emailValue,
        tenant,
        name: nameValue,
        accessCode: accessCodeValue || (isArquitechFlow ? ARQUITECH_REGISTER_CODE : ""),
      });

      setPendingEmail(loginData.email || emailValue);
      setStatus(loginData.message || "Código enviado. Verifique seu e-mail para entrar.");
      return;
    }

    if (loginData?.access_token && loginData?.user) {
      await finalizeSession(loginData, tenant);
      return;
    }

    setStatus(loginData?.message || "Conta criada, mas a validação não foi concluída corretamente.");
  }

  async function doRegister() {
    if (busy) return;

    if (password !== passwordConfirm) {
      setStatus("As senhas não conferem.");
      return;
    }

    if (!acceptTerms) {
      setStatus("Você precisa aceitar os termos para continuar.");
      return;
    }

    const nameNormalized = String(name || "").trim();
    const emailNormalized = normalizeEmail(email);
    const normalizedAccessCode = normalizeAccessCode(accessCode);

    if (!nameNormalized) {
      setStatus("Informe seu nome completo.");
      return;
    }

    if (!emailNormalized || !password) {
      setStatus("Preencha nome, e-mail e senha.");
      return;
    }

    setBusy(true);
    setStatus("Criando sua conta e preparando a continuidade da jornada...");

    try {
      // Asaas/billing/checkout está desabilitado neste patch.
      // Mesmo que o usuário escolha Founder/Pro/Team, seguimos pelo acesso direto.
      await completeRegistration({
        nameValue: nameNormalized,
        emailValue: emailNormalized,
        passwordValue: password,
        accessCodeValue: normalizedAccessCode,
      });
    } catch (err) {
      if (err?.status === 409) {
        setAuthMode("login");
        setEmail(emailNormalized);
        setStatus("Este e-mail já possui cadastro. Entre com sua senha para continuar.");
      } else {
        setStatus(normalizeAuthErrorMessage(err, "Não foi possível criar a conta."));
      }
    } finally {
      setBusy(false);
    }
  }

  async function doLogin() {
    if (busy) return;

    const emailNormalized = normalizeEmail(email);

    if (!emailNormalized || !password) {
      setStatus("Informe e-mail e senha.");
      return;
    }

    setBusy(true);
    setStatus("Validando acesso e recuperando contexto...");

    try {
      const { data } = await apiFetchWithTimeout(
        "/api/auth/login",
        {
          method: "POST",
          org: tenant,
          skipAuthRedirect: true,
          body: {
            tenant,
            email: emailNormalized,
            password,
            access_code: journey?.fromArquitech
              ? accessCode || ARQUITECH_REGISTER_CODE
              : accessCode || undefined,
            source: journey?.fromArquitech ? "arquitech" : journey?.source || undefined,
            product: journey?.fromArquitech ? "arquitech" : journey?.product || undefined,
            agent: journey?.fromArquitech ? "aria" : journey?.agent || undefined,
          },
        },
        AUTH_REQUEST_TIMEOUT_MS,
      );

      if (data?.pending_otp) {
        savePendingOtpContext({
          email: data.email || emailNormalized,
          tenant,
        });

        setPendingEmail(data.email || emailNormalized);
        setOtpMode(true);
        setStatus(data?.message || "Código enviado. Verifique seu e-mail.");
        return;
      }

      if (data?.access_token && data?.user) {
        await finalizeSession(data, tenant);
        return;
      }

      setStatus(data?.message || "Não foi possível concluir o login.");
    } catch (err) {
      setStatus(normalizeAuthErrorMessage(err, "Não foi possível entrar agora."));
    } finally {
      setBusy(false);
    }
  }

  async function doForgotPassword() {
    if (busy) return;

    const emailNormalized = normalizeEmail(email);

    if (!emailNormalized) {
      setStatus("Informe seu e-mail.");
      return;
    }

    setBusy(true);
    setStatus("Enviando instruções...");

    try {
      const { data } = await apiFetchWithTimeout(
        "/api/auth/forgot-password",
        {
          method: "POST",
          org: tenant,
          skipAuthRedirect: true,
          body: {
            tenant,
            email: emailNormalized,
          },
        },
        20000,
      );

      setStatus(data?.message || "Se a conta existir, enviaremos um link de recuperação.");
    } catch (err) {
      setStatus(normalizeAuthErrorMessage(err, "Não foi possível solicitar recuperação."));
    } finally {
      setBusy(false);
    }
  }

  async function doResetPassword() {
    if (busy) return;

    if (!resetToken) {
      setStatus("Token de recuperação ausente.");
      return;
    }

    if (password !== passwordConfirm) {
      setStatus("As senhas não conferem.");
      return;
    }

    if (!password || !passwordConfirm) {
      setStatus("Preencha os dois campos de senha.");
      return;
    }

    setBusy(true);
    setStatus("Atualizando sua senha...");

    try {
      const { data } = await apiFetchWithTimeout(
        "/api/auth/reset-password",
        {
          method: "POST",
          org: tenant,
          skipAuthRedirect: true,
          body: {
            tenant,
            token: resetToken,
            password,
            password_confirm: passwordConfirm,
          },
        },
        20000,
      );

      setStatus(data?.message || "Senha atualizada. Você já pode entrar.");
      setPassword("");
      setPasswordConfirm("");
      setAuthMode("login");
    } catch (err) {
      setStatus(normalizeAuthErrorMessage(err, "Não foi possível redefinir a senha."));
    } finally {
      setBusy(false);
    }
  }

  async function doVerifyOtp() {
    if (busy) return;

    const ctx = getPendingOtpContext();
    const resolvedTenant = ctx?.tenant || tenant;
    const emailNormalized = normalizeEmail(ctx?.email || pendingEmail || email);
    const code = String(otpCode || "").trim();

    if (!emailNormalized || !code) {
      setStatus("Informe o código enviado por e-mail.");
      return;
    }

    setBusy(true);
    setStatus("Validando código...");

    try {
      const { data } = await apiFetchWithTimeout(
        "/api/auth/login/verify-otp",
        {
          method: "POST",
          org: resolvedTenant,
          skipAuthRedirect: true,
          body: {
            tenant: resolvedTenant,
            email: emailNormalized,
            code,
          },
        },
        AUTH_REQUEST_TIMEOUT_MS,
      );

      if (!data?.access_token || !data?.user) {
        setStatus(data?.message || "Código inválido ou sessão não finalizada.");
        return;
      }

      await finalizeSession(data, resolvedTenant);
    } catch (err) {
      setStatus(normalizeAuthErrorMessage(err, "Falha na validação do código."));
    } finally {
      setBusy(false);
    }
  }

  function renderModeTabs() {
    if (otpMode) return null;

    const tabBase = {
      ...secondaryBtn,
      padding: "13px 16px",
      borderRadius: 18,
      boxShadow: "none",
    };

    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 22 }}>
        <button
          type="button"
          onClick={() => setAuthMode("login")}
          style={{
            ...tabBase,
            background: mode === "login" ? "rgba(247,200,98,0.14)" : "rgba(255,255,255,0.045)",
            borderColor: mode === "login" ? "rgba(247,200,98,0.46)" : palette.line,
            color: mode === "login" ? palette.goldSoft : "rgba(248,250,252,0.70)",
          }}
        >
          Entrar
        </button>

        <button
          type="button"
          onClick={() => setAuthMode("register")}
          style={{
            ...tabBase,
            background: mode === "register" ? "rgba(247,200,98,0.14)" : "rgba(255,255,255,0.045)",
            borderColor: mode === "register" ? "rgba(247,200,98,0.46)" : palette.line,
            color: mode === "register" ? palette.goldSoft : "rgba(248,250,252,0.70)",
          }}
        >
          Criar conta
        </button>
      </div>
    );
  }

  function renderOtpForm() {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          doVerifyOtp();
        }}
        style={{ display: "grid", gap: 14, marginTop: 22 }}
      >
        <label>
          <span style={label}>Código OTP</span>
          <input
            style={input}
            value={otpCode}
            onChange={(event) => setOtpCode(event.target.value)}
            placeholder="Código de 6 dígitos"
            inputMode="numeric"
            autoComplete="one-time-code"
          />
        </label>

        <button type="submit" disabled={busy} style={btn}>
          {busy ? "Validando..." : "Validar e continuar"}
        </button>

        <button
          type="button"
          onClick={() => {
            setOtpMode(false);
            setOtpCode("");
            setStatus("");
          }}
          style={secondaryBtn}
        >
          Voltar
        </button>
      </form>
    );
  }

  function renderLoginForm() {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          doLogin();
        }}
        style={{ display: "grid", gap: 14, marginTop: 22 }}
      >
        <label>
          <span style={label}>E-mail</span>
          <input
            style={input}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="voce@empresa.com"
            autoComplete="email"
          />
        </label>

        <PasswordField
          labelText="Senha"
          placeholder="Sua senha"
          value={password}
          show={showLoginPassword}
          onToggle={() => setShowLoginPassword((prev) => !prev)}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
        />

        <button type="submit" disabled={busy} style={btn}>
          {busy ? "Entrando..." : "Entrar e continuar"}
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <button type="button" onClick={() => setAuthMode("forgot")} style={linkBtn}>
            Esqueci minha senha
          </button>
          <button type="button" onClick={() => setAuthMode("register")} style={linkBtn}>
            Criar conta
          </button>
        </div>

        {showAdminShortcut ? (
          <button type="button" onClick={goToAdminDirect} style={secondaryBtn}>
            Ir para Admin
          </button>
        ) : null}
      </form>
    );
  }

  function renderRegisterForm() {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          doRegister();
        }}
        style={{ display: "grid", gap: 14, marginTop: 22 }}
      >
        <label>
          <span style={label}>Nome completo</span>
          <input
            style={input}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Seu nome"
            autoComplete="name"
          />
        </label>

        <label>
          <span style={label}>E-mail</span>
          <input
            style={input}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="voce@empresa.com"
            autoComplete="email"
          />
        </label>

        <PasswordField
          labelText="Senha"
          placeholder="Crie uma senha"
          value={password}
          show={showPassword}
          onToggle={() => setShowPassword((prev) => !prev)}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
        />

        <PasswordField
          labelText="Confirmar senha"
          placeholder="Repita sua senha"
          value={passwordConfirm}
          show={showPasswordConfirm}
          onToggle={() => setShowPasswordConfirm((prev) => !prev)}
          onChange={(event) => setPasswordConfirm(event.target.value)}
          autoComplete="new-password"
        />

        <label>
          <span style={label}>Código promocional, convite ou acesso interno</span>
          <input
            style={input}
            value={accessCode}
            onChange={(event) => setAccessCode(event.target.value)}
            placeholder="Opcional"
            autoComplete="off"
          />
        </label>

        <label>
          <span style={label}>Tipo de acesso</span>
          <select
            style={input}
            value={selectedPlan}
            onChange={(event) => setSelectedPlan(event.target.value)}
          >
            <option value="free_trial">Diagnóstico inicial gratuito</option>
            <option value="founder_access">Founder Access</option>
            <option value="pro_access">Pro Access</option>
            <option value="team_access">Team Access</option>
          </select>
        </label>

        <label style={{ display: "flex", gap: 10, alignItems: "flex-start", color: palette.muted, fontSize: 13, lineHeight: 1.55 }}>
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(event) => setAcceptTerms(event.target.checked)}
            style={{ marginTop: 3 }}
          />
          <span>
            Aceito os termos de uso, política de privacidade e tratamento seguro dos dados pela GLIP/PatroAI.
          </span>
        </label>

        <div
          style={{
            border: `1px solid ${palette.lineGold}`,
            background: "rgba(247,200,98,0.07)",
            color: palette.goldSoft,
            borderRadius: 16,
            padding: "10px 12px",
            fontSize: 12,
            lineHeight: 1.45,
          }}
        >
          Checkout e cobrança estão temporariamente desabilitados. O acesso seguirá direto para
          cadastro, login e ambiente Aria.
        </div>

        <button type="submit" disabled={busy} style={btn}>
          {busy ? "Preparando acesso..." : "Criar conta e continuar"}
        </button>

        <button type="button" onClick={() => setAuthMode("login")} style={linkBtn}>
          Já tenho conta. Entrar.
        </button>
      </form>
    );
  }

  function renderForgotForm() {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          doForgotPassword();
        }}
        style={{ display: "grid", gap: 14, marginTop: 22 }}
      >
        <label>
          <span style={label}>E-mail</span>
          <input
            style={input}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="voce@empresa.com"
            autoComplete="email"
          />
        </label>

        <button type="submit" disabled={busy} style={btn}>
          {busy ? "Enviando..." : "Enviar instruções"}
        </button>

        <button type="button" onClick={() => setAuthMode("login")} style={linkBtn}>
          Voltar para login
        </button>
      </form>
    );
  }

  function renderResetForm() {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          doResetPassword();
        }}
        style={{ display: "grid", gap: 14, marginTop: 22 }}
      >
        <PasswordField
          labelText="Nova senha"
          placeholder="Crie uma nova senha"
          value={password}
          show={showResetPassword}
          onToggle={() => setShowResetPassword((prev) => !prev)}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
        />

        <PasswordField
          labelText="Confirmar nova senha"
          placeholder="Repita a nova senha"
          value={passwordConfirm}
          show={showResetPasswordConfirm}
          onToggle={() => setShowResetPasswordConfirm((prev) => !prev)}
          onChange={(event) => setPasswordConfirm(event.target.value)}
          autoComplete="new-password"
        />

        <button type="submit" disabled={busy} style={btn}>
          {busy ? "Atualizando..." : "Atualizar senha"}
        </button>

        <button type="button" onClick={() => setAuthMode("login")} style={linkBtn}>
          Voltar para login
        </button>
      </form>
    );
  }

  function renderActiveForm() {
    if (otpMode) return renderOtpForm();
    if (mode === "forgot") return renderForgotForm();
    if (mode === "reset") return renderResetForm();
    if (mode === "register") return renderRegisterForm();
    return renderLoginForm();
  }

  const originLabel = journey.fromArquitech
    ? "landing GLIP / Aria"
    : journey.fromAvatar
      ? "avatar / pré-chat"
      : journey.fromDemo
        ? "demonstração"
        : journey.fromPatroai
          ? "landing PatroAI"
          : journey.fromOrkio
            ? "landing Orkio"
            : "";

  return (
    <main style={shell}>
      <section style={pageGrid}>
        <aside style={sidePanel}>
          <span style={sideChip}>{presentation.badge}</span>

          <h1
            style={{
              margin: "34px 0 14px",
              fontSize: "clamp(34px, 5vw, 58px)",
              letterSpacing: "-0.06em",
              lineHeight: 0.95,
            }}
          >
            GLIP + Aria
          </h1>

          <h2 style={{ margin: "0 0 12px", fontSize: 22 }}>{presentation.panelTitle}</h2>

          <p style={{ color: palette.muted, lineHeight: 1.65, fontSize: 15 }}>
            {presentation.panelBody}
          </p>

          <div style={{ display: "grid", gap: 10, marginTop: 26 }}>
            {presentation.steps.map((step, index) => (
              <div
                key={`${step}-${index}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "rgba(248,250,252,0.76)",
                  border: `1px solid ${palette.line}`,
                  borderRadius: 16,
                  padding: "12px 14px",
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                <strong style={{ color: palette.goldSoft }}>{index + 1}</strong>
                <span>{step}</span>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 26,
              borderRadius: 24,
              border: `1px solid ${palette.line}`,
              background: "rgba(255,255,255,0.045)",
              padding: 18,
            }}
          >
            <strong style={{ display: "block", marginBottom: 8 }}>Continuidade de contexto</strong>
            <span style={{ color: palette.muted, lineHeight: 1.55, fontSize: 13 }}>
              Origem, intenção, retorno pós-login e diagnóstico iniciado são preservados sem
              criar rotas novas.
            </span>
          </div>
        </aside>

        <section style={card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <span style={sideChip}>{journey.fromArquitech ? "Acesso GLIP" : "Acesso"}</span>
            {showAdminShortcut ? (
              <button type="button" style={adminChip} onClick={goToAdminDirect}>
                Admin
              </button>
            ) : null}
          </div>

          <h1
            style={{
              margin: "24px 0 10px",
              fontSize: "clamp(28px, 4vw, 42px)",
              letterSpacing: "-0.05em",
              lineHeight: 1,
            }}
          >
            {presentation.title}
          </h1>

          <p style={{ color: palette.muted, lineHeight: 1.62, fontSize: 15 }}>
            {presentation.subtitle}
          </p>

          {originLabel ? (
            <div style={statusBox}>
              Origem reconhecida: <strong>{originLabel}</strong>. Vamos manter essa intenção
              durante o acesso.
            </div>
          ) : null}

          {renderModeTabs()}
          {renderActiveForm()}

          {status ? <div style={statusBox}>{status}</div> : null}

          <p
            style={{
              marginTop: 22,
              color: palette.faint,
              fontSize: 12,
              lineHeight: 1.55,
            }}
          >
            Privacidade por design • OTP quando necessário • Retorno seguro para /app
          </p>
        </section>
      </section>
    </main>
  );
}
