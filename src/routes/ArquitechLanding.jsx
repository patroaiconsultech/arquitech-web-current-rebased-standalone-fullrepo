import React from "react";
import { Link } from "react-router-dom";

import "../styles/arquitech.css";
import "../styles/arquitech-team.css";
import sabrinaHasseImg from "../assets/images/sabrina-hasse.jpeg";

/**
 * GLIP-01 — Narrative & Brand Layer
 *
 * Observação operacional:
 * Os parâmetros abaixo preservam o hardlock técnico já existente no fluxo Arquitech.
 * A experiência visível passa a ser GLIP + Aria, sem expor Orkio/PatroAI ao usuário.
 */
const authUrl = "/auth?source=arquitech&agent=aria&product=arquitech&onboarding=1";

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



      <section className="arquitech-section arquitech-about" id="quem-somos" aria-labelledby="quem-somos-title">
        <div className="arquitech-about-grid">
          <div className="arquitech-about-copy">
            <p className="arquitech-kicker">Quem somos</p>
            <h2 id="quem-somos-title">Arquitetura com escuta, método e presença humana.</h2>
            <p>
              A GLIP nasce para aproximar tecnologia, organização e sensibilidade arquitetônica.
              Antes de qualquer automação, existe uma jornada feita de pessoas, decisões, sonhos,
              prazos, responsabilidades e detalhes que precisam ser preservados.
            </p>
            <p>
              A Aria apoia o fluxo digital. A experiência humana segue no centro: entender o
              cliente, organizar prioridades e conduzir cada etapa com clareza, elegância e confiança.
            </p>

            <div className="arquitech-about-values" aria-label="Valores da GLIP">
              <span>Escuta</span>
              <span>Clareza</span>
              <span>Método</span>
              <span>Cuidado</span>
            </div>
          </div>

          <article className="arquitech-founder-card" aria-label="Arquiteta Sabrina Hasse">
            <div className="arquitech-founder-photo-wrap">
              <img
                src={sabrinaHasseImg}
                alt="Arquiteta Sabrina Hasse segurando material da marca GLIP Arquitetura"
                className="arquitech-founder-photo"
                loading="lazy"
              />
            </div>

            <div className="arquitech-founder-content">
              <p className="arquitech-founder-role">Arquiteta</p>
              <h3>Sabrina Hasse</h3>
              <p>
                Sabrina Hasse representa o olhar humano da GLIP: sensibilidade estética,
                atenção aos detalhes e responsabilidade profissional para transformar ideias
                em ambientes com propósito, beleza e funcionalidade.
              </p>
              <Link className="arquitech-secondary-button" to={authUrl}>
                Iniciar briefing com Aria
              </Link>
            </div>
          </article>
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
