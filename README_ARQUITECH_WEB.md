# Arquitech Web — frontend standalone

Este pacote usa o Orkio Web atual como base, mas configura a raiz `/` e `/arquitech` para a landing da Arquitech.

## Backend

Aponte o runtime para o backend Orkio atual:

```env
API_BASE_URL=https://SEU-BACKEND-ORKIO-ATUAL
```

O navegador usa `/api`, e o `server.cjs` faz proxy para `API_BASE_URL`.

## Rotas principais

- `/` → Arquitech
- `/arquitech` → Arquitech
- `/auth` → autenticação atual
- `/app` → console atual com hardlock ARIA no modo Arquitech

## Regra

No modo Arquitech, a ARIA é a única superagente. Sem Team e sem multiagente neste fluxo.
