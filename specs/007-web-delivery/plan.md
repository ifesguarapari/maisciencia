# Plano: integração e publicação da web

**Feature**: `007-web-delivery` | **Data**: 2026-10-28
**Especificação**: [spec.md](spec.md)

## Solução

Criar `.github/workflows/web.yml` com jobs de build e deploy. O build usa Node 24,
cache npm pelo lockfile, `npm ci`, ESLint, testes Node, validador Python SDD e
build Vite com verificação do artefato. O deploy depende do build bem-sucedido,
restringe-se a eventos fora de PR em `main`, usa o ambiente `github-pages` e as
actions oficiais fixadas por SHA. Permissões de escrita ficam apenas no deploy;
o build pode consultar metadados do Pages com `pages: read` somente para obter
a base na preparação de publicação. PRs não consultam Pages e não publicam.

`configure-pages` informa a base para publicação. Em PRs, usar o prefixo do nome
do repositório, ou `/` para repositórios `<owner>.github.io`. A variável de build
`WEB_BASE_PATH` seleciona a base no Vite sem modificar `.env`. Concorrência de CI
é por ref; o deploy usa o grupo `github-pages` sem cancelamento de publicação
ativa. Não criar workflow ou infraestrutura para a API.

## Compatibilidade estática

Usar `import.meta.env.BASE_URL` para caminhos gerados em JavaScript e
`%BASE_URL%` nos links HTML que não são recursos automaticamente tratados pelo
Vite. Os recursos CSS são reescritos pelo Vite. Separar o prefixo antes de
identificar `/login`, `/feira`, `/oficinas`, `/oficinas/ler`, `/oficinas/lancar`
e `/oficinas/melhorar`, inclusive com barra final.

Centralizar em `web/src/pages.js` o catálogo das seis páginas provisórias,
com título, mensagem e cor, e derivar dele as sete entradas HTML. A interface,
o plugin de build `web/build/static-routes.js` e o verificador
`web/scripts/check-build.mjs` compartilham esse catálogo para manter a seleção
de rota, a emissão de arquivos e a conferência do artefato coerentes.

O plugin emite `login/index.html`, `feira/index.html`, `oficinas/index.html`,
`oficinas/ler/index.html`, `oficinas/lancar/index.html` e
`oficinas/melhorar/index.html` a partir do HTML compilado antes da geração do
service worker. Com a página inicial, são sete entradas físicas. Todos os
caminhos compilados usam a base absoluta, permitindo servir os documentos
aninhados sem fallback. Manter a atualização PWA por prompt, manifesto e cache
sob a base e exclusão das rotas de API. O verificador deve exigir as sete
entradas e sua inclusão no precache. Não usar uma página 404 para mascarar
rotas existentes.

A inspeção do artefato identificou que `media="print"` no link CSS de entrada
fazia o build anterior copiar a folha sem a transformação necessária. O plugin
`web/build/deferred-styles.js` torna a folha compilável na etapa inicial do HTML
e restaura `id="page-styles"` e `media="print"` no único link compilado. Assim,
Tailwind, URLs e minificação passam pelo Vite, preservando o bootstrap escuro,
o sinal `stylesReady` e a liberação após carregamento. Conferir novamente um
primeiro acesso com CSS atrasado, além dos caminhos do artefato.

## Contexto e constituição

Preservar Vite vanilla, Tailwind, Alpine, PWA, português da apresentação e
limites de backend. Não adicionar dependências de execução sem necessidade.
HTML estático adicional não cria serviço novo. Artefatos Markdown permanecem
em português, código e workflow em inglês. Segredos e valores de `.env` não
integram build nem documentação. Não há mudança de persistência; o modelo
desta feature é o artefato estático e os jobs de entrega.

## Matriz de implementação

| Requisito | Solução | Validação |
| --- | --- | --- |
| FR-001 | `.github/workflows/web.yml`, Node 24 e lockfile | Sintaxe e revisão dos eventos, cache e instalação |
| FR-002 | Checks do build e verificador de artefato | Executar comandos equivalentes e casos de falha pertinentes |
| FR-003 | Guards de branch/evento e permissões dos jobs | Revisão de PR, push e dispatch sem disparar GitHub |
| FR-004 | Artefato `web/dist`, deploy dependente e concorrência | Conferir diretório e política da publicação |
| FR-005 | Base do Vite, HTML, caminhos e catálogo de rotas | Testes e builds na raiz e no prefixo |
| FR-006 | Sete entradas físicas derivadas do catálogo compartilhado | HTTP estático sem fallback, incluindo rotas aninhadas, e navegador |
| FR-007 | Manifesto, service worker e cache com base | Inspeção do artefato e exercício local em navegador |
| FR-008 | Escopo web e preservação de `.env` | Inspeção dos arquivos e ausência de workflow API |
| FR-009 | README, arquitetura e quickstart | Conferência de comandos, links e limites |

## Verificação planejada

Executar ESLint, testes da web, build e verificação do artefato para ambas as
bases. Validar YAML do workflow com ferramenta disponível e revisar condições e
permissões. Executar validador SDD. Servir o artefato por servidor estático sem
fallback e conferir início, aplicativo, feira, página geral das oficinas e três
páginas individuais em navegador real. Exercitar acesso direto, recarga e barra
final nas duas bases, além de manifesto, fontes, SVGs e imagens. A ativação de Pages e a execução de Actions ficam como
etapas remotas não executadas nesta entrega local.

## Evolução: release e publicação autorizadas em 2026-11-07

Evoluir esta especificação viva para a execução remota solicitada. A consulta
ao Pages encontrou `build_type=workflow`, HTTPS obrigatório e o domínio
`https://maisciencia.ifes.app.br/`, portanto a publicação usa a base `/` sem
alterar DNS. O workflow existente já obtém a base correta de `configure-pages`.

Adotar 0.2.0 para as novas rotas públicas de oficinas e os ajustes institucionais.
Usar o SemVer incorporado em `npm version`, sem dependências novas. Documentar
patch, minor, major e a convenção durante 0.y.z em `CONTRIBUTING.md`; registrar
as alterações em `CHANGELOG.md`. Atualizar somente a versão da web e o lockfile.

Após conferir o diff, criar commit Conventional Commits na bugfix atual,
finalizá-la em `develop`, abrir `release/0.2.0`, preparar versão e changelog
e executar os checks equivalentes ao workflow. Finalizar a release com tag
anotada 0.2.0 e merge nas duas branches, sem reescrever histórico. Enviar
somente `main`, `develop` e essa tag, preferencialmente em push atômico.
Usar os hooks existentes de Commitizen; não desativar verificações.

Acompanhar o run Web do commit exato de `main` até sua conclusão. Conferir
por HTTPS a página inicial, as seis rotas provisórias e os recursos contra o
build local; verificar a interface publicada em navegador. Publicar as notas
da versão na release do GitHub, vinculadas à tag existente. Registrar a
evidência remota em `verification.md`, sem alterar retroativamente a tag
publicada; o registro posterior pode ser um commit documental em `develop`.
