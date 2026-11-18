# Verificação: integração e publicação da web

**Data**: 2026-10-28. Artefatos especificados antes da implementação.

| Requisito | Evidência | Estado observado |
| --- | --- | --- |
| FR-001 | Eventos, Node, cache e lockfile do workflow | YAML conferido; instalação limpa pelo lockfile passou |
| FR-002 | ESLint, testes, build, artefato e SDD | ESLint, 61 testes, builds e verificador passaram localmente e no run da release 0.3.0 |
| FR-003 | Guards e permissões de PR, push e dispatch | Revisão de nove combinações de evento/ref e permissões sem escrita no build |
| FR-004 | Diretório publicado, dependência e concorrência | Upload restrito a `web/dist`; deploy 43637653321 concluiu com sucesso para o commit da tag 0.3.0 |
| FR-005 | Builds e testes de caminhos nas duas bases | `/` e `/maisciencia/` passaram; artefatos e navegador conferidos |
| FR-006 | Entradas físicas e HTTP sem fallback | Sete páginas publicadas e 13 variantes de URL conferidas por HTTPS; conteúdo corresponde ao build local |
| FR-007 | Manifesto, service worker e recursos sob a base | Manifesto e escopo conferidos; navegação estática offline passou sob `/maisciencia/` |
| FR-008 | Ausência de workflow API e preservação de configuração local | Somente `web.yml`; `.env` ignorados e ausentes do artefato |
| FR-009 | Instruções reproduzíveis e limites honestos | README, arquitetura, contribuição e quickstart sincronizados |
| FR-010 | Política SemVer, manifestos, changelog, Git Flow e tag | 0.3.0 sincronizada nos manifestos e changelog; feature e release finalizadas, tag e branches enviados, release GitHub publicada |

## Checks de código e artefato

`npm run lint` passou e `npm test` executou 29 testes com sucesso: sete de dados
e filtros, nove de caminhos/rotas/exclusão da API e 13 do verificador de build.
Os casos novos rejeitam rotas físicas ausentes, recursos inexistentes, URLs que
escapam da base, manifesto ou registro SW inconsistentes e API no precache.

Build e `npm run check:build` passaram nas bases `/` e `/maisciencia/`, com
29 arquivos e 318 e 315 referências internas conferidas, respectivamente. As
entradas `login/index.html` e `feira/index.html` estão presentes. O plugin de
rotas as grava antes da geração PWA; o CSS final contém a transformação do Vite
e um único link `page-styles` com `media="print"` para o bootstrap existente.

A tentativa de instalação limpa offline não encontrou um pacote no cache local.
Depois, `npm ci --no-audit --no-fund` com cache temporário e rede instalou os
553 pacotes do lockfile, sem atualização de dependências. ESLint, os 29 testes,
build de projeto e verificador passaram novamente nessa instalação limpa. O
artefato resultante foi comparado byte a byte com o snapshot usado no navegador:
os 29 arquivos eram idênticos e nenhum arquivo `.env` foi incluído.

## Workflow

O YAML foi analisado com PyYAML, e eventos, dependência, diretório do artefato,
permissões e guards foram revisados. O shell de resolução da base passou em
`bash -n` e em cinco cenários: Pages na raiz, prefixo com e sem barra final,
PR de projeto e repositório de organização. A condição de publicação foi
confrontada com nove combinações de PR/push/dispatch e ref de main/feature/PR.
Somente push e dispatch de `main` permitem upload e deploy; falha anterior
interrompe os steps e o job dependente. Essa análise local não executa o runner
do GitHub nem comprova a configuração de permissões do repositório remoto.

`actionlint` e `shellcheck` não estavam disponíveis; não foi alegada validação
por essas ferramentas. A instalação exibiu avisos de dependências transitivas
obsoletas já presentes no lockfile; não houve atualização fora do escopo.

## HTTP estático e navegador

Os snapshots foram servidos por `python3 -m http.server` em duas portas locais,
sem fallback SPA: um diretório na raiz e outro contendo somente `maisciencia/`.
As dez combinações de home, login e feira com/sem barra foram verificadas com
HTTP e Chrome headless. O HTTP nativo redireciona diretórios sem barra e entrega
as entradas reais com sucesso. Um service worker já ativo também pode atender
o alias sem redirecionamento, mantendo o comportamento da aplicação.
As verificações HTTP negativas de `/maisciencia/not-a-route` e `/favicon.svg`
fora do prefixo retornaram 404 no servidor do projeto; não foram confundidas
com falhas de recursos da aplicação.

