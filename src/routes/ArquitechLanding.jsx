import React from "react";
import { Link } from "react-router-dom";

import "../styles/arquitech.css";

/**
 * GLIP-01 — Narrative & Brand Layer
 *
 * Observação operacional:
 * Os parâmetros abaixo preservam o hardlock técnico já existente no fluxo Arquitech.
 * A experiência visível passa a ser GLIP + Aria, sem expor Orkio/PatroAI ao usuário.
 */
const authUrl = "/auth?source=arquitech&agent=aria&product=arquitech&onboarding=1";
const sabrinaHasseImg = "/arquitech-assets/sabrina-hasse.jpeg";

const modules = [
  {
    eyebrow: "GLIP CRM",
    title: "Clientes e briefings",
    text:
      "Organize leads, dados do cliente, briefing inicial, necessidades do projeto e próximos passos em uma jornada clara.",
  },
  {
    eyebrow: "GLIP Proposal",
    title: "Propostas configuráveis",
    text:
      "Estruture escopo, etapas, prazos, honorários, versões e aprovações antes de avançar para contratação.",
  },
  {
    eyebrow: "GLIP Contracts",
    title: "Contratos organizados",
    text:
      "Centralize minutas, pendências, revisões, aceite, anexos e histórico para reduzir ruído entre proposta e execução.",
  },
  {
    eyebrow: "GLIP Studio",
    title: "Projetos, arquivos e versões",
    text:
      "Conecte etapas, responsáveis, entregáveis, documentos técnicos, versões e aprovações sem substituir CAD, BIM ou SketchUp.",
  },
  {
    eyebrow: "GLIP Works",
    title: "Obras e fornecedores",
    text:
      "Acompanhe visitas, ocorrências, cronogramas, riscos, evidências e comunicação com fornecedores em um fluxo único.",
  },
  {
    eyebrow: "GLIP Insights",
    title: "Indicadores e margem",
    text:
      "Visualize prazo, custo, status, margem, pendências e decisões para conduzir cada projeto com mais previsibilidade.",
  },
];

const flow = [
  "Briefing",
  "Proposta",
  "Contrato",
  "Projeto",
  "Obra",
  "Portal do cliente",
  "Indicadores",
];

const projectTypes = [
  "lojas de shopping",
  "clínicas e consultórios",
  "escritórios corporativos",
  "interiores comerciais",
  "retrofit e reformas",
  "obras em execução",
];

