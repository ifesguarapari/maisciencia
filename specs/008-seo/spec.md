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

- A página inicial permite indexação. Aplicativo, feira e as quatro páginas
  de oficinas permanecem rastreáveis, mas têm `noindex,follow` enquanto provisórias.
- O sitemap contém somente a página inicial canônica, sem fragmentos de seção,
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
- **FR-002**: Cada uma das seis páginas provisórias DEVE receber título,
  descrição e canonical próprios no HTML inicial; variantes com barra final e
  navegação pelo shell PWA DEVEM convergir para os mesmos sinais da rota.
- **FR-003**: A página inicial DEVE permitir indexação; as seis provisórias
  DEVEM usar `noindex,follow` e ficar fora do sitemap até terem conteúdo final.
- **FR-004**: O build DEVE fornecer `robots.txt` e `sitemap.xml` com URLs
  absolutas e consistentes. Recursos necessários à renderização NÃO DEVEM ser
  bloqueados. O sitemap NÃO DEVE inventar `lastmod`, prioridade ou periodicidade.
- **FR-005**: A página inicial DEVE apresentar dados estruturados `WebSite`
  consistentes com sua identidade real. NÃO DEVE inventar avaliações, endereço,
  entidade jurídica ou funcionalidade de busca. As provisórias não repetem esse bloco.
- **FR-006**: Metadados de compartilhamento DEVEM refletir título, descrição,
  URL e a imagem `icons/slide.webp`, com texto alternativo. Essa imagem DEVE
  ter 750 por 425 pixels e combinar `images/background.webp`, `images/ifes.svg`
  e `images/maisciencia.svg`, preservando a identidade das marcas fornecidas.
  O HTML principal e os HTMLs gerados DEVEM incluir Open Graph com URL, tipo,
  título, descrição, nome do site, idioma, imagem HTTPS, tipo MIME, largura,
  altura e descrição da imagem. Os cartões de compartilhamento DEVEM usar a
  mesma imagem. Esses sinais não devem ser apresentados como garantia de
  posicionamento no Google nem de prévia validada no WhatsApp.
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

- **SC-001**: As sete entradas HTML têm os metadados esperados antes de JavaScript,
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
