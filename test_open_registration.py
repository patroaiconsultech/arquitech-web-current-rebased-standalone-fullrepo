from __future__ import annotations

from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app.config import Settings
from app.main import create_app
from app.integrations.orkio.adapter import OrkioAdapter
from app.schemas import CapabilityExecutionIn, CapabilityResponse


class FakeOrkioAdapter(OrkioAdapter):
    def __init__(
        self,
        *,
        mismatch_identity: bool = False,
        mismatch_context: bool = False,
        fail: bool = False,
    ):
        self.mismatch_identity = mismatch_identity
        self.mismatch_context = mismatch_context
        self.fail = fail
        self.execute_calls = 0
        self.stream_calls = 0
        self.last_request: CapabilityExecutionIn | None = None

    def execute(self, request: CapabilityExecutionIn) -> CapabilityResponse:
        self.execute_calls += 1
        self.last_request = request
        if self.fail:
            from app.integrations.orkio.errors import OrkioUnavailable
            raise OrkioUnavailable("fake unavailable")
        agent = "Orkio" if self.mismatch_identity else "Aria"
        agent_id = "orkio" if self.mismatch_identity else "aria"
        response = CapabilityResponse(
            schema_version="ORKIO-RESPONSE-1",
            request_id=request.context.request_id,
            execution_id=request.context.execution_id,
            correlation_id=request.context.correlation_id,
            tenant_id=request.context.tenant_id,
            source_platform="orkio",
            agent_id=agent_id,
            agent_name=agent,
            display_name=agent,
            final_speaker=agent,
            turn_owner=agent_id,
            capability_id=request.capability_id,
            status="completed",
            content="Resposta da Aria",
        )
        if self.mismatch_context:
            response.tenant_id = "other-tenant"
        from app.integrations.orkio.identity_mapper import validate_capability_response
        return validate_capability_response(response, request)

    def stream(self, request: CapabilityExecutionIn):
        self.stream_calls += 1
        self.last_request = request
        if self.fail:
            from app.integrations.orkio.errors import OrkioUnavailable
            raise OrkioUnavailable("fake unavailable")
        agent = "Orkio" if self.mismatch_identity else "Aria"
        agent_id = "orkio" if self.mismatch_identity else "aria"

        common = {
            "request_id": request.context.request_id,
            "execution_id": request.context.execution_id,
            "correlation_id": request.context.correlation_id,
            "tenant_id": "other-tenant" if self.mismatch_context else request.context.tenant_id,
            "capability_id": request.capability_id,
            "agent_id": agent_id,
            "agent_name": agent,
            "final_speaker": agent,
            "turn_owner": agent_id,
        }
        yield {"event": "chunk", "content": "Resposta ", **common}
        yield {"event": "chunk", "content": "da Aria", **common}
        yield {"event": "done", "status": "completed", **common}


@pytest.fixture()
def settings(tmp_path: Path) -> Settings:
    return Settings(
        app_name="GLIP Test",
        environment="test",
        release_commit="test-commit",
        release_artifact="test-artifact",
        deployment_id="test-deployment",
        database_url=f"sqlite:///{tmp_path / 'test.db'}",
        auto_create_schema=True,
        jwt_secret="test-secret-with-at-least-thirty-two-characters",
        jwt_issuer="glip-test",
        jwt_audience="glip-test-client",
        access_token_minutes=60,
        cors_origins=("http://testserver",),
        max_upload_bytes=1024 * 1024,
        default_tenant_slug="arquitech",
        default_tenant_name="GLIP",
        require_access_code=True,
        bootstrap_access_code="EFATA-TEST-7777",
        bootstrap_admin_email="admin@glip.example.com",
        bootstrap_admin_password="Admin-Test-Password-7777",
        orkio_base_url=None,
        orkio_m2m_token_url=None,
        orkio_client_id=None,
        orkio_client_secret=None,
        orkio_m2m_scope=None,
        orkio_timeout_seconds=10,
        orkio_api_version="v1",
        orkio_max_attempts=2,
        orkio_backoff_seconds=0,
        orkio_circuit_breaker_failures=3,
        orkio_circuit_breaker_reset_seconds=30,
        log_level="WARNING",
    )


@pytest.fixture()
def fake_adapter():
    return FakeOrkioAdapter()


@pytest.fixture()
def app(settings, fake_adapter):
    return create_app(settings=settings, orkio_adapter=fake_adapter)


@pytest.fixture()
def client(app):
    with TestClient(app) as value:
        yield value


def register_and_login(client: TestClient, *, email: str, tenant: str = "arquitech") -> dict:
    response = client.post(
        "/api/auth/register",
        json={
            "tenant": tenant,
            "email": email,
            "name": "Test User",
            "password": "Strong-Test-Password-7777",
            "access_code": "EFATA-TEST-7777",
            "accept_terms": True,
            "source": "glip",
            "product": "arquitech",
            "agent": "aria",
        },
        headers={"X-Org-Slug": tenant},
    )
    assert response.status_code == 201, response.text
    response = client.post(
        "/api/auth/login",
        json={
            "tenant": tenant,
            "email": email,
            "password": "Strong-Test-Password-7777",
        },
        headers={"X-Org-Slug": tenant},
    )
    assert response.status_code == 200, response.text
    return response.json()


@pytest.fixture()
def user_session(client):
    return register_and_login(client, email="user@glip.example.com")


@pytest.fixture()
def auth_headers(user_session):
    return {
        "Authorization": f"Bearer {user_session['access_token']}",
        "X-Org-Slug": user_session["tenant"],
    }
