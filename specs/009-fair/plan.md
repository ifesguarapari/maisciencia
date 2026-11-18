# Plano: página da FEMAIS-ES

**Feature**: `009-fair` | **Data**: 2026-11-14
**Especificação**: [spec.md](spec.md) | **Branch**: `feature/issue/2`

## Solução

O cabeçalho reutiliza as classes compartilhadas `.brand`, `.brand-ifes` e
`.brand-science` de `web/src/style.css`, incluindo seus breakpoints. Não
definir dimensões específicas para essas marcas na Feira; a correção elimina
as sobrescritas divergentes de `web/src/fair.css`.

Preservar Vite vanilla, HTML, Tailwind CSS, Alpine.js e PWA, sem dependências
novas nem persistência. Criar apresentação própria da Feira e uma leitura
estática integral do regulamento. Compartilhar a renderização entre o HTML
produzido pelo build e a seleção de página no navegador, necessária quando
o service worker responde com o shell institucional. Selecionar a rota antes
de iniciar Alpine para evitar a exibição da página errada.

## Conteúdo e composição

Usar `web/src/fair.html` como apresentação, `web/src/fair.js` como renderizador
compartilhado, `web/src/fair.css` para estilos escopados e
`web/src/regulation.js` para os dados normativos extraídos do documento.
O texto do regulamento conserva todos os parágrafos, listas e numeração;
conteúdo editorial da Feira pode ser sintetizado sem distorcer as regras.
As etapas são dados estáticos com os três meses/locais definidos no contrato.
`web/src/fair-data.js` mantém as etapas e suas listas de instituições, para
compartilhamento entre renderização e testes sem alterar a rede principal.
Cada instituição tem `name` e `city`; os campi cujo município não foi
explicitado usam `city: null`, preservando o rótulo fornecido.

As artes ficam em `web/public/images/feira/background.webp` e
`web/public/images/feira/femais.svg`. A reorganização é uma movimentação e
renomeação, sem transformar os arquivos. O carregamento, o preload, o CSS
e o build precisam usar os novos caminhos nas duas bases públicas.

A identidade combina fundo azul-petróleo da imagem original e logomarca
FEMAIS-ES ampliada proporcionalmente no destaque principal. O cabeçalho
usa as marcas Ifes e Mais Ciência na Escola. A composição mantém as
seções de proposta, público, modalidades, edição, regulamento e apoio, com
navegação fixa e móvel. Botões reutilizam borda, raio e transparência da
principal, nas três cores fornecidas. Parallax desloca o fundo somente em
desktop com preferência adequada; revelações nunca dependem de escala.
Manter a identidade institucional e a parceria do rodapé sem inventar apoios.

## Rotas, HTML e SEO

`web/src/pages.js` mantém um catálogo de páginas de conteúdo e provisórias.
Com a inicial, são onze entradas: as sete anteriores mais regulamento e
três etapas. `web/src/paths.js` reconhece o catálogo completo, com limites
de diretório e barra final. `web/build/static-routes.js` e a transformação
HTML de `web/build/seo.js` geram conteúdo e metadados próprios por rota.
`web/src/main.js` aplica a mesma seleção ao shell PWA antes de Alpine.

`web/src/seo.js` centraliza sinais de todas as páginas. Início, Feira,
regulamento e dezembro entram no sitemap; as sete provisórias usam `noindex,follow`.
`WebSite` permanece exclusivo da inicial. A imagem de compartilhamento
institucional existente é preservada na inicial e demais páginas
institucionais; as cinco rotas da Feira passam a usar
`icons/feira/slide.webp`, composto a partir do fundo da Feira, Ifes e a
logomarca FEMAIS-ES conforme a evolução de 008. Não criar dados de evento
com datas exatas que não foram fornecidas. Origem HTTPS e base permanecem
configuráveis.

## Verificação da constituição

| Princípio | Atendimento e evidência planejada | Desvio |
| --- | --- | --- |
| Intenção especificada | 009 precede implementação e evolui os contratos 006/007/008 | Nenhum |
| Fronteiras | Somente conteúdo estático, sem Flask, Kong, MongoDB ou BFF | Nenhum |
| Segurança | Sem sessões, formulários, segredos ou novas APIs | Nenhum |
| Idioma e configuração | Conteúdo institucional pt-BR; código e caminhos técnicos em inglês; `.env` preservados | Rotas públicas em português explicitamente solicitadas |
| Evidência honesta | Testes e builds separados de navegador, PWA e publicação | Nenhuma aprovação humana presumida |

## Pesquisa, dados e contratos

