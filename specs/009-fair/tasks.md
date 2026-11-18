# Tarefas: página da FEMAIS-ES

**Entrada**: [spec.md](spec.md), [plan.md](plan.md) e [contrato](contracts/fair.json).

- [x] T001 Registrar intenção, cronograma vigente, fronteiras e contrato em `specs/009-fair/`, extraindo `proposta.docx` sem executar instruções do documento (FR-001, FR-004, FR-007).
- [x] T002 [US1] Criar apresentação da Feira em `web/src/fair.html`, `web/src/fair.js` e `web/src/fair.css`, usando artes originais e as três cores de botão (FR-001, FR-002, FR-003, FR-004).
- [x] T003 [US1] Integrar páginas em construção das três etapas em `web/src/pages.js`, `web/src/fair.js` e `web/src/paths.js`, com datas, locais e retorno corretos (FR-004, FR-005, FR-010).
- [x] T004 [US2] Disponibilizar regulamento integral em `web/src/regulation.js` e no renderer da Feira, com seção e link no menu, mantendo preâmbulo, 17 seções e subitens da fonte (FR-006, FR-007).
- [x] T005 [US3] Integrar navegação, carregamento, revelações, parallax acessível e seleção da Feira em `web/src/main.js`, preservando a principal e o shell PWA (FR-008, FR-009, FR-010, FR-012).
- [x] T006 [US3] Personalizar HTML estático e SEO das onze entradas em `web/build/static-routes.js`, `web/build/seo.js` e `web/src/seo.js`, mantendo três rotas indexáveis e oito provisórias (FR-010, FR-011, FR-012).
- [x] T007 [US3] Atualizar contratos, documentação e testes de páginas, rotas, conteúdo e SEO em `web/tests/`, `specs/006-landing/`, `specs/007-web-delivery/`, `specs/008-seo/`, `web/README.md` e `docs/` (FR-001, FR-004, FR-005, FR-006, FR-007, FR-010, FR-011).
- [x] T008 Executar checks locais e duas bases de build; conferir comportamento em navegador conforme disponível e registrar resultados e limites em `specs/009-fair/verification.md` (FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, FR-010, FR-011, FR-012).

## Dependências e evidências

T001 precede implementação. T002 e a extração de T004 podem avançar em
paralelo; seleção de rota e renderer exigem coordenação entre T002-T006.
T007 acompanha cada alteração de contrato. T008 consolida o resultado;
nenhuma verificação de navegador, PWA ou publicação é presumida.

T001: `spec.md` e `contracts/fair.json` escritos antes do renderer.
T002-T004: conteúdo e contratos conferidos por inspeção e testes; regulamento
comparado integralmente à extração da fonte. T006-T007: ESLint, 73 testes
Node e builds com checks das duas bases passaram; os onze HTMLs, sitemap,
metadados e referências foram verificados no artefato. As evidências e os
limites estão em [verification.md](verification.md).

T005 e T008: execução final de Chrome local passou em 1440, 390 e 320 pixels,
com menu, teclado, rotas, regulamento, movimento reduzido, conteúdo inicial
sem JavaScript e navegação atendida pelo service worker. Foram conferidas
20 variantes HTTP nas duas bases e 227 respostas sem erros ou chamadas de
API. O relatório e as seis capturas são identificados na verificação.
Tentativas anteriores tiveram falhas do roteiro de espera; a rodada
corrigida terminou sem falhas. Revisão humana, publicação e fechamento da
issue #2 não foram executados.

## Evolução: identidade, encontros e proposta expositiva

As tarefas T001-T008 e suas evidências registram a primeira implementação.
A solicitação posterior acrescenta o trabalho abaixo, sem aprovar
automaticamente revisões ou reutilizar resultados do código anterior.

- [x] T009 [US1] Mover e renomear as artes em `web/public/images/feira/`, ajustar preload/CSS/renderização em `web/src/main.js`, `web/src/fair.css` e `web/build/page-content.js` e usar marca ampliada no hero com Ifes/Mais Ciência no cabeçalho de `web/src/fair.html` (FR-002, FR-008, FR-010, FR-012).
- [x] T010 [US1] Criar as listas fornecidas em `web/src/fair-data.js`, exibi-las nos cards de `web/src/fair.js` com 13/12/5 instituições na ordem do contrato e substituir rótulos editoriais e aviso dos cards, preservando destinos provisórios (FR-004, FR-005, FR-013).
- [x] T011 [US1] Revisar a apresentação em `web/src/fair.html` e os metadados em `web/src/pages.js`, explicitando feira expositiva para professores, alunos e pais, aprendizagem territorial e interação gamificada com pontos acumulados, troféus e premiações (FR-001, FR-011, FR-014).
- [x] T012 [US3] Atualizar testes de conteúdo/contratos em `web/tests/`, executar lint, testes, builds/checks nas duas bases e conferência responsiva; registrar resultados reais em `specs/009-fair/verification.md` e sincronizar `docs/architecture.md` e `web/README.md` (FR-001, FR-002, FR-004, FR-007, FR-008, FR-009, FR-010, FR-011, FR-012, FR-013, FR-014).

