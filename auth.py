from __future__ import annotations

from dataclasses import dataclass
import os
from urllib.parse import urlparse


def _as_bool(value: str | None, default: bool = False) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _as_int(value: str | None, default: int) -> int:
    try:
        return int(value or default)
    except (TypeError, ValueError):
        return default


def _as_float(value: str | None, default: float) -> float:
    try:
        return float(value or default)
    except (TypeError, ValueError):
        return default


def _csv(value: str | None) -> tuple[str, ...]:
    return tuple(item.strip() for item in (value or "").split(",") if item.strip())


@dataclass(frozen=True)
class Settings:
    app_name: str
    environment: str
    release_commit: str
    release_artifact: str
    deployment_id: str
    database_url: str
    auto_create_schema: bool
    jwt_secret: str
    jwt_issuer: str
    jwt_audience: str
    access_token_minutes: int
    cors_origins: tuple[str, ...]
    max_upload_bytes: int
    default_tenant_slug: str
    default_tenant_name: str
    require_access_code: bool
    bootstrap_access_code: str | None
    bootstrap_admin_email: str | None
    bootstrap_admin_password: str | None
    orkio_base_url: str | None
    orkio_m2m_token_url: str | None
    orkio_client_id: str | None
    orkio_client_secret: str | None
    orkio_m2m_scope: str | None
    orkio_timeout_seconds: int
    orkio_api_version: str
    orkio_max_attempts: int
    orkio_backoff_seconds: float
    orkio_circuit_breaker_failures: int
    orkio_circuit_breaker_reset_seconds: int
    log_level: str

    @classmethod
    def from_env(cls) -> "Settings":
        database_url = os.getenv("DATABASE_URL", "sqlite:///./glip.db").strip()
        if database_url.startswith("postgres://"):
            database_url = "postgresql://" + database_url[len("postgres://"):]
        settings = cls(
            app_name=os.getenv("GLIP_APP_NAME", "GLIP Backend"),
            environment=os.getenv("GLIP_ENVIRONMENT", "development"),
            release_commit=(os.getenv("GLIP_RELEASE_COMMIT") or "").strip() or "unknown",
            release_artifact=(os.getenv("GLIP_RELEASE_ARTIFACT") or "").strip() or "unknown",
            deployment_id=(
                os.getenv("GLIP_DEPLOYMENT_ID")
                or os.getenv("RAILWAY_DEPLOYMENT_ID")
                or ""
            ).strip() or "local",
            database_url=database_url,
            auto_create_schema=_as_bool(os.getenv("GLIP_AUTO_CREATE_SCHEMA"), default=False),
            jwt_secret=os.getenv("GLIP_JWT_SECRET", "change-me-in-production"),
            jwt_issuer=os.getenv("GLIP_JWT_ISSUER", "glip-backend"),
            jwt_audience=os.getenv("GLIP_JWT_AUDIENCE", "glip-frontend"),
            access_token_minutes=_as_int(os.getenv("GLIP_ACCESS_TOKEN_MINUTES"), 720),
            cors_origins=_csv(
                os.getenv(
                    "GLIP_CORS_ORIGINS",
                    "http://localhost:5173,http://127.0.0.1:5173",
                )
            ),
            max_upload_bytes=_as_int(os.getenv("GLIP_MAX_UPLOAD_BYTES"), 20 * 1024 * 1024),
            default_tenant_slug=os.getenv("GLIP_DEFAULT_TENANT_SLUG", "arquitech").strip().lower(),
            default_tenant_name=os.getenv(
                "GLIP_DEFAULT_TENANT_NAME",
                "GLIP Intelligence Architecture",
            ).strip(),
            require_access_code=_as_bool(
                os.getenv("GLIP_REQUIRE_ACCESS_CODE"),
                default=False,
            ),
            bootstrap_access_code=(os.getenv("GLIP_BOOTSTRAP_ACCESS_CODE") or "").strip() or None,
            bootstrap_admin_email=(os.getenv("GLIP_BOOTSTRAP_ADMIN_EMAIL") or "").strip().lower() or None,
            bootstrap_admin_password=(os.getenv("GLIP_BOOTSTRAP_ADMIN_PASSWORD") or "").strip() or None,
            orkio_base_url=(os.getenv("ORKIO_BASE_URL") or "").strip().rstrip("/") or None,
            orkio_m2m_token_url=(os.getenv("ORKIO_M2M_TOKEN_URL") or "").strip() or None,
            orkio_client_id=(os.getenv("ORKIO_CLIENT_ID") or "").strip() or None,
            orkio_client_secret=(os.getenv("ORKIO_CLIENT_SECRET") or "").strip() or None,
            orkio_m2m_scope=(os.getenv("ORKIO_M2M_SCOPE") or "").strip() or None,
            orkio_timeout_seconds=_as_int(os.getenv("ORKIO_TIMEOUT_SECONDS"), 60),
            orkio_api_version=os.getenv("ORKIO_API_VERSION", "v1").strip(),
            orkio_max_attempts=_as_int(os.getenv("ORKIO_MAX_ATTEMPTS"), 2),
            orkio_backoff_seconds=_as_float(os.getenv("ORKIO_BACKOFF_SECONDS"), 0.25),
            orkio_circuit_breaker_failures=_as_int(
                os.getenv("ORKIO_CIRCUIT_BREAKER_FAILURES"),
                5,
            ),
            orkio_circuit_breaker_reset_seconds=_as_int(
                os.getenv("ORKIO_CIRCUIT_BREAKER_RESET_SECONDS"),
                30,
            ),
            log_level=os.getenv("LOG_LEVEL", "INFO").upper(),
        )
        settings.validate()
        return settings

    def validate(self) -> None:
        production = self.environment.lower() in {"production", "prod"}
        if production and self.jwt_secret == "change-me-in-production":
            raise RuntimeError("GLIP_JWT_SECRET must be configured in production.")
        if production and len(self.jwt_secret) < 32:
            raise RuntimeError("GLIP_JWT_SECRET must have at least 32 characters in production.")
        if production and self.release_commit == "unknown":
            raise RuntimeError("GLIP_RELEASE_COMMIT must identify the deployed commit in production.")
        if production and self.release_artifact == "unknown":
            raise RuntimeError("GLIP_RELEASE_ARTIFACT must identify the deployed artifact in production.")
        parsed = urlparse(self.database_url)
        if parsed.scheme not in {"sqlite", "postgresql", "postgresql+psycopg2"}:
            raise RuntimeError("DATABASE_URL must use sqlite or postgresql.")
        if not self.cors_origins:
            raise RuntimeError("GLIP_CORS_ORIGINS must define at least one allowed origin.")
        if self.orkio_timeout_seconds < 1:
            raise RuntimeError("ORKIO_TIMEOUT_SECONDS must be positive.")
        if not 1 <= self.orkio_max_attempts <= 5:
            raise RuntimeError("ORKIO_MAX_ATTEMPTS must be between 1 and 5.")
        if self.orkio_backoff_seconds < 0:
            raise RuntimeError("ORKIO_BACKOFF_SECONDS cannot be negative.")
        if self.orkio_circuit_breaker_failures < 1:
            raise RuntimeError("ORKIO_CIRCUIT_BREAKER_FAILURES must be positive.")
        if self.orkio_circuit_breaker_reset_seconds < 1:
            raise RuntimeError("ORKIO_CIRCUIT_BREAKER_RESET_SECONDS must be positive.")
