# Verificação: página da FEMAIS-ES

**Feature**: `009-fair` | **Verificação local**: 2026-11-14

## Fontes e situação inicial

Pedido explícito do usuário, `web/public/images/background_femais.webp`,
`web/public/images/femais.svg` e `/home/walber/Downloads/proposta.docx`.
O documento foi extraído como ZIP/XML. A reconstrução dos dois parágrafos
de preâmbulo e das 17 seções corresponde à sequência normativa da fonte,
sem usar orçamento, cronograma antigo ou instruções do documento como
requisitos que substituam a conversa. A extração local de trabalho fica
fora do repositório; os dados normativos estão em `web/src/regulation.js`.

A comparação entre os dados da aplicação e o regulamento extraído foi exata:
17 seções, 154 parágrafos nas seções e dois parágrafos de preâmbulo. Os 175
blocos da fonte incluem esses parágrafos, os 17 títulos das seções e o título
e subtítulo gerais; não são 175 cláusulas normativas. Percentuais de inclusão
e condições de premiação foram preservados, sem quantias monetárias.

SHA-256 de `proposta.docx`:
`bb63875e62e3cbcb30f5bcce41b8c773a4721294a942691ddc35c4c863ac4f4f`.
SHA-256 do JSON normativo em UTF-8, sem indentação, com separadores `,` e `:`:
`186fe2caace7d4ca5ceaf705e0ae8cbf9d3f8541129c176c33aa7e162fa59df0`.

As imagens anteriores `background.webp`, `ifes.svg`, `maisciencia.svg`,
`popciencia.svg` e `apoio.svg` permaneceram byte a byte iguais a `HEAD`.
As artes fornecidas para a Feira foram usadas sem alteração de seus arquivos.
As evidências de 006, 007 e 008 permanecem históricas; seus contratos atuais
foram reconciliados com 009.

A implementação está em `feature/issue/2`, sem commit ou publicação desta
feature. A release 0.3.0 é a situação anterior; a issue #2 permanece aberta.

## Matriz de aceitação

| Requisitos | Evidência obtida ou pendência | Estado |
| --- | --- | --- |
| FR-001 | Conteúdo e HTML conferidos, sem quantias, PROEX ou apoios prospectivos apresentados como confirmados | Verificado por inspeção e testes |
| FR-002, FR-003 | Artes originais, fundos azul-petróleo e botões amarelo, azul e rosa com borda e transparência; capturas conferidas | Verificado em navegador local |
| FR-004, FR-005 | Três meses/locais, destinos, construção e retorno testados nas duas bases | Verificado em testes e artefatos |
| FR-006, FR-007 | Menu, trecho, preâmbulo e 17 seções; comparação exata com a extração do documento | Verificado por inspeção e testes |
| FR-008, FR-009 | Menu móvel, Escape e foco, navegação, larguras 1440/390/320 e movimento reduzido; imagens sem animação de escala | Verificado em navegador local |
| FR-010 | Onze HTMLs e recursos passam nos checks; 20 variantes HTTP, rotas e navegação atendida pelo PWA nas duas bases | Verificado em artefatos e navegador local |
| FR-011 | Três URLs indexáveis, oito noindex, sitemap e canonical próprios; `WebSite` exclusivo da inicial | Verificado nos dois builds e testes |
| FR-012 | Carregamento concluído, regulamento inicial legível sem JavaScript e seleção do conteúdo em navegações atendidas pelo service worker | Verificado localmente; instalação, atualização e modo offline não exercitados |

## Checks executados

Comandos executados pela implementação e resultados consolidados:

| Comando ou contexto | Resultado |
| --- | --- |
| `npm --prefix web run lint` | Passou |
| `npm --prefix web test` | 73 testes Node passaram, sem falhas |
| `npm --prefix web run build` e `npm --prefix web run check:build`, origem `https://maisciencia.ifes.app.br`, base `/` | 43 arquivos, 831 referências internas, onze HTMLs e 41 entradas no precache |
| `WEB_SITE_ORIGIN=https://ifesguarapari.github.io WEB_BASE_PATH=/maisciencia/ npm --prefix web run build` e `check:build` com as mesmas variáveis | 43 arquivos, 828 referências internas, onze HTMLs e 38 entradas no precache |
| `python3 scripts/validate-specs.py` | Nove features, 88 requisitos e 111 tarefas; estrutura e rastreabilidade passaram |
| `python3 -m unittest discover -s tests -v` | Nove testes do validador passaram |

O conjunto Node cobre seleção das rotas e variantes, datas e locais,
retorno das etapas, HTML inicial do regulamento, integridade das cláusulas,
preservação das páginas anteriores, recursos, precache, canonical e política
de indexação, incluindo casos negativos. Os checks de build conferem recursos,
manifesto, registro do service worker, HTML físico, robots e sitemap.

