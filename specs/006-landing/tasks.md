# Tarefas: página institucional

As tarefas registram implementação nova; resultados planejados permanecem
pendentes até execução. Não representam homologação humana.

- [x] T001 [US1] Registrar intenção e decisões em `spec.md`, `plan.md` e artefatos SDD antes de alterar a página (FR-001, FR-004, FR-008).
- [x] T002 [US1] Construir cabeçalho, hero, nove seções e rodapé em `web/index.html` e estilos em `web/src/style.css` (FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-009).
- [x] T003 [US2] Separar instituições e pessoas em `web/src/data.js` e implementar abas, busca, filtro e detalhes em `web/src/main.js` (FR-007, FR-008).
- [x] T004 [US3] Implementar navegação, foco, responsividade, revelação, contagem e redução de movimento em `web/src/main.js` e `web/src/style.css` (FR-003, FR-005, FR-011).
- [x] T005 [US4] Apresentar `/login` provisório e remover chamadas de sessão/saúde da entrada pública em `web/index.html` e `web/src/main.js` (FR-010).
- [x] T006 [US3] Atualizar SEO e PWA em `web/index.html` e `web/vite.config.js`, incluindo recursos estáticos necessários (FR-002, FR-012).
- [x] T007 [US1] Sincronizar convenções, arquitetura, guia e `web/README.md` com a nova página e seu idioma (FR-001, FR-004, FR-010).
- [x] T008 [US2] Executar verificações de dados, filtros e interações e registrar resultados em `verification.md` (FR-007, FR-008, FR-011).
- [x] T009 [US3] Executar ESLint, build e validação SDD e registrar alcance de navegador/PWA em `verification.md` (FR-002, FR-003, FR-005, FR-006, FR-009, FR-010, FR-011, FR-012).

## Evolução: apresentação inicial

- [x] T010 [US3] Implementar fundo crítico escuro e indicador acessível em `web/index.html`, ocultando a apresentação enquanto estiver em preparação (FR-013).
- [x] T011 [US3] Coordenar prontidão, espera limitada e recuperação no frontend, preservando acesso sem JavaScript e preferência de movimento reduzido (FR-013).
- [x] T012 [US3] Verificar abertura com recursos atrasados, falhas, acesso sem JavaScript e movimento reduzido; registrar comandos e limites em `verification.md` (FR-011, FR-013).

## Evolução: tamanho estável das imagens

- [x] T013 [US3] Retirar escala contínua das marcas e ampliação das imagens das oficinas em `web/src/style.css`, sincronizando contrato e verificação (FR-014).

## Evolução: identificação institucional

- [x] T014 [US1] Retirar o processo Ifes PROEX de toda a página em `web/index.html` e conferir sua ausência nas fontes e no build (FR-009).

## Evolução: pontuação da página

- [x] T015 [US1] Substituir travessões por hífen simples nos textos e rótulos acessíveis, conferindo fontes públicas e build (FR-001).

## Evolução: oficinas práticas e ambientes virtuais

- [x] T016 [US1] Atualizar título e categoria da seção, substituir períodos por links de ambientes virtuais em `web/index.html` e conferir fonte/build conforme `contracts/ui.json` (FR-006).

## Evolução: projetos aprovados

- [x] T017 [US1] Atualizar o bloco de projetos aprovados em `web/index.html` com dois títulos, processos CNPq e valores individuais, conferindo fonte/build conforme `contracts/ui.json` (FR-009).

## Evolução: colaboração em Matemática

- [x] T018 [US2] Substituir o card de suporte em Informática por Marcelene Alves Duarte, Colaboração em Matemática, com iniciais coerentes em `web/src/data.js`; conferir dados e build (FR-008).

## Evolução: descrição das atividades

- [x] T019 [US1] Atualizar a redação de Atividades Semanais em `web/index.html` para atividades extracurriculares orientadas, sem carga horária fixa, e conferir fonte/build (FR-004).

## Evolução: rótulo da seção de projeto

- [x] T020 [US1] Usar Projeto nos menus e rodapé e PROJETO na identificação da seção em `web/index.html`, conferindo fonte e build (FR-003).

## Evolução: imagem dos apoios

- [x] T021 [US1] Substituir as três colunas textuais de apoio pela imagem fornecida em `web/index.html`, ajustar sua exibição responsiva em `web/src/style.css` e sincronizar contrato e evidências (FR-009, FR-011, FR-012).

## Evolução: somente a faixa de apoios

- [x] T022 [US1] Retirar o bloco Ifes/Mais Ciência somente da linha de apoio em `web/index.html`, centralizar `apoio.svg`, remover estilos sem uso e conferir fonte/build com o contrato atualizado (FR-009, FR-011).

## Evolução: ícones da aplicação

- [x] T023 [US3] Gerar os quatro PNGs de `web/public/icons/` a partir de `web/public/favicon.svg`, conferir cores, dimensões, opacidade e área segura maskable, sincronizar contrato e registrar build e evidências (FR-002, FR-012).

## Evolução: acesso à feira

- [x] T024 [US4] Adicionar os botões Feira no cabeçalho, menu móvel e hero com detalhes rosa e implementar `/feira` provisório, preservando `/login`, em `web/index.html`, `web/src/main.js` e `web/src/style.css`; sincronizar contrato e documentação (FR-010, FR-015).
- [x] T025 [US3] Verificar botões, rotas, retorno, foco, menu e layout responsivo no navegador e executar ESLint, build e validação SDD, registrando resultados e limites (FR-010, FR-011, FR-015).
- [x] T026 [US3] Corrigir a ocultação visual do texto auxiliar do menu móvel em `web/src/style.css`, preservando seu nome acessível, e conferir novamente o controle e o link Feira em telas pequenas (FR-011).
