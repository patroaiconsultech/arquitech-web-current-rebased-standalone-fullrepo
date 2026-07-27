from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HOOK = ROOT / "src/hooks/useGlipAriaMode.js"
API = ROOT / "src/ui/api.js"

hook_text = HOOK.read_text(encoding="utf-8")
api_text = API.read_text(encoding="utf-8")

checks = {
    "persona_lock_boolean": "persona_lock: true" in hook_text,
    "persona_lock_string_removed": 'persona_lock: "glip_aria_architecture"' not in hook_text,
    "runtime_persona_preserved": 'runtime_persona: "glip_aria_architecture"' in hook_text,
    "aria_agent_preserved": 'agent_id: ariaId' in hook_text,
    "aria_target_preserved": 'target_agent_slug: "aria"' in hook_text,
    "single_destination_preserved": 'dest_mode: "single"' in hook_text,
    "chat_stream_serializes_persona_lock": "persona_lock," in api_text,
    "chat_stream_endpoint_preserved": 'joinApi("/api/chat/stream")' in api_text,
}

failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise SystemExit(f"FAILED: {failed}")

print(json.dumps({"status": "PASS", "checks": checks}, ensure_ascii=False))