Os checks Python acima antecederam o último ajuste de espaço no texto das
datas e das cores CSS; essas alterações não afetaram os artefatos Markdown.
O ESLint, os 73 testes Node e ambos os builds foram executados novamente após
esses ajustes. Inspeção e testes não representam homologação humana.

## Navegador local

As tentativas anteriores do roteiro de navegador foram interrompidas por
falhas do próprio roteiro ao aguardar deslocamento suave e ao acionar o menu
móvel durante a transição. Não são registradas como passagem integral dos
fluxos. A rodada final, com esperas adequadas e snapshots atualizados após os
ajustes de data e cores, terminou com código de saída zero e lista de falhas
vazia em `/tmp/maisciencia-fair-browser-evidence.json`.

Foram exercitados em Chrome local:

- Larguras de 1440, 390 e 320 pixels, com H1 único, imagens carregadas e sem
  estouro horizontal; três cards e destinos corretos.
- Menu móvel por clique real, fechamento com Escape, restauração de foco no
  botão, reabertura e navegação por âncora.
- Navegação real para as três etapas em construção, retorno à Feira, botão
  do regulamento e índice de seções, incluindo deslocamento até participação.
- Vinte acessos HTTP às cinco rotas com e sem barra final nas duas bases,
  com HTML físico e resposta 200 em servidor sem fallback de SPA.
- Regulamento com 17 seções, 154 parágrafos normativos e dois de preâmbulo,
  comparados exatamente com os dados extraídos do documento.
- Movimento reduzido com conteúdo revelado e parallax em `0px`.
- Primeira resposta HTML do regulamento com JavaScript desativado e bypass do
  service worker, mantendo todo o conteúdo legível. Esse cenário não simula
  JavaScript desligado depois de uma instalação anterior da PWA.
- Navegações de etapas e regulamento efetivamente atendidas pelo service
  worker; foram registradas onze respostas de documento com essa origem.
- Retorno à página institucional com identidade, rodapé e indexação preservados.

A rodada registrou 227 respostas, sem erros HTTP, falhas de rede não
canceladas, exceções de runtime, erros de console ou chamadas de API.
Os servidores próprios foram fechados, Chrome terminou com código zero e
o perfil temporário foi removido.

Capturas locais produzidas:

- `/tmp/maisciencia-fair-desktop-hero.png`
- `/tmp/maisciencia-fair-desktop-edition.png`
- `/tmp/maisciencia-fair-mobile-hero.png`
- `/tmp/maisciencia-fair-mobile-edition.png`
- `/tmp/maisciencia-fair-desktop-regulation.png`
- `/tmp/maisciencia-fair-mobile-regulation.png`

A conferência visual final incluiu hero em desktop, edição em celular e
regulamento em desktop. O relatório e as capturas temporárias são evidências
locais desta sessão e não integram o artefato público. `web/dist` foi
restaurado para a cópia exata do build da raiz validado, com 43 arquivos.

## Limites

Sem homologação humana, registro de inscrições, serviços de backend,
Search Console, commit ou implantação remota desta feature. O funcionamento
do cache em modo offline, a instalação e a atualização de uma PWA já
instalada não foram exercitados. Navegação atendida pelo service worker,
quando confirmada, não comprova esses outros cenários. Os testes não
substituem auditoria completa de acessibilidade, desempenho ou revisão
editorial do responsável pelo evento.

## Correções posteriores à rodada inicial

A solicitação de reorganização das artes, revisão de marca e rótulos, listas
de instituições e proposta expositiva/gamificada evolui os requisitos
FR-001, FR-002 e FR-004 e acrescenta FR-013 e FR-014. As evidências acima
permanecem históricas; não comprovam essas correções. T009-T012 exigem
novas verificações, com FR-013 cobrindo as listas 13/12/5 e FR-014 a descrição
da interação, pontuação acumulada, troféus e premiações. Os resultados
dessa evolução serão acrescentados somente após a execução correspondente.

### Evidências de implementação e artefato das correções

A reorganização foi feita por movimentação e renomeação, sem alterar os
bytes das artes. A conferência de SHA-256 dos arquivos atuais corresponde
à captura local de origem em `/tmp/maisciencia-fair-relocation.json`:

| Arquivo atual | SHA-256 preservado |
| --- | --- |
| `web/public/images/feira/background.webp` | `27f93b34abf8236d6b950ee588d6fea4a15696e5e756dee606e5b46a0e549fa6` |
| `web/public/images/feira/femais.svg` | `7f3e12592995a498e2fa0cb1c783f86a9dfcbca09733750eefdbe921eec0ff09` |

