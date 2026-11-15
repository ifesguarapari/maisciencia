# Verificação: descoberta e indexação da web

**Data**: 2026-11-14. Evidências locais; não representam indexação pelo Google.

| Requisito | Verificação prevista | Estado |
| --- | --- | --- |
| FR-001 | Título, descrição e canonical únicos no HTML inicial | Sete entradas por base conferidas no artefato e por HTTP |
| FR-002 | Metadados das sete rotas e sincronização após fallback PWA | 14 heads iniciais e nove estados renderizados passaram; alias servido pelo SW foi corrigido no DOM |
| FR-003 | Home indexável e seis provisórias noindex fora do sitemap | Políticas e sitemap conferidos; casos negativos rejeitados |
| FR-004 | Robots permissivo e sitemap coerente, sem datas inventadas | Arquivos e XML passaram; os quatro documentos nas duas bases foram entregues corretamente com SW ativo |
| FR-005 | JSON-LD válido e identidade real somente na home | Parse e conteúdo conferidos no artefato e navegador, com bloco removido nas provisórias |
| FR-006 | Metadados de compartilhamento e cartão do projeto | slide.webp WebP RGB de 750 por 425 px conferido; Open Graph e Twitter usam URL absoluta com tipo e dimensões corretos |
| FR-007 | Origem HTTPS válida e builds nas duas bases | Domínio próprio na raiz e origem github.io sob /maisciencia/ passaram; origens inválidas rejeitadas |
| FR-008 | Checks, casos negativos e compatibilidade em navegador | 61 testes, ESLint e builds passaram; aparência e inicialização conferidas |
| FR-009 | Guia e distinção de resultados externos | docs/seo.md e referências sincronizados, com Search Console explicitamente pendente |

## Execução local

`npm run lint` passou. Os 61 testes de `npm test` passaram: 37 existentes e
24 de SEO, incluindo canonical duplicado/incorreto, indexação indevida,
sitemap inconsistente, bloqueio de crawler, JSON-LD, configuração de origem,
escaping de HTML/JSON e exclusão dos arquivos de descoberta do shell PWA.
Um DOM mínimo testa a sincronização sem substituir a conferência em navegador.

Build e `check:build` passaram nas duas configurações, com a mesma origem/base
informadas em cada par de comandos:

- `WEB_SITE_ORIGIN=https://maisciencia.ifes.app.br WEB_BASE_PATH=/`: 36 arquivos
  e 695 referências internas, com sete documentos HTML verificados pelo SEO.
- `WEB_SITE_ORIGIN=https://ifesguarapari.github.io WEB_BASE_PATH=/maisciencia/`:
  36 arquivos e 692 referências internas, também com sete entradas conferidas.

O build final em `web/dist` usa o domínio próprio e a base `/`. Os snapshots
de QA incluíram o arquivo local `images/popciencia.svg`, que apareceu durante
o trabalho e foi preservado sem alterações por esta feature. A PWA o inclui
pelo glob existente; isso explica um recurso adicional nas contagens atuais.
Robots e sitemap não foram adicionados ao precache.

O script oficial de pré-requisitos reconheceu `specs/008-seo/`, selecionada
localmente sem renomear a branch. O validador SDD passou com oito features,
76 requisitos e 91 tarefas; `git diff --check` também passou. Essa validação
é estrutural e não representa homologação semântica ou humana.

## Navegador e HTTP estático

Dois servidores HTTP estáticos, sem fallback SPA, serviram snapshots separados
da raiz e do projeto. As 14 entradas iniciais tinham título, descrição,
canonical, robots e dados estruturados esperados antes do JavaScript.

Chrome headless verificou a home em 1440 e 390 px, o término do indicador,
o carregamento e a ausência de overflow. As duas capturas foram inspecionadas.
Nas duas bases, o alias de oficina sem barra final foi atendido online e
offline pelo service worker. A resposta bruta continha os metadados do shell
da home; depois da inicialização, o DOM apresentou título de oficina,
canonical próprio, `noindex,follow` e nenhum WebSite. O retorno restaurou os
sinais da home com um único bloco estruturado.

