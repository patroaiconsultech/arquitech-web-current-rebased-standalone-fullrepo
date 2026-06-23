AO-GLIP02 — APPCONSOLE ARIA HARDLOCK
CAMINHO REAL NO GITHUB:
src/routes/AppConsole.jsx

PROBLEMA:
A autenticação já funciona e o /app abre, mas o console ainda mostra e responde como Orkio.

SINTOMAS:
- Sidebar mostra "Orkio".
- Header mostra "Destino: Team • @Team / @Orkio / @Chris / @Orion".
- Resposta inicial vem como "Sou Orkio, o copiloto inteligente da PatroAI".
- Mesmo com URL contendo source=arquitech&agent=aria&product=arquitech, a camada de console ainda deixa o runtime cair no host/default Orkio.

CAUSA PROVÁVEL:
No AppConsole.jsx, o modo Arquitech existe, mas:
1. ainda há labels hardcoded de Orkio;
2. o destino visual ainda mostra Team/Orkio/Chris/Orion;
3. buildDestinationContract pode fazer fallback para hostAgentId quando não encontra Aria em /api/agents;
4. esse fallback manda Orkio como agente real, mesmo em modo GLIP/Aria.

OBJETIVO:
Forçar, somente em isArquitechMode:
- visual: GLIP + Aria;
- destino: Aria;
- payload: source=arquitech, product=arquitech, visible_agent=Aria, target_agent_slug=aria;
- sem fallback para hostAgentId/Orkio;
- sem expor Team, Chris, Orion ou Orkio na UX.

NÃO TOCAR:
- backend;
- runtime;
- orchestrator;
- auth;
- billing;
- banco;
- server.cjs;
- api.js.

============================================================
PATCH CIRÚRGICO 1 — buildDestinationContract
============================================================

No AppConsole.jsx, procure a função:

