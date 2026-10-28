# Tarefas: baseline retrospectiva de sessões

Os itens concluídos representam inventário documental desta adoção, não tarefas
anteriores à implementação. Validações externas permanecem pendentes.

## Inventário e contratos

- [x] T001 [US1] Inspecionar entrada e identidade e registrar em `spec.md` e `data-model.md` (FR-001, FR-002, FR-003).
- [x] T002 [US2] Inspecionar expiração, revogação e rotação em `plan.md` (FR-004, FR-005, FR-006).
- [x] T003 [US3] Capturar origem, CSRF e chamadas internas em `contracts/openapi.yaml` e `contracts/internal-auth.openapi.yaml` (FR-007, FR-008).
- [x] T004 [US3] Relacionar falhas, cache, saúde e provisionamento a fontes e testes em `verification.md` (FR-009, FR-010, FR-011, FR-012).
- [x] T005 [US1] Documentar reprodução em `quickstart.md` e decisões em `research.md` (FR-001, FR-012).

## Evidência de execução

- [x] T006 [US1] Registrar testes de autenticação e BFF em `verification.md`, distinguindo persistência simulada (FR-001, FR-002, FR-003, FR-012).
- [ ] T007 [US2] Validar o ciclo de vida com MongoDB e Kong reais em `verification.md` (FR-004, FR-005, FR-006, FR-008, FR-009).
- [ ] T008 [US3] Validar cookie, origem, CSRF e ausência de cache no navegador em `verification.md` (FR-002, FR-007, FR-010).
- [ ] T009 [US3] Registrar saúde agregada no ambiente integrado em `verification.md` (FR-011).

T007 depende da infraestrutura de `001-platform-foundation`; T008 depende do
frontend de `003-web-pwa`. Resultados novos devem preservar os limites reais da
evidência, sem substituir o requisito para transformar uma falha em sucesso.
