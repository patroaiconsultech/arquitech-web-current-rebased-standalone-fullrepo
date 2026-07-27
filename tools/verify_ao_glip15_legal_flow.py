from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

app_console = (ROOT / "src/routes/AppConsole.jsx").read_text(encoding="utf-8")
auth = (ROOT / "src/lib/auth.js").read_text(encoding="utf-8")
modal = (ROOT / "src/ui/TermsModal.jsx").read_text(encoding="utf-8")

checks = {
    "legal_routes_registered": all(
        token in (ROOT / "src/App.jsx").read_text(encoding="utf-8")
        for token in (
            'path="/legal/terms"',
            'path="/legal/privacy"',
            'routes/legal/Terms.jsx',
            'routes/legal/Privacy.jsx',
        )
    ),
    "modal_requires_checkbox": all(
        token in modal
        for token in (
            'type="checkbox"',
            "acknowledged",
            "Li e concordo",
            "disabled={accepting || !acknowledged}",
        )
    ),
    "modal_surfaces_legal_error": all(
        token in modal
        for token in ("initialError", "useEffect", "setError(String(initialError))")
    ),
    "app_console_imports_terms_version": "fetchCurrentTermsVersion" in app_console,
    "app_console_checks_version": "acceptedTermsVersion" in app_console,
    "app_console_fails_closed": all(
        token in app_console
        for token in (
            "legalVersionError",
            "setLegalVersionError",
            "setShowTermsModal(true)",
        )
    ),
    "terms_fetch_has_no_local_fallback": (
        "return getAcceptedTermsVersion()" not in auth
        and "data?.terms_version" in auth
        and "não informou uma versão válida" in auth
    ),
    "legal_footer_no_html_dead_links": all(
        token not in (ROOT / "src/components/LegalFooter.jsx").read_text(encoding="utf-8")
        for token in ("/legal/terms.html", "/legal/privacy.html")
    ),
    "current_default_version": "2026-07-24" in auth,
    "glip_terms_brand": "Termos de Uso do GLIP" in (
        ROOT / "src/routes/legal/Terms.jsx"
    ).read_text(encoding="utf-8"),
    "glip_privacy_brand": "GLIP trata dados pessoais" in (
        ROOT / "src/routes/legal/Privacy.jsx"
    ).read_text(encoding="utf-8"),
    "accepted_version_reused": "result?.termsVersion" in app_console,
}

failed = [name for name, passed in checks.items() if not passed]
if failed:
    raise SystemExit("FAILED: " + ", ".join(failed))

print(f"AO-GLIP15.1 LEGAL FLOW PASS — {len(checks)} checks")