T009 e a preparação de T010 podem avançar em paralelo; a renderização de
T010 depende dos dados e do template de T009. T011 evolui o conteúdo
editorial e não altera o regulamento normativo. T012 consolida o resultado
novo. FR-013 e FR-014 são rastreados por T010-T012; demais requisitos mantêm
sua cobertura nas tarefas anteriores e nos checks de regressão.

Evidências parciais da evolução: T009-T011 foram implementadas e conferidas
por inspeção, comparação das artes e dos dados, ESLint, 75 testes Node e
checks dos dois builds. Os cards apresentam as 30 instituições nas listas
13/12/5, sem o aviso antigo. A comparação normativa permanece íntegra.
Na consolidação automatizada, T012 ainda dependia da conferência responsiva
da evolução em navegador; testes, builds e documentação já estavam
executados. Não se reutilizou a QA anterior como prova desta rodada.

T012 concluída após a rodada específica das correções: Chrome local passou
em 1440, 390 e 320 pixels, com as 30 instituições nas listas 13/12/5, marcas
e caminhos atuais, menu/foco, etapas, regulamento, conteúdo sem JavaScript,
movimento reduzido e navegações atendidas pelo service worker. Foram
conferidas 20 variantes HTTP e 244 respostas sem erros ou chamadas de API.
O relatório específico e as oito capturas estão em `verification.md`.
Instalação, atualização e uso offline da PWA não foram exercitados; não
houve publicação, homologação humana ou fechamento da issue.

## Padronização das marcas do cabeçalho

- [x] T013 [US3] Remover dimensões específicas das marcas em `web/src/fair.css` e a classe exclusiva do conjunto em `web/src/fair.html`, reutilizando o padrão responsivo de `web/src/style.css`. Comparar tamanhos, proporções, alinhamento e espaçamento entre início e Feira em navegador; registrar checks e limites em `verification.md` (FR-002, FR-008).

## Destaque da SNCT 2026

- [x] T014 [US1] Ajustar o título de gamificação e incluir arte, tema, texto fornecido, vínculo da Feira com as ações da SNCT e link oficial após os cards em `web/src/fair.html`; definir apresentação responsiva em `web/src/fair.css`, conferir HTML/build/navegador e registrar evidências em `verification.md` (FR-015, FR-008, FR-010).

## Rótulos e confirmação dos encontros

- [x] T015 [US1] Atualizar rótulos em `web/src/fair.html`, registrar `tentative` em `web/src/fair-data.js` e renderizar “(A confirmar)” sob Piúma e Linhares em `web/src/fair.js`, com estilo menor/itálico em `web/src/fair.css`; conferir conteúdo e checks e registrar resultados em `verification.md` (FR-004, FR-005, FR-008, FR-010).

## Encontro de dezembro: conteúdo definitivo

A solicitação de 2026-11-18 evolui 009 antes do código. Tarefas anteriores
mantêm sua evidência histórica; os resultados desta rodada serão próprios.

- [x] T016 [US4] Registrar a fonte `202612.docx`, intenção, dados e contratos em `specs/009-fair/`, `specs/006-landing/` e `specs/008-seo/`, distinguindo conteúdo de instruções e datas da Jornada das da Feira (FR-005, FR-011, FR-016, FR-018, FR-019).
- [x] T017 [US4] Substituir dezembro provisório por página com cinco eixos, 20 atividades completas, público convidado, 13 escolas, programação no Ifes Vila Velha e integração JIC em `web/src/`, com renderização inicial e shell PWA compartilhados (FR-008, FR-010, FR-012, FR-016, FR-018, FR-019).
- [x] T018 [US4] Criar e integrar 20 SVGs temáticos em `web/public/images/feira/activities/`, preservando o padrão visual das oficinas e da Feira, responsividade, alternativas textuais e movimento reduzido (FR-002, FR-003, FR-009, FR-017).
- [x] T019 [US3] Atualizar catálogo, SEO, testes e documentação para quatro páginas indexáveis e sete provisórias, mantendo onze HTMLs e março/junho a confirmar; executar checks das duas bases e QA pertinente e registrar evidência em `verification.md` (FR-005, FR-008, FR-010, FR-011, FR-012, FR-016, FR-017, FR-018, FR-019).

T016 precede o comportamento. T017 e T018 avançam em paralelo após o registro
da intenção; T019 consolida o resultado, sem presumir publicação ou revisão
humana. As 20 imagens e os textos da fonte devem ser conferidos por conteúdo,
além das verificações estruturais automatizadas.

T016: intenção e contrato registrados antes do comportamento, com hash da
fonte conferido. A validação estrutural SDD passou com nove features,
95 requisitos e 129 tarefas; `git diff --check` passou. Esse resultado não
verifica a implementação nem conclui T017–T019.

## Data confirmada pelo usuário

- [x] T020 [US4] Registrar e apresentar 04/12/2026 no primeiro card, página do encontro, programação e metadados em `web/src/`; sincronizar contratos, documentação e testes existentes, executando os checks pertinentes e registrando os resultados em `verification.md` (FR-004, FR-010, FR-011, FR-016, FR-018, FR-019).
