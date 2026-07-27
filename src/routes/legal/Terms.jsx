import React from "react";
import { Link } from "react-router-dom";

const LEGAL_VERSION = "2026-07-24";

const sections = [
  {
    title: "1. Sobre o GLIP",
    body:
      "GLIP Intelligence Architecture é uma plataforma de apoio a atividades de arquitetura, organização de projetos, análise de documentos e interação assistida por inteligência artificial. Os recursos podem evoluir de forma controlada para preservar segurança, qualidade e estabilidade.",
  },
  {
    title: "2. Aceitação",
    body:
      "Ao criar uma conta ou selecionar “Aceitar e continuar”, o usuário declara que leu e concorda com estes Termos de Uso e com a Política de Privacidade vinculada à mesma versão legal.",
  },
  {
    title: "3. Uso responsável",
    body:
      "O usuário deve utilizar a plataforma de forma lícita, ética e compatível com os direitos de terceiros. Não é permitido contornar controles de acesso, segurança, tenant, governança ou limites técnicos.",
  },
  {
    title: "4. Inteligência artificial",
    body:
      "Respostas produzidas por inteligência artificial podem conter imprecisões. Entregáveis, cálculos, projetos, documentos e decisões relevantes devem ser revisados por profissional habilitado antes de qualquer uso definitivo.",
  },
  {
    title: "5. Projetos, arquivos e conteúdo",
    body:
      "O usuário deve enviar apenas informações e documentos que tenha autorização para utilizar. O GLIP poderá processar o conteúdo mínimo necessário para organizar projetos, gerar respostas e produzir entregáveis solicitados.",
  },
  {
    title: "6. Disponibilidade e evolução",
    body:
      "Recursos podem ser atualizados, limitados ou temporariamente suspensos para manutenção, segurança, compatibilidade ou evolução governada. O início do serviço ou uma resposta HTTP isolada não constituem garantia de funcionamento integral.",
  },
  {
    title: "7. Responsabilidade profissional",
    body:
      "O GLIP é uma ferramenta de apoio. Ele não substitui responsabilidade técnica, validação legal, aprovação de órgãos públicos, análise estrutural, orçamento profissional ou qualquer atividade sujeita a habilitação específica.",
  },
  {
    title: "8. Segurança e contas",
    body:
      "O usuário é responsável por proteger suas credenciais e informar acessos indevidos. Tentativas de acesso cross-tenant, uso de credenciais de terceiros ou exploração da plataforma poderão resultar em bloqueio.",
  },
  {
    title: "9. Atualizações",
    body:
      "Quando houver mudança relevante, uma nova versão poderá exigir novo aceite. A versão vigente será informada pela própria plataforma.",
  },
  {
    title: "10. Contato",
    body:
      "Solicitações relacionadas a estes Termos podem ser encaminhadas pelos canais oficiais da PatroAI Consultech.",
  },
];

export default function Terms() {
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
            Termos de Uso do GLIP
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-white/72 sm:text-lg">
            Condições de utilização do GLIP Intelligence Architecture, operado pela PatroAI Consultech.
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
