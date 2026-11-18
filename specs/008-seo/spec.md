# Especificação: descoberta e indexação da web

**Feature**: `008-seo` | **Data**: 2026-11-14 | **Branch**: `feature/issue/2`
**Origem**: práticas de SEO para a página institucional no Google Search.

## Objetivo e escopo

Oferecer sinais claros e coerentes de identidade, conteúdo e indexação no HTML
entregue pelo site. Implementar SEO técnico e um roteiro de manutenção editorial
e Search Console. Evoluir 006 e 007 sem alterar a arquitetura. A preparação
original foi local; em 2026-11-14 o usuário autorizou concluir a feature pelo
Git Flow, commitar com Commitizen e `re #2` e publicar uma release, conforme
[007-web-delivery](../007-web-delivery/spec.md). SEO não garante indexação,
posição ou prazo no Google.

## Histórias e aceitação

### US1 — Identificar a página institucional (P1)

Como visitante ou mecanismo de busca, quero receber informações corretas da
página já no HTML inicial, antes da execução do JavaScript.

- Dada a página inicial, quando obtenho seu HTML, encontro título e descrição
  em português, endereço canônico HTTPS e identidade consistente do site.
- Dada uma página provisória, quando obtenho seu HTML, encontro título,
  descrição e endereço próprios, sem depender de correção posterior pelo navegador.
- Dada a navegação atendida pelo cache PWA, os metadados finais continuam
  coerentes com a rota visível.

### US2 — Descobrir conteúdo pronto para indexação (P1)

Como mecanismo de busca, quero rastrear os recursos e identificar somente as
páginas que já oferecem conteúdo institucional útil para resultados de pesquisa.

- A página inicial, a apresentação da feira, o regulamento e o encontro de
  dezembro permitem indexação. Aplicativo, as quatro páginas de oficinas e as
  etapas de março e junho da feira permanecem
  rastreáveis, mas têm `noindex,follow` enquanto provisórias.
- O sitemap contém somente as quatro páginas prontas canônicas, sem fragmentos de seção,
  páginas em construção ou datas de atualização inventadas.
- O robots permite rastrear páginas, estilos, scripts e imagens, incluindo
  as páginas em que o crawler precisa ler `noindex`.

### US3 — Manter e acompanhar a qualidade de SEO (P2)

Como mantenedor, quero verificações reproduzíveis e orientações sobre conteúdo
e Search Console, sem confundir um build correto com indexação pelo Google.

- Configurações inválidas ou sinais de indexação inconsistentes falham nos checks.
- O guia explica propriedade, sitemap, inspeção de URL, conteúdo útil e métricas,
  identificando explicitamente o trabalho externo ainda não executado.

## Requisitos

- **FR-001**: A página inicial DEVE ter título e descrição descritivos em pt-BR,
  idioma preservado e exatamente um endereço canônico HTTPS no HTML inicial.
- **FR-002**: Cada página além da inicial DEVE receber título,
  descrição e canonical próprios no HTML inicial; variantes com barra final e
  navegação pelo shell PWA DEVEM convergir para os mesmos sinais da rota.
- **FR-003**: A página inicial, `/feira`, `/feira/regulamento` e
  `/feira/202612` DEVEM permitir indexação; as sete provisórias DEVEM usar
  `noindex,follow` e ficar fora do sitemap até terem conteúdo final. A apresentação
  da feira, o regulamento e dezembro deixam de ser provisórios conforme
  [009-fair](../009-fair/spec.md).
- **FR-004**: O build DEVE fornecer `robots.txt` e `sitemap.xml` com URLs
  absolutas e consistentes. Recursos necessários à renderização NÃO DEVEM ser
  bloqueados. O sitemap NÃO DEVE inventar `lastmod`, prioridade ou periodicidade.
- **FR-005**: A página inicial DEVE apresentar dados estruturados `WebSite`
  consistentes com sua identidade real. NÃO DEVE inventar avaliações, endereço,
  entidade jurídica ou funcionalidade de busca. As provisórias não repetem esse bloco.
- **FR-006**: Metadados de compartilhamento DEVEM refletir título, descrição,
  URL e imagem adequados à rota, com texto alternativo. A inicial e as demais
  páginas institucionais DEVEM preservar `icons/slide.webp`, composto por
  `images/background.webp`, `images/ifes.svg` e `images/maisciencia.svg`.
  `/feira` e suas quatro subpáginas DEVEM usar `icons/feira/slide.webp`,
  composto por `images/feira/background.webp`, `images/ifes.svg` e
  `images/feira/femais.svg`. Os dois cartões DEVEM ter 750 por 425 pixels,
  formato WebP e identidade fiel às marcas, sem alterar as fontes ou substituir
  o cartão anterior. O HTML inicial DEVE incluir uma única ocorrência de cada
  campo Open Graph: URL canônica, tipo, título, descrição, nome do site, idioma,
  imagem HTTPS e URL segura, MIME, largura, altura e texto alternativo.
  Os cartões Twitter DEVEM apontar para a mesma imagem Open Graph da rota.
  A sincronização pelo shell PWA DEVE preservar essa seleção. Esses sinais
  não representam garantia de posição no Google nem prévia validada no WhatsApp.