export default function ArquitechLanding() {
  return (
    <main className="arquitech-page" id="top">
      <section className="arquitech-hero">
        <nav className="arquitech-nav" aria-label="Navegação principal">
          <Link className="arquitech-brand" to="/arquitech" aria-label="GLIP Intelligence Architecture">
            <span className="arquitech-brand-mark" aria-hidden="true">
              G
            </span>
            <span>
              GLIP
              <small>Intelligence Architecture</small>
            </span>
          </Link>

          <div className="arquitech-nav-actions">
            <a href="#quem-somos">Quem somos</a>
            <a href="#flow">Fluxo</a>
            <a href="#modules">Módulos</a>
            <a href="#aria">Aria</a>
            <Link className="arquitech-nav-cta" to={authUrl}>
              Falar com Aria
            </Link>
          </div>
        </nav>

        <div className="arquitech-hero-grid">
          <div className="arquitech-hero-copy">
            <p className="arquitech-kicker">GLIP Flow Intelligence</p>
            <h1>Arquitetura fluida. Projetos organizados. Obras acompanhadas com inteligência.</h1>
            <p className="arquitech-lead">
              A GLIP Intelligence Architecture conecta briefing, cliente, proposta, contrato, projeto,
              obra e indicadores em uma jornada digital clara, elegante e rastreável.
            </p>

            <div className="arquitech-hero-actions">
              <Link className="arquitech-primary-button" to={authUrl}>
                Iniciar briefing com Aria
              </Link>
              <a className="arquitech-secondary-button" href="#modules">
                Ver módulos da plataforma
              </a>
            </div>

            <p className="arquitech-fineprint">
              Tecnologia discreta, experiência humana e método arquitetônico preservado. A inteligência
              trabalha nos bastidores para dar clareza ao fluxo, não para substituir a responsabilidade
              profissional.
            </p>
          </div>

          <aside className="arquitech-aria-card" id="aria" aria-label="Apresentação da Aria">
            <div className="arquitech-card-header">
              <div className="arquitech-avatar" aria-hidden="true">
                A
              </div>
              <div>
                <strong>Aria</strong>
                <span>Coordenadora inteligente do fluxo arquitetônico</span>
              </div>
            </div>

            <div className="arquitech-chat-preview">
              <p className="arquitech-user-bubble">
                Tenho uma clínica em fase de briefing e preciso organizar proposta, contrato,
                cronograma e documentos.
              </p>
              <p className="arquitech-aria-bubble">
                <strong>Diagnóstico inicial</strong>
                <span>
                  Vamos estruturar o briefing, separar pendências, preparar a proposta, mapear riscos,
                  organizar documentos e definir uma rota segura até contrato, projeto e obra.
                </span>
              </p>
            </div>

            <div className="arquitech-mini-metrics" aria-label="Capacidades principais">
              <span>Briefing</span>
              <span>Propostas</span>
              <span>Contratos</span>
              <span>Obras</span>
            </div>
          </aside>
        </div>
      </section>

      <section className="arquitech-section" id="quem-somos" aria-labelledby="quem-somos-title">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "clamp(28px, 5vw, 56px)",
            alignItems: "center",
          }}
        >
          <div>
            <p className="arquitech-kicker">Quem somos</p>
            <h2 id="quem-somos-title">A GLIP nasce da prática real da arquitetura.</h2>
            <p>
              A GLIP Arquitetura une visão estética, organização de processos e inteligência
              aplicada para conduzir projetos com mais clareza, presença e previsibilidade.
            </p>
            <p>
              À frente dessa jornada está a arquiteta Sabrina Hasse, que traduz a essência da
              marca em uma experiência próxima, sofisticada e funcional: escuta ativa, atenção
              aos detalhes e compromisso com ambientes que conectam propósito, beleza e uso real.
            </p>

            <div
              style={{
                display: "grid",
                gap: "14px",
                marginTop: "28px",
              }}
            >
              <article className="arquitech-flow-item" style={{ alignItems: "flex-start" }}>
                <span>01</span>
                <strong>Escuta e briefing com clareza</strong>
              </article>
              <article className="arquitech-flow-item" style={{ alignItems: "flex-start" }}>
                <span>02</span>
                <strong>Projeto com método, repertório e sensibilidade</strong>
              </article>
              <article className="arquitech-flow-item" style={{ alignItems: "flex-start" }}>
                <span>03</span>
                <strong>Jornada acompanhada pela Aria e pela equipe GLIP</strong>
              </article>
            </div>
          </div>

          <aside
            aria-label="Arquiteta Sabrina Hasse"
            style={{
              borderRadius: "32px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.16)",
              background: "rgba(255,255,255,0.08)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.28)",
            }}
          >
            <img
              src={sabrinaHasseImg}
              alt="Arquiteta Sabrina Hasse segurando uma pasta da GLIP Arquitetura"
              loading="lazy"
              decoding="async"
              style={{
                display: "block",
                width: "100%",
                aspectRatio: "4 / 5",
                objectFit: "cover",
                objectPosition: "center top",
              }}
            />

            <div style={{ padding: "22px 24px 26px" }}>
              <p className="arquitech-kicker" style={{ marginBottom: "8px" }}>
                Arquiteta responsável
              </p>
              <h3 style={{ margin: 0, fontSize: "clamp(1.35rem, 2vw, 1.85rem)" }}>
                Sabrina Hasse
              </h3>
              <p style={{ marginTop: "10px", marginBottom: 0, opacity: 0.78, lineHeight: 1.65 }}>
                Presença humana, olhar técnico e sensibilidade estética para transformar
                briefing, projeto e execução em uma experiência mais fluida.
              </p>
            </div>
          </aside>
        </div>
      </section>


      <section className="arquitech-section" id="flow">
        <div className="arquitech-section-heading">
          <p className="arquitech-kicker">Jornada ponta a ponta</p>
          <h2>Do primeiro contato ao acompanhamento da obra.</h2>
          <p>
            A GLIP Flow Intelligence transforma informações soltas em uma sequência compreensível:
            cliente, briefing, proposta, contrato, projeto, execução e indicadores.
          </p>
        </div>

        <div className="arquitech-flow">
          {flow.map((item, index) => (
            <article key={item} className="arquitech-flow-item">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="arquitech-section arquitech-systems" id="modules">
        <div>
          <p className="arquitech-kicker">Módulos de negócio</p>
          <h2>Uma plataforma para preservar contexto, decisão e execução.</h2>
          <p>
            A Aria organiza o fluxo para que a equipe tenha clareza do próximo passo e o cliente
            perceba acompanhamento real em cada etapa.
          </p>
        </div>

        <div className="arquitech-system-grid">
          {["CRM", "Propostas", "Contratos", "Studio", "Works", "Insights"].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="arquitech-section">
        <div className="arquitech-section-heading">
          <p className="arquitech-kicker">Arquitetura operacional</p>
          <h2>Propostas, contratos, projetos e obras no mesmo raciocínio.</h2>
          <p>
            Cada módulo foi pensado para reduzir retrabalho, preservar decisões e facilitar a
            continuidade entre equipe, fornecedores e cliente.
          </p>
        </div>

        <div className="arquitech-capability-list">
          {modules.map((item) => (
            <article key={item.eyebrow}>
              <span>{item.eyebrow}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="arquitech-section">
        <div className="arquitech-section-heading">
          <p className="arquitech-kicker">Casos de uso</p>
          <h2>Da loja de shopping à obra em andamento.</h2>
          <p>
            A experiência foi desenhada para contextos em que projeto, prazo, orçamento, documentação
            e aprovação precisam caminhar juntos.
          </p>
        </div>

        <div className="arquitech-tags">
          {projectTypes.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="arquitech-disclaimer">
        <p className="arquitech-kicker">Responsabilidade preservada</p>
        <h2>Assistência inteligente, decisão profissional.</h2>
        <p>
          A GLIP e a Aria apoiam organização, clareza e gestão do fluxo, mas não substituem
          arquitetos, engenheiros, responsáveis técnicos, validações legais, órgãos públicos,
          shopping centers, bombeiros, conselhos profissionais ou revisão jurídica especializada.
        </p>
        <Link className="arquitech-primary-button" to={authUrl}>
          Começar com Aria
        </Link>
      </section>
    </main>
  );
}
