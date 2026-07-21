# AO-GLIP06B — Sabrina Hasse com imagem pública estável

## Diagnóstico

No frontend enviado, o código já importava `src/assets/images/sabrina-hasse.jpeg` e o build local gerou o asset `dist/assets/sabrina-hasse-*.jpeg`.

Se a imagem ainda não aparece na landing em produção, a causa mais provável não é o JSX em si, mas uma destas situações:

1. o deploy está servindo uma build antiga;
2. o deploy está usando outra branch/repo;
3. a imagem não entrou no build usado em produção;
4. cache/CDN/browser ainda está mostrando versão anterior.

## Correção deste pacote

Este pacote coloca a imagem também em:

`public/arquitech-assets/sabrina-hasse.jpeg`

E altera a landing para usar:

`/arquitech-assets/sabrina-hasse.jpeg`

Assim, depois do deploy, você consegue testar a imagem diretamente no navegador:

`https://SEU-DOMINIO/arquitech-assets/sabrina-hasse.jpeg`

Se essa URL não abrir a foto, o problema é deploy/branch/build, não a seção da landing.

## Arquivos do pacote

- `src/routes/ArquitechLanding.jsx`
- `public/arquitech-assets/sabrina-hasse.jpeg`
- `src/assets/images/sabrina-hasse.jpeg`
- `tools/verify_ao_glip06b_public_image.py`

## Validação

```bash
python3 tools/verify_ao_glip06b_public_image.py
npm run build
```

Depois do deploy:

1. abrir `/arquitech-assets/sabrina-hasse.jpeg`;
2. abrir `/arquitech`;
3. clicar em `Quem somos`;
4. validar se a foto aparece.
