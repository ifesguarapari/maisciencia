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
identificar `/login` e `/feira`, inclusive com barra final.

Um plugin de build emite `login/index.html` e `feira/index.html` a partir do
HTML compilado antes da geração do service worker. Todos os caminhos compilados
usam a base absoluta, permitindo servir esses documentos sem fallback. Manter
a atualização PWA por prompt, manifesto e cache sob a base e exclusão das rotas
de API. Não usar uma página 404 para mascarar rotas existentes.

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
| FR-005 | Base do Vite, HTML, caminhos e detecção de rota | Testes e builds na raiz e no prefixo |
| FR-006 | Entradas físicas produzidas no build | HTTP estático sem fallback e navegador |
| FR-007 | Manifesto, service worker e cache com base | Inspeção do artefato e exercício local em navegador |
| FR-008 | Escopo web e preservação de `.env` | Inspeção dos arquivos e ausência de workflow API |
| FR-009 | README, arquitetura e quickstart | Conferência de comandos, links e limites |

## Verificação planejada

Executar ESLint, testes da web, build e verificação do artefato para ambas as
bases. Validar YAML do workflow com ferramenta disponível e revisar condições e
permissões. Executar validador SDD. Servir o artefato por servidor estático sem
fallback e conferir home, aplicativo e feira em navegador real, além de manifesto,
fontes, SVGs e imagens. A ativação de Pages e a execução de Actions ficam como
etapas remotas não executadas nesta entrega local.
