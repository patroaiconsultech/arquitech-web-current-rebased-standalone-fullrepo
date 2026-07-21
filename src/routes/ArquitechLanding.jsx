import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import GLIPInstallButton from "../components/GLIPInstallButton.jsx";
import GLIPLanguageSwitch from "../components/GLIPLanguageSwitch.jsx";
import { useGlipLandingLocale } from "../lib/glipLandingLocale.js";
import useGlipSeo from "../lib/useGlipSeo.js";
import "../styles/arquitech.css";

const authUrl = "/auth?source=arquitech&agent=aria&product=arquitech&onboarding=1";
const whatsappNumber = "5551984600089";
const sabrinaHasseImg = "/arquitech-assets/sabrina-hasse.jpeg";

const COPY = {
  pt: {
    nav: {
      about: "Quem somos",
      projects: "Projetos",
      aria: "Aria",
      briefing: "Briefing",
      cta: "Iniciar briefing",
    },
    hero: {
      kicker: "Excelência em projetos comerciais, corporativos e médicos",
      title: "Arquitetura humana, autoral e inteligente para marcas que precisam acontecer.",
      lead:
        "A GLIP Intelligence Architecture une experiência em projetos e obras com uma camada digital criada para organizar briefing, proposta, contrato, projeto, execução e indicadores com clareza, elegância e acompanhamento real.",
      primary: "Conversar com Aria",
      secondary: "Solicitar briefing",
      install: "Instalar app",
      note: "Transformando espaços, valorizando marcas.",
      noteStrong: "Um estúdio com assinatura humana e inteligência operacional discreta.",
    },
    metrics: [
      ["20+", "anos de experiência aplicada"],
      ["3", "especialidades centrais"],
      ["1", "fluxo inteligente com Aria"],
    ],
    about: {
      kicker: "Quem somos",
      title: "Arquitetura para negócios, conduzida com escuta, precisão e cuidado.",
      profileRole: "Arquiteta, CEO e Founder",
      profileCaption:
        "Sabrina Hasse conduz a GLIP com uma combinação de repertório técnico, escuta ativa e sensibilidade estética para transformar espaços em experiências de marca.",
      imageAlt: "Arquiteta Sabrina Hasse segurando material institucional da GLIP Arquitetura",
      paragraphs: [
        "Localizada em Porto Alegre e com atuação no Rio Grande do Sul e no Brasil, a GLIP Arquitetura foi criada pela arquiteta Sabrina Hasse, CEO e founder da empresa.",
        "Com experiência desde 2000, a GLIP é especializada em projetos arquitetônicos, complementares e execução de obras para negócios. Seu foco está em ambientes comerciais, corporativos e médicos, especialmente lojas de shopping centers, escritórios e consultórios.",
        "A nova presença digital preserva essa essência e acrescenta Aria, uma inteligência operacional que ajuda a organizar contexto, decisões e próximos passos sem substituir a responsabilidade profissional da arquitetura.",
      ],
    },
    specialties: [
      "Projetos comerciais",
      "Ambientes corporativos",
      "Clínicas e consultórios",
      "Lojas de shopping",
      "Execução completa de obras",
      "Gestão personalizada",
    ],
    valuesHeading: {
      kicker: "Missão, visão e valores",
      title: "Uma marca criativa, confiável, técnica e profundamente humana.",
    },
    values: [
      {
        title: "Missão",
        text:
          "Ser referência em arquitetura e design pela dedicação, atendimento diferenciado e soluções completas, ágeis, criativas e personalizadas.",
      },
      {
        title: "Visão",
        text:
          "Elevar a experiência de empresas, marcas e profissionais que precisam transformar espaços em ambientes de venda, cuidado, trabalho e relacionamento.",
      },
      {
        title: "Valores",
        text:
          "Compromisso, responsabilidade, qualidade, escuta ativa, criatividade, clareza, confiança e respeito à identidade de cada cliente.",
      },
    ],
    method: {
      kicker: "Método GLIP",
      title: "Do primeiro contato à obra, cada decisão fica no lugar certo.",
      text:
        "A GLIP Intelligence Architecture nasce para apoiar arquitetos e clientes em contextos nos quais prazo, orçamento, documentação, marca e execução precisam caminhar juntos. A tecnologia trabalha em segundo plano: organiza, lembra, sintetiza e orienta.",
    },
    journey: [
      ["01", "Briefing", "Entendimento do negócio, perfil do cliente, ponto comercial e prioridades."],
      ["02", "Proposta", "Escopo, etapas, honorários, prazos, versões e pendências comerciais."],
      ["03", "Contrato", "Documentos, aceite, anexos, revisões e histórico de decisões conectados."],
      ["04", "Projeto", "Responsáveis, entregáveis, arquivos técnicos, aprovações e versões."],
      ["05", "Obra", "Visitas, fornecedores, ocorrências, riscos, evidências e comunicação."],
      ["06", "Indicadores", "Leitura executiva de prazo, custo, margem, status e próximos passos."],
    ],
    projects: {
      kicker: "Projetos",
      title: "Uma vitrine preparada para receber o portfólio GLIP.",
      text:
        "Esta seção fica pronta para importarmos imagens, categorias, descrições e páginas de detalhe dos projetos. A estrutura já considera lojas, consultórios, espaços corporativos e experiências comerciais.",
      items: [
        "Quiosque Havanna - Shopping Praia de Belas",
        "Consultório de Psiquiatria",
        "Multiverso Experience - Cais Embarcadero",
        "Quiosque Milkymoo - Bourbon Ipiranga",
      ],
      placeholder: "Imagem e estudo de caso a inserir.",
    },
    aria: {
      kicker: "Aria",
      title: "A coordenadora inteligente do fluxo arquitetônico.",
      text:
        "Aria atua como uma camada operacional discreta: recebe contexto, separa pendências, sugere próximos passos, prepara resumos, organiza etapas e mantém a linguagem do projeto acessível para cliente, equipe e fornecedores.",
      user: "Tenho uma loja em shopping e preciso sair do briefing para uma proposta clara.",
      route: "Rota sugerida",
      answer:
        "Vamos organizar necessidades do negócio, restrições do ponto, escopo, etapas, documentos, prazos e riscos antes de avançar para proposta e contrato.",
      link: "Abrir conversa com Aria",
    },
    modulesHeading: {
      kicker: "Sistema",
      title: "Uma arquitetura digital para preservar contexto, decisão e execução.",
      text:
        "Cada módulo foi desenhado para reduzir retrabalho, dar visibilidade ao cliente e manter a equipe alinhada sem substituir ferramentas técnicas como CAD, BIM ou SketchUp.",
    },
    modules: [
      ["Client Intelligence", "Briefings, clientes, contexto, histórico e próximos passos em uma única leitura."],
      ["Proposal Studio", "Propostas mais claras, com escopo rastreável, versões e decisões organizadas."],
      ["Contract Flow", "Contratos, anexos, aceite e pendências conectados ao fluxo real do projeto."],
      ["Project Memory", "Arquivos, entregáveis, revisões e contexto técnico preservados ao longo do tempo."],
      ["Works Control", "Obras, fornecedores, visitas e evidências organizados sem perder o olhar humano."],
      ["Executive Insights", "Indicadores para conduzir prazos, custos, riscos e margem com previsibilidade."],
    ],
    briefing: {
      kicker: "Briefing comercial",
      title: "Comece com contexto suficiente para uma conversa objetiva.",
      text:
        "Este primeiro formulário organiza o essencial para a GLIP entender seu momento, preparar a abordagem inicial e conduzir o próximo contato com mais precisão.",
      fields: {
        name: "Nome",
        brand: "Empresa ou marca",
        kind: "Tipo de projeto",
        city: "Cidade / estado",
        timing: "Prazo desejado",
        stage: "Momento atual",
        contact: "WhatsApp ou e-mail",
        message: "Mensagem",
      },
      options: ["Loja", "Consultório", "Escritório", "Quiosque", "Reforma", "Outro"],
      submit: "Gerar contato",
      receipt: "Briefing organizado. Você pode seguir pelo WhatsApp ou conversar com Aria.",
      whatsapp: "Enviar pelo WhatsApp",
      aria: "Continuar com Aria",
    },
    global: {
      kicker: "Nível global",
      title: "Uma presença digital tão refinada quanto o projeto que ela representa.",
      text:
        "A landing posiciona a GLIP como uma marca brasileira com presença internacional: elegante, comercial, autoral e preparada para escalar relacionamento, qualidade, acompanhamento e clareza sem perder a assinatura humana da arquitetura.",
    },
    disclaimer: {
      kicker: "Responsabilidade preservada",
      title: "Assistência inteligente, decisão profissional.",
      text:
        "A GLIP e a Aria apoiam organização, clareza e gestão do fluxo, mas não substituem arquitetos, engenheiros, responsáveis técnicos, validações legais, órgãos públicos, shopping centers, bombeiros, conselhos profissionais ou revisão jurídica especializada.",
      verse: "“Se o Senhor não edificar a casa, em vão trabalham os que a edificam.”",
      verseRef: "Salmo 127:1",
      cta: "Começar com Aria",
    },
  },
  en: {
    nav: {
      about: "About",
      projects: "Projects",
      aria: "Aria",
      briefing: "Briefing",
      cta: "Start briefing",
    },
    hero: {
      kicker: "Commercial, corporate and healthcare architecture",
      title: "Human, authored and intelligent architecture for brands built to happen.",
      lead:
        "GLIP Intelligence Architecture combines project and construction expertise with a digital layer designed to organize briefing, proposal, contract, design, execution and indicators with clarity, elegance and real follow-up.",
      primary: "Talk to Aria",
      secondary: "Request briefing",
      install: "Install app",
      note: "Transforming spaces, elevating brands.",
      noteStrong: "A studio with a human signature and discreet operational intelligence.",
    },
    metrics: [
      ["20+", "years of applied experience"],
      ["3", "core specialties"],
      ["1", "intelligent flow with Aria"],
    ],
    about: {
      kicker: "About",
      title: "Architecture for businesses, led with listening, precision and care.",
      profileRole: "Architect, CEO and Founder",
      profileCaption:
        "Sabrina Hasse leads GLIP with technical repertoire, active listening and aesthetic sensitivity to turn spaces into brand experiences.",
      imageAlt: "Architect Sabrina Hasse holding GLIP Arquitetura institutional material",
      paragraphs: [
        "Based in Porto Alegre and serving Rio Grande do Sul and Brazil, GLIP Arquitetura was created by architect Sabrina Hasse, CEO and founder of the company.",
        "With experience since 2000, GLIP specializes in architectural projects, complementary disciplines and construction execution for businesses. Its focus is commercial, corporate and healthcare environments, especially shopping mall stores, offices and clinics.",
        "The new digital presence preserves that essence and adds Aria, an operational intelligence that helps organize context, decisions and next steps without replacing professional architectural responsibility.",
      ],
    },
    specialties: [
      "Commercial projects",
      "Corporate environments",
      "Clinics and medical offices",
      "Shopping mall stores",
      "Full construction execution",
      "Personalized management",
    ],
    valuesHeading: {
      kicker: "Mission, vision and values",
      title: "A creative, reliable, technical and deeply human brand.",
    },
    values: [
      {
        title: "Mission",
        text:
          "To be a reference in architecture and design through dedication, differentiated service and complete, agile, creative and personalized solutions.",
      },
      {
        title: "Vision",
        text:
          "To elevate the experience of companies, brands and professionals who need to transform spaces into environments for sales, care, work and relationships.",
      },
      {
        title: "Values",
        text:
          "Commitment, responsibility, quality, active listening, creativity, clarity, trust and respect for each client's identity.",
      },
    ],
    method: {
      kicker: "GLIP Method",
      title: "From first contact to construction, every decision has a place.",
      text:
        "GLIP Intelligence Architecture supports architects and clients in contexts where schedule, budget, documentation, brand and execution need to move together. Technology works quietly in the background: organizing, remembering, synthesizing and guiding.",
    },
    journey: [
      ["01", "Briefing", "Business goals, client profile, commercial point and priorities."],
      ["02", "Proposal", "Scope, phases, fees, deadlines, versions and commercial pending items."],
      ["03", "Contract", "Documents, acceptance, attachments, reviews and decision history connected."],
      ["04", "Design", "Owners, deliverables, technical files, approvals and versions."],
      ["05", "Construction", "Visits, suppliers, occurrences, risks, evidence and communication."],
      ["06", "Indicators", "Executive reading of time, cost, margin, status and next steps."],
    ],
    projects: {
      kicker: "Projects",
      title: "A showcase prepared to receive the GLIP portfolio.",
      text:
        "This section is ready for project images, categories, descriptions and detail pages. The structure already considers stores, clinics, corporate spaces and commercial experiences.",
      items: [
        "Havanna Kiosk - Shopping Praia de Belas",
        "Psychiatry Office",
        "Multiverso Experience - Cais Embarcadero",
        "Milkymoo Kiosk - Bourbon Ipiranga",
      ],
      placeholder: "Image and case study to be added.",
    },
    aria: {
      kicker: "Aria",
      title: "The intelligent coordinator of the architectural flow.",
      text:
        "Aria works as a discreet operational layer: it receives context, separates pending items, suggests next steps, prepares summaries, organizes stages and keeps project language accessible to clients, teams and suppliers.",
      user: "I have a shopping mall store and need to turn the briefing into a clear proposal.",
      route: "Suggested route",
      answer:
        "Let's organize business needs, point restrictions, scope, phases, documents, deadlines and risks before moving to proposal and contract.",
      link: "Open conversation with Aria",
    },
    modulesHeading: {
      kicker: "System",
      title: "A digital architecture to preserve context, decisions and execution.",
      text:
        "Each module was designed to reduce rework, give clients visibility and keep the team aligned without replacing technical tools such as CAD, BIM or SketchUp.",
    },
    modules: [
      ["Client Intelligence", "Briefings, clients, context, history and next steps in one reading."],
      ["Proposal Studio", "Clearer proposals with traceable scope, versions and organized decisions."],
      ["Contract Flow", "Contracts, attachments, acceptance and pending items connected to the real project flow."],
      ["Project Memory", "Files, deliverables, reviews and technical context preserved over time."],
      ["Works Control", "Construction, suppliers, visits and evidence organized without losing the human eye."],
      ["Executive Insights", "Indicators to manage deadlines, costs, risks and margin with predictability."],
    ],
    briefing: {
      kicker: "Commercial briefing",
      title: "Start with enough context for an objective conversation.",
      text:
        "This first form organizes the essentials so GLIP can understand your moment, prepare the initial approach and lead the next contact with more precision.",
      fields: {
        name: "Name",
        brand: "Company or brand",
        kind: "Project type",
        city: "City / state",
        timing: "Desired timeline",
        stage: "Current stage",
        contact: "WhatsApp or email",
        message: "Message",
      },
      options: ["Store", "Clinic", "Office", "Kiosk", "Renovation", "Other"],
      submit: "Generate contact",
      receipt: "Briefing organized. You can continue on WhatsApp or talk to Aria.",
      whatsapp: "Send by WhatsApp",
      aria: "Continue with Aria",
    },
    global: {
      kicker: "Global level",
      title: "A digital presence as refined as the project it represents.",
      text:
        "The landing positions GLIP as a Brazilian brand with international presence: elegant, commercial, authored and ready to scale relationship, quality, follow-up and clarity without losing architecture's human signature.",
    },
    disclaimer: {
      kicker: "Responsibility preserved",
      title: "Intelligent assistance, professional decision.",
      text:
        "GLIP and Aria support organization, clarity and workflow management, but do not replace architects, engineers, technical owners, legal validations, public agencies, shopping centers, firefighters, professional councils or specialized legal review.",
      verse: "“Unless the Lord builds the house, those who build it labor in vain.”",
      verseRef: "Psalm 127:1",
      cta: "Start with Aria",
    },
  },
};

