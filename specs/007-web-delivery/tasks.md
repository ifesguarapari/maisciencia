# Tarefas: integração e publicação da web

Os resultados remotos permanecem não executados até uma execução real. As tarefas
abaixo cobrem a entrega local autorizada e sua evidência, sem revisão humana fictícia.

- [x] T001 Registrar intenção, plano, decisões e rastreabilidade em `specs/007-web-delivery/` antes da implementação (FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-009).
- [x] T002 [P] [US1] Criar `.github/workflows/web.yml` com checks, metadados de base, guards, artefato e deploy condicionado, mantendo a API fora do escopo (FR-001, FR-002, FR-003, FR-004, FR-008).
- [x] T003 [P] [US3] Adaptar `web/index.html`, caminhos de `web/src/` e `web/vite.config.js` para raiz e prefixo, com entradas físicas e PWA correspondente (FR-005, FR-006, FR-007).
- [x] T004 [US3] Acrescentar testes de caminhos e verificação do artefato em `web/tests/` e `web/scripts/`, cobrindo as duas bases e recursos ausentes (FR-002, FR-005, FR-006, FR-007).
- [x] T005 [US2] Documentar ativação e operação em `specs/007-web-delivery/quickstart.md`, `web/README.md`, `CONTRIBUTING.md` e `docs/architecture.md`, sincronizando o contexto da landing (FR-009).
- [x] T006 [US1] Executar checks locais, revisar YAML e guards e registrar evidências em `specs/007-web-delivery/verification.md` (FR-001, FR-002, FR-003, FR-004, FR-008).
- [x] T007 [US3] Conferir o build com HTTP estático sem fallback e navegador; registrar recursos, rotas e limites de PWA, sem alegar publicação remota (FR-005, FR-006, FR-007, FR-009).

T002 e T003 podem acontecer em paralelo após T001, com contrato comum para
`WEB_BASE_PATH` e `npm run check:build`. T004 acompanha os caminhos escolhidos;
T005 e verificações finais dependem da implementação concreta.

## Evolução: rotas das oficinas

- [x] T008 [US3] Ampliar o catálogo, o emissor de HTML físico e o verificador de artefato em `web/` para as quatro rotas de oficinas solicitadas em 006, mantendo testes e precache nas bases `/` e `/maisciencia/` (FR-005, FR-006, FR-007).

## Evolução: release e publicação autorizadas

- [x] T009 [US2] Registrar política SemVer e fluxo Git Flow em `CONTRIBUTING.md`, sincronizando especificação, plano e contrato da entrega web (FR-009, FR-010).
- [x] T010 [US2] Incorporar o trabalho em `develop`, preparar `release/0.2.0`, atualizar os manifestos da web e `CHANGELOG.md` e executar os checks locais antes de finalizar a release (FR-002, FR-010).
- [x] T011 [US2] Finalizar a release em `main` e `develop`, criar a tag 0.2.0 e enviar branches e tag; acompanhar o workflow e publicar as notas da versão no GitHub (FR-003, FR-004, FR-010).
- [x] T012 [US3] Conferir as sete páginas e recursos por HTTPS e a interface em navegador no domínio configurado; registrar resultados reais e limites em `verification.md` (FR-005, FR-006, FR-007, FR-008, FR-009).
