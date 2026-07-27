from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class RegisterIn(StrictModel):
    tenant: str
    email: EmailStr
    name: str = Field(min_length=2, max_length=180)
    password: str = Field(min_length=8, max_length=256)
    access_code: str | None = None
    accept_terms: bool = False
    marketing_consent: bool = False
    source: str | None = None
    product: str | None = None
    agent: str | None = None

    @field_validator("tenant")
    @classmethod
    def normalize_tenant(cls, value: str) -> str:
        value = value.strip().lower()
        if not value:
            raise ValueError("tenant is required")
        return value


class LoginIn(StrictModel):
    tenant: str
    email: EmailStr
    password: str
    access_code: str | None = None
    source: str | None = None
    product: str | None = None
    agent: str | None = None


class OtpVerifyIn(StrictModel):
    tenant: str
    email: EmailStr
    code: str


class ForgotPasswordIn(StrictModel):
    tenant: str
    email: EmailStr


class ResetPasswordIn(StrictModel):
    tenant: str
    token: str
    password: str = Field(min_length=8)
    password_confirm: str = Field(min_length=8)


class AccessCodeIn(StrictModel):
    code: str
    email: EmailStr | None = None
    tenant: str | None = None
    org: str | None = None


class AccessGrantCreateIn(StrictModel):
    label: str = Field(min_length=2, max_length=120)
    code: str = Field(min_length=8, max_length=256)
    allowed_email: EmailStr | None = None
    max_uses: int | None = Field(default=None, ge=1)
    expires_at: datetime | None = None


class ThreadCreateIn(StrictModel):
    title: str = Field(default="Nova conversa", min_length=1, max_length=240)


class ThreadUpdateIn(StrictModel):
    title: str = Field(min_length=1, max_length=240)


class ChatIn(StrictModel):
    thread_id: str | None = None
    message: str = Field(min_length=1, max_length=50_000)
    agent_id: str | None = "aria"
    agent_ids: list[str] | None = None
    dest_mode: str | None = None
    visible_agent: str | None = "aria"
    target_agent_slug: str | None = "aria"
    requested_agent_names: list[str] | None = None
    source: str | None = "glip"
    product: str | None = "arquitech"
    context_mode: str | None = None
    runtime_persona: str | None = None
    persona_lock: bool | None = True
    top_k: int | None = Field(default=None, ge=1, le=50)
    trace_id: str | None = None
    client_message_id: str | None = Field(default=None, min_length=1, max_length=120)
    tenant: str | None = None


class DocumentGenerateIn(StrictModel):
    thread_id: str | None = None
    format: Literal["md", "csv", "xlsx", "docx", "pptx", "pdf"]
    title: str | None = None
    filename: str | None = None
    content: str = ""
    rows: list[list[Any]] | None = None
    requested_agent_hint: str = "aria"


class CanonicalExecutionContext(StrictModel):
    schema_version: Literal["GLIP-EXECUTION-1"] = "GLIP-EXECUTION-1"
    request_id: str
    execution_id: str
    correlation_id: str
    tenant_id: str
    organization_id: str
    user_id: str
    source_platform: str = "glip"
    source_environment: str
    requested_capability: str
    requested_agent: str = "aria"
    governance_mode: str = "governed"
    write_allowed: bool = False
    execution_allowed: bool = True
    data_classification: Literal["PUBLIC", "INTERNAL", "CONFIDENTIAL", "RESTRICTED", "REGULATED", "SECRET"] = "CONFIDENTIAL"
    thread_id: str | None = None
    resolved_agent: str = "aria"
    turn_owner: str = "aria"
    display_agent: str = "Aria"
    route_family: str = "glip"
    ownership_locked: bool = True


class CapabilityExecutionIn(StrictModel):
    schema_version: Literal["ORKIO-CAPABILITY-REQUEST-1"] = "ORKIO-CAPABILITY-REQUEST-1"
    capability_id: str
    capability_version: str | None = None
    context: CanonicalExecutionContext
    input: dict[str, Any]
    idempotency_key: str


class CapabilityResponse(StrictModel):
    schema_version: Literal["ORKIO-RESPONSE-1"]
    message_id: str | None = None
    request_id: str
    execution_id: str
    correlation_id: str
    tenant_id: str
    source_platform: str
    agent_id: str
    agent_name: str
    display_name: str
    final_speaker: str
    turn_owner: str
    capability_id: str
    status: Literal["accepted", "running", "completed", "failed", "cancelled", "partial"]
    content: str | None = None
    error: dict[str, Any] | None = None
    token_usage: dict[str, Any] | None = None
    latency: dict[str, Any] | None = None
    artifacts: list[dict[str, Any]] = Field(default_factory=list)
    created_at: datetime | None = None
