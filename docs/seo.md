# SEO da página institucional

Este guia acompanha [008-seo](../specs/008-seo/spec.md): o HTML deve identificar
corretamente o Ifes Mais Ciência na Escola e indicar quais páginas estão
prontas para pesquisa. SEO ajuda mecanismos de busca e pessoas a compreender
o conteúdo; não garante indexação, posição nem prazo no Google. Consulte o
[guia inicial do Google Search Central](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).

## Sinais publicados pelo build

`web/src/seo.js` centraliza identidade e metadados, aproveitando o catálogo
de páginas em `web/src/pages.js`. A transformação HTML e a geração de rotas
entregam título, descrição em português, canonical HTTPS e política de
indexação no HTML inicial de cada entrada física. A sincronização no cliente
mantém esses sinais quando uma navegação PWA recebe o shell da página inicial.

| Rota canônica na base `/` | Indexação | Sitemap |
| --- | --- | --- |
| `/` | `index,follow,max-image-preview:large` | Incluída |
| `/login/` | `noindex,follow` | Excluída |
| `/feira/` | `noindex,follow` | Excluída |
| `/oficinas/` | `noindex,follow` | Excluída |
| `/oficinas/ler/` | `noindex,follow` | Excluída |
| `/oficinas/lancar/` | `noindex,follow` | Excluída |
| `/oficinas/melhorar/` | `noindex,follow` | Excluída |