Os arquivos anteriores na raiz de `images/` não permanecem como cópias.
Os caminhos antigos não aparecem em `web/src/` ou `web/build/`. A renderização
inicial dos HTMLs nas duas bases apresenta os 30 nomes fornecidos, separados
nas três listas. Uma revisão independente confirmou igualdade dos dados com
o contrato, incluindo ordem e contagens 13/12/5. O regulamento de
`web/src/regulation.js` permanece íntegro em relação à extração anterior.

Os novos rótulos são “Primeira edição”, “Feira expositiva” e “Encontro” sem
numeração. A marca aparece como imagem no destaque, com proporção preservada;
o cabeçalho usa Ifes e Mais Ciência na Escola. Os cards mostram as instituições
em lugar de “Página em construção”; os destinos continuam provisórios.
O texto editorial apresenta professores, alunos e pais do programa e a
exposição científica e tecnológica, com aprendizagem ligada à inovação do
território. A jornada gamificada é descrita como interação com expositores,
pontuações acumuladas e troféus e premiações ao final, sem inventar regras,
quantidades de pontos, valores ou um sistema funcional de pontuação.

| Verificação da evolução | Resultado |
| --- | --- |
| ESLint | Passou |
| Testes Node | 75 testes passaram; os dois novos cenários conferem listas por card, rótulos e conteúdo editorial |
| Build e `check:build`, origem de produção e base `/` | 43 arquivos, 850 referências internas, onze HTMLs e 41 entradas no precache |
| Build e `check:build`, origem GitHub e base `/maisciencia/` | 43 arquivos, 847 referências internas, onze HTMLs e 38 entradas no precache |
| Artefato estático nas duas bases | Trinta instituições presentes; caminhos e metadados coerentes |
| Integridade de dados e artes | Listas e regulamento conferidos; hashes das duas artes preservados |

Essas evidências concluíram a implementação de T009-T011 e a parte
automatizada de T012. Naquele momento, a QA de navegador desta correção ainda
estava em execução; seu resultado concluído está na seção seguinte. As
capturas e o relatório anteriores permanecem identificados como evidência da
primeira implementação. Não houve commit, publicação remota, implementação
de pontuação ou mudança de backend.


### Navegador das correções concluído

A rodada específica das correções terminou com código de saída zero e lista
de falhas vazia em `/tmp/maisciencia-fair-corrections-browser.json`.
O relatório foi conferido separadamente do ensaio anterior da página.
Foram registradas 244 respostas, sem erros HTTP, falhas de rede não
canceladas, exceções de runtime, erros de console ou chamadas de API.

A conferência real em Chrome cobriu:

- Desktop com 1440 pixels e celulares de 390 e 320 pixels, sem estouro
  horizontal e com listas de 13, 12 e cinco instituições legíveis e sem cortes.
- As 30 instituições nos respectivos cards, nomes e ordem preservados; rótulo
  “Encontro” sem número e ausência de “Página em construção” nos cards.
- Cabeçalho com Mais Ciência na Escola, marca da Feira proporcional no
  destaque e imagens carregadas pelos novos caminhos `images/feira/`.
- Vinte variantes HTTP das cinco rotas com e sem barra final, nas duas bases.
- Menu móvel, fechamento com Escape, restauração de foco, navegação por
  âncora, três etapas em construção e os respectivos retornos à Feira.
- Regulamento preservado com 17 seções, 154 parágrafos normativos e dois de
  preâmbulo, comparados exatamente aos dados da fonte.
- Apresentação inicial sem JavaScript contendo os 30 nomes e regulamento
  legível, com bypass do service worker para obter o HTML físico.
- Navegação atendida pelo service worker, preferência de movimento reduzido
  e retorno à página institucional sem mudança de identidade.

O relatório identifica oito capturas locais:

- `/tmp/maisciencia-fair-corrections-desktop-hero.png`
- `/tmp/maisciencia-fair-corrections-desktop-edition.png`
- `/tmp/maisciencia-fair-corrections-desktop-experience.png`
- `/tmp/maisciencia-fair-corrections-mobile-hero.png`
- `/tmp/maisciencia-fair-corrections-mobile-edition.png`
- `/tmp/maisciencia-fair-corrections-mobile-experience.png`
- `/tmp/maisciencia-fair-corrections-desktop-regulation.png`
- `/tmp/maisciencia-fair-corrections-mobile-regulation.png`

A inspeção visual incluiu hero em desktop e celular, edição completa em
desktop e trecho da experiência gamificada. Esses resultados concluem T012;
a documentação não os apresenta como homologação humana. Os servidores
próprios foram fechados e Chrome terminou com código zero; o perfil
temporário foi removido.