O exercício principal teve nove estados renderizados e 122 respostas sem
erro HTTP, runtime, console, falha de recurso ou chamada de API. O helper
precisou aguardar a ativação e recarregar para obter o primeiro controle do
service worker; isso respeita o ciclo da PWA com atualização por prompt.

A conferência adicional identificou um desvio real: navegar a `robots.txt`
com SW ativo retornava HTML da home. A correção de T007 acrescenta robots e
sitemap à denylist de navegação, preservando as regras de API e mantendo esses
arquivos fora do precache. O teste da regra e os novos builds passaram.

A recoleta direcionada aprovou os quatro documentos online: robots com
`text/plain` e sitemap com `application/xml` nas duas bases, sempre HTTP 200,
corpo idêntico ao HTTP normal e `fromServiceWorker=false`, com controle do
SW comprovado antes de navegar. Alias de oficina e retorno à home continuaram
atendidos pelo SW com metadados corretos. Essa coleta observou 130 respostas,
sem API, exceções de runtime, erros de console ou falhas de carregamento.
Ocorreram duas sondagens automáticas do Chrome a `/favicon.ico` com 404 ao
abrir documentos sem head HTML; foram separadas dos quatro alvos, todos aprovados.
Não foi criado um ícone fora do escopo para ocultar essas sondagens.

Chrome e servidores temporários foram encerrados. Os checks de estrutura SDD
e `git diff --check` passaram depois da consolidação das evidências.

## Evolução: cartão de compartilhamento em 2026-11-14

`web/public/icons/slide.webp` foi criado com a ferramenta integrada `image_gen`,
usando o fundo fornecido como referência principal e exportações PNG das duas
marcas SVG como referências de composição. As marcas ficam à esquerda e a
personagem à direita, sobre fundo escuro, sem textos ou selos adicionais.
Inkscape produziu as referências intermediárias; ImageMagick redimensionou e
exportou o resultado em WebP com qualidade 90. A imagem final foi inspecionada.

A decodificação confirmou WebP RGB opaco, 750 por 425 pixels e 71.404 bytes.
Comparações SHA256 confirmaram que os três arquivos de origem não foram
alterados e que a cópia da imagem no build é idêntica ao arquivo público.
O cartão consta no precache PWA nas duas bases.

O HTML fonte principal contém o bloco Open Graph solicitado. Os descritores
compartilhados e os sete HTMLs gerados por base têm `og:url`, `og:type`,
`og:title`, `og:description`, `og:image`, `og:site_name`, `og:locale`,
`og:image:secure_url`, MIME `image/webp`, largura 750, altura 425 e texto
alternativo. Twitter acompanha a mesma imagem. Cada campo aparece uma vez,
com origem, base e rota coerentes antes do JavaScript.

ESLint e os 61 testes passaram, incluindo os casos negativos de URL segura,
MIME e dimensões divergentes. Builds e `check:build` passaram novamente nas
duas bases: 37 arquivos e 696 referências internas na raiz; 37 arquivos e
693 referências no projeto. O build final usa a origem pública do domínio
próprio e a base `/`. A PWA gerou 35 e 32 entradas, respectivamente.

Um servidor HTTP local confirmou HTTP 200 no HTML com a imagem OG presente
antes de JavaScript e HTTP 200 no cartão, com Content-Type `image/webp` e
corpo idêntico ao arquivo de origem. O servidor foi encerrado. O validador
SDD passou com oito features, 76 requisitos e 93 tarefas, assim como
`git diff --check`.

Não houve publicação ou conferência no WhatsApp/Facebook reais. A validação
completa de navegador/PWA da evolução anterior não foi repetida para essa
troca de imagem e campos de compartilhamento; suas evidências mantêm o alcance
anterior. A imagem e os metadados precisam estar publicados para os serviços
externos buscarem a nova prévia.

<details>
<summary>Prompt enviado à ferramenta integrada de imagem</summary>