const initialBriefing = {
  name: "",
  brand: "",
  kind: "",
  city: "",
  timing: "",
  stage: "",
  contact: "",
  message: "",
};

function buildWhatsappUrl(briefing, locale) {
  const isEnglish = locale === "en";
  const lines = isEnglish
    ? [
        "Hello, GLIP. I would like to request a commercial briefing.",
        `Name: ${briefing.name || "-"}`,
        `Company/brand: ${briefing.brand || "-"}`,
        `Project type: ${briefing.kind || "-"}`,
        `City/state: ${briefing.city || "-"}`,
        `Timeline: ${briefing.timing || "-"}`,
        `Current stage: ${briefing.stage || "-"}`,
        `Contact: ${briefing.contact || "-"}`,
        `Message: ${briefing.message || "-"}`,
      ]
    : [
        "Olá, GLIP. Gostaria de solicitar um briefing comercial.",
        `Nome: ${briefing.name || "-"}`,
        `Empresa/marca: ${briefing.brand || "-"}`,
        `Tipo de projeto: ${briefing.kind || "-"}`,
        `Cidade/estado: ${briefing.city || "-"}`,
        `Prazo: ${briefing.timing || "-"}`,
        `Momento atual: ${briefing.stage || "-"}`,
        `Contato: ${briefing.contact || "-"}`,
        `Mensagem: ${briefing.message || "-"}`,
      ];

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export default function ArquitechLanding() {
  useGlipSeo();

  const { locale, setLocale, isEnglish } = useGlipLandingLocale();
  const copy = COPY[locale] || COPY.pt;
  const [briefing, setBriefing] = useState(initialBriefing);
  const [briefingReady, setBriefingReady] = useState(false);
  const whatsappUrl = useMemo(() => buildWhatsappUrl(briefing, locale), [briefing, locale]);

  function updateBriefing(field, value) {
    setBriefingReady(false);
    setBriefing((current) => ({ ...current, [field]: value }));
  }

  function handleBriefingSubmit(event) {
    event.preventDefault();
    setBriefingReady(true);
  }

  return (
    <main className="arquitech-page" id="top">
      <section className="arquitech-hero">
        <nav className="arquitech-nav" aria-label={isEnglish ? "Main navigation" : "Navegação principal"}>
          <Link className="arquitech-brand" to="/arquitech" aria-label="GLIP Intelligence Architecture">
            <img
              className="arquitech-brand-logo"
              src="/arquitech-assets/glip-logo-horizontal.jpeg"
              alt="GLIP Arquitetura"
            />
            <span>
              <small>Intelligence Architecture</small>
            </span>
          </Link>

          <div className="arquitech-nav-actions">
            <a href="#quem-somos">{copy.nav.about}</a>
            <a href="#projetos">{copy.nav.projects}</a>
            <a href="#aria">{copy.nav.aria}</a>
            <a href="#briefing">{copy.nav.briefing}</a>
            <GLIPLanguageSwitch locale={locale} onChange={setLocale} />
            <Link className="arquitech-nav-cta" to={authUrl}>
              {copy.nav.cta}
            </Link>
          </div>
        </nav>

        <div className="arquitech-hero-grid">
          <div className="arquitech-hero-copy">
            <p className="arquitech-kicker">{copy.hero.kicker}</p>
            <h1>{copy.hero.title}</h1>
            <p className="arquitech-lead">{copy.hero.lead}</p>

            <div className="arquitech-hero-actions">
              <Link className="arquitech-primary-button" to={authUrl}>
                {copy.hero.primary}
              </Link>
              <a className="arquitech-secondary-button" href="#briefing">
                {copy.hero.secondary}
              </a>
              <GLIPInstallButton locale={locale} label={copy.hero.install} variant="hero" />
            </div>

            <div className="arquitech-metrics" aria-label={isEnglish ? "Experience indicators" : "Indicadores da experiência"}>
              {copy.metrics.map(([value, label]) => (
                <div key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <aside className="arquitech-brand-stage" aria-label="GLIP Arquitetura">
            <img src="/arquitech-assets/glip-logo-stacked.jpeg" alt="GLIP Arquitetura" />
            <div className="arquitech-stage-note">
              <span>{copy.hero.note}</span>
              <strong>{copy.hero.noteStrong}</strong>
            </div>
          </aside>
        </div>
      </section>

      <section className="arquitech-section arquitech-founder-section" id="quem-somos">
        <div className="arquitech-founder-grid">
          <div className="arquitech-founder-copy">
            <p className="arquitech-kicker">{copy.about.kicker}</p>
            <h2>{copy.about.title}</h2>

            <div className="arquitech-rich-text">
              {copy.about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <figure className="arquitech-founder-card">
            <div className="arquitech-founder-photo-shell">
              <img src={sabrinaHasseImg} alt={copy.about.imageAlt} loading="lazy" />
            </div>
            <figcaption>
              <span>{copy.about.profileRole}</span>
              <strong>Sabrina Hasse</strong>
              <p>{copy.about.profileCaption}</p>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="arquitech-specialties" aria-label={isEnglish ? "GLIP specialties" : "Especialidades GLIP"}>
        {copy.specialties.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </section>

      <section className="arquitech-section arquitech-values-section">
        <div className="arquitech-section-heading">
          <p className="arquitech-kicker">{copy.valuesHeading.kicker}</p>
          <h2>{copy.valuesHeading.title}</h2>
        </div>

        <div className="arquitech-values-grid">
          {copy.values.map((item) => (
            <article key={item.title}>
              <span>{item.title}</span>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="arquitech-section arquitech-editorial">
        <div>
          <p className="arquitech-kicker">{copy.method.kicker}</p>
          <h2>{copy.method.title}</h2>
        </div>
        <p>{copy.method.text}</p>
      </section>

      <section className="arquitech-journey" aria-label={isEnglish ? "GLIP journey" : "Jornada GLIP"}>
        {copy.journey.map(([number, title, text]) => (
          <article key={title}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section className="arquitech-section arquitech-projects-section" id="projetos">
        <div className="arquitech-section-heading">
          <p className="arquitech-kicker">{copy.projects.kicker}</p>
          <h2>{copy.projects.title}</h2>
          <p>{copy.projects.text}</p>
        </div>

        <div className="arquitech-project-grid">
          {copy.projects.items.map((item, index) => (
            <article key={item}>
              <div className="arquitech-project-placeholder">
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3>{item}</h3>
              <p>{copy.projects.placeholder}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="arquitech-section arquitech-aria-section" id="aria">
        <div className="arquitech-aria-copy">
          <p className="arquitech-kicker">{copy.aria.kicker}</p>
          <h2>{copy.aria.title}</h2>
          <p>{copy.aria.text}</p>
        </div>

        <div className="arquitech-dialogue-card">
          <p className="arquitech-user-bubble">{copy.aria.user}</p>
          <p className="arquitech-aria-bubble">
            <strong>{copy.aria.route}</strong>
            <span>{copy.aria.answer}</span>
          </p>
          <Link className="arquitech-inline-link" to={authUrl}>
            {copy.aria.link}
          </Link>
        </div>
      </section>

      <section className="arquitech-section" id="modules">
        <div className="arquitech-section-heading">
          <p className="arquitech-kicker">{copy.modulesHeading.kicker}</p>
          <h2>{copy.modulesHeading.title}</h2>
          <p>{copy.modulesHeading.text}</p>
        </div>

        <div className="arquitech-capability-list">
          {copy.modules.map(([name, text]) => (
            <article key={name}>
              <span>GLIP</span>
              <h3>{name}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="arquitech-section arquitech-briefing-section" id="briefing">
        <div className="arquitech-briefing-copy">
          <p className="arquitech-kicker">{copy.briefing.kicker}</p>
          <h2>{copy.briefing.title}</h2>
          <p>{copy.briefing.text}</p>
        </div>

        <form className="arquitech-briefing-form" onSubmit={handleBriefingSubmit}>
          <label>
            <span>{copy.briefing.fields.name}</span>
            <input value={briefing.name} onChange={(event) => updateBriefing("name", event.target.value)} autoComplete="name" />
          </label>
          <label>
            <span>{copy.briefing.fields.brand}</span>
            <input value={briefing.brand} onChange={(event) => updateBriefing("brand", event.target.value)} autoComplete="organization" />
          </label>
          <label>
            <span>{copy.briefing.fields.kind}</span>
            <select value={briefing.kind} onChange={(event) => updateBriefing("kind", event.target.value)}>
              <option value="">{copy.briefing.fields.kind}</option>
              {copy.briefing.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>{copy.briefing.fields.city}</span>
            <input value={briefing.city} onChange={(event) => updateBriefing("city", event.target.value)} />
          </label>
          <label>
            <span>{copy.briefing.fields.timing}</span>
            <input value={briefing.timing} onChange={(event) => updateBriefing("timing", event.target.value)} />
          </label>
          <label>
            <span>{copy.briefing.fields.contact}</span>
            <input value={briefing.contact} onChange={(event) => updateBriefing("contact", event.target.value)} autoComplete="email" />
          </label>
          <label className="arquitech-briefing-form-wide">
            <span>{copy.briefing.fields.stage}</span>
            <input value={briefing.stage} onChange={(event) => updateBriefing("stage", event.target.value)} />
          </label>
          <label className="arquitech-briefing-form-wide">
            <span>{copy.briefing.fields.message}</span>
            <textarea value={briefing.message} onChange={(event) => updateBriefing("message", event.target.value)} rows={5} />
          </label>

          <div className="arquitech-briefing-actions">
            <button type="submit" className="arquitech-primary-button">
              {copy.briefing.submit}
            </button>
            {briefingReady ? (
              <>
                <p>{copy.briefing.receipt}</p>
                <a className="arquitech-secondary-button" href={whatsappUrl} target="_blank" rel="noreferrer">
                  {copy.briefing.whatsapp}
                </a>
                <Link className="arquitech-secondary-button" to={authUrl}>
                  {copy.briefing.aria}
                </Link>
              </>
            ) : null}
          </div>
        </form>
      </section>

      <section className="arquitech-section arquitech-global-band">
        <div>
          <p className="arquitech-kicker">{copy.global.kicker}</p>
          <h2>{copy.global.title}</h2>
        </div>
        <p>{copy.global.text}</p>
      </section>

      <section className="arquitech-disclaimer">
        <p className="arquitech-kicker">{copy.disclaimer.kicker}</p>
        <h2>{copy.disclaimer.title}</h2>
        <p>{copy.disclaimer.text}</p>
        <figure className="arquitech-bible-verse">
          <blockquote>{copy.disclaimer.verse}</blockquote>
          <figcaption>{copy.disclaimer.verseRef}</figcaption>
        </figure>
        <Link className="arquitech-primary-button" to={authUrl}>
          {copy.disclaimer.cta}
        </Link>
      </section>
    </main>
  );
}
