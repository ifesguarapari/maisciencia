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

Centralizar em `web/src/pages.js` o catálogo de três páginas de conteúdo
(Feira, regulamento e dezembro) e sete provisórias. Com a inicial, derivar as onze
entradas HTML. A interface, o plugin de rotas estáticas e o verificador de
build compartilham esse catálogo para manter seleção e emissão coerentes.

O plugin emite os documentos correspondentes antes da geração do service
worker. A evolução [008-seo](../008-seo/spec.md) personaliza o head por rota
e acrescenta robots e sitemap; [009-fair](../009-fair/plan.md) fornece conteúdo
estático próprio para Feira, regulamento e etapas. Todos os caminhos usam
a base absoluta, permitindo servir documentos aninhados sem fallback.
Manter atualização PWA por prompt, manifesto e cache sob a base e exclusão
das APIs. O verificador deve exigir as onze entradas e sua inclusão no
precache. Não usar página 404 para mascarar rotas existentes.

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
| FR-006 | Onze entradas físicas derivadas do catálogo compartilhado | HTTP estático sem fallback, incluindo rotas aninhadas, e navegador |
| FR-007 | Manifesto, service worker e cache com base | Inspeção do artefato e exercício local em navegador |
| FR-008 | Escopo web e preservação de `.env` | Inspeção dos arquivos e ausência de workflow API |
| FR-009 | README, arquitetura e quickstart | Conferência de comandos, links e limites |
| FR-010 | Política em CONTRIBUTING, manifestos, changelog e Git Flow | Comparação de versões e tag; branches sincronizadas e run da release |

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

## Evolução: release 0.3.0 da feature issue/2

Em 2026-11-14, concluir a entrega de SEO, compartilhamento e ajustes
institucionais de 006 e 008. Usar 0.3.0, pois há funcionalidades adicionais
de descoberta/indexação e compartilhamento, conforme a política SemVer local.
Preservar a versão independente da API e a configuração existente do Pages.

Criar o commit da feature pelo assistente Commitizen com rodapé `re #2`.
Finalizar por `git flow feature finish --no-ff issue/2`, tornando a integração
explícita no histórico. Abrir `release/0.3.0`, usar `npm version minor
--no-git-tag-version` e preparar changelog e evidências. Executar instalação
limpa, lint, testes, SDD e os builds nas duas bases antes de finalizar a release.
Registrar também a preparação da release com Commitizen e a referência pedida.

Finalizar a release com tag anotada imutável, merge em `main` e retorno a
`develop`, enviando branches e tag sem push forçado. Acompanhar o run do
commit exato de produção. Conferir por HTTPS páginas, robots, sitemap,
cartão WebP e recursos contra o build; realizar smoke dirigido em navegador.
Criar a release no GitHub após sucesso e registrar os resultados em `develop`.

Na preparação da release 0.3.0, a leitura da issue GitHub #2 encontrou o título
“Feira” e requisitos da página completa da FEMAIS-ES; `/feira` era provisória. O usuário esclareceu
que a issue deve permanecer aberta para implementação posterior. Finalizar
somente a branch de trabalho, preservando a referência pedida `re #2` nos
commits, sem marcar critérios ou homologação da issue como realizados.

## Evolução: conteúdo estático da Feira

A ampliação de 009 utiliza renderer compartilhado entre build e navegador
para apresentar as regras já no HTML entregue e corrigir a seleção quando
a PWA retorna o shell da inicial. As páginas novas entram nos mesmos checks
de recursos, SEO e precache. Os trechos de release 0.2.0 e 0.3.0 acima
descrevem execuções anteriores; não constituem evidência remota desta mudança.

## Release 0.4.0 da FEMAIS-ES

A solicitação atual autoriza publicar 009 e a evolução de 008, usando
`feat(web)` com Commitizen e rodapé `re #2`. A versão 0.4.0 é minor porque
introduz conteúdo e rotas compatíveis: Feira, regulamento e três etapas.
A versão independente da API permanece 0.1.0. Não modificar dependências,
workflow ou configuração de domínio.