function buildDestinationContract(rawMessage = "", hostAgentId = null) {

Dentro dela, procure este bloco:

if (isArquitechMode) {
  const aria = findAriaAgentRecord(agents);
  const ariaId = aria?.id || hostAgentId || null;
  return {
    dest_mode: "single",
    agent_id: ariaId,
    agent_ids: [],
    target_agent_slug: ariaId || "aria",
    visible_agent: "ARIA",
    requested_agent_names: [],
    source: "arquitech",
    product: "arquitech",
  };
}

Substitua por:

if (isArquitechMode) {
  const aria = findAriaAgentRecord(agents);
  const ariaId = aria?.id || null;

  return {
    dest_mode: "single",
    agent_id: ariaId,
    agent_ids: [],
    target_agent_slug: "aria",
    visible_agent: "Aria",
    requested_agent_names: ["Aria"],
    source: "arquitech",
    product: "arquitech",
  };
}

============================================================
PATCH CIRÚRGICO 2 — resolveHostAgentId
============================================================

Na função:

function resolveHostAgentId(modeOverride = null) {

confirme que o primeiro bloco fica assim:

if (isArquitechMode) {
  const aria = findAriaAgentRecord(agents);
  return aria?.id || null;
}

Não deixe retornar Orkio como fallback em modo Arquitech.

Se estiver assim:

if (isArquitechMode) {
  const aria = findAriaAgentRecord(agents);
  if (aria?.id) return aria.id;
}

adicione:

return null;

logo depois.

============================================================
PATCH CIRÚRGICO 3 — appendToPlaceholder
============================================================

Procure:

agent_name: "Orkio",

dentro de appendToPlaceholder.

Troque por:

agent_name: isArquitechMode ? "Aria" : "Orkio",

============================================================
PATCH CIRÚRGICO 4 — initialDraftAgentName
============================================================

Procure o bloco que monta initialDraftAgentName.

Ele deve ficar assim:

const initialDraftAgentName = isArquitechMode
  ? "Aria"
  : resolveAssistantDisplayName(
      {
        agent_name: destinationContract.visible_agent || activeRuntimeAgent || (destMode === "team" ? "Orkio" : ""),
        content: finalMsg,
      },
      destMode === "team" ? "Orkio" : "Agent"
    );

============================================================
PATCH CIRÚRGICO 5 — setActiveRuntimeAgent
============================================================

Procure:

setActiveRuntimeAgent("Orkio");

Troque por:

setActiveRuntimeAgent(isArquitechMode ? "Aria" : "Orkio");

============================================================
PATCH CIRÚRGICO 6 — execution trace
============================================================

Procure:

label: "Enviando para o runtime dOrkio",

Troque por:

label: isArquitechMode ? "Enviando para Aria" : "Enviando para o runtime Orkio",

Procure o detail baseado em Team/Multi/Agente e troque o primeiro item do resetExecutionTrace por algo assim:

{
  kind: "system",
  label: "Solicitação recebida",
  detail: isArquitechMode
    ? "Modo GLIP + Aria acionado."
    : destMode === "team"
      ? "Modo Team acionado."
      : destMode === "multi"
        ? "Execução multiagente preparada."
        : agentIdToSend
          ? "Agente definido para esta execução."
          : "Roteamento automático preparado.",
}

============================================================
PATCH CIRÚRGICO 7 — sidebar title
============================================================

Procure no JSX do sidebar o texto:

Orkio

Troque por expressão condicional:

{isArquitechMode ? "GLIP" : "Orkio"}

Se for difícil editar como expressão, pode trocar diretamente por:

GLIP

porque este frontend é da Arquitech/GLIP.

============================================================
PATCH CIRÚRGICO 8 — destino visual
============================================================

Procure este texto no JSX:

Destino: {destMode === "team" ? "Team" : destMode === "single" ? "Agente" : "Multi"} • @Team / @Orkio / @Chris / @Orion

Troque por:

{isArquitechMode ? (
  <>Destino: Aria • GLIP Flow Intelligence</>
) : (
  <>Destino: {destMode === "team" ? "Team" : destMode === "single" ? "Agente" : "Multi"} • @Team / @Orkio / @Chris / @Orion</>
)}

============================================================
PATCH CIRÚRGICO 9 — chip superior
============================================================

Procure:

Arquitech · ARIA única

Troque por:

GLIP · Aria

============================================================
PATCH CIRÚRGICO 10 — fallback agent_name em erros
============================================================

Procure ocorrências de:

agent_name: "Orkio",

Troque as ocorrências dentro de mensagens/fallbacks por:

agent_name: isArquitechMode ? "Aria" : "Orkio",

============================================================
PATCH CIRÚRGICO 11 — limpar boas-vindas antiga em threads novas
============================================================

Se a resposta antiga "Sou Orkio..." continuar aparecendo por histórico, crie uma conversa nova após o deploy.

Se aparecer em conversa nova, o backend ainda está respondendo pelo default Orkio.
Nesse caso, aplicar o patch backend posterior:
- garantir que aria_profile.py esteja salvo na raiz do backend;
- confirmar se o backend carrega profile="aria" quando source=arquitech/product=arquitech/target_agent_slug=aria.

VALIDAÇÃO:
1. Commit:
AO-GLIP02 hardlock AppConsole to Aria in GLIP mode

2. Redeploy frontend.

3. Abrir:
https://web-arquitech-com-amor-sa.up.railway.app/app?source=arquitech&agent=aria&product=arquitech&onboarding=1

4. Esperado:
- Sidebar: GLIP
- Badge: GLIP · Aria
- Destino: Aria • GLIP Flow Intelligence
- Mensagem do assistente: Aria
- Sem Team/Orkio/Chris/Orion visível na UX GLIP.

5. Se a resposta textual ainda disser "Sou Orkio":
- não é mais UI;
- é roteamento backend/profile;
- próximo patch será backend Aria runtime mapping.
