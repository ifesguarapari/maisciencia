# Pesquisa e decisões de SEO

Consulta em 2026-11-14 a fontes primárias do Google Search Central:

- [Guia inicial de SEO](https://developers.google.com/search/docs/fundamentals/seo-starter-guide):
  priorizar conteúdo útil, identidade clara, títulos e descrições descritivos.
- [SEO com JavaScript](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics):
  entregar metadados consistentes no HTML inicial e preservar seu sentido após
  renderização. O shell PWA exige atenção adicional às rotas provisórias.
- [Uso de noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing):
  permitir o rastreamento para que o crawler leia a regra; robots não é mecanismo
  de exclusão do índice. Decisão: manter noindex nas seis telas em construção.
- [Construção de sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap):
  listar URLs canônicas que se deseja indexar. Decisão: somente a home enquanto
  as demais páginas são provisórias, sem lastmod artificial a cada build.
- [Nome do site](https://developers.google.com/search/docs/appearance/site-names):
  usar WebSite com nome e URL reais. O recurso de nome do site é documentado
  para domínio/subdomínio, não para subpastas. Não prometer resultado especial.

O código já fornece HTML institucional, idioma, descrição e Open Graph parcial.
A principal lacuna é a repetição do head da home nas cópias físicas, corrigida
somente depois pelo cliente. A renderização de metadados no build resolve isso
com as ferramentas existentes, sem servidor ou dependência de execução nova.

Dados de equipe e instituições continuam sob Alpine; acompanhar o HTML
renderizado no Search Console é mais proporcional que reescrever a página.

## Observação do site publicado

Em 2026-11-14, uma consulta HTTPS real encontrou HTTP 200 na página inicial,
sem link canonical nem meta robots no HTML recebido. `robots.txt` e
`sitemap.xml` retornaram HTTP 404. Esse diagnóstico confirma a lacuna de
descoberta; não comprova ausência no índice do Google. A ferramenta de
consulta web não conseguiu abrir o domínio, então esses estados foram
conferidos por um cliente HTTP separado, sem modificar a hospedagem.
