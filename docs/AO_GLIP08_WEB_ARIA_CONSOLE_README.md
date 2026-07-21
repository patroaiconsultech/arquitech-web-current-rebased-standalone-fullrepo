# AO-GLIP08 — Web Aria Console Lock

## Diagnóstico

A landing nova da Arquitech/GLIP já foi promovida, mas o console ainda podia abrir a experiência antiga multiagente quando o usuário entrava em `/app` sem querystring ou quando `/api/agents` não retornava Aria.

## O que este pacote altera

Arquivos completos:

- `src/routes/AppConsole.jsx`
- `src/hooks/useGlipAriaMode.js`

## Correção UX

- `/app` no frontend standalone da Arquitech passa a ser Aria por padrão.
- Se o backend ainda não retornar Aria, o frontend cria uma Aria virtual segura.
- A lista visível de agentes em modo Arquitech fica reduzida à Aria.
- O destino do chat fica travado em `single` + `Aria`.

## Validação

```bash
python3 tools/verify_ao_glip08_web_aria_console.py
npm run build
```

Teste real:

1. Abrir `/app` sem querystring.
2. Confirmar que o console mostra Aria.
3. Confirmar que não aparecem múltiplos agentes na experiência Arquitech.
4. Perguntar: `qual é a tua especialidade?`
5. A resposta deve vir como Aria/GLIP, sem Orkio/Team/Chris/Orion.
