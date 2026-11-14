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