O navegador confirmou títulos, textos provisórios, retorno, navegação, filtros
e abas 21/9, oito imagens, duas fontes carregadas e referências dos SVGs. Os
endereços do site de projeto permaneceram no prefixo; manifesto, ícones, script
e escopo do service worker foram conferidos. A composição foi verificada em
desktop e em 390 px, sem rolagem horizontal. As capturas móveis foram inspecionadas.

Em primeira visita com CSS interceptado e pausado, o navegador mostrou fundo
escuro, indicador de carregamento e conteúdo oculto. Havia uma única folha
compilada, com `media="print"`; ao liberá-la, o bootstrap ativou `media="all"`
e exibiu a interface preparada. A captura desse estado foi inspecionada.

Com cache HTTP desabilitado, service worker ativo e rede emulada como offline,
uma nova navegação à feira sob `/maisciencia/` e o retorno ao início foram
atendidos pelo service worker. Dados, filtros e recursos permaneceram disponíveis.
O ajuste do helper para navegação normal foi necessário porque uma recarga
com bypass de cache também ignorava o service worker. O exercício comprova
navegação estática após acesso online; não é login autenticado offline.

A execução consolidada observou 451 requisições no navegador, incluindo 265 do
site de projeto, sem erros de runtime ou console, chamadas de API, falhas de
rede, respostas HTTP de erro ou endereços escapando da base. O build registra
26 entradas no manifesto Workbox e 24 URLs distintas, correspondentes aos
24 itens em CacheStorage; favicon e Apple Touch aparecem por glob e inclusão
explícita. Isso não altera as três rotas físicas nem a evidência offline.

O validador SDD passou com sete features, 66 requisitos e 72 tarefas, e
`git diff --check` passou. Os servidores e o Chrome usados no exercício foram
encerrados depois da conferência. A revisão dos artefatos é local e não
substitui revisão humana ou execução real do workflow no GitHub.

## Evolução local das rotas em 2026-11-07

As quatro rotas de oficinas acrescentadas por 006 estão no catálogo compartilhado,
no emissor de HTML e no verificador do artefato. Os 37 testes Node passaram, assim
como os builds e `check:build` nas duas bases: 33 arquivos, 701 referências na
raiz e 698 no prefixo. As sete entradas HTML estão no precache. O Chrome confirmou
acesso direto e variantes com barra final por HTTP estático sem fallback nas
duas bases, sem erros ou escapes da base; detalhes em
[006-landing](../006-landing/verification.md).

Essa evolução não alterou o workflow nem executou uma publicação remota.

## Preparação da release 0.2.0 em 2026-11-07