```text
Create a clean institutional social-sharing banner by compositing the three supplied images. Target canvas aspect ratio exactly 750:425, landscape, to be delivered as a 750 by 425 pixel preview. Image 1 is the actual background, NOT a loose inspiration: preserve its existing dark charcoal science textures, colorful illustrated woman scientist on the RIGHT, her face, glasses, hand and lab tubes, without repainting or changing the subject. Fill the entire banner with that same background, with only a minimal proportional crop to the 750:425 aspect ratio. Images 2 and 3 are supporting official logo inserts rendered on charcoal only to make their white lettering visible. Preserve their exact shapes, colors, spelling, geometry and aspect ratios. Place both official marks together in the empty dark LEFT half, centered vertically, with generous margins: the Instituto Federal mark from image 2 on the left at approximately x=38,y=150,width=100,height=125 in final 750x425 coordinates; the full Mais Ciência na Escola wordmark from image 3 to its right at approximately x=163,y=167,width=248,height=87. Use a subtle thin vertical charcoal-gray divider at x=149 between the marks, height around 96. The logo insert backgrounds must blend invisibly into the background, with no rectangular panels, white boxes, border, shadow or frames. Keep all official logo text visible and exact: INSTITUTO FEDERAL, Espírito Santo, CIÊNCIA NA ESCOLA with the colored plus/NA motif. Do not add any other text, slogans, URLs, names, government seals, watermark, extra icons or decorative elements. Maintain balanced visual weight: clear crisp logos left, the original scientist illustration right, dark institutional theme. Use the supplied artwork rather than inventing a new logo or face.
```

</details>

## Limites

Não há evidência de indexação, posição, configuração do Search Console ou
Core Web Vitals de usuários reais. Não há nova publicação autorizada por esta
solicitação. Resultados locais serão registrados com seu alcance real.

## Evolução: FEMAIS-ES em 2026-11-14

A intenção de indexação evolui com [009-fair](../009-fair/spec.md): inicial,
apresentação da feira e regulamento entram no sitemap; aplicativo, oficinas
e três etapas provisórias ficam de fora. O cartão `slide.webp` e `WebSite`
exclusivo da inicial são preservados. O comando `node --test --test-isolation=none tests/seo.test.js`, executado em
`web`, passou com 27 testes. As fixtures cobrem onze entradas em cada uma das
duas bases, `/` e `/maisciencia/`, com sitemap de três URLs indexáveis; os
casos negativos recusam noindex indevido da feira e do regulamento, etapas
indevidamente indexáveis e URLs prontas ausentes ou duplicadas no sitemap. A
sincronização de metadados percorre home, feira, regulamento, três etapas e
oficina, removendo duplicatas e mantendo `WebSite` apenas na home. Essas
fixtures não comprovam a renderização nem o build final. O lint direcionado
`npx eslint src/seo.js build/seo.js scripts/check-seo.mjs tests/seo.test.js`
também passou. As verificações do artefato completo e do navegador pertencem
à consolidação de 009.
A conferência não representa publicação nem indexação pelo Google.

Rastreabilidade: FR-001, FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008 e FR-009.

## Evolução: cartão próprio da Feira

O pedido de 2026-11-14 amplia FR-006 com `icons/feira/slide.webp` para as
cinco rotas da Feira. As evidências anteriores permanecem históricas: não
comprovam esta evolução. A política de três páginas prontas e oito
provisórias permanece a mesma.

### Produção da imagem e integridade das fontes

T013 foi concluída com a ferramenta integrada `image_gen`, em modo de edição
com quatro referências: fundo original da Feira, exportação da marca Ifes,
exportação da marca FEMAIS-ES e cartão principal como referência de composição.
A composição final preserva as marcas à esquerda e a ilustração à direita,
sobre o fundo azul-petróleo fornecido. A saída foi inspecionada visualmente.

A saída PNG original ficou em
`/home/walber/.codex/generated_images/01a170dd-4acb-7621-831a-b9c277b69529/exec-cb0553fa-a772-4bc3-84cd-fd398dc64886.png`.
ImageMagick realizou redimensionamento e recorte proporcional para 750 por
425 pixels, exportando WebP opaco em RGB, qualidade 90, método 6, sem alpha.
O arquivo final é `web/public/icons/feira/slide.webp`, com 79.688 bytes e
SHA-256 `3c3897f851b1de60e887ccb3914575cb9ff71ec5c0511213100f7498df13f379`.
A identificação do arquivo confirmou WebP, 750 por 425 e canais sRGB.