Validar instalação pelo lockfile, ESLint, testes Node, ferramenta SDD, dois
builds e recursos estáticos. Finalizar `feature/issue/2` em `develop` com
merge explícito, abrir `release/0.4.0`, incrementar somente os manifestos
web pelo npm, datar o changelog e criar o commit de preparação pelo
Commitizen. Finalizar Git Flow com tag anotada imutável, enviar `main`,
`develop` e a tag atomicamente e acompanhar o run do commit exato.

Conferir HTTPS, SEO e imagem nova no domínio público e navegação em Chrome.
Publicar notas da release ligadas à tag existente; consolidar evidências
pós-deploy em `develop`, sem alterar a tag. Recriar a feature com
`git flow feature start issue/2` após confirmar o deploy, antes de registrar
a execução, para que o resultado conste como evidência realizada. Consolidar
as notas em `develop`, enviá-las e atualizar a feature por fast-forward,
deixando-a ativa, limpa e com o mesmo HEAD de `develop`. A issue #2 fica aberta.

## Release 0.5.0 do encontro de dezembro

Em 2026-11-18, o usuário autorizou finalizar a feature, usar Commitizen com
rodapé `fix #2`, preparar a versão SemVer, implantar pelo GitHub Actions e
reabrir a feature local. Planejar 0.5.0 como minor: a nova página completa
de dezembro adiciona conteúdo compatível às rotas existentes. Preservar
as versões independentes da web e da API, o domínio e o workflow atual.

Antes do commit, revisar o diff e executar os checks pertinentes ao conteúdo
final de 009, inclusive a confirmação de 04/12/2026 no Ifes Vila Velha, os
20 SVGs, os rótulos e os avisos das outras etapas. Executar instalação pelo
lockfile, ESLint, testes Node, validador SDD e builds/checks nas bases `/`
e `/maisciencia/`. Conferir onze HTMLs, quatro URLs no sitemap e sete rotas
com `noindex,follow`; registrar resultados reais e limites.

Criar o commit da feature pelo assistente Commitizen, com o tipo adequado
ao conteúdo e o rodapé literal `fix #2`. Finalizar com
`git flow feature finish --no-ff issue/2`, iniciar `release/0.5.0` e usar
`npm version minor --no-git-tag-version` em `web` para sincronizar os
manifestos. Atualizar `CHANGELOG.md` com a data e o conteúdo finais, repetir
os checks exigidos pela preparação e criar o commit da release pelo
Commitizen com o mesmo rodapé. Manter todos os hooks ativos.

Finalizar Git Flow com tag anotada imutável 0.5.0 e integração em `main` e
`develop`. Enviar somente essas branches e a tag, preferencialmente de
forma atômica e sem push forçado. Acompanhar o workflow do commit exato de
`main`, identificando os jobs de build e deploy e sua URL; sucesso de um
run anterior não comprova esta publicação.

Após sucesso, conferir por HTTPS o conteúdo da Feira e de dezembro, sua
data, atividades, recursos, metadados, robots e sitemap contra o artefato
validado. Realizar smoke dirigido da interface publicada em navegador,
distinguindo esse resultado dos checks locais. Publicar as notas da
release do GitHub ligadas à tag existente e registrar evidências reais
em `verification.md`, sem alterar a tag publicada.

Finalização da branch e fechamento da issue são operações distintas.
Preservar o rodapé pedido `fix #2`, mas conferir o estado da issue #2 após
a integração: a decisão anterior do usuário mantém a issue aberta; restaurar
esse estado caso a automação do GitHub a encerre. O restante do escopo da
Feira não deve ser marcado como concluído por causa desta release.

Consolidar as evidências em `develop` com Commitizen e a referência pedida,
enviar a branch e recriar `feature/issue/2` com `git flow feature start issue/2`
após confirmar a implantação. Se a recriação preceder o commit documental,
atualizar a feature por fast-forward. Ao terminar, conferir a branch ativa,
a árvore limpa, o mesmo HEAD de `develop` e a issue #2 aberta. Não presumir
que esses estados existem antes da execução.
