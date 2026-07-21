#!/usr/bin/env python3
"""AO-GLIP10 offline verifier for the GLIP PWA shell and UI contrast contract."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def main() -> int:
    index = (ROOT / "index.html").read_text(encoding="utf-8")
    main = (ROOT / "src" / "main.jsx").read_text(encoding="utf-8")
    css = (ROOT / "src" / "index.css").read_text(encoding="utf-8")
    console = (ROOT / "src" / "routes" / "AppConsole.jsx").read_text(encoding="utf-8")
    prompt = (ROOT / "src" / "components" / "PWAInstallPrompt.jsx").read_text(encoding="utf-8")
    sw = (ROOT / "public" / "sw.js").read_text(encoding="utf-8")
    server = (ROOT / "server.cjs").read_text(encoding="utf-8")
    manifest = json.loads((ROOT / "public" / "manifest.webmanifest").read_text(encoding="utf-8"))

    checks = {
        "global_css_loaded_by_real_entrypoint": 'import "./index.css";' in main,
        "service_worker_registered": 'register("/sw.js", { scope: "/" })' in main,
        "body_boots_dark": 'class="bg-[#060812] text-white antialiased"' in index,
        "manifest_theme_dark": manifest.get("theme_color") == "#060812",
        "manifest_background_dark": manifest.get("background_color") == "#060812",
        "standalone_background_locked": "@media (display-mode: standalone)" in css and "background: #060812 !important" in css,
        "api_not_cached": 'url.pathname.startsWith("/api/")' in sw,
        "runtime_env_not_cached": 'url.pathname === "/env.js"' in sw,
        "service_worker_update_headers": '"Cache-Control", "no-cache, no-store, must-revalidate"' in server and '"Service-Worker-Allowed", "/"' in server,
        "glip_auth_context_preserved": 'nav(isArquitechMode ? buildArquitechFallbackAuthUrl() : "/auth")' in console,
        "glip_install_prompt_branded": 'productLabel={isArquitechMode ? "GLIP" : "Orkio"}' in console and 'Install {productLabel}' in prompt,
        "legacy_light_body_removed": 'bg-[#f6f0e6] text-[#1f211c]' not in index,
    }

    for name, passed in checks.items():
        require(passed, f"FAILED: {name}")

    print(json.dumps({"patch": "AO-GLIP10", "passed": True, "checks": checks}, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
