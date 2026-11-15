# Tarefas: descoberta e indexação da web

- [x] T001 Registrar intenção, solução, pesquisa e contrato em `specs/008-seo/`, selecionando a feature sem alterar a branch Git Flow (FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-009).
- [x] T002 [US1] Implementar identidade, descritores e validação de origem em `web/src/seo.js` e transformação HTML em `web/build/seo.js` (FR-001, FR-002, FR-005, FR-006, FR-007).
- [x] T003 [US2] Integrar metadados por rota, robots e sitemap em `web/build/static-routes.js`, `web/vite.config.js` e `web/index.html`; sincronizar o shell PWA em `web/src/main.js` (FR-002, FR-003, FR-004, FR-007, FR-008).
- [x] T004 [P] [US3] Implementar verificação de SEO do artefato e testes em `web/scripts/check-seo.mjs` e `web/tests/seo.test.js`, integrando `web/package.json` (FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008).
- [x] T005 [P] [US3] Escrever `docs/seo.md` e atualizar referências de arquitetura, guia SDD e `web/README.md`, distinguindo Search Console e indexação real dos checks locais (FR-009).
- [x] T006 [US3] Executar checks nas duas bases e conferir HTML/HTTP/navegador/PWA; registrar resultados e limites em `specs/008-seo/verification.md` (FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-009).
- [x] T007 [US2] Corrigir a substituição dos arquivos de descoberta pelo shell com PWA ativo em `web/src/seo.js` e `web/vite.config.js`, testar a exclusão em `web/tests/seo.test.js` e conferir os arquivos reais nas duas bases em navegador (FR-004, FR-008).

## Evolução: imagem e metadados de compartilhamento

- [x] T008 [US1] Criar `web/public/icons/slide.webp` com 750 por 425 pixels a partir do fundo e das marcas fornecidos; conferir visualmente o resultado e suas dimensões, preservando as fontes originais (FR-006).
- [x] T009 [US1] Integrar a nova imagem e os campos estruturados de Open Graph em `web/src/seo.js` e no HTML principal; atualizar `web/scripts/check-seo.mjs` e `web/tests/seo.test.js`, conferindo tags, arquivo e contratos antes de registrar a evidência (FR-001, FR-002, FR-006, FR-008).

T002 e T003 são sequenciais. T004 e T005 podem avançar em paralelo após o
contrato de T001. T007 foi acrescentada pela lacuna observada durante T006;
a conclusão de T006 depende também dessa correção. Revisões humanas
e tarefas externas não são aprovadas automaticamente.

## Evolução: apresentação e regulamento da FEMAIS-ES

- [x] T010 [US1] Estender `web/src/seo.js` ao catálogo de páginas prontas e provisórias, com canonical e metadados próprios para feira, regulamento e três etapas, mantendo `WebSite` exclusivo da inicial (FR-002, FR-003, FR-005, FR-008).
- [x] T011 [US2] Gerar e validar o sitemap com inicial, feira e regulamento em `web/build/seo.js` e `web/scripts/check-seo.mjs`; excluir as oito provisórias e preservar a política de robots (FR-003, FR-004, FR-008).
- [x] T012 [US3] Atualizar `web/tests/seo.test.js`, `specs/008-seo/contracts/seo.json` e `docs/seo.md`; executar testes e registrar alcance e limites das onze rotas (FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-009).

## Evolução: cartão e metadados sociais próprios da Feira

- [x] T013 [US1] Criar `web/public/icons/feira/slide.webp` com 750 por 425 pixels, usando o fundo `images/feira/background.webp` e as marcas `images/ifes.svg` e `images/feira/femais.svg`; conferir composição, formato e preservação dos arquivos originais e do cartão principal (FR-006).
- [x] T014 [US1] Selecionar o cartão próprio nas cinco rotas da Feira em `web/src/seo.js`, com Open Graph/Twitter únicos e coerentes no HTML inicial e shell PWA; ajustar `web/tests/seo.test.js` e `web/scripts/check-seo.mjs` para validar escolha, recurso, tipo e dimensões (FR-002, FR-006, FR-007, FR-008).
- [x] T015 [US3] Revisar sinais de Google Search com fontes primárias, conferir builds/HTTP nas duas bases e registrar em `specs/008-seo/verification.md` e `docs/seo.md` os resultados, a versão pública observada e os limites de Search Console, indexação e prévia externa (FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008, FR-009).

T013 e a implementação de T014 podem avançar em paralelo após este contrato;
a validação do artefato em T015 depende do cartão final e dos metadados
integrados. A revisão de fontes e do estado público pode ocorrer antes,
sem atribuir seus resultados à branch ainda não publicada.
