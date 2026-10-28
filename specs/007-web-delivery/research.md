# Pesquisa e decisões

**Data**: 2026-10-28. Fontes oficiais consultadas para a implementação local.

## Workflow e permissões

Usar actions oficiais para checkout, Node, configuração, artefato e deploy do
Pages, fixadas por SHA com a versão correspondente em comentário. O
[guia atual do Vite](https://vite.dev/guide/static-deploy.html#github-pages)
apresenta essas actions; as releases oficiais esclarecem versões mais recentes
quando exemplos da documentação ainda usam versões anteriores.

| Action | Versão consultada | Fonte |
| --- | --- | --- |
| `actions/checkout` | 7.0.1 | [Releases](https://github.com/actions/checkout/releases) |
| `actions/setup-node` | 7.1.0 | [Release](https://github.com/actions/setup-node/releases/tag/v7.1.0) |
| `actions/configure-pages` | 6.0.0 | [Releases](https://github.com/actions/configure-pages/releases) |
| `actions/upload-pages-artifact` | 5.0.0 | [Releases](https://github.com/actions/upload-pages-artifact/releases) |
| `actions/deploy-pages` | 5.0.1 | [Releases](https://github.com/actions/deploy-pages/releases) |

Separar build e deploy, com dependência explícita, ambiente `github-pages` e
permissões `pages: write` e `id-token: write` somente no deploy, conforme o
[contrato de workflows do Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
O build consulta a configuração do Pages somente em `main`, fora de PR; em PR
usa uma base previsível sem depender de Pages habilitado. Não usar
`pull_request_target`, tokens pessoais ou segredos de VPS.

A fila de deploy não deve cancelar uma publicação ativa. Cancelamento de CI
fica restrito às execuções substituídas de pull requests, conforme os
[controles de concorrência](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency).
Uma execução manual pode selecionar outra branch; o guard de deploy precisa
verificar evento e ref, além dos eventos do workflow.

## Base e hospedagem estática

Sites de projeto usam normalmente `/<repository>/`, enquanto domínio próprio
ou site da organização usa `/`. O
[guia de base pública do Vite](https://vite.dev/guide/build.html#public-base-path)
descreve a reescrita dos recursos e `import.meta.env.BASE_URL`; a
[substituição de constantes no HTML](https://vite.dev/guide/env-and-mode.html#html-env-replacement)
permite usar `%BASE_URL%` em navegação e referências dinâmicas presentes no HTML.

O repositório observado é `ifesguarapari/maisciencia`. A configuração do Pages,
quando disponível no workflow, determina a base efetiva. O fallback para PR é
`/maisciencia/`; localmente a base padrão continua `/`.

Em vez de depender de reescrita SPA ou de uma página 404, emitir entradas reais
`login/index.html` e `feira/index.html` com os mesmos recursos compilados. Essa
decisão cobre as duas rotas conhecidas e evita que uma primeira navegação dependa
do service worker. O servidor estático pode normalizar o caminho sem barra para
o diretório com barra final; a aplicação reconhece ambas as formas.

## Descoberta na verificação do CSS

O verificador encontrou URLs absolutas ainda na folha copiada: o link de entrada
com `media="print"` não passava pela compilação CSS esperada do build. A solução
usa hooks de HTML antes e depois da transformação do Vite para manter somente
o link final assíncrono, com o mesmo identificador usado no bootstrap. Essa é
uma correção de implementação necessária à base do Pages, mantendo a intenção
de evitar conteúdo sem estilos, em vez de remover o carregamento progressivo.

## Escopo e entrega

GitHub Pages hospeda o artefato estático. A API permanece fora da entrega atual,
conforme o adiamento explícito do usuário. Ativar Pages, publicar commits,
alterar DNS ou executar Actions remotamente não são evidências desta preparação.
O fluxo precisa existir na branch principal para permitir sua operação manual
normal; a primeira ativação usa **Settings → Pages → GitHub Actions**.
