# Verificação: integração e publicação da web

**Data**: 2026-10-28. Artefatos especificados antes da implementação.

| Requisito | Evidência | Estado observado |
| --- | --- | --- |
| FR-001 | Eventos, Node, cache e lockfile do workflow | YAML conferido; instalação limpa pelo lockfile passou |
| FR-002 | ESLint, testes, build, artefato e SDD | ESLint, 37 testes, builds e verificador passaram localmente e no run da release 0.2.0 |
| FR-003 | Guards e permissões de PR, push e dispatch | Revisão de nove combinações de evento/ref e permissões sem escrita no build |
| FR-004 | Diretório publicado, dependência e concorrência | Upload restrito a `web/dist`; deploy 42384132172 concluiu com sucesso para o commit da tag 0.2.0 |
| FR-005 | Builds e testes de caminhos nas duas bases | `/` e `/maisciencia/` passaram; artefatos e navegador conferidos |
| FR-006 | Entradas físicas e HTTP sem fallback | Sete páginas publicadas e 13 variantes de URL conferidas por HTTPS; conteúdo corresponde ao build local |
| FR-007 | Manifesto, service worker e recursos sob a base | Manifesto e escopo conferidos; navegação estática offline passou sob `/maisciencia/` |
| FR-008 | Ausência de workflow API e preservação de configuração local | Somente `web.yml`; `.env` ignorados e ausentes do artefato |
| FR-009 | Instruções reproduzíveis e limites honestos | README, arquitetura, contribuição e quickstart sincronizados |
| FR-010 | Política SemVer, manifestos, changelog, Git Flow e tag | 0.2.0 sincronizada nos manifestos e changelog; Git Flow concluído, tag e branches enviados, release GitHub publicada |

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

## Limites da preparação original

GitHub Actions, ativação de Pages, publicação remota, domínio, DNS e VPS não
foram executados nesta preparação local. Esses resultados não podem ser inferidos
de testes locais, inspeção de YAML ou build bem-sucedido.
Não foram verificados instalação no sistema operacional, atualização entre duas
versões publicadas, dispositivos físicos ou outros motores de navegador.
