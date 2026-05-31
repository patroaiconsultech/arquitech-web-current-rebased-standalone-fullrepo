import React from "react";
import { Link } from "react-router-dom";
import "../styles/arquitech.css";

const authUrl = "/auth?source=arquitech&agent=aria&product=arquitech&onboarding=1";

const capabilities = [
  "Briefings inteligentes",
  "Escopos e checklists",
  "Propostas e cronogramas",
  "Gestão de riscos",
  "Documentação de apoio",
  "Integrações futuras",
];

const projectTypes = [
  "lojas de shopping",
  "lojas de rua",
  "clínicas e consultórios",
  "escritórios corporativos",
  "interiores comerciais",
  "retrofit e reformas",
];

export default function ArquitechLanding() {
  return (
    <main className="arquitech-page">
      <section className="arquitech-hero">
        <nav className="arquitech-nav" aria-label="Arquitech">
          <Link className="arquitech-brand" to="/arquitech" aria-label="Arquitech">
            <img src="/arquitech-assets/logo-symbol.svg" alt="" />
            <span>Arquitech</span>
          </Link>
          <div className="arquitech-nav-actions">
            <Link to="/patroai">PatroAI</Link>
            <Link to="/orkio">Orkio</Link>
            <Link className="arquitech-nav-cta" to={authUrl}>Começar com a ARIA</Link>
          </div>
        </nav>

        <div className="arquitech-hero-grid">
          <div className="arquitech-hero-copy">
            <p className="arquitech-kicker">Arquitetura assistida por IA</p>
            <h1>Acima do BIM, a camada de decisão.</h1>
            <p className="arquitech-lead">
              A Arquitech é um módulo vertical do Orkio para apoiar escritórios de arquitetura
              na organização de briefings, escopos, documentos, riscos, propostas, cronogramas
              e decisões de projeto.
            </p>
            <div className="arquitech-hero-actions">
              <Link className="arquitech-primary-button" to={authUrl}>Começar com a ARIA</Link>
              <a className="arquitech-secondary-button" href="#como-funciona">Ver como funciona</a>
            </div>
            <p className="arquitech-fineprint">
              ARIA é a superagente standalone da Arquitech. Ela responde sozinha no fluxo Arquitech,
              sem orquestração com outros agentes.
            </p>
          </div>

          <aside className="arquitech-aria-card" aria-label="Prévia da ARIA">
            <div className="arquitech-card-header">
              <img src="/arquitech-assets/logo-symbol.svg" alt="" />
              <div>
                <strong>ARIA</strong>
                <span>Superagente da Arquitech</span>
              </div>
            </div>
            <div className="arquitech-chat-preview">
              <p className="arquitech-user-bubble">
                Tenho uma loja de 80m² em shopping e preciso organizar o projeto.
              </p>
              <div className="arquitech-aria-bubble">
                <strong>Diagnóstico inicial</strong>
                <span>
                  Vamos estruturar briefing, documentos, riscos de aprovação, cronograma
                  preliminar e próximos passos para uma rota segura de trabalho.
                </span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id="como-funciona" className="arquitech-section">
        <div className="arquitech-section-heading">
          <p className="arquitech-kicker">Método</p>
          <h2>Uma inteligência única para organizar projeto, obra e decisão.</h2>
          <p>
            A Arquitech não substitui as ferramentas existentes. Ela cria uma camada estratégica
            de leitura, contexto e decisão acima de sistemas técnicos como BIM e CAD.
          </p>
        </div>

        <div className="arquitech-steps">
          <article>
            <span>01</span>
            <h3>Briefing</h3>
            <p>ARIA organiza objetivo, fase, área, documentos, prazo, restrições e entrega esperada.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Estrutura</h3>
            <p>Transforma informações soltas em escopo, checklist, pendências, riscos e rota de trabalho.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Decisão</h3>
            <p>Apoia proposta, cronograma, comunicação com cliente e próximos passos operacionais.</p>
          </article>
        </div>
      </section>

      <section className="arquitech-section arquitech-systems">
        <div>
          <p className="arquitech-kicker">Integrações futuras</p>
          <h2>Preparada para conversar com o ecossistema da arquitetura.</h2>
          <p>
            A plataforma foi pensada para evoluir com integrações a BIM, CAD, ERPs, CRMs,
            planilhas, documentos técnicos, manuais de shopping, bases de fornecedores e
            sistemas internos de escritórios e construtoras.
          </p>
        </div>
        <div className="arquitech-system-grid">
          {["BIM", "CAD", "ERP", "CRM", "Planilhas", "Manuais", "Fornecedores", "Obra"].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="arquitech-section">
        <div className="arquitech-section-heading">
          <p className="arquitech-kicker">Casos de uso</p>
          <h2>Da loja de shopping à obra complexa.</h2>
        </div>
        <div className="arquitech-tags">
          {projectTypes.map((item) => <span key={item}>{item}</span>)}
        </div>
      </section>

      <section className="arquitech-section arquitech-capabilities">
        <div className="arquitech-section-heading">
          <p className="arquitech-kicker">Capacidades</p>
          <h2>O que a ARIA pode ajudar a estruturar.</h2>
        </div>
        <div className="arquitech-capability-list">
          {capabilities.map((item) => (
            <article key={item}>
              <h3>{item}</h3>
              <p>Organização técnica, clareza de escopo e próximo passo prático para o escritório.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="arquitech-disclaimer">
        <h2>Assistência inteligente, responsabilidade profissional preservada.</h2>
        <p>
          A Arquitech e a ARIA apoiam o processo técnico, mas não substituem o profissional
          habilitado, o responsável técnico, o BIM, o CAD, órgãos públicos, shopping centers,
          bombeiros ou conselhos profissionais. Toda validação final deve ser feita pelo
          profissional responsável e pelos órgãos competentes.
        </p>
        <Link className="arquitech-primary-button" to={authUrl}>Iniciar briefing com a ARIA</Link>
      </section>
    </main>
  );
}
