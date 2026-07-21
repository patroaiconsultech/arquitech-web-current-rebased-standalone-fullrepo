#!/usr/bin/env python3
from pathlib import Path
import sys

checks = [
    Path("src/routes/ArquitechLanding.jsx"),
    Path("public/arquitech-assets/sabrina-hasse.jpeg"),
    Path("src/assets/images/sabrina-hasse.jpeg"),
]

failed = False
for path in checks:
    if not path.exists():
        print(f"ERRO: ausente: {path}")
        failed = True
    else:
        print(f"OK: {path} ({path.stat().st_size} bytes)")

landing = Path("src/routes/ArquitechLanding.jsx")
if landing.exists():
    src = landing.read_text(encoding="utf-8")
    must_have = [
        'const sabrinaHasseImg = "/arquitech-assets/sabrina-hasse.jpeg";',
        'src={sabrinaHasseImg}',
        'id="quem-somos"',
        'Sabrina Hasse',
    ]
    for token in must_have:
        if token not in src:
            print(f"ERRO: token não encontrado em ArquitechLanding.jsx: {token}")
            failed = True
        else:
            print(f"OK: token encontrado: {token}")

    if '../assets/images/sabrina-hasse' in src:
        print("AVISO: ainda existe import/caminho via src/assets. Este pacote usa public/arquitech-assets como caminho principal.")

if failed:
    print("\nNO-GO: corrija os itens acima antes do build.")
    sys.exit(1)

print("\nGO: pacote AO-GLIP06B pronto. Rode npm run build e depois valide /arquitech-assets/sabrina-hasse.jpeg no preview/produção.")
