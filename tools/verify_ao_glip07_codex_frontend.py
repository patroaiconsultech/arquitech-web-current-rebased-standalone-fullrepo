from pathlib import Path

checks = [
    Path("src/routes/ArquitechLanding.jsx"),
    Path("src/styles/arquitech.css"),
    Path("public/arquitech-assets/sabrina-hasse.jpeg"),
    Path("src/assets/images/sabrina-hasse.jpeg"),
    Path("public/arquitech-assets/glip-logo-horizontal.jpeg"),
    Path("public/arquitech-assets/glip-logo-stacked.jpeg"),
]

ok = True
for path in checks:
    if not path.exists():
        print(f"ERRO: ausente: {path}")
        ok = False
    else:
        print(f"OK: {path}")

landing = Path("src/routes/ArquitechLanding.jsx")
if landing.exists():
    src = landing.read_text(encoding="utf-8")
    required = [
        'const sabrinaHasseImg = "/arquitech-assets/sabrina-hasse.jpeg";',
        'className="arquitech-founder-card"',
        'Sabrina Hasse',
        'id="quem-somos"',
    ]
    for item in required:
        if item not in src:
            print(f"ERRO: landing sem marcador: {item}")
            ok = False
        else:
            print(f"OK: marcador landing: {item}")

css = Path("src/styles/arquitech.css")
if css.exists():
    c = css.read_text(encoding="utf-8")
    for item in [".arquitech-founder-grid", ".arquitech-founder-card", ".arquitech-founder-photo-shell"]:
        if item not in c:
            print(f"ERRO: CSS sem marcador: {item}")
            ok = False
        else:
            print(f"OK: marcador CSS: {item}")

if not ok:
    raise SystemExit(1)

print("AO-GLIP07 verificado com sucesso.")