As seis páginas com aviso provisório continuam acessíveis e rastreáveis.
Não as bloqueie em `robots.txt`: o crawler precisa acessá-las para ler
[`noindex`](https://developers.google.com/search/docs/crawling-indexing/block-indexing).
Estilos, JavaScript e imagens também precisam estar disponíveis para renderização.

O build gera `dist/robots.txt` permissivo, com indicação do sitemap, e
`dist/sitemap.xml` somente com a URL canônica da página inicial. Não entram
fragmentos de seção, páginas em construção, `lastmod` inventado, prioridade
ou frequência artificial. Um [sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
informa as URLs desejadas, sem garantir seu rastreamento ou indexação.

A página inicial contém JSON-LD `WebSite` com nome e URL reais. As provisórias
não repetem esse bloco. Não adicionar avaliações, depoimentos, endereço,
entidade jurídica ou `SearchAction` sem conteúdo e funcionalidade reais que
os sustentem. O recurso de [nome do site](https://developers.google.com/search/docs/appearance/site-names)
do Google se aplica a domínio ou subdomínio; hospedagem em subpasta não recebe
essa mesma elegibilidade.

Open Graph e os metadados do cartão de compartilhamento usam título,
descrição, URL e `icons/slide.webp`, com texto alternativo. Esse cartão tem
750 por 425 px e combina o fundo com as marcas Ifes e Mais Ciência na Escola.
O HTML principal e as entradas geradas incluem `og:url`, `og:type`, `og:title`,
`og:description`, `og:image`, `og:site_name` e `og:locale`, além de URL segura,
MIME WebP, largura, altura e descrição da imagem. Os campos seguem o
[protocolo Open Graph](https://ogp.me/); o cartão Twitter usa a mesma imagem.
Eles descrevem a apresentação de links compartilhados; não
representam garantia de ranking na pesquisa.

Depois de publicar, confira a resposta pública da página e de
`https://maisciencia.ifes.app.br/icons/slide.webp`. Plataformas podem guardar
uma prévia anterior em cache. A validação local do HTML e da imagem não
comprova que WhatsApp ou outras redes atualizaram a prévia; isso precisa ser
conferido no compartilhamento real após o deploy.

## Origem pública e base

A origem pública padrão é `https://maisciencia.ifes.app.br`. Com a base `/`,
o canonical da página inicial é `https://maisciencia.ifes.app.br/`.
`WEB_SITE_ORIGIN` permite informar outra origem pública no build: HTTPS, sem
credenciais, caminho de página, consulta ou fragmento. Informe uma origem
como `https://ifesguarapari.github.io`, nunca o caminho `/maisciencia/` nessa
variável. A configuração inválida deve falhar em vez de gerar URLs ambíguas.

`WEB_BASE_PATH` define o caminho de hospedagem. O canonical, o sitemap e os
URLs de compartilhamento combinam essa base com a origem pública. Recursos,
navegação e PWA também respeitam a base. Essas variáveis são públicas e não
exigem criar nem alterar o `.env` local. Preserve os valores existentes e
mantenha segredos fora do build.

Em uma publicação sob `/maisciencia/`, o arquivo gerado dentro dessa pasta
não substitui `https://ifesguarapari.github.io/robots.txt`. As regras de
[`robots.txt` precisam estar na raiz da origem](https://developers.google.com/crawling/docs/robots-txt/create-robots-txt)
para controlar seu rastreamento. A configuração da raiz é responsabilidade
da hospedagem; a geração local não comprova esse controle.

## Verificação local

Execute na pasta `web`, com Node.js 24+ e as dependências instaladas por `npm ci`:

```bash
npm run lint
npm test
WEB_SITE_ORIGIN=https://maisciencia.ifes.app.br WEB_BASE_PATH=/ npm run build
WEB_SITE_ORIGIN=https://maisciencia.ifes.app.br WEB_BASE_PATH=/ npm run check:build
WEB_SITE_ORIGIN=https://ifesguarapari.github.io WEB_BASE_PATH=/maisciencia/ npm run build
WEB_SITE_ORIGIN=https://ifesguarapari.github.io WEB_BASE_PATH=/maisciencia/ npm run check:build
```

Use a mesma origem e base no build e no respectivo `check:build`. O segundo
build substitui `dist/`; reconstrua com a configuração de destino antes de
preparar uma publicação. `check:build` inclui os checks de recursos e SEO.
Na raiz, execute também `python3 scripts/validate-specs.py`.

Confira as sete entradas por HTTP estático sem fallback: título e descrição
próprios, canonical único, política da tabela e JSON-LD somente na inicial.
Inspecione `robots.txt`, XML do sitemap e recursos na base escolhida. Em
navegador, confira o conteúdo após o carregamento e uma navegação atendida
pelo service worker, incluindo os metadados da página provisória. Testes
locais não comprovam o HTML renderizado pelo Google, publicação nem indexação.

Robots e sitemap ficam fora do fallback de navegação HTML da PWA. Mesmo com
o service worker ativo, abri-los online deve entregar os arquivos reais.
Eles não são adicionados ao precache; acesso offline não deve ser confundido
com disponibilidade online nem substituído pela página inicial.

Registre comandos, resultados e limites em
[008-seo/verification.md](../specs/008-seo/verification.md). Este guia descreve
o procedimento; não declara que esses checks ou uma nova publicação ocorreram.

## Search Console: procedimento manual após a publicação

Não há propriedade do Search Console conectada nesta tarefa. Nenhuma etapa
abaixo foi executada: criação ou verificação de propriedade, envio de sitemap,
inspeção de URL, solicitação de indexação ou coleta de métricas. Não foi feita
alteração de DNS nem criado token de verificação.

1. Com a conta institucional autorizada, abra o
   [Google Search Console](https://search.google.com/search-console/).
   Use uma propriedade existente ou adicione o prefixo de URL
   `https://maisciencia.ifes.app.br/`. Uma propriedade de domínio
   `maisciencia.ifes.app.br` abrange seus protocolos e subdomínios e exige
   verificação DNS. Escolha conforme o acesso e o alcance necessários, usando
   a [orientação de propriedades](https://support.google.com/webmasters/answer/34592?hl=pt-BR).
2. Siga a [verificação de propriedade](https://support.google.com/webmasters/answer/9008080?hl=pt-BR)
   indicada pelo Google. Para domínio, o responsável pelo DNS aplica o registro
   legítimo fornecido pelo Search Console. Para prefixo de URL, a tag HTML é
   uma alternativa quando oferecida: o usuário fornece a tag real para inclusão
   no `<head>` da página inicial e publicação. Não usar tokens de exemplo,
   inventar credenciais ou substituir verificações de outros responsáveis.
3. Depois de publicar e confirmar o acesso HTTPS aos arquivos, execute a
   primeira ação concreta: em **Sitemaps**, envie `sitemap.xml`, correspondente
   a `https://maisciencia.ifes.app.br/sitemap.xml`. Confira o processamento e
   registre eventuais erros. Para outro destino, use a URL com a origem e a
   base efetivamente publicadas.
4. Na **Inspeção de URL**, abra `https://maisciencia.ifes.app.br/` e execute
   **Testar URL publicado**. Veja o HTML e a captura renderizados, especialmente
   o conteúdo de `<main>`, instituições e oficinas, além de recursos e erros
   JavaScript. Confirme que a tela de carregamento libera o conteúdo e que
   canonical e indexação estão corretos. Corrija falhas antes de solicitar
   indexação da inicial. A [inspeção de URL](https://support.google.com/webmasters/answer/9012289?hl=pt-BR)
   distingue teste em tempo real e dados da versão indexada; o teste não
   prevê o canonical que o Google escolherá nem garante inclusão no índice.
5. Acompanhe **Indexação → Páginas** para identificar bloqueios e exclusões,
   incluindo as exclusões intencionais por `noindex`. No relatório de
   **Desempenho**, compare consultas, páginas, impressões, cliques, CTR e
   posição em períodos equivalentes. Registre a data e o intervalo observado;
   ausência de dados não prova falha. O
   [Search Console](https://support.google.com/webmasters/answer/9128668?hl=pt-BR)
   oferece esses dados de acompanhamento.

Solicite indexação somente para conteúdo pronto. A solicitação não remove
`noindex` das páginas provisórias e não deve ser usada repetidamente como
promessa de acelerar resultados.

## Conteúdo e divulgação institucional

Priorize explicações que ajudem estudantes, escolas e comunidades a entender
o projeto: objetivos, atividades, metodologia e como participar quando houver
informações confirmadas. Preserve os dados fornecidos de 21 escolas, nove
campi e 11 municípios; apresente nomes e contexto em texto útil, sem repetir
palavras-chave artificialmente ou publicar números sem atualização real.

Ao concluir as páginas de oficinas e feira, inclua descrição das atividades,
público, orientações e resultados disponíveis. Publique datas, locais e
contatos somente quando confirmados. Use fotografias autorizadas com textos
alternativos que descrevam seu conteúdo e contexto; imagens decorativas
mantêm alternativa vazia. Não transformar as ilustrações atuais em registros
fotográficos reais nem inventar depoimentos, avaliações ou resultados.

Quando uma provisória tiver conteúdo final, revise a política em
`web/src/seo.js`, remova `noindex`, inclua sua URL canônica no sitemap gerado
e mantenha canonical e links internos coerentes. Atualize especificação,
contrato e checks junto com a mudança, execute a verificação e só então
publique e acompanhe a URL no Search Console. Não retire `noindex` apenas
para aumentar a contagem de páginas indexáveis.

Divulgue o endereço canônico em páginas reais das escolas, campi, parceiros
e projetos relacionados quando houver interesse editorial. O contato e a
publicação são ações humanas dos responsáveis institucionais. Não automatizar
envios, comprar links nem distribuir mensagens em massa. Nenhuma divulgação
ou mensagem externa foi enviada nesta tarefa.

## Desempenho e experiência

Acompanhe [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)
com dados reais de usuários: LCP para carregamento, INP para resposta às
interações e CLS para estabilidade visual. O relatório do Search Console
depende de dados suficientes; sem eles, registre a indisponibilidade.

Use [PageSpeed Insights](https://pagespeed.web.dev/) e Lighthouse para
diagnosticar imagens, fontes, JavaScript e carregamento. Separe os dados de
campo apresentados pelo PageSpeed dos ensaios de laboratório do Lighthouse,
conforme a [documentação do PageSpeed](https://developers.google.com/speed/docs/insights/v5/about):
uma nota local não comprova Core Web Vitals reais nem ranking. Registre URL,
data, dispositivo e condições de cada medição. Não há medição de laboratório
ou de usuários reais declarada por este guia.

Preserve imagens dimensionadas, recursos acessíveis ao crawler e o acesso
ao conteúdo com falhas ou atraso de recursos. Revise o estado de carregamento
e o conteúdo renderizado ao alterar estilos, scripts, filtros ou PWA.