- **FR-007**: A origem pública HTTPS DEVE ser configurável no build e respeitar
  a base `/` ou `/maisciencia/`. A origem inválida DEVE ser rejeitada; `.env`
  existentes e segredos DEVEM ser preservados. A origem padrão é o domínio atual.
- **FR-008**: Checks DEVEM detectar regressões de canonical, indexação e sitemap.
  Aparência, prontidão, acessibilidade, rotas, PWA e ausência de chamadas de API
  DEVEM permanecer compatíveis com 006 e 007.
- **FR-009**: Um guia em português DEVE orientar Search Console, conteúdo,
  links institucionais e desempenho, separando checks locais, publicação,
  indexação real e atividades que dependem de acesso externo.

## Critérios de sucesso

- **SC-001**: As onze entradas HTML têm os metadados esperados antes de JavaScript,
  com canonical único e política correta, nas duas bases de build suportadas.
- **SC-002**: Robots e sitemap passam nos checks; casos negativos relevantes
  são rejeitados, incluindo indexação indevida de uma provisória.
- **SC-003**: Navegação em navegador, incluindo uma rota atendida pelo PWA,
  preserva conteúdo e metadados, sem erros de runtime ou chamadas de API.
- **SC-004**: O guia identifica as etapas de Search Console e métricas que
  ainda exigem execução externa; resultados não são presumidos.

## Premissas e limites

A escolha inicial é indexar somente o conteúdo pronto. A política das páginas
provisórias será revista quando deixarem de exibir avisos de construção.
O domínio observado na release anterior é `https://maisciencia.ifes.app.br/`.
Em hospedagem sob subpasta, o robots precisa também estar na raiz da origem
para controlar seu rastreamento; um arquivo dentro da subpasta não a substitui.
Não há propriedade Search Console conectada nesta sessão. Não criar tokens de
verificação, alterar DNS, prometer rich results ou alegar homologação pelo Google.

## Evolução

Esta especificação precede a implementação do SEO. As entregas 006 e 007
mantêm as evidências históricas; 008 passa a reger metadados e indexação.

## Evolução: conteúdo da FEMAIS-ES em 2026-11-14

A solicitação de [009-fair](../009-fair/spec.md) substitui o aviso de construção
de `/feira` e cria `/feira/regulamento` com conteúdo institucional real. Essas
duas rotas passam a ser indexáveis e entram no sitemap. As etapas
`/feira/202612`, `/feira/202703` e `/feira/202706` permanecem em construção,
com canonical próprio e `noindex,follow`. As dez páginas além da inicial têm
metadados próprios. `WebSite` continua exclusivo da inicial, e a imagem de
compartilhamento já existente é preservada. A mudança é preparada localmente,
sem alegar publicação, indexação ou atualização de prévia externa.

## Evolução: cartão próprio da Feira e revisão de SEO

Em 2026-11-14, o usuário solicitou rever o SEO para Google e preparar o
compartilhamento da Feira com uma composição própria. O novo cartão amplia
FR-006; a política de três páginas prontas indexáveis e oito provisórias
não muda. A composição e as tags devem ser verificadas localmente, e qualquer
consulta de produção deve identificar a versão efetivamente publicada. Não
confundir a release anterior com o conteúdo desta branch ainda não publicado.
A revisão não autoriza registrar acesso ao Search Console, indexação real ou
prévia externa sem evidência; a avaliação técnica distingue essas camadas.

## Evolução: dezembro pronto para pesquisa em 2026-11-18

A página `/feira/202612` passa a apresentar conteúdo útil e completo do encontro,
conforme US4 de 009. Sua política evolui para `index,follow,max-image-preview:large`
e inclusão no sitemap. São quatro rotas indexáveis e sete provisórias, sem
alterar as onze entradas nem o cartão compartilhado da Feira. A confirmação
posterior do usuário fixa o encontro em 04/12/2026, refletida nos títulos e
descrições próprios da rota; a política JSON-LD existente continua vigente.
A mudança é local e não comprova publicação, rastreamento pelo Google ou nova
prévia social.