A comparação dos hashes atuais com
`/tmp/maisciencia-fair-sharing/source-hashes.json` confirmou a preservação de
`web/public/icons/slide.webp`, `web/public/images/feira/background.webp`,
`web/public/images/ifes.svg` e `web/public/images/feira/femais.svg`. O cartão
principal não foi substituído.

<details>
<summary>Prompt enviado à ferramenta integrada para o cartão da Feira</summary>

```text
Create a finished institutional social-sharing banner for FEMAIS-ES by compositing the supplied assets. Landscape aspect ratio exactly 750:425, for a final 750x425 pixel card. Image 1 is the ACTUAL EDIT TARGET BACKGROUND, not loose inspiration: preserve its blue-petroleum background, halftone dots, molecules and the existing illustrated woman in a yellow jacket with glasses and tablet on the RIGHT, and the little robot at lower right. Use that same artwork and composition without repainting faces, clothing, robot or adding objects. Only proportional crop for the requested aspect ratio is allowed. Images 2 and 3 are supporting official logo inserts rendered on the same blue only to show the white lettering clearly. Keep their exact spelling, geometry, colors, typography and aspect ratios. Image 4 is the EXISTING HOME sharing banner as a composition reference ONLY: emulate its balanced clear logos on the LEFT and character on the RIGHT, but use the actual background from image 1 and the FEMAIS-ES logo from image 3, not the home wordmark. Place the full Instituto Federal mark from image 2 on the empty LEFT at roughly x=35,y=155,width=86,height=108 in the final 750x425 coordinates; place the complete Feira wordmark from image 3 to its right at roughly x=157,y=112,width=225,height=161, keeping all the text visible: #FEIRA, CIÊNCIA NA ESCOLA, FEMAIS-ES. Between the two marks add only a very subtle vertical blue-gray divider, about x=140,y=126,height=157. Allow small layout adjustments so neither logo covers the woman or the robot. The insert backgrounds must blend invisibly with the original blue background: no rectangular panels, white boxes, borders, added frames, glow or shadows. Keep logos crisp and high contrast. Do not add extra text, slogans, dates, prices, URLs, government seals, watermarks or new decorative objects. The result must look like the same established project sharing-card system, with the existing Feira background and exact supplied official marks.
```

</details>

### Integração dos descritores e primeiros checks

T014 seleciona o cartão próprio em `/feira`, `/feira/regulamento` e nas
três etapas. Inicial, login e oficinas preservam o cartão institucional.
Open Graph e Twitter usam a mesma imagem da rota, com MIME, dimensões,
alternativa e URL segura coerentes. A resposta física tem os metadados
antes de JavaScript, e a sincronização PWA aplica os mesmos descritores.

O conjunto direcionado de SEO passou com 32 testes. O título da Feira foi
condensado para uma redação mais concisa e a descrição passou a explicitar
Espírito Santo. Após essa alteração editorial, ESLint e os 80 testes Node
passaram novamente. Os dois builds e seus checks passaram com os seguintes
resultados:

| Origem e base | Artefato | Precache |
| --- | --- | --- |
| `https://maisciencia.ifes.app.br/` | 44 arquivos, 851 referências internas, onze HTMLs | 42 entradas |
| `https://ifesguarapari.github.io/maisciencia/` | 44 arquivos, 848 referências internas, onze HTMLs | 39 entradas |

O título resultante tem 65 caracteres incluindo o sufixo institucional;
essa escolha busca concisão, sem impor limite fixo de caracteres ao Google.
A comparação HTTP e de navegador dos artefatos finais continua em execução
como parte de T015. Seus resultados não são presumidos a partir do build.

### Consulta pública e limites observados

A consulta pública de 2026-11-14 observou a versão anteriormente publicada,
com registro em `/tmp/maisciencia-seo-production-audit.json` e
`/tmp/maisciencia-seo-useragent-audit.json`. A inicial respondeu HTTP 200
com título, descrição, canonical HTTPS único, política de indexação e
metadados sociais completos. Robots respondeu 200 e permitiu rastreamento;
o sitemap respondeu 200 e continha apenas a inicial.

