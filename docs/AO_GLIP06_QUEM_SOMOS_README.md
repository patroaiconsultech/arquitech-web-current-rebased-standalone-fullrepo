# AO-GLIP06 — Quem somos com Sabrina Hasse

Este pacote adiciona a foto da Arquiteta Sabrina Hasse na landing da GLIP/Arquitech.

## Arquivos incluídos

- `src/routes/ArquitechLanding.jsx`
- `src/assets/images/sabrina-hasse.jpeg`
- `src/styles/arquitech-team.css`

## O que mudou

- A navegação ganhou o link `Quem somos`.
- Foi adicionada uma seção `id="quem-somos"` logo após o hero.
- A foto é importada pelo Vite a partir de `src/assets/images/sabrina-hasse.jpeg`.
- A camada visual foi isolada em `src/styles/arquitech-team.css` para reduzir risco sobre o CSS atual.

## Comandos recomendados

```bash
npm run build
```

## Checklist de validação

- A foto da Sabrina aparece na seção "Quem somos".
- O link "Quem somos" na navegação rola para a seção correta.
- Mobile não corta o rosto de forma ruim.
- O botão "Iniciar briefing com Aria" preserva a rota com `source=arquitech&agent=aria&product=arquitech&onboarding=1`.
- Não aparecem Orkio, PatroAI, Orion, Team ou mensagens técnicas na landing.
