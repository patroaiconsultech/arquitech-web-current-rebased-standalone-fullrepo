# AO-GLIP07 — Promote Codex Frontend com Sabrina Hasse

Este pacote promove os arquivos do frontend novo vindo do sandbox Codex para a estrutura raiz do repo frontend.

## Arquivos principais

- `src/routes/ArquitechLanding.jsx`
- `src/styles/arquitech.css`
- `public/arquitech-assets/sabrina-hasse.jpeg`
- `src/assets/images/sabrina-hasse.jpeg`

A landing usa caminho público direto:

```jsx
const sabrinaHasseImg = "/arquitech-assets/sabrina-hasse.jpeg";
```

Após deploy, teste diretamente:

```text
/arquitech-assets/sabrina-hasse.jpeg
/arquitech
```

Se a imagem abrir na URL direta e não aparecer na landing, o problema é JSX/CSS.
Se a imagem não abrir na URL direta, o problema é deploy/branch/asset fora do build.