`/feira` convergiu para `/feira/` com HTTP 200, mas ainda mostrou a página
provisória e `noindex,follow`. `/feira/regulamento/` e
`/icons/feira/slide.webp` responderam HTTP 404. Essas respostas representam
a release anterior, não falha dos novos arquivos locais, e deixam claro que
a Feira pronta e o novo cartão ainda dependem de publicação para coleta externa.
A imagem institucional existente respondeu 200. Solicitações com user agents
Googlebot, facebookexternalhit e WhatsApp receberam o mesmo HTML provisório
com resposta 200; isso não simula a infraestrutura real desses crawlers.

A auditoria consultou os [requisitos técnicos do Google](https://developers.google.com/search/docs/essentials/technical),
[títulos](https://developers.google.com/search/docs/appearance/title-link),
[canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls),
[noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing),
[sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
e o [protocolo Open Graph](https://ogp.me/). Títulos descritivos e concisos
são adequados; não há comprimento fixo obrigatório de título. Uma página
precisa estar acessível e indexável, mas atender aos requisitos técnicos
não garante indexação. O crawler deve conseguir ler `noindex`; não bloquear
essas rotas a leitura pelo robots. Sitemap é um sinal de descoberta.

Não há evidência de Search Console conectado, indexação real, posição na
busca, Core Web Vitals de usuários reais nem prévia atualizada no WhatsApp.
A revisão distingue código/build local, resposta da versão pública e resultados
externos. Não houve publicação, alteração de DNS ou verificação de propriedade.

Rastreabilidade desta evolução: FR-001, FR-002, FR-003, FR-004, FR-005,
FR-006, FR-007, FR-008 e FR-009.

## Conferência final de HTTP e navegador do cartão da Feira

T015 concluída em 2026-11-14, com a branch local e o site público analisados
separadamente. A evidência local está em
`/tmp/maisciencia-fair-social-local-audit.json`, com lista de falhas vazia.
Foram conferidos 22 HTMLs iniciais e 20 variantes de URL nas bases `/` e
`/maisciencia/`. Canonical, políticas de indexação, Open Graph e Twitter
corresponderam às rotas, sem duplicações. As cinco rotas da Feira usam
`icons/feira/slide.webp`; as outras seis mantêm o cartão institucional.

Ambas as imagens responderam 200 com MIME `image/webp`; a nova tem 79.688
bytes e foi decodificada pelo Chrome com 750 por 425 pixels nas duas bases.
Robots e sitemap responderam com MIME apropriado e o sitemap continha somente
início, Feira e regulamento. O cartão próprio foi encontrado no precache.

O fluxo início → Feira → regulamento → início produziu oito estados de DOM
com metadados corretos, nas duas bases, incluindo oito documentos atendidos
pelo service worker. Foram registradas 149 respostas sem erros HTTP, falhas
de rede não canceladas, exceções, erros de console ou chamadas de API. O
roteiro inicial foi ajustado para aguardar ativação do service worker e uma
segunda navegação antes de verificar controle; isso não exigiu mudança na
aplicação. Chrome terminou com código zero; os dois servidores e o perfil
temporário foram encerrados.

A auditoria pública permanece distinta: `/feira/` ainda apresenta a versão
provisória com `noindex,follow`, o sitemap publicado contém somente a inicial
e as novas rotas de regulamento e imagem retornaram 404. Essas observações
estão em `/tmp/maisciencia-seo-production-audit.json` e
`/tmp/maisciencia-seo-useragent-audit.json`; requisições com nomes de user agents
não constituem acesso pela infraestrutura real dos respectivos crawlers.
Não houve publicação, verificação de Search Console, comprovação de indexação
no Google ou prévia real dentro do WhatsApp. O build local foi restaurado
para a cópia da raiz validada, sem nova alteração de conteúdo.

A revisão consultou os requisitos técnicos, títulos, canonical, noindex,
sitemaps e imagens do Google Search Central e o protocolo Open Graph.
Referências e orientação de acompanhamento estão em
[docs/seo.md](../../docs/seo.md). Atendimento técnico e sitemap não garantem
indexação nem a exibição do cartão por todos os aplicativos.
