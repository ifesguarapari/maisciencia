# Evidências e rastreabilidade

**Captura**: 2026-10-27. Código e métodos de teste foram inspecionados. A
existência de um teste não significa que ele passou nesta adoção. A execução
local consolidada nesta adoção está registrada abaixo. Não há
homologação humana registrada nem comprovação de infraestrutura real aqui.

Os caminhos abaixo são relativos à raiz do repositório. Os métodos pertencem
a `api/tests/test_authentication.py` (`SessionLifecycleTests` e
`AuthenticationCommandTests`) ou `api/tests/test_web_backend.py`
(`BrowserBackendTests` e `AuthenticationTransportTests`).

| Requisito | Fonte observada | Testes existentes | Estado da evidência |
| --- | --- | --- | --- |
| FR-001 | `authentication/app.py`: `login` e `_login_credentials` | `test_unknown_and_incorrect_credentials_have_the_same_response`; `test_disabled_accounts_cannot_login_or_reuse_sessions` | Testes locais passaram; dependências controladas. |
| FR-002 | `web/routes.py`: `_session_response`; `web/client.py`: `public_session` | `test_login_hides_private_fields_and_sets_a_scoped_secure_cookie`; `test_login_stores_only_the_session_verifier` | Inspecionado; cookie real no navegador pendente. |
| FR-003 | `authentication/app.py`: `current_session` | `test_current_session_updates_activity_without_extending_lifetime`; `test_current_session_returns_identity_and_csrf_without_private_fields` | Testes locais passaram; persistência e transporte simulados. |
| FR-004 | `authentication/app.py`: `_session_context` | `test_absolute_expiration_is_enforced_before_ttl_cleanup`; `test_idle_expiration_is_enforced_before_ttl_cleanup`; `test_an_unknown_token_is_rejected`; `test_disabled_accounts_cannot_login_or_reuse_sessions` | Inspecionado; TTL e persistência reais pendentes. |
| FR-005 | `authentication/app.py`: `refresh`; `web/routes.py`: `refresh` | `test_refresh_rotates_the_token_and_keeps_absolute_expiry`; `test_refresh_rotates_the_cookie_without_exposing_its_value` | Testes locais passaram; persistência e transporte simulados. |
| FR-006 | `authentication/app.py`: `logout` | `test_logout_revokes_the_server_side_session`; `test_logout_revokes_a_concurrently_rotated_session`; `test_revocation_during_lookup_does_not_restore_a_session` | Inspecionado; concorrência MongoDB real pendente. |
| FR-007 | `web/app.py`: `validate_browser_origin`; `authentication/app.py`: `_csrf_guard` | `test_login_rejects_missing_or_untrusted_origins`; `test_state_changes_reject_form_content_and_malformed_login_payloads`; `test_session_mutations_require_matching_csrf` | Testes locais passaram; persistência e transporte simulados. |
| FR-008 | `authentication/app.py`: `_internal_guard`; `api/gateway/kong.yaml` | `test_all_internal_routes_require_a_backend_secret`; `test_missing_internal_configuration_fails_closed` | Guardas inspecionadas; bloqueio no Kong real pendente. |
| FR-009 | `web/client.py`; erros de banco na autenticação | `test_failed_revocation_does_not_claim_logout_succeeded`; `test_database_failures_are_sanitized`; `test_transport_failures_and_malformed_payloads_fail_closed`; `test_redirects_never_forward_credentials_to_another_host` | Testes locais passaram; persistência e transporte simulados. |
| FR-010 | `web/app.py`: `disable_response_caching`; `web/src/main.js`; `web/vite.config.js` | `test_rejected_session_clears_cookie_and_errors_are_not_cached` | Backend inspecionado; armazenamento/cache no navegador pendente. |
| FR-011 | `web/app.py`: `health`; `web/status.py` | `test_health_has_no_database_or_authentication_dependency`; `test_health_aggregation_preserves_partial_availability` | Inspecionado; rede completa pendente. |
| FR-012 | `authentication/app.py`: `init_db_command`, `create_user_command` | `test_create_user_hashes_the_hidden_password`; `test_create_user_rejects_duplicate_email`; `test_create_user_rejects_short_passwords`; `test_init_db_creates_unique_and_expiry_indexes` | Inspecionado; provisionamento no MongoDB real pendente. |

## Registro de execução

| Verificação | Resultado nesta captura | Limite |
| --- | --- | --- |
| Inspeção de código e métodos acima | Concluída | Não executa o comportamento. |
| Testes locais de autenticação e BFF | Passaram nesta adoção | Usam persistência simulada. |
| Fluxo HTTP completo com Kong e MongoDB | Não verificado | Necessita infraestrutura acessível. |
| Cookie e comportamento em navegador | Não verificado | Necessita navegador e origem configurada. |

Atualizações devem registrar comando, data, resultado e limite da evidência,
sem anexar tokens ou senhas. A situação da suíte completa deve ser registrada
sem confundir contagem de métodos com cobertura funcional ou homologação.

## Verificação documental executada em 2026-10-27

Foi executado um script local de inspeção para conferir: referências FR dos
requisitos em `tasks.md` e `verification.md`, existência dos destinos de links
Markdown locais e leitura dos contratos com PyYAML/JSON. Resultado: sem erros
nesses checks. Nas interfaces de sessão, todos os `$ref` locais e entre os
dois arquivos OpenAPI foram resolvidos. Isso não é validação completa pelo
schema oficial OpenAPI, teste de contrato HTTP nem execução de infraestrutura.

## Limite de corpo nos endpoints de login

Em 2026-10-27, um exercício com os clientes de teste Flask enviou JSON válido
com campos de credenciais e um campo adicional de 20.000 caracteres para
`/login` e `/internal/login`. Ambos retornaram HTTP `413`, conteúdo `text/html`
e `Cache-Control: no-store`, conforme o limite `MAX_CONTENT_LENGTH=16384`
(16 KiB). O cliente público usou origem permitida e uma dependência substituta;
o cliente interno usou uma credencial de teste. A rejeição ocorreu antes do
acesso a dados, sem conexão ou operação em MongoDB real.

O limite e a resposta HTML foram acrescentados aos dois contratos OpenAPI.
A correção documental foi conferida por parsing YAML e resolução de `$ref`,
sem repetir o exercício ou atribuir a ele validação de gateway ou navegador.

## Execução local consolidada em 2026-10-27

A suíte API de 47 testes passou, incluindo 21 cenários de autenticação e
16 do BFF. Foram usados cliente Flask, dependências controladas e persistência
simulada. Black e Pylint passaram. Essa evidência cobre os cenários locais de
sessão e erros previstos nos testes, sem comprovar MongoDB, Kong ou navegador
reais. As validações externas mantêm suas tarefas abertas.
