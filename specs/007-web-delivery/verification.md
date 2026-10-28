# Verificação: integração e publicação da web

**Data**: 2026-10-28. Artefatos especificados antes da implementação.

| Requisito | Evidência | Estado observado |
| --- | --- | --- |
| FR-001 | Eventos, Node, cache e lockfile do workflow | YAML conferido; instalação limpa pelo lockfile passou |
| FR-002 | ESLint, testes, build, artefato e SDD | ESLint, 29 testes, builds e verificador passaram |
| FR-003 | Guards e permissões de PR, push e dispatch | Revisão de nove combinações de evento/ref e permissões sem escrita no build |
| FR-004 | Diretório publicado, dependência e concorrência | Upload restrito a `web/dist`; deploy depende de build e usa fila sem cancelamento |
| FR-005 | Builds e testes de caminhos nas duas bases | `/` e `/maisciencia/` passaram; artefatos e navegador conferidos |
| FR-006 | Entradas físicas e HTTP sem fallback | Dez endereços conferidos em servidor estático, incluindo redirecionamentos nativos |
| FR-007 | Manifesto, service worker e recursos sob a base | Manifesto e escopo conferidos; navegação estática offline passou sob `/maisciencia/` |
| FR-008 | Ausência de workflow API e preservação de configuração local | Somente `web.yml`; `.env` ignorados e ausentes do artefato |
| FR-009 | Instruções reproduzíveis e limites honestos | README, arquitetura, contribuição e quickstart sincronizados |

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

## Limites remotos

GitHub Actions, ativação de Pages, publicação remota, domínio, DNS e VPS não
foram executados nesta preparação local. Esses resultados não podem ser inferidos
de testes locais, inspeção de YAML ou build bem-sucedido.
Não foram verificados instalação no sistema operacional, atualização entre duas
versões publicadas, dispositivos físicos ou outros motores de navegador.
