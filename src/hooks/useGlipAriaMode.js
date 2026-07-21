import { useMemo } from "react";

function normalizeSlug(value = "") {
  return String(value || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function readGlipAriaConsoleMode() {
  if (typeof window === "undefined") return false;
  try {
    const params = new URLSearchParams(window.location.search || "");
    const source = normalizeSlug(params.get("source"));
    const product = normalizeSlug(params.get("product"));
    const agent = normalizeSlug(params.get("agent"));
    const path = normalizeSlug(window.location.pathname || "");

    const explicitNonArquitech =
      source.includes("patroai") ||
      source.includes("orkio") ||
      product.includes("patroai") ||
      product.includes("orkio") ||
      agent === "orkio";

    if (explicitNonArquitech) return false;

    const explicitArquitech =
      source === "arquitech" ||
      source === "glip" ||
      product === "arquitech" ||
      product === "glip" ||
      product.includes("glip") ||
      agent === "aria";

    if (explicitArquitech) return true;

    // AO-GLIP08: este frontend é o standalone da Arquitech/GLIP.
    // Quando o usuário chega em /app sem querystring, a experiência correta
    // continua sendo Aria, não o console antigo multiagente da Patroai.
    return path === "app" || path.endsWith("/app");
  } catch {
    return false;
  }
}

export function isGlipAriaAgentRecord(agent) {
  const name = normalizeSlug(agent?.name);
  const description = normalizeSlug(agent?.description);
  const slug = normalizeSlug(agent?.slug || agent?.id);
  return (
    name === "aria" ||
    slug === "aria" ||
    name.includes("aria") ||
    name.includes("arquitech") ||
    name.includes("glip") ||
    description.includes("aria") ||
    description.includes("arquitech") ||
    description.includes("glip")
  );
}

export function findGlipAriaAgentRecord(list) {
  const rows = Array.isArray(list) ? list : [];
  return (
    rows.find((agent) => normalizeSlug(agent?.name) === "aria") ||
    rows.find((agent) => normalizeSlug(agent?.slug || agent?.id) === "aria") ||
    rows.find((agent) => isGlipAriaAgentRecord(agent)) ||
    null
  );
}

export function buildVirtualGlipAriaAgent() {
  return {
    id: "aria",
    agent_key: "aria",
    slug: "aria",
    name: "Aria",
    display_name: "Aria",
    description:
      "Inteligência operacional da GLIP para arquitetura comercial, briefing, propostas, contratos, projetos e obras.",
    role: "glip_architecture_operator",
    team: "glip",
    persisted: false,
    source_status: "virtual_frontend_fallback",
    is_default: true,
    voice_id: "marin",
  };
}

export function ensureGlipAriaAgentList(list) {
  const rows = Array.isArray(list) ? list : [];
  const aria = findGlipAriaAgentRecord(rows);
  if (aria) {
    return [
      {
        ...aria,
        id: aria.id || "aria",
        agent_key: "aria",
        slug: "aria",
        name: "Aria",
        display_name: "Aria",
        is_default: true,
      },
    ];
  }
  return [buildVirtualGlipAriaAgent()];
}

export function coerceGlipAriaAgentName(name = "Agent") {
  const raw = String(name || "").trim();
  const slug = normalizeSlug(raw);

  if (!raw) return "Aria";

  if (
    slug === "orkio" ||
    slug === "agent" ||
    slug === "agente" ||
    slug === "assistant" ||
    slug === "model" ||
    slug === "aria" ||
    slug.includes("orkio") ||
    slug.includes("patroai") ||
    slug.includes("team") ||
    slug.includes("chris") ||
    slug.includes("orion") ||
    slug.includes("auditor")
  ) {
    return "Aria";
  }

  return raw;
}

const GLIP_ARIA_FALLBACK = [
  "Sou Aria, a inteligência operacional da GLIP Intelligence Architecture.",
  "",
  "Minha especialidade é organizar o fluxo de arquitetura comercial, corporativa e médica para que briefing, proposta, contrato, projeto e obra caminhem com clareza, rastreabilidade e cuidado humano.",
  "",
  "Posso ajudar a GLIP assim:",
  "",
  "1. Briefing",
  "Estruturo necessidades do cliente, perfil do negócio, restrições do ponto, referências, orçamento, prazo, prioridades e decisões pendentes.",
  "",
  "2. Proposta",
  "Transformo o briefing em escopo comercial, etapas, entregáveis, honorários, prazos, premissas e próximos passos.",
  "",
  "3. Contrato",
  "Organizo documentos, anexos, aprovações, pendências e pontos de atenção para reduzir ruído entre proposta e execução.",
  "",
  "4. Projeto",
  "Apoio a memória do projeto: versões, decisões, responsáveis, arquivos, aprovações e comunicação com cliente e fornecedores.",
  "",
  "5. Obra",
  "Ajudo a acompanhar visitas, cronograma, ocorrências, riscos, evidências e encaminhamentos até a entrega.",
  "",
  "A decisão técnica continua sendo da equipe GLIP. Eu trabalho nos bastidores para dar método, memória e clareza ao processo."
].join("\n");

function isWrongGlipRuntimeResponse(text) {
  return (
    /PATCH GOVERNANCE RESPONSE/i.test(text) ||
    /patch_mode\s*:/i.test(text) ||
    /audit_receipt_id\s*:/i.test(text) ||
    /Artifact execut[áa]vel/i.test(text) ||
    /Aprovar patch/i.test(text) ||
    /Diff preview/i.test(text) ||
    /Rollback:/i.test(text) ||
    /AUDITORIA FOCADA/i.test(text) ||
    /\bAO\d+[A-Z0-9_-]*\b/i.test(text) ||
    /terminal guard/i.test(text) ||
    /runtime principal/i.test(text) ||
    /runtime protegido/i.test(text) ||
    /stream principal/i.test(text) ||
    /stream foi encerrado/i.test(text) ||
    /recupera[çc][aã]o [úu]til/i.test(text) ||
    /nenhuma escrita/i.test(text) ||
    /\bbranch\b/i.test(text) ||
    /\bdeploy\b/i.test(text) ||
    /summit_investor/i.test(text) ||
    /technical_audit/i.test(text) ||
    /Router Precedence/i.test(text) ||
    /Router AO/i.test(text) ||
    /ORKIO|PatroAI|PATROAI/i.test(text) ||
    /Business Plan/i.test(text) ||
    /Business Plan vivo/i.test(text) ||
    /agentes personalizados/i.test(text) ||
    /equipe consultiva premium/i.test(text) ||
    /wa\.me\/5551989697605/i.test(text)
  );
}

export function normalizeGlipAriaAssistantContent(value = "") {
  const original = String(value || "");
  if (!original) return original;

  if (isWrongGlipRuntimeResponse(original)) {
    return GLIP_ARIA_FALLBACK;
  }

  return original
    .replace(/Sou\s+Orkio,\s*o\s+copiloto\s+inteligente\s+da\s+PatroAI!?/gi, "Sou Aria, a inteligência operacional da GLIP.")
    .replace(/Sou\s+Orkio/gi, "Sou Aria")
    .replace(/\bOrkio\b/g, "Aria")
    .replace(/\bORKIO\b/g, "ARIA")
    .replace(/\bPatroAI\b/g, "GLIP")
    .replace(/\bPatroai\b/g, "GLIP")
    .replace(/\bPatroaí\b/g, "GLIP")
    .replace(/\bTeam\b/g, "Aria")
    .replace(/\bChris\b/g, "Aria")
    .replace(/\bOrion\b/g, "Aria");
}

export function buildGlipAriaDestinationContract(agents = []) {
  const aria = findGlipAriaAgentRecord(agents);
  const ariaId = aria?.id || "aria";

  return {
    dest_mode: "single",
    agent_id: ariaId,
    agent_ids: [],
    target_agent_slug: "aria",
    visible_agent: "Aria",
    requested_agent_names: ["Aria"],
    source: "arquitech",
    product: "arquitech",
    context_mode: "glip_aria",
    runtime_persona: "glip_aria_architecture",
    persona_lock: "glip_aria_architecture",
  };
}

export default function useGlipAriaMode({ agents = [] } = {}) {
  const isGlipAriaMode = readGlipAriaConsoleMode();

  return useMemo(
    () => ({
      isGlipAriaMode,
      assistantName: isGlipAriaMode ? "Aria" : "Orkio",
      findAriaAgentRecord: () => findGlipAriaAgentRecord(agents),
      coerceAgentName: (name) => (isGlipAriaMode ? coerceGlipAriaAgentName(name) : name || "Agent"),
      normalizeAssistantContent: (content) =>
        isGlipAriaMode ? normalizeGlipAriaAssistantContent(content) : String(content || ""),
      buildDestinationContract: () => buildGlipAriaDestinationContract(agents),
    }),
    [isGlipAriaMode, agents],
  );
}
