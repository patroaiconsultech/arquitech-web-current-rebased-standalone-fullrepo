#!/usr/bin/env python3
from pathlib import Path
import sys

root = Path.cwd()
app = root / "src/routes/AppConsole.jsx"
hook = root / "src/hooks/useGlipAriaMode.js"

errors = []
for path in (app, hook):
    if not path.exists():
        errors.append(f"Arquivo ausente: {path}")

if not errors:
    app_text = app.read_text(encoding="utf-8", errors="ignore")
    hook_text = hook.read_text(encoding="utf-8", errors="ignore")

    checks = [
        ("AppConsole importa ensureGlipAriaAgentList", "ensureGlipAriaAgentList" in app_text),
        ("AppConsole normaliza lista de agentes em modo Aria", "const visibleAgents = isArquitechMode ? ensureGlipAriaAgentList(rawAgents) : rawAgents;" in app_text),
        ("AppConsole trava destino em Aria", 'window.localStorage?.setItem("orkio_last_dest_single", aria.id);' in app_text),
        ("Hook reconhece /app standalone como Aria", 'return path === "app" || path.endsWith("/app");' in hook_text),
        ("Hook cria fallback virtual da Aria", "buildVirtualGlipAriaAgent" in hook_text),
        ("Hook reduz lista visível para Aria", "ensureGlipAriaAgentList" in hook_text),
    ]

    for label, ok in checks:
        print(("OK   " if ok else "FAIL ") + label)
        if not ok:
            errors.append(label)

if errors:
    print("\nAO-GLIP08 WEB: NO-GO")
    for err in errors:
        print(f"- {err}")
    sys.exit(1)

print("\nAO-GLIP08 WEB: GO")
print("Agora rode: npm run build")
