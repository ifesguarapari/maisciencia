# Histórico de versões

As releases da web seguem a política SemVer descrita em
[CONTRIBUTING.md](CONTRIBUTING.md). As versões da API são independentes.

## 0.5.0 - 2026-11-18

### Novidades

- Página do encontro da FEMAIS-ES em 04 de dezembro de 2026, no Ifes Vila Velha,
  com programação, público convidado e as 13 instituições participantes.
- Cinco eixos e 20 atividades com ilustrações SVG próprias, exposições,
  expositores, interações e descrições completas em detalhes expansíveis.
- Apresentação da Jornada de Integração 2026 com imagem, período e link oficial.
- Página de dezembro indexável, com metadados de compartilhamento e inclusão
  no sitemap, que passa a conter quatro páginas prontas.

### Correções

- Data 04/12/2026 identificada no card da Feira, título, programação e metadados.
- Rótulos “Primeira edição” e “Projeto” e avisos “(A confirmar)” nos encontros
  de Piúma e Linhares, com fonte menor e itálica.
- Transição do fundo móvel preservada quando o título ocupa mais linhas e
  dimensões declaradas da imagem da Jornada alinhadas ao arquivo original.

## 0.4.0 - 2026-11-14

### Novidades

- Página FEMAIS-ES com apresentação da feira expositiva, público escolar,
  modalidades, experiência gamificada e destaque da SNCT 2026 - Ciência Delas.
- Primeira edição em três encontros, com as 30 instituições distribuídas
  em Vila Velha, Piúma e Linhares e páginas provisórias próprias.
- Regulamento completo com 17 seções, índice e conteúdo disponível no HTML inicial.
- Identidade visual própria, imagens organizadas em `images/feira/` e
  cartão social `icons/feira/slide.webp` com 750 por 425 pixels.
- SEO e compartilhamento por rota, sitemap com inicial, Feira e regulamento
  e validação do formato e das dimensões reais dos cartões WebP.

### Correções

- Proporções das marcas do cabeçalho padronizadas entre início e Feira,
  incluindo tamanhos de celular.
- Seleção de conteúdo e metadados da Feira preservada em navegações PWA.

## 0.3.0 - 2026-11-14

### Novidades

- Metadados de SEO no HTML inicial de cada rota, com canonical HTTPS e
  identidade estruturada WebSite.
- Robots e sitemap para descoberta da página institucional; telas em
  construção permanecem com noindex até terem conteúdo final.
- Cartão de compartilhamento WebP de 750 por 425 px, com marcas do projeto,
  Open Graph completo e metadados Twitter.
- Checks automáticos de SEO integrados ao build e guia de manutenção e Search Console.

### Correções

- Metadados coerentes na navegação PWA e arquivos robots/sitemap fora do
  fallback HTML.
- Marca Pop Ciência e subtítulo do programa no rodapé, com parceria preservada.
- Grafia da parceria Profe e atualização da colaboração em Foguetes para
  Ijanai dos Santos Sobrinho.
- Nome de Nanine abreviado para Nanine R. P. dos Santos Pereira.

## 0.2.0 - 2026-11-07

### Novidades

- Página geral de oficinas e três páginas individuais provisórias, com
  acesso direto e aviso de construção.
- Botões Saiba mais nas oficinas e navegação para a página geral.
- Identificação da parceria Profe no bloco de identidade do rodapé.

### Correções

- Ícones da aplicação atualizados a partir da nova arte do favicon.
- Botões das oficinas e de retorno com borda, cor e fundo translúcido.
- Abertura com somente Feira em rosa e Aplicativo em verde, seguindo o
  estilo do cabeçalho.
- Artefato estático e precache incluem todas as rotas das oficinas.

## 0.1.0

- Primeira release da plataforma e da página institucional.
- Workflow da web para validação e publicação no GitHub Pages.
