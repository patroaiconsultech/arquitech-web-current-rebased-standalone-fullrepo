import React from "react";
import { Link } from "react-router-dom";

const LEGAL_VERSION = "2026-07-24";

const sections = [
  {
    title: "1. Controlador e finalidade",
    body:
      "PATROAI CONSULTECH LTDA opera o GLIP Intelligence Architecture. Os dados são tratados para criação e proteção da conta, funcionamento do produto, suporte, segurança, auditoria e prestação dos recursos solicitados.",
  },
  {
    title: "2. Dados tratados",
    body:
      "Podemos tratar dados cadastrais, informações de organização e tenant, registros técnicos, histórico de interação, arquivos enviados e metadados necessários à operação.",
  },
  {
    title: "3. Inteligência artificial",
    body:
      "Trechos mínimos e autorizados podem ser processados por provedores de inteligência artificial para produzir respostas ou artefatos solicitados. Documentos brutos devem permanecer preferencialmente no armazenamento do produto.",
  },
  {
    title: "4. Compartilhamento",
    body:
      "Dados somente serão compartilhados com prestadores necessários à operação, sob finalidade definida e controles compatíveis. Não há autorização automática para mistura ou aprendizado identificável entre tenants.",
  },
  {
    title: "5. Segurança e retenção",
    body:
      "Aplicamos autenticação, isolamento de tenant, trilhas de auditoria e limitação de acesso. A retenção observará finalidade, obrigações aplicáveis e políticas operacionais do produto.",
  },
  {
    title: "6. Direitos do titular",
    body:
      "O titular poderá solicitar confirmação, acesso, correção, informação, portabilidade, oposição ou exclusão quando aplicável, respeitadas obrigações legais e necessidades de segurança.",
  },
  {
    title: "7. Atualizações",
    body:
      "Mudanças relevantes poderão exigir novo aceite. A versão legal vigente é informada pela API e pela interface do GLIP.",
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#070910] text-white">
      <div className="pointer-events-none fixed inset-0 opacity-70">
        <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-[-12%] top-[8%] h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <Link to="/app" className="inline-flex items-center text-sm text-white/55 transition hover:text-white">
          &larr; Voltar ao GLIP
        </Link>

        <section className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.06] p-7 shadow-2xl shadow-black/30 backdrop-blur sm:p-10">
          <div className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
            Versão {LEGAL_VERSION}
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-[-0.06em] sm:text-6xl">
            Política de Privacidade
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-white/72 sm:text-lg">
            Como o GLIP trata dados pessoais e informações de projetos com segurança, finalidade e isolamento.
          </p>
        </section>

        <section className="mt-5 grid gap-4">
          {sections.map((section) => (
            <article key={section.title} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur">
              <h2 className="text-lg font-bold tracking-tight text-white">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/72">{section.body}</p>
            </article>
          ))}
        </section>

        <footer className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-white/55">
          <strong className="text-white/85">GLIP Intelligence Architecture</strong> — Operado por PATROAI CONSULTECH LTDA.
        </footer>
      </main>
    </div>
  );
}