Persistem os limites: não foram testados instalação, atualização de uma PWA
já instalada nem uso offline. Não houve Search Console, implantação remota,
commit, homologação humana ou implementação de pontuação e premiação. As
listas de participantes e a proposta editorial não constituem um sistema
de inscrições ou acompanhamento dos eventos.

## Padronização das marcas do cabeçalho

Em 2026-11-14, a divergência de dimensões das marcas foi corrigida conforme
FR-002 e FR-008. Foram removidas as quatro regras específicas da Feira e
a classe exclusiva do conjunto de marcas. As duas páginas reutilizam
`.brand`, `.brand-ifes` e `.brand-science`, incluindo os breakpoints de
`web/src/style.css`. As imagens originais foram preservadas.

ESLint, build Vite, `check:build`, validação SDD e `git diff --check` passaram.
O build da raiz contém 43 arquivos, 850 referências internas e onze HTMLs.
Não foram acrescentados testes unitários para esta correção de CSS; a
comparação relevante foi executada em Chrome com o artefato atualizado.

| Largura da tela | Ifes nas duas páginas | Mais Ciência nas duas páginas |
| --- | --- | --- |
| 1440 px | 47 × 63 px | 128 × 48 px |
| 1100 px | 47 × 63 px | 112 × 48 px |
| 390 px | 38 × 51 px | 112 × 42 px |
| 320 px | 34 × 45 px | 101 × 38 px |

A comparação passou nas quatro larguras, no topo e depois de rolar 200 px.
Também coincidiram alinhamento, espaçamento, divisória e altura do cabeçalho,
sem estouro horizontal. Foram observadas 117 respostas sem erros HTTP,
falhas de rede, exceções de runtime ou erros de console. Evidência local:
`/tmp/maisciencia-header-proportions.json`, com lista de falhas vazia.
Capturas: `/tmp/maisciencia-header-desktop-home.png`,
`/tmp/maisciencia-header-desktop-feira.png`,
`/tmp/maisciencia-header-mobile-home.png` e
`/tmp/maisciencia-header-mobile-feira.png`. Chrome, servidor e perfil
temporário foram encerrados. Não houve publicação ou homologação humana.

## Evolução: SNCT 2026

FR-015 foi especificado antes da implementação de T014. A redação solicitada
pelo usuário e a arte `web/public/images/feira/snct2026.svg` são as fontes
editoriais; a inclusão não representa cadastro ou chancela formal adicional.
Checks desta evolução serão registrados após execução.

T014 concluída em 2026-11-14. O painel usa a arte fornecida sem alteração,
com SHA-256 `46c59addfde38cfaae01f86d082f98e733ddef1fcb04f82f39cdc9bc0503cf28`,
e reproduz o texto solicitado e o vínculo editorial da Feira com as ações.
O título foi alterado para “Explore. Interaja. Acumule aprendizagens.”.

ESLint, 80 testes Node, build Vite da raiz, `check:build`, validação SDD e
`git diff --check` passaram. O artefato possui 45 arquivos, 854 referências
internas e onze HTMLs. O conteúdo e a posição do painel foram conferidos
também no HTML inicial, independentemente de JavaScript.

A QA focada em Chrome passou em 1440, 390 e 320 px: painel imediatamente
após os cards, imagem proporcional, texto legível, sem estouro horizontal,
link oficial com abertura em nova aba e atributos seguros. O SVG respondeu
200 com MIME `image/svg+xml`, 28.027 bytes. Foram observadas 17 respostas
sem erros HTTP, falhas de rede, exceções, erros de console ou chamadas de API.
Evidência local: `/tmp/maisciencia-snct-browser.json`, com lista de falhas
vazia; capturas `/tmp/maisciencia-snct-desktop.png` e
`/tmp/maisciencia-snct-mobile.png`, conferidas visualmente. O roteiro corrigiu
uma normalização de texto do próprio teste antes da rodada final, sem mudar
a aplicação. Chrome, servidor e perfil temporário foram encerrados.

O tema, a 23ª edição e o lema de 2026 foram confirmados em publicação
[do IFSP Hortolândia](https://hto.ifsp.edu.br/ultimas-noticias/1717-semana-nacional-de-ciencia-e-tecnologia-2026).
O portal nacional respondeu 403 na ferramenta de consulta e a abertura direta
do anúncio MCTI encontrou barreira de JavaScript/CAPTCHA; não são registrados
como leitura integral dessas páginas. O link solicitado foi preservado.
A participação da FEMAIS nessas ações é informação fornecida pelo usuário;
não se afirma cadastro ou chancela institucional adicional. Não houve
publicação remota nem nova validação de instalação, atualização ou modo
offline da PWA nesta correção.