A proposta foi extraída por ZIP/XML, sem executar conteúdo do documento.
A extração identifica o preâmbulo e as 17 seções normativas. O cronograma
antigo e o orçamento não determinam a interface. Não há migração de banco
nem contrato HTTP novo. O contrato de interface está em
[contracts/fair.json](contracts/fair.json); a identidade visual e a seleção
de páginas são responsabilidade do frontend.

## Matriz de implementação e validação

| Requisitos | Solução | Validação planejada |
| --- | --- | --- |
| FR-001, FR-002, FR-003 | Template e CSS da Feira, artes originais | Conteúdo compilado e inspeção responsiva |
| FR-004, FR-005, FR-013 | Dados das etapas e listas em `fair-data.js`, cards sem aviso | Nomes, ordem, 13/12/5 instituições, datas, links e destinos provisórios |
| FR-014 | Texto editorial da jornada gamificada em `fair.html` | Interação, pontos acumulados, troféus e premiações sem regras inventadas |
| FR-006, FR-007 | Trecho e página integral de regulamento | Contagem e comparação com fonte; links de seções |
| FR-008, FR-009 | Menu e efeitos compartilhados com escopo visual próprio | Navegador, teclado, celular e movimento reduzido |
| FR-010, FR-011, FR-012 | Catálogo, renderer, HTML, SEO e shell PWA | Testes Node, dois builds e checks, navegador conforme disponível |

## Validação planejada

Executar `npm run lint`, `npm test`, `npm run build` e `npm run check:build`
em `web`, tanto com base `/` e origem de produção quanto com base
`/maisciencia/` e origem do GitHub. Executar o validador SDD e seus testes na
raiz. Conferir HTML gerado, ausência de orçamento, preservação das regras,
recursos e links, depois exercitar navegação e layout em navegador disponível.
Registrar os resultados reais em [verification.md](verification.md).

A publicação da versão anterior não comprova implantação de 009. A preparação
original foi local. O pedido posterior autoriza concluir a feature, publicar
a release 0.4.0 e recriar a feature em `develop`, seguindo 007. O resultado
remoto será registrado somente após a execução; a issue #2 permanece aberta.

## Correções editoriais e de organização

A evolução de 2026-11-14 reutiliza a feature e suas cinco rotas. O hero usa
a imagem da marca em lugar do título tipográfico, mantendo H1 acessível e
nome da Feira nos metadados. Os rótulos editoriais usam “Primeira edição”,
“Feira expositiva” e “Encontro” sem numeral. Os cards recebem listas
semânticas das instituições, preservando a ordem fornecida e a legibilidade
em celular; seus links de destino continuam em construção e com noindex.

A apresentação destaca exposição científica e tecnológica para professores,
alunos e pais do programa, relacionando atividades escolares e outras
aprendizagens da inovação local. A proposta gamificada descreve a interação
com expositores, acúmulo de pontos e reconhecimento por troféus e premiações,
sem criar backend, app de pontuação, critérios ou quantias. O conteúdo
normativo de `regulation.js` permanece integralmente preservado.

Testes de conteúdo devem conferir nomes e ordem das listas, números de
instituições, caminhos de arte, ausência dos rótulos antigos nos cards e
metadados coerentes. Os builds das duas bases e a inspeção em navegador
verificam especialmente a proporção da marca e a altura das listas longas.

## Semana Nacional de Ciência e Tecnologia

FR-015: incluir um painel estático em `web/src/fair.html`, imediatamente
após os cards dos encontros, com a arte original `snct2026.svg`, texto
fornecido pelo usuário, identificação de 2026 e link oficial. O painel
reutiliza revelação e botão translúcido, com grade responsiva em
`web/src/fair.css`. Preservar a proporção retrato da imagem e a leitura
sem JavaScript. Não alterar datas dos encontros ou o regulamento.
O título de gamificação passa a “Explore. Interaja. Acumule aprendizagens.”.

## Rótulos e encontros a confirmar

Em 2026-11-17, FR-004 passa a usar “Primeira edição” no CTA do hero e
“Projeto” nos três links de retorno. O campo `tentative` em `fair-data.js`
identifica Piúma e Linhares. O renderer compartilhado inclui o aviso
“(A confirmar)” em elemento `em` sob o local, nos cards e nas páginas de
etapa; CSS define fonte menor e itálica, permitindo síntese de estilo
somente nesse aviso porque a configuração global desativa síntese de fontes.
Não alterar nomes, datas,
instituições ou destinos. Vila Velha permanece sem aviso.

## Encontro de dezembro de 2026

