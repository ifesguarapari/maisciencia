# Plano: descoberta e indexação da web

**Feature**: `008-seo` | **Data**: 2026-11-14 | **Branch**: `feature/issue/2`
**Especificação**: [spec.md](spec.md)

## Solução

Manter Node 24, Vite, HTML, Tailwind, Alpine e PWA, sem biblioteca nova ou backend.
Centralizar a identidade e os descritores dos metadados em `web/src/seo.js`.
Derivar páginas de conteúdo e provisórias de `web/src/pages.js`, sem criar catálogo paralelo de rotas.
A configuração `WEB_SITE_ORIGIN` é pública, HTTPS, sem caminho, consulta,
fragmento ou credenciais; o padrão é `https://maisciencia.ifes.app.br`.

Gerar o bloco de metadados por transformação HTML do Vite, também no servidor
de desenvolvimento. `web/build/seo.js` renderiza os descritores escapando HTML
e JSON-LD; `web/build/static-routes.js` personaliza cada cópia física e emite
robots e sitemap antes do fechamento do PWA. O documento fonte mantém um
marcador explícito para substituir somente seu bloco de SEO.

O cliente sincroniza os mesmos descritores no início da página. Isso cobre o
fallback de navegação do service worker, que pode entregar o shell da home a
uma rota provisória. Não depender dessa sincronização para o HTML físico.
Cada provisória tem canonical próprio com barra final e `noindex,follow`.

Usar `WebSite` somente na home, sem `SearchAction`. A imagem específica de
compartilhamento é definida na evolução abaixo. Sitemap lista a home e as
páginas de conteúdo explicitamente indexáveis no catálogo;
robots permite rastreamento. Não adicionar cache PWA de robots ou sitemap.
Excluir esses dois arquivos do fallback de navegação HTML: a conferência
com service worker ativo identificou que robots era substituído pelo shell.
Offline, a indisponibilidade de rede desses arquivos não deve virar HTML da home.

Integrar `web/scripts/check-seo.mjs` a `npm run check:build`, mantendo o
verificador de recursos existente. Acrescentar testes dos sinais críticos e
dos erros de configuração; não criar testes que apenas congelem a redação.

## Constituição e compatibilidade

Markdown em pt-BR; identificadores e comentários em inglês. Interface
institucional em português. `.env`, API, Kong, MongoDB e BFF não mudam.
Preservar carregamento escuro, URLs solicitadas, imagens estáveis e estilos.
Não realizar commit, release ou publicação nesta feature sem novo pedido.

## Rastreabilidade

| Requisito | Solução e validação |
| --- | --- |
| FR-001 | Identidade e canonical em `web/src/seo.js`; HTML bruto e teste |
| FR-002 | Renderização por rota em `web/build/seo.js` e `static-routes.js`; sincronização em `main.js` e smoke PWA |
| FR-003 | Política no catálogo SEO, robots meta e exclusão do sitemap; testes negativos |
| FR-004 | Emissão de arquivos no build e verificador SEO; inspeção HTTP e XML |
| FR-005 | JSON-LD WebSite no bloco da home; parse e coerência de URL/nome |
| FR-006 | Descritores Open Graph e cartão de compartilhamento com recurso existente |
| FR-007 | Validação de origem em `seo.js`, configuração no Vite e builds nas duas bases |
| FR-008 | Testes, check:build, ESLint e smoke em navegador, sem ampliar as verificações externas |
| FR-009 | `docs/seo.md`, referências oficiais e roteiro Search Console |

## Verificação planejada

Executar ESLint, testes Node, builds e check:build nas duas bases e validador
SDD. Servir os artefatos por HTTP estático e conferir HTML bruto, robots,
sitemap, inicialização e navegação PWA em Chrome. Conferência local não prova
indexação, Core Web Vitals de usuários reais nem configuração do Search Console.

## Evolução: cartão de compartilhamento em 2026-11-14

Criar `web/public/icons/slide.webp` com 750 por 425 pixels usando o fundo e as
marcas Ifes/Mais Ciência fornecidos. Preservar os arquivos originais. O caminho
de compartilhamento passa a ser `icons/slide.webp`, com MIME `image/webp` e
dimensões explícitas nos descritores de SEO e no contrato.

Manter os campos básicos Open Graph e acrescentar `og:image:secure_url`,
`og:image:type`, `og:image:width` e `og:image:height` imediatamente após
`og:image`. O HTML fonte apresenta um bloco completo com valores da home;
a transformação do build personaliza a origem, a base e a rota. Twitter e a
sincronização PWA usam os mesmos descritores para evitar divergência.

Conferir contrato, testes e os sete HTMLs compilados com URL absoluta da
imagem, tipo e dimensões corretos. A inspeção local de metadados não comprova
que WhatsApp ou outras plataformas atualizaram ou exibiram suas prévias.

## Evolução: apresentação e regulamento da feira

O catálogo compartilhado passa a expor `pages`, `contentPages` e
`placeholderPages`. `getPageSeo` consulta `pages`, preserva títulos, descrições
e canonical individuais e deriva a política de indexação do estado explícito
da página. `getSeoTags` identifica a rota `home`, em vez do estado de indexação,
para emitir `WebSite`; assim, as novas páginas indexáveis não duplicam a
identidade raiz. O sitemap é derivado de `contentPages` indexáveis e da inicial.
Os checks exigem exatamente esse conjunto, recusando omissões, duplicação,
placeholders, fragmentos e datas inventadas. Testes cobrem as onze rotas nas
bases `/` e `/maisciencia/`, além da troca de metadados pelo shell PWA.
FR-002, FR-003, FR-004, FR-005 e FR-008 acompanham essa evolução.

## Evolução: compartilhamento próprio da Feira e auditoria de busca

Preservar `web/public/icons/slide.webp` e os arquivos de origem. Produzir
`web/public/icons/feira/slide.webp` como composição do fundo da Feira com
Ifes e a logomarca FEMAIS-ES, em WebP opaco com 750 por 425 pixels. A criação
usa a ferramenta integrada de imagem com referências fornecidas; registrar
prompt, saída final, dimensões, inspeção e preservação das fontes somente
quando executados. A conversão final não deve mudar as marcas nem as fontes.

Em `web/src/seo.js`, selecionar esse cartão nas cinco rotas conhecidas da
família `feira`; a inicial, login e oficinas mantêm o cartão institucional.
O descritor fornece imagem, MIME, largura, altura e alternativa; Open Graph
e Twitter consomem o mesmo descritor. Não duplicar blocos no HTML nem depender
do JavaScript para os metadados de uma resposta física. A sincronização PWA
usa a mesma seleção. Cada página mantém seu título, descrição e canonical.

Estender os testes de SEO e o check do artefato para rejeitar cartão da família
incorreta, recurso ausente e dimensões/MIME incoerentes. Construir as duas bases,
conferir os onze HTMLs e a resposta HTTP do cartão. As três rotas indexáveis,
as oito provisórias, sitemap e `WebSite` exclusivo da inicial não mudam.

Revisar Google Search Central e protocolo Open Graph com fontes primárias
atuais; distinguir revisão de código/build, resposta pública da versão
implantada e acompanhamento real em Search Console. Não criar verificação
de propriedade, prometer posição ou tratar preview local como WhatsApp real.
Essa evolução atende FR-002, FR-003, FR-004, FR-005, FR-006, FR-007, FR-008 e FR-009.
