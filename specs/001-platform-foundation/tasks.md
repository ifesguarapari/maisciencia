# Tarefas: base da plataforma

**Natureza**: baseline retrospectiva. Itens concluídos são captura e inspeção
documentais; não afirmam implementação SDD anterior ou aprovação humana.

## Inventário

- [x] T001 [US1] Registrar processos e publicação em `contracts/platform.yaml` e `plan.md` (FR-001, FR-008).
- [x] T002 [US1] Inspecionar identidades, prefixos e fronteiras do gateway em `api/gateway/kong.yaml` e `verification.md` (FR-002, FR-003).
- [x] T003 [US2] Capturar responsabilidade e preparação de dados em `data-model.md` e `research.md` (FR-005, FR-010).
- [x] T004 [US2] Inspecionar o BFF sem MongoDB e exclusão de configurações locais em `verification.md` (FR-006, FR-009).
- [x] T005 [US3] Relacionar saúde e sanitização aos testes existentes em `verification.md` (FR-004, FR-007).

## Verificação

- [ ] T006 [US1] Executar publicação e roteamento por Kong, inclusive falha de um domínio e prefixos semelhantes; registrar em `verification.md` (FR-001, FR-002, FR-003, FR-008).
- [ ] T007 [US2] Exercitar concessões e negações dos sete usuários em MongoDB real e migração de ambiente existente; registrar em `verification.md` (FR-005, FR-010).
- [x] T008 [US3] Registrar testes Python e checks locais efetivamente executados em `verification.md` (FR-004, FR-006, FR-007, FR-009).
- [ ] T009 [US3] Observar saúde com dependências indisponíveis no ambiente integrado em `verification.md` (FR-004, FR-007).

## Evolução nominal

A alteração posterior de nomes está em `005-domain-names`. Os artefatos desta
baseline são vivos e refletem a nomenclatura atual sem apagar a origem
retrospectiva. Testes de configuração não comprovam migração ou isolamento real.