A evolução de 2026-11-18 permanece em 009, completando uma rota já prevista.
Extrair `202612.docx` por ZIP/XML como conteúdo e manter dados editoriais
estáticos separados do renderer. Compartilhar o mesmo HTML entre build e
shell PWA. A página terá hero e atalhos locais, cinco eixos, 20 cards com SVGs
próprios, resumo, exposição, expositor e interação; descrições extensas ficam
em elementos `details` nativos, presentes no HTML sem JavaScript. Reutilizar
marcas, botões translúcidos, revelações e parallax com movimento reduzido.

Os novos SVGs ficam em `web/public/images/feira/activities/`, com nomes em
inglês, dimensões 480 × 300 e composições originais no estilo das oficinas.
Usar a imagem original `jic2026.svg` no trecho específico da Jornada. Não
incluir arquivos DOCX no artefato público, valores monetários ou serviços
simulados. O documento não informa o dia da FEMAIS; a correção explícita
posterior do usuário confirma 04/12/2026. Essa data acompanha o card, o
destaque, a programação no Ifes Vila Velha e os metadados, mantendo os quatro
horários fornecidos e o período próprio da Jornada.

Mover dezembro do catálogo provisório ao conteúdo indexável em `pages.js`;
sitemap terá quatro URLs e restarão sete provisórias, preservando as onze
entradas e o cartão social compartilhado da Feira. Contratos 006, 008 e 009
acompanham a intenção; 007 preserva seu inventário de entradas. Testes devem
validar conteúdo e metadados de dezembro, distinção entre datas da Jornada e
da Feira, conservação das duas etapas provisórias e conteúdo real no HTML.
Executar lint, testes Node, builds/checks de ambas as bases, validador SDD e
QA de navegador proporcional, registrando somente resultados reais.

Os dados finais ficam em `web/src/december-data.js`; `web/src/december.js`
produz o trecho do encontro e `december.css` contém os estilos específicos.
O renderer de `fair.js` incorpora esse trecho no cabeçalho e rodapé existentes,
tanto no HTML físico quanto ao reconstruir a rota pelo shell PWA. As escolas
reutilizam `fair-data.js`, evitando manter listas divergentes. O contrato
registra um fingerprint dos 120 campos textuais extraídos da fonte para
proteger a integridade das atividades, com remoção apenas dos pontos e vírgulas
finais dos resumos. A apresentação do aplicativo descreve a proposta futura.

A data ISO `2026-12-04` fica na programação de `december-data.js` e é
reutilizada pelo primeiro encontro de `fair-data.js`. A data longa e a
numérica acompanham a página; o renderer dos cards inclui o dia somente
para a etapa com data confirmada. Testes existentes passam a exigir a data
correta, preservando a distinção entre FEMAIS e Jornada.

A quebra do título completo aumenta o hero em telas pequenas. A transição
do fundo móvel acompanha os 490 px da imagem, em vez de uma porcentagem da
altura total, evitando um corte visível quando o texto ocupa mais linhas.

## Entrega da versão 0.5.0

A autorização posterior de 2026-11-18 permite publicar o conteúdo desta
evolução pelo fluxo existente de 007. Usar 0.5.0 como minor pela página
completa de dezembro e suas 20 atividades, preservando o dia confirmado
04/12/2026 no Ifes Vila Velha, os rótulos e os avisos das etapas seguintes.
Os checks da release devem manter onze entradas, quatro rotas indexáveis
e sete provisórias, além das marcas, botões, acessibilidade e regras PWA.

Executar Commitizen com rodapé `fix #2`, finalizar a feature e a release
pelo Git Flow, acompanhar o Actions do commit exato e conferir a página
publicada antes de registrar sucesso. A preparação e a execução ficam nas
tarefas T021–T024 de [007](../007-web-delivery/tasks.md). Após a implantação,
consolidar evidências em `develop` e recriar `feature/issue/2` pelo Git Flow,
conferindo base, branch ativa e árvore limpa. A issue GitHub #2 deve
permanecer aberta conforme decisão anterior, mesmo que seja necessário
restaurar esse estado após o fechamento automático causado pela referência
pedida. Não atribuir implementação nem homologação às funcionalidades
restantes por causa da entrega desta página.

## Substituição da arte da Jornada por SVG

Usar o arquivo `web/public/images/feira/jic2026.svg` fornecido pelo usuário
no lugar do PNG. Atualizar o caminho em `december-data.js` e no contrato,
e ajustar as dimensões declaradas no renderer à proporção da nova imagem.
Remover o PNG da pasta pública, mantendo os registros históricos de sua
publicação em 0.5.0. Conferir build e referências para evitar recurso antigo
ou ausente; preservar o conteúdo e o link da Jornada. A correção permanece
na feature local, sem executar nova release por esta solicitação.
