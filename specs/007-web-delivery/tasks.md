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

## Evolução: release 0.3.0 da feature issue/2

- [x] T013 [US2] Revisar o diff, registrar a feature com Commitizen e `re #2`, finalizar `feature/issue/2` e preparar `release/0.3.0` com versão da web e `CHANGELOG.md` (FR-009, FR-010).
- [x] T014 [US2] Executar checks locais, registrar preparação com Commitizen e `re #2`, finalizar a release, enviar `main`, `develop` e tag 0.3.0 e acompanhar o workflow até seu resultado real (FR-002, FR-003, FR-004, FR-010).
- [x] T015 [US3] Conferir por HTTPS páginas, SEO, imagem de compartilhamento e recursos, fazer smoke em navegador e publicar notas/evidências reais da release (FR-005, FR-006, FR-007, FR-008, FR-009).
- [x] T016 [US2] Resolver o estado da issue GitHub #2 conforme o esclarecimento de escopo solicitado ao usuário, distinguindo seu fechamento da finalização da branch e sem aprovar critérios pendentes (FR-009, FR-010).

## Release 0.4.0 e reabertura da feature

- [x] T017 [US2] Validar o diff e a instalação limpa; registrar a feature com Commitizen e `re #2`, finalizar `feature/issue/2` em `develop` e preparar `release/0.4.0`, manifestos web e `CHANGELOG.md` (FR-002, FR-009, FR-010).
- [x] T018 [US2] Conferir os dois builds, criar commit de preparação com Commitizen e `re #2`, finalizar Git Flow e enviar `main`, `develop` e tag 0.4.0; acompanhar os jobs do commit exato no Actions (FR-002, FR-003, FR-004, FR-010).
- [x] T019 [US3] Conferir páginas, recursos, SEO, novo cartão e apresentação por HTTPS/Chrome; publicar notas da versão e registrar evidências reais e limites em `verification.md` e `docs/seo.md` (FR-005, FR-006, FR-007, FR-008, FR-009).
- [x] T020 [US2] Incorporar evidências a `develop` com Commitizen e `re #2`, enviar a branch e recriar `feature/issue/2` pelo Git Flow, confirmando base, branch ativa e árvore limpa, sem fechar a issue #2 (FR-009, FR-010).

## Release 0.5.0 e recriação da feature

O pedido de 2026-11-18 autoriza esta sequência. As tarefas abaixo permanecem
pendentes até evidências próprias; a publicação 0.4.0 é histórica.

- [x] T021 [US2] Revisar o conteúdo final de dezembro e os ajustes da Feira, executar instalação e checks locais pertinentes, registrar a feature pelo Commitizen com `fix #2`, finalizar `feature/issue/2` e iniciar `release/0.5.0`, atualizando somente manifestos web e `CHANGELOG.md` conforme SemVer (FR-002, FR-005, FR-006, FR-009, FR-010).
- [x] T022 [US2] Conferir a preparação com builds/checks das duas bases, onze HTMLs, quatro URLs indexáveis e sete provisórias; criar o commit da release com Commitizen e `fix #2`, finalizar Git Flow, enviar `main`, `develop` e tag 0.5.0 e acompanhar os jobs do commit exato no Actions até seu resultado real (FR-002, FR-003, FR-004, FR-006, FR-010).
- [x] T023 [US3] Conferir por HTTPS e navegador a implantação, incluindo 04/12/2026 no Ifes Vila Velha, 20 atividades, recursos, SEO, robots e sitemap; publicar notas da release ligadas à tag existente e registrar evidências e limites reais em `verification.md` (FR-005, FR-006, FR-007, FR-008, FR-009).
- [x] T024 [US2] Conferir e preservar a issue GitHub #2 aberta, restaurando o estado caso `fix #2` cause fechamento automático; consolidar evidências em `develop` com Commitizen e a referência pedida, enviar a branch e recriar `feature/issue/2` pelo Git Flow após o deploy, confirmando branch ativa, base em `develop` e árvore limpa (FR-009, FR-010).

T021 precede a integração da release; T022 depende dos checks da versão
preparada; T023 depende do resultado remoto de T022. T024 confirma o estado
final solicitado e não transforma a finalização da branch em conclusão da
issue. Nenhuma tarefa presume publicação ou homologação humana.

## Release patch 0.5.1

- [x] T025 [US2] Revisar a troca de imagem, validar checks pertinentes, criar commit `fix(web)` pelo Commitizen com `re #2`, finalizar a feature e preparar `release/0.5.1`, sincronizando manifestos e changelog (FR-002, FR-009, FR-010).
- [ ] T026 [US2] Validar os builds da correção, registrar a preparação pelo Commitizen, finalizar a release e enviar main/develop/tag 0.5.1; acompanhar o resultado do commit exato no GitHub Actions (FR-002, FR-003, FR-004, FR-010).
- [ ] T027 [US3] Conferir SVG, ausência do PNG e layout publicados, criar notas e evidências reais, preservar a issue #2 aberta e devolver a feature recriada pelo Git Flow, ativa, limpa e alinhada a develop (FR-005, FR-006, FR-007, FR-008, FR-009, FR-010).
