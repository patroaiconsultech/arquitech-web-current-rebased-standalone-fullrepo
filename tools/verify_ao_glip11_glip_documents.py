from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / "src" / "routes" / "AppConsole.jsx"
FORMATS = ROOT / "src" / "lib" / "documents" / "glipDocumentFormats.js"
ARTIFACTS = ROOT / "src" / "lib" / "documents" / "glipDocumentArtifacts.js"
CARD = ROOT / "src" / "components" / "documents" / "GlipArtifactCard.jsx"


def require(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(f"AO_GLIP11_FRONTEND_VERIFY_FAILED: {message}")


def main() -> None:
    for path in (APP, FORMATS, ARTIFACTS, CARD):
        require(path.is_file(), f"missing:{path.relative_to(ROOT)}")

    app = APP.read_text(encoding="utf-8")
    formats = FORMATS.read_text(encoding="utf-8")
    artifacts = ARTIFACTS.read_text(encoding="utf-8")
    card = CARD.read_text(encoding="utf-8")

    for extension in ("pdf", "docx", "xlsx", "pptx", "csv", "txt", "md"):
        require(f'"{extension}"' in formats, f"missing_read_format:{extension}")

    for unsupported in ('".doc"', '".ppt"', '".xls"', '".png"', '".jpg"', '".webp"'):
        require(unsupported not in formats, f"unsupported_format_exposed:{unsupported}")

    require("getGlipDocumentSupport(f)" in app, "missing_upload_validation")
    require("formatGlipUploadResult(uploadResult" in app, "missing_indexing_status")
    require("extractGlipArtifacts(m)" in app, "missing_artifact_extraction")
    require("<GlipArtifactCard" in app, "missing_artifact_card")
    require(
        "finalArtifactEnvelope.artifacts" in app,
        "terminal_artifacts_not_preserved",
    )
    require(
        "O arquivo ficará restrito a esta conversa." in app,
        "glip_thread_scope_not_explicit",
    )
    require("ORKIO_EVENT:" in artifacts, "event_artifact_parser_missing")
    require("Arquivo criado pela Aria" in card, "aria_card_identity_missing")

    sw = ROOT / "public" / "sw.js"
    manifest = ROOT / "public" / "manifest.webmanifest"
    main_jsx = ROOT / "src" / "main.jsx"
    require(sw.is_file(), "pwa_service_worker_missing")
    require(manifest.is_file(), "pwa_manifest_missing")
    require(main_jsx.is_file(), "entrypoint_missing")
    require(
        'import "./index.css";' in main_jsx.read_text(encoding="utf-8"),
        "global_css_not_loaded",
    )

    print("AO_GLIP11_FRONTEND_VERIFY_OK")


if __name__ == "__main__":
    main()
