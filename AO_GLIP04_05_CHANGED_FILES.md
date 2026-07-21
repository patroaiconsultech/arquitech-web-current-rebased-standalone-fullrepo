#!/usr/bin/env python3
from pathlib import Path
import sys

path = Path("src/routes/AppConsole.jsx")
if not path.exists():
    print("NO-GO: src/routes/AppConsole.jsx não encontrado.")
    sys.exit(2)

src = path.read_text(encoding="utf-8", errors="replace")
required = [
    "function containsGlipAriaIdentityLeak(",
    "function sanitizeGlipAriaStreamDelta(",
    "sanitizeGlipAriaStreamDelta(delta, \"\", isArquitechMode)",
    "function sanitizeGlipAriaVisibleMessage(",
    "glipAssistantName}, me ajuda a transformar esta conversa",
]
missing = [item for item in required if item not in src]
if missing:
    print("NO-GO: AppConsole.jsx não contém todos os pontos AO-GLIP04+05.")
    for item in missing:
        print(" -", item)
    sys.exit(1)

print("GO: AppConsole.jsx contém AO-GLIP04+05 persona guard + premium shell.")