O usuário autorizou commits, Git Flow, versionamento e publicação. A consulta
real ao GitHub encontrou Pages com `build_type=workflow`, domínio
`maisciencia.ifes.app.br` e HTTPS obrigatório. O último run observado antes
da nova release foi [40749047261](https://github.com/ifesguarapari/maisciencia/actions/runs/40749047261),
concluído com sucesso para 0.1.0. `main` e `develop` estavam sincronizadas com
as respectivas referências remotas após fetch.

A versão proposta é 0.2.0 pelas novas páginas e navegação de oficinas. Git Flow,
npm e Commitizen já estão instalados; não foi necessária biblioteca adicional.
A preparação mantém a API em 0.1.0 e preserva os `.env` ignorados. Os resultados
da nova release serão registrados depois de executados, sem inferência a partir
da publicação anterior.

O commit `5539edf` incorporou as páginas e revisões institucionais; a bugfix
foi finalizada em `develop` e `release/0.2.0` foi aberta pelo Git Flow. O bump
`npm --prefix web version minor --no-git-tag-version` sincronizou as três
ocorrências da versão nos dois manifestos, sem modificar versões de pacotes.
O changelog registra 0.2.0 com data de 2026-11-07.

A instalação limpa `npm ci --cache /tmp/maisciencia-release-npm-cache
--no-audit --no-fund` instalou os 553 pacotes do lockfile. ESLint e os 37 testes
Node passaram; os nove testes Python da ferramenta SDD também passaram. Builds
e `check:build` passaram em `/maisciencia/` e `/`: 33 arquivos com 691 e 694
referências internas, respectivamente. O build final está na base `/`, usada
pelo domínio configurado. O validador SDD passou com sete features, 67 requisitos
e 84 tarefas, assim como `git diff --check`. O hook Commitizen validou o commit;
Black e Pylint não tiveram arquivos Python da API para conferir.

## Publicação da release 0.2.0 em 2026-11-07

O commit de preparação `a94c93d` foi finalizado por Git Flow. O merge em `main`
é `24e0caa27dfd16b1884b63a8e6ec4f53d9707b99`, alvo da tag anotada 0.2.0.
O merge de retorno em `develop` é `37972c9`. O push atômico enviou as duas
branches e somente essa nova tag, sem push forçado. As branches temporárias
bugfix e release foram removidas localmente pelo fluxo. Os hooks Commitizen
passaram também no commit de preparação e nos merges.

O [workflow 42384132172](https://github.com/ifesguarapari/maisciencia/actions/runs/42384132172)
concluiu com `success` para o commit exato da release. Ambos os jobs passaram:
Validate and build web e Deploy web to GitHub Pages. O log do deploy confirmou
a versão de build, o sucesso da implantação e a URL
[https://maisciencia.ifes.app.br/](https://maisciencia.ifes.app.br/).
A [release 0.2.0](https://github.com/ifesguarapari/maisciencia/releases/tag/0.2.0)
foi publicada com as notas em português, vinculada à tag existente.

A verificação HTTPS realizou 46 consultas: os 33 arquivos do build e 13
variantes de endereço das sete páginas, incluindo as rotas provisórias com
e sem barra final. Todas terminaram em HTTP 200 e tiveram SHA256 idêntico
ao arquivo correspondente do build local na base `/`, incluindo HTML, CSS,
JavaScript, manifesto, service worker, fontes, imagens e ícones. A comparação
comprova que os arquivos novos foram publicados, sem confundir HTML anterior
em cache com o artefato da release.

O registro de resultados posteriores à publicação é incorporado a `develop`
como documentação, preservando o commit de `main` e a tag imutável da release.
Não houve criação de workflow API, alteração de DNS, de domínio ou de HTTPS,
nem exposição de `.env` ou configuração de VPS.

Chrome 156 headless, com perfil novo, conferiu o site real em 1440 e 390 px.
O indicador terminou, CSS e fontes carregaram, oito imagens ficaram disponíveis
em cada largura e o hero apresentou somente Feira rosa e Aplicativo verde,
sem rolagem horizontal. Cliques reais na feira e em Ler um Livro com Jogos,
seguidos de retorno à raiz, passaram. As oito etapas observaram 108 respostas
sem chamadas de API, exceções de runtime, erros de console, HTTP de erro ou
falhas de carregamento. Capturas desktop e móvel foram inspecionadas; o helper
rolou a página para aferir as imagens com carregamento sob demanda.

Essa conferência de produção usou perfil novo online. Não repetiu instalação,
offline ou atualização de uma PWA já instalada, nem homologou aparelhos
físicos ou outros motores. Esses limites permanecem distintos do sucesso
do deploy e dos arquivos publicados. A validação estrutural SDD e
`git diff --check` passaram também após registrar os resultados remotos.

## Preparação da release 0.3.0 em 2026-11-14

O usuário autorizou finalizar `feature/issue/2` pelo Git Flow, usar Commitizen
com a referência `re #2`, versionar semanticamente e publicar pelo Actions.
A revisão do diff recomendou 0.3.0 pelas funcionalidades de SEO, descoberta
e compartilhamento. Não identificou bloqueios materiais. Os novos módulos,
checks e assets são parte necessária do stage; `.env` e API ficam preservados.

Após fetch, `main` e `develop` estavam sincronizadas com o remoto; a última
tag era 0.2.0. O Pages continua configurado por workflow no domínio
`https://maisciencia.ifes.app.br/`, com HTTPS obrigatório. Os resultados da
nova execução serão registrados após ocorrerem, sem inferir sucesso da anterior.

A consulta à issue GitHub #2 retornou “Feira”, com requisitos da FEMAIS-ES
completa que não foram implementados nesta feature. Foi solicitado
esclarecimento sobre seu fechamento, separado da finalização da branch.
Os critérios e a aprovação humana da issue não foram marcados como concluídos.

O usuário respondeu que a issue #2 deve permanecer aberta para implementar
a Feira depois. Essa decisão foi preservada; nenhuma mudança foi enviada
ao cadastro da issue. O fechamento autorizado passa a ser o da branch Git Flow.

O commit `bb128bf`, criado pelo assistente Commitizen, contém `re #2` como
rodapé. A primeira tentativa local omitiu o rodapé por consumo de Enter na
confirmação do assistente; o commit ainda não publicado foi corrigido pelo
próprio Commitizen antes da integração. Os hooks existentes passaram.
`git flow feature finish --no-ff issue/2` criou o merge explícito `8fbf0c0`
em `develop` e removeu a feature local. `release/0.3.0` foi aberta e o bump
npm atualizou a versão da web nos dois manifestos, sem alterar dependências
ou a versão da API. O changelog registra a nova versão e seu escopo.

A instalação limpa pelo lockfile instalou os 553 pacotes existentes, sem
atualizações de dependências. ESLint e os 61 testes Node passaram; os nove
testes Python da ferramenta SDD também passaram. Builds e `check:build`
passaram nas duas configurações: 37 arquivos e 686 referências internas em
`https://ifesguarapari.github.io/maisciencia/`; 37 arquivos e 689 referências
em `https://maisciencia.ifes.app.br/`. Cada artefato teve sete HTMLs, robots,
sitemap e compartilhamento aprovados pelo verificador SEO. O build final usa
a configuração do domínio próprio. A PWA gerou 32 e 35 entradas, respectivamente.

O validador SDD passou com oito features, 76 requisitos e 100 tarefas;
`git diff --check` e a validação Commitizen do intervalo de commits passaram.
Não foram repetidos testes da API, pois seus arquivos não mudaram.

## Publicação da release 0.3.0 em 2026-11-14

O commit de preparação `7c92dd2` foi criado pelo assistente Commitizen como
`build(release): prepare 0.3.0`, com rodapé `re #2`. O Git Flow finalizou a
release e criou a tag anotada 0.3.0 no merge de produção
`5e7c1a8c3d9e996032ec64411476f706a5ebbce9`. O retorno a `develop` é `82d2078`.
O push atômico enviou `main`, `develop` e somente a nova tag, sem reescrever
histórico. As branches temporárias feature e release foram removidas localmente.

O [workflow 43637653321](https://github.com/ifesguarapari/maisciencia/actions/runs/43637653321)
terminou com `success` para o commit exato de produção. Os jobs Validate and
build web e Deploy web to GitHub Pages passaram, incluindo instalação limpa,
ESLint, testes, SDD, leitura do Pages, build, checks e upload. A
[release 0.3.0](https://github.com/ifesguarapari/maisciencia/releases/tag/0.3.0)
foi publicada com as notas em português e referência à issue, sem fechá-la.

A conferência HTTPS realizou 50 consultas: 37 arquivos e 13 variantes das
sete páginas. Todas terminaram em HTTP 200, com SHA256 correspondente ao
build local na base `/`. Robots respondeu `text/plain`, sitemap respondeu
`application/xml` e o cartão respondeu `image/webp`, com 71.404 bytes.
Isso confirma os arquivos novos no domínio público, inclusive os sinais de
SEO disponíveis antes do JavaScript; não comprova indexação ou prévia em
aplicativos de redes sociais.

Chrome com perfil novo online conferiu a home em 1440 e 390 px, sem overflow,
com estilos, fontes e inicialização prontos. A equipe apresentou os seis
colaboradores, Ijanai em Foguetes com iniciais IS e Nanine com nome abreviado.
O rodapé apresentou Pop Ciência proporcional, subtítulo e parceria com a
grafia corrigida. A imagem OG foi recebida como WebP de 750 por 425 px.
Capturas do desktop e do celular foram inspecionadas.

A home manteve canonical raiz, política indexável e um único WebSite. O
clique real na oficina Ler foi atendido pelo service worker com canonical
próprio, `noindex` e sem WebSite; o retorno restaurou os sinais da home.
As 66 respostas observadas não tiveram erros HTTP, falhas de carregamento,
exceções de runtime, erros de console ou chamadas de API. Chrome foi encerrado.
Não foram repetidos instalação no sistema operacional, Lighthouse, contraste
formal, offline ou atualização de uma instalação antiga para esta publicação.

A leitura final da issue [#2](https://github.com/ifesguarapari/maisciencia/issues/2)
confirmou estado `open`, como o usuário pediu após esclarecer seu escopo.
Nenhum critério pendente ou homologação da FEMAIS-ES foi aprovado. Os registros
posteriores ao deploy são incorporados a `develop`, preservando a tag imutável
e o commit de produção. O validador SDD e `git diff --check` passaram após
consolidar essas evidências.

## Limites da preparação original

GitHub Actions, ativação de Pages, publicação remota, domínio, DNS e VPS não
foram executados nesta preparação local. Esses resultados não podem ser inferidos
de testes locais, inspeção de YAML ou build bem-sucedido.
Não foram verificados instalação no sistema operacional, atualização entre duas
versões publicadas, dispositivos físicos ou outros motores de navegador.

## Preparação da release 0.4.0

Em 2026-11-14, o usuário autorizou finalizar a feature atual, criar commits
com Commitizen e `re #2`, versionar e publicar pelo GitHub Actions e recriar
a feature local após o deploy. A revisão independente não encontrou
bloqueios. A versão minor 0.4.0 corresponde às novas páginas e funcionalidades
compatíveis de 009 e 008; a API permanece sem alterações.

As referências foram atualizadas do origin: `main` e `develop` estavam
sincronizadas, com tag mais recente 0.3.0. O Pages confirmou modo workflow,
domínio `maisciencia.ifes.app.br` e HTTPS. Resultados locais e remotos da
release serão registrados após execução, sem inferir publicação a partir
das evidências anteriores. T017-T020 cobrem a preparação e conferência.
Rastreabilidade: FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007,
FR-008, FR-009 e FR-010.

A instalação limpa pelo lockfile instalou os 553 pacotes existentes. ESLint,
80 testes Node, nove testes Python do validador e estrutura SDD passaram
(nove features, 91 requisitos e 124 tarefas); `git diff --check` ficou limpo.
Os avisos de dependências obsoletas já existentes não motivaram atualização
de dependências nesta release. Nenhum arquivo da API foi alterado, por isso
seus testes não foram repetidos. Os builds finais serão conferidos após o
bump dos manifestos em `release/0.4.0`.

O assistente Commitizen criou `0b4f73c`, `feat(web): add FEMAIS-ES exhibition
pages`, com o corpo descritivo e rodapé `re #2`. Os hooks passaram, sem
pular verificações; Black/Pylint não tinham arquivos de API para analisar.
`git flow feature finish --no-ff issue/2` criou o merge explícito `ff16ff4`
em `develop` e removeu a feature local. `git flow release start 0.4.0` abriu
a release e `npm version minor --no-git-tag-version` sincronizou a versão
0.4.0 nos dois manifestos. O diff do lockfile só alterou os dois campos de
versão da raiz; nenhuma dependência mudou. O changelog foi datado em
2026-11-14 conforme o contexto do usuário.

Os builds finais da versão 0.4.0 e os respectivos `check:build` passaram:
45 arquivos e 851 referências internas na base `/maisciencia/` com origem
GitHub; 45 arquivos e 854 referências na base `/` com domínio próprio.
Os onze HTMLs, robots, sitemap, cartões e rotas foram aprovados. O precache
teve 40 e 43 entradas, respectivamente. O artefato final em `web/dist` usa
a raiz de produção; a cópia local usada na futura conferência HTTPS está
em `/tmp/maisciencia-release040-root`. A validação SDD e diff permaneceram
limpos após preparar os manifestos e o changelog.

## Publicação da release 0.4.0 e recriação da feature

O commit `94857a1`, `build(release): prepare 0.4.0`, foi criado no assistente
Commitizen com rodapé `re #2`; os hooks passaram. O Git Flow finalizou a
release com merge em `main`, tag anotada 0.4.0 e retorno a `develop`, removendo
a branch temporária. A tag aponta para o commit de produção
`c9dcd6a93d933a2e6d50ad8383ea14296793bc4e`; o merge de retorno a `develop`
é `fcb5379ecb072a12f3d9025af19332c42de342e9`. As árvores das duas branches
eram iguais ao finalizar a release. O push atômico enviou `main`, `develop`
e somente a tag nova, sem reescrever histórico.

O [run 43658087707](https://github.com/ifesguarapari/maisciencia/actions/runs/43658087707)
terminou com `success` para esse commit exato. Os jobs Validate and build web
(132641036911) e Deploy web to GitHub Pages (132641135607) passaram. O deploy
foi concluído em `2026-11-15T00:26:09Z`, correspondente a 2026-11-14 no fuso
do usuário. A [release 0.4.0](https://github.com/ifesguarapari/maisciencia/releases/tag/0.4.0)
foi publicada com notas em português, tag verificada e referência `re #2`.

A conferência HTTPS em `/tmp/maisciencia-release040-http.json` realizou
66 consultas: 45 arquivos e 21 variantes de páginas. Todas terminaram em
HTTP 200, com SHA-256 idêntico ao arquivo correspondente do artefato validado.
Robots respondeu `text/plain`; sitemap, `application/xml`; e o cartão próprio
da Feira, `image/webp`, com 79.688 bytes. Seu SHA-256 é
`3c3897f851b1de60e887ccb3914575cb9ff71ec5c0511213100f7498df13f379`.

Chrome online com perfil novo conferiu início e Feira em 1440 e 390 px,
sem estouro horizontal, com proporções iguais das marcas do cabeçalho.
Os três encontros apresentaram 30 instituições na distribuição 13/12/5,
SNCT e o título “Acumule aprendizagens” corretos. O regulamento preservou
exatamente 17 seções, 154 parágrafos normativos e dois de preâmbulo. Início,
Feira e regulamento permitiram indexação; a etapa provisória manteve noindex.
O cartão próprio respondeu 200 e foi decodificado com 750 por 425 px.
Robots e sitemap permaneceram corretos com PWA ativo; o sitemap contém
três URLs. Houve dez documentos atendidos pelo service worker e 168 respostas
sem erros HTTP, rede, runtime, console ou chamadas de API.

Evidência de navegador: `/tmp/maisciencia-release040-browser.json`, com
lista de falhas vazia. Foram produzidas quatro capturas
`/tmp/maisciencia-release040-{desktop,mobile}-{home,fair}.png`; as da Feira
foram conferidas visualmente. Chrome terminou com código zero e o perfil
temporário foi removido. Não foram testados instalação, atualização de uma
PWA antiga, modo offline, indexação real no Google ou prévia no WhatsApp.
Não houve homologação humana, mudança de API, workflow ou DNS.

Depois de confirmar a publicação, `git flow feature start issue/2` recriou
a branch a partir de `develop` no commit `fcb5379`. A execução retornou
temporariamente a `develop` para consolidar estas evidências; o passo final
usa fast-forward para atualizar a feature com a documentação e deixá-la
ativa. Essa ordem permite registrar a recriação depois de executá-la, sem
alterar a tag publicada. A leitura da issue #2 confirmou estado `open`,
sem marcar critérios de aceite ou fechar a issue.

## Preparação da release 0.5.0 (2026-11-18)

O usuário autorizou a publicação do encontro de dezembro e os ajustes da Feira,
com Commitizen, referência `fix #2`, Git Flow e recriação da feature após o
deploy. A versão minor reflete a nova página funcional de dezembro, com cinco
eixos, 20 atividades ilustradas e data confirmada de 04/12/2026 no Ifes Vila
Velha. O commit foi registrado como `fix(web)` conforme a solicitação; o bump
SemVer considera o conteúdo agregado da release e foi executado por
`npm --prefix web version minor --no-git-tag-version`.

Antes da integração, `git fetch --prune origin` confirmou `main` e `develop`
alinhadas às respectivas branches remotas. A configuração Pages consultada
indicou `build_type=workflow`, CNAME `maisciencia.ifes.app.br` e HTTPS obrigatório;
o workflow Web está ativo. A issue #2 estava aberta. A revisão independente do
diff e dos arquivos novos não encontrou bloqueios ou arquivos inesperados.
A altura declarada da imagem JIC foi corrigida para seus 213 pixels reais.

A instalação limpa pelo lockfile concluiu com 553 pacotes. ESLint passou,
os 89 testes Node passaram, os nove testes Python do validador passaram e a
validação SDD passou com nove features, 95 requisitos e 134 tarefas.
`git diff --check` passou. O Commitizen 4.19.3 criou o commit
`f126115f9592545c1d98b3eeb0570ff81e0875f3`, com o rodapé `fix #2`; o hook
Conventional Commits passou e Black/Pylint foram ignorados por não haver
arquivos API alterados. A seleção inicial de `feat` foi recusada pela revisão
automática por interpretar o pedido como tipo `fix`; a seleção `fix(web)`
foi autorizada, sem contornar hooks ou a revisão.

`git flow feature finish issue/2` integrou a feature por fast-forward em
`develop` e removeu a branch local; `git flow release start 0.5.0` iniciou a
release. Manifestos e lockfile estão em 0.5.0 e o changelog foi atualizado.
T021 está concluída. Os builds da versão preparada, a finalização da release,
o envio, o resultado remoto e a recriação da feature ainda dependem de suas
próprias evidências e não são presumidos por este registro.

### Checks dos artefatos 0.5.0

Os builds da versão preparada passaram nas duas bases. Em `/maisciencia/`,
com origem `https://ifesguarapari.github.io`, o verificador conferiu 66 arquivos,
905 referências internas e 11 HTMLs; o precache contém 61 entradas. Em `/`,
com origem `https://maisciencia.ifes.app.br`, conferiu 66 arquivos, 908
referências internas e 11 HTMLs; o precache contém 64 entradas. Os checks de
SEO, robots e sitemap passaram em ambos, com quatro páginas prontas e sete
provisórias. A validação SDD passou novamente. A API permanece em 0.1.0.
O resultado do Actions e a validação pública ainda não foram executados.

### Implantação e validação pública de 0.5.0

O segundo commit criado pelo Commitizen, `1441ce92039b2cf3d54bf338a0d38f9f404b249f`,
registrou a preparação como `fix(release): prepare 0.5.0`, com `fix #2`.
O hook Conventional Commits passou; Black e Pylint foram ignorados por não
haver mudanças de API. `git flow release finish -m 'Release 0.5.0' 0.5.0`
incorporou a release em `main`, criou a tag anotada 0.5.0 e incorporou a tag
em `develop`, removendo a branch de release. A tag aponta para
`c24236e9fb64c29bcafc3ff35bbb4fed801c5da8`, mesmo commit de `main`.
O merge de retorno gerou `8b33ff714a8cb785156fa325728f38ee4f7d21e7` em
`develop`; os três manifestos consultados em main, develop e tag indicaram
0.5.0. O push atômico enviou `main`, `develop` e `refs/tags/0.5.0` sem
reescrever histórico.

A execução [44236342876](https://github.com/ifesguarapari/maisciencia/actions/runs/44236342876)
foi iniciada pelo push e terminou em **success** para o SHA exato da release.
O job de build `134573283128` passou por instalação, ESLint, testes, SDD,
configuração Pages, build, check do artefato e upload. O job de deploy
`134573475133` também terminou em **success**. O run foi criado em
2026-11-18T04:17:53Z e terminou em 2026-11-18T04:18:42Z. Esses resultados
confirmam a implantação desta versão, em vez de reutilizar evidências de 0.4.0.

A conferência HTTPS no domínio `https://maisciencia.ifes.app.br` usou TLS
normal, até seis downloads simultâneos e nenhum acesso à API ou a domínios
externos. Foram observadas **77 respostas HTTP 200**, sem falhas, cobrindo os
**66 arquivos** do artefato, sem diferenças de nomes de assets com hash.
As onze rotas canônicas passaram com título, descrição, canonical, Open Graph
e Twitter corretos. Inicial, Feira, regulamento e dezembro são indexáveis;
as sete páginas provisórias usam noindex e o sitemap contém quatro URLs.
Robots permite rastrear os recursos.

A página [do encontro](https://maisciencia.ifes.app.br/feira/202612/)
respondeu com 04/12/2026 no Ifes Vila Velha, quatro horários, 20 atividades,
cinco eixos e 13 instituições. Os 20 SVGs são XML válido em 480 × 300;
os cartões WebP têm 750 × 425 pixels e a imagem JIC tem 300 × 213.
Os hashes dos recursos estáveis correspondem ao artefato validado localmente.

Chrome real confirmou o encontro e o card da Feira em 1440, 390 e 320 px:
79 respostas e nenhum erro de console, execução ou recurso, com data,
metadados e dimensões corretos e sem rolagem horizontal. O hero de 320 px
foi inspecionado visualmente em produção. Essa conferência não repetiu os
exercícios anteriores de PWA offline ou atualização de clientes já instalados.
Google Search Console, indexação efetiva e prévia dentro do WhatsApp não
foram exercitados. Não houve homologação editorial humana.

As [notas da release 0.5.0](https://github.com/ifesguarapari/maisciencia/releases/tag/0.5.0)
foram publicadas, sem marcação de rascunho ou pré-release, vinculadas à tag
existente. A issue #2 foi fechada automaticamente pelo rodapé `fix #2` e
reaberta conforme a decisão anterior de preservá-la. O conector GitHub
retornou 403 ao tentar alterar seu estado; a CLI autenticada executou
`gh issue reopen 2` com sucesso, sem comentário ou mudança de escopo.

Após o deploy, `git flow feature start issue/2` recriou a feature a partir
de `develop`, ambas em `8b33ff714a8cb785156fa325728f38ee4f7d21e7`, com árvore
limpa. T021–T024 estão concluídas. A consolidação documental em develop
será incorporada por fast-forward à feature reaberta, preservando a mesma
base e o estado final solicitado. A versão da API continua 0.1.0.

Arquivos temporários usados como apoio: `/tmp/maisciencia-0.5.0-actions.json`,
`/tmp/maisciencia-0.5.0-http-results.json` e
`/tmp/maisciencia-0.5.0-browser-results.json`. Não fazem parte do artefato nem
substituem as evidências versionadas acima. Navegador e perfil temporários
foram encerrados após a conferência.

## Preparação da correção 0.5.1 (2026-11-18)

A troca PNG→SVG é uma correção compatível, classificada como patch. A revisão
independente confirmou escopo restrito, SVG válido com 26.983 bytes e SHA-256
`971e144e09b8ba59d161d7383e0e8f6e91955b926af9c932e4b4b5880bc48c26`.
ESLint e os 89 testes existentes passaram. O validador SDD passou com nove
features, 95 requisitos e 138 tarefas; `git diff --check` passou.

Commitizen 4.19.3 criou `fix(web): replace JIC artwork with SVG`, commit
`bae93f1`, com referência `re #2`, que mantém a issue aberta. O hook de
mensagem passou e Black/Pylint foram ignorados por não haver mudanças API.
Git Flow finalizou `feature/issue/2` em develop e iniciou `release/0.5.1`.
`npm --prefix web version patch --no-git-tag-version` sincronizou os manifestos
em 0.5.1 e o changelog foi atualizado. T025 concluída; publicação, validação
remota e recriação da feature aguardam suas próprias evidências.

Os artefatos preparados de 0.5.1 passaram: 66 arquivos, 905 referências
internas em `/maisciencia/` e 908 em `/`, com onze HTMLs e SEO válido.
O SVG aparece no HTML e no precache; o PNG está ausente da fonte e do
artefato. A validação SDD passou novamente. As dependências não foram
alteradas; a instalação limpa fica a cargo do workflow antes do deploy.

### Implantação da patch 0.5.1

Commitizen registrou `build(release): prepare 0.5.1`, commit `e269bee`, com
`re #2`; o hook Conventional Commits passou. Git Flow finalizou a release,
criou a tag anotada 0.5.1 e sincronizou main/develop. Main e tag apontam para
`3c1bc814027770a0c426c2aaa3682124d85ce17f`; o merge de retorno gerou
`c61a8a86fbed53c29ee9cd578246523d0e5d8aa0`. O push atômico enviou branches e
tag, sem reescrever histórico.

O [run 44239581080](https://github.com/ifesguarapari/maisciencia/actions/runs/44239581080)
terminou em success para o SHA exato da tag. Build `134583885669` e deploy
`134584035695` passaram, incluindo instalação limpa pelo lockfile, lint,
testes, SDD, build e check do artefato antes de publicar.

A conferência HTTPS usou TLS normal e confirmou: página do encontro 200,
SVG 200 com MIME `image/svg+xml` e SHA-256 correspondente ao arquivo fornecido,
PNG antigo 404 e service worker 200 com SVG no precache e sem referência ao
PNG. A página continua informando 04/12/2026 no Ifes Vila Velha. Chrome real
carregou o SVG em 1440, 390 e 320 px, mantendo sua proporção e sem rolagem
horizontal; foram observadas 46 respostas e nenhum erro de recurso, console
ou execução. A seção móvel foi inspecionada visualmente. Navegador e perfil
temporários foram encerrados. Não foram repetidos testes de PWA offline,
Search Console ou compartilhamento social nesta correção.

As [notas 0.5.1](https://github.com/ifesguarapari/maisciencia/releases/tag/0.5.1)
foram publicadas vinculadas à tag existente. A issue #2 foi encontrada fechada
após a incorporação do histórico e reaberta pela CLI conforme decisão anterior;
os novos commits usam referência não conclusiva `re #2`. Após o deploy,
`git flow feature start issue/2` recriou a feature de develop, em `c61a8a8`,
com árvore limpa. T025–T027 concluídas. As evidências documentais serão
sincronizadas por fast-forward para devolver a feature alinhada a develop.
A versão API permanece 0.1.0 e o workflow da API continua fora do escopo.

Apoios temporários desta sessão: `/tmp/maisciencia-0.5.1-actions.json`,
`/tmp/maisciencia-0.5.1-http-results.json` e
`/tmp/maisciencia-0.5.1-browser-results.json`. Os fatos acima, changelog,
contratos e histórico Git constituem o registro versionado.
