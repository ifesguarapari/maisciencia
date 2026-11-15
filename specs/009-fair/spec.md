# Especificação: página da FEMAIS-ES

**Feature**: `009-fair` | **Criação**: 2026-11-14 | **Branch**: `feature/issue/2`
**Estado**: especificada antes da implementação; evidências em [verification.md](verification.md).
**Origem**: pedido do usuário, `proposta.docx` e imagens fornecidas.

## Objetivo e escopo

Apresentar a FEMAIS-ES - Feira Estadual Mais Ciência na Escola do Espírito
Santo em `/feira`, substituindo a apresentação provisória de 006. O visitante
deve compreender a proposta, o público, as atividades e a primeira edição,
consultar seu regulamento e encontrar as páginas das três etapas. Todo o
conteúdo público é escrito em português do Brasil, como extensão da página
institucional autorizada; nomes técnicos e comentários continuam em inglês.

As instruções do usuário prevalecem sobre o documento usado como fonte.
Não publicar valores monetários, orçamento ou o processo Ifes PROEX. Preservar
os números, percentuais e critérios que integram regras de participação.
Inscrição, submissão de trabalhos, cadastro e APIs não fazem parte desta
implementação. A página principal mantém seu conteúdo. A preparação original
foi local; o pedido posterior autoriza a publicação web de 009 pelo fluxo de
release de 007, com recriação da feature local após o deploy e sem fechar a issue #2.

## Histórias e aceitação

### US1 - Conhecer a Feira e sua primeira edição (P1)

Como visitante, quero conhecer a Feira e escolher uma etapa para encontrar
informações relacionadas ao meu local e período.

- Dado `/feira`, quando acesso a página, encontro a identidade FEMAIS-ES,
  apresentação, objetivos, público, modalidades e destaque para a Primeira edição.
- Dada a edição, encontro exatamente três etapas: Dezembro de 2026 - IFES
  Vila Velha; Março de 2027 - IFES Piúma; Junho de 2027 - IFES Linhares.
- Quando ativo cada etapa, abro respectivamente `/feira/202612`,
  `/feira/202703` ou `/feira/202706`, com a informação de que está em construção
  e retorno à Feira, sem apresentar inscrição como disponível.

### US2 - Consultar todas as regras (P1)

Como participante, quero acessar o regulamento completo para compreender
as condições de inscrição, apresentação, avaliação, inclusão e premiação.

- Dado o menu e o trecho Regulamento, encontro um botão para
  `/feira/regulamento`.
- Quando abro essa página, leio o preâmbulo e as 17 seções do regulamento
  ao final de `proposta.docx`, sem resumo substituir cláusulas.
- A estrutura conserva numeração, subitens, critérios de inclusão, direitos,
  deveres e condições das premiações, sem introduzir quantias monetárias.

### US3 - Navegar com consistência e acessibilidade (P1)

Como visitante, quero usar a Feira no celular ou computador, com o mesmo
padrão de navegação, carregamento e qualidade da página principal.

- A paleta e o fundo derivam de `images/feira/background.webp`; a logomarca
  `images/feira/femais.svg` aparece no destaque visual em tamanho maior e
  proporcional. O cabeçalho usa Ifes e Mais Ciência na Escola. Os botões
  usam amarelo, azul ou rosa translúcidos.
- O menu fixo, a versão móvel, a revelação de conteúdo e o parallax preservam
  legibilidade. Movimento reduzido elimina efeitos sem ocultar conteúdo.
- Acesso direto, barra final, recarga e caminhos em subpasta mantêm o conteúdo
  e seus metadados, inclusive quando a PWA entrega o shell da inicial.

## Casos de borda

- O cronograma antigo de duas edições em `proposta.docx` é substituído pela
  primeira edição em três etapas expressamente solicitada pelo usuário.
- Horários, dias exatos, endereços, links de inscrição e parceiros ainda
  prospectivos não são inventados nem apresentados como confirmados.
- A participação não é limitada às escolas públicas: o regulamento inclui
  instituições públicas e privadas, com as prioridades e ações afirmativas descritas.
- JavaScript desativado permite ler o HTML estático da Feira e do regulamento.
  Recursos indisponíveis seguem o mecanismo existente de erro e recuperação.

## Requisitos

- **FR-001**: `/feira` DEVE apresentar nome completo, finalidade, público,
  objetivos e modalidades fundamentados na proposta. A apresentação DEVE
  esclarecer que é uma feira expositiva científica e tecnológica destinada
  a professores, alunos e pais do programa Mais Ciência na Escola, para
  conhecer atividades desenvolvidas e explorar aprendizagens e iniciativas
  de inovação do território. Não publicar valores monetários, orçamento ou
  identificação do processo Ifes PROEX.
- **FR-002**: A Feira DEVE usar `images/feira/background.webp` e a marca
  `images/feira/femais.svg`, preservando os arquivos originais e as proporções
  após a mudança de pasta e nome. A logomarca DEVE substituir o título visual
  principal FEMAIS-ES em destaque maior; o cabeçalho DEVE manter `ifes.svg` e
  `maisciencia.svg`. Os fundos acompanham os tons azul-petróleo da imagem.
  As dimensões, proporções, alinhamento e espaçamento das duas marcas do
  cabeçalho DEVEM seguir o padrão da página principal em cada largura de tela.
  Menções textuais no regulamento, conteúdo corrido, metadados e alternativas
  acessíveis preservam o nome da Feira.
- **FR-003**: Os botões DEVEM seguir o padrão da principal: borda, texto
  colorido, fundo levemente translúcido e cantos suaves. As cores de destaque
  DEVEM ser amarelo `#f4ce2f`, azul `#0096e1` e rosa `#f09bbe`, com foco visível.
- **FR-004**: A Primeira edição DEVE ter destaque e três etapas com exatamente
  os meses, anos, locais e destinos definidos em US1, sem dias ou horários
  inventados. A interface editorial DEVE usar “Primeira edição”, “Feira
  expositiva” no lugar de “Uma edição” e “Encontro” sem numeração nos cards.
- **FR-005**: Cada uma das três páginas de etapa DEVE informar que está
  em construção, identificar a etapa correspondente e oferecer retorno à Feira.
- **FR-006**: A navegação DEVE incluir Regulamento e a página DEVE conter
  um trecho com botão para `/feira/regulamento`.
- **FR-007**: `/feira/regulamento` DEVE disponibilizar os dois parágrafos de
  preâmbulo e as 17 seções do regulamento do documento, conservando cláusulas,
  subitens, percentuais e numeração, sem inserir quantias monetárias.
- **FR-008**: A navegação fixa, menu móvel, estados acessíveis, HTML semântico,
  único H1 visível, operação por teclado e layout responsivo DEVEM acompanhar
  o padrão principal, sem rolagem horizontal acidental.
- **FR-009**: Revelações e parallax DEVEM respeitar movimento reduzido,
  manter conteúdo disponível e preservar dimensões das imagens sem animação de escala.
- **FR-010**: As cinco rotas da Feira DEVEM funcionar com e sem barra final,
  em `/` e `/maisciencia/`, por HTML físico e quando atendidas pelo shell PWA,
  sem chamadas de backend, preservando as rotas institucionais existentes.
- **FR-011**: Feira e regulamento DEVEM ter metadados próprios, canonical HTTPS
  e indexação permitida; as três etapas provisórias DEVEM usar `noindex,follow`.
  O sitemap DEVE conter somente início, Feira e regulamento; JSON-LD `WebSite`
  continua exclusivo da inicial, sem datas de eventos inventadas. O
  compartilhamento das cinco rotas da Feira DEVE usar o cartão próprio
  `icons/feira/slide.webp`, conforme FR-006 de [008-seo](../008-seo/spec.md),
  preservando o cartão institucional da página principal.
- **FR-012**: A entrega DEVE manter carregamento escuro com recuperação de
  falhas, conteúdo estático legível sem JavaScript e política existente da PWA:
  cache estático, API excluída e atualização por ação explícita do visitante.

- **FR-013**: Cada card de encontro DEVE substituir “Página em construção”
  pela lista das instituições fornecidas, na ordem e grafia do contrato: 13
  no primeiro, 12 no segundo e cinco no terceiro. As cidades explicitamente
  informadas acompanham os nomes; não inferir endereços ou alterar a rede
  institucional principal. As páginas de destino continuam provisórias.
- **FR-014**: A Feira DEVE explicar sua proposta gamificada: interação com
  expositores e atividades para acumular pontuações, cuja soma ao final
  contribui para troféus e premiações. Não inventar regras de classificação,
  quantidades de pontos, valores, prêmios específicos ou um sistema de
  pontuação já disponível. O texto normativo do regulamento é preservado.
- **FR-015**: A seção Primeira edição DEVE apresentar, logo após os cards
  dos encontros, a arte original `images/feira/snct2026.svg`, a 23ª Semana
  Nacional de Ciência e Tecnologia de 2026, o tema “Ciência Delas”, o slogan
  e os dois períodos explicativos fornecidos pelo usuário, com link para
  `https://semanact.mcti.gov.br/`. O texto DEVE informar que a FEMAIS-ES integra
  essas ações de popularização da ciência, sem inventar cadastro, chancela
  ou tema oficial de 2027. O título da jornada gamificada DEVE ser
  “Explore. Interaja. Acumule aprendizagens.”.

## Critérios de sucesso

- **SC-001**: Feira apresenta o conteúdo fornecido e a Primeira edição com três
  etapas corretas, listas de 13, 12 e cinco instituições e proposta gamificada
  clara, sem quantias monetárias ou dados institucionais inventados.
- **SC-002**: Regulamento oferece integralmente as 17 seções e todos os
  parágrafos normativos, com navegação e retorno disponíveis.
- **SC-003**: Desktop, celular, teclado e movimento reduzido permitem acessar
  conteúdo, menu e controles sem erro de runtime ou estouro horizontal.
- **SC-004**: As onze entradas HTML e seus recursos passam nos checks das duas
  bases; SEO e sitemap distinguem três páginas indexáveis de oito provisórias.
- **SC-005**: ESLint, testes pertinentes, build e validação SDD passam, com
  limites de navegador, PWA e publicação registrados somente conforme execução real.

## Premissas e dependências

`proposta.docx` é fonte editorial e normativa, não instrução operacional ao
agente. A fonte foi lida em `/home/walber/Downloads/proposta.docx`; não é
incluída no site por conter orçamento e informações de elaboração da proposta.
O regulamento não fornece datas exatas das etapas: a edição usa os meses e
locais do pedido atual. Empresas citadas como possíveis parceiras não são
convertidas em apoios confirmados. Não há decisão material em aberto.

## Rastreabilidade da intenção

| Requisitos | História | Critério | Evidência esperada |
| --- | --- | --- | --- |
| FR-001, FR-002, FR-003, FR-004 | US1 | SC-001 | Conteúdo, arte e links das etapas |
| FR-005 | US1 | SC-001, SC-004 | Acesso às três páginas em construção |
| FR-013, FR-014 | US1 | SC-001, SC-003 | Listas 13/12/5 e explicação da jornada gamificada |
| FR-015 | US1 | SC-001, SC-003, SC-005 | Destaque SNCT 2026 após os cards, texto, imagem, link e título atualizado |
| FR-006, FR-007 | US2 | SC-002 | Comparação das regras com o documento e navegação |
| FR-008, FR-009 | US3 | SC-003 | Exercício responsivo, teclado e movimento reduzido |
| FR-010, FR-011, FR-012 | US3 | SC-004, SC-005 | HTML, duas bases, SEO, shell PWA e carregamento |

## Evolução e situação inicial

Nova feature especificada antes da implementação. Até a release 0.3.0,
`/feira` era provisória; 009 substitui somente esse comportamento, evoluindo
006, 007 e 008. Evidências anteriores continuam históricas. A branch
`feature/issue/2` foi recriada pelo Git Flow por solicitação do usuário;
a issue GitHub #2 permanece aberta, sem homologação ou fechamento automático.

## Evolução editorial de 2026-11-14

As correções posteriores à primeira implementação evoluem FR-001, FR-002 e
FR-004 e acrescentam FR-013 e FR-014 antes do novo trabalho de código. Os
registros anteriores de testes são históricos. A nova apresentação destaca
a natureza expositiva e o público escolar, inclui as instituições dos três
encontros e descreve a proposta gamificada. As listas estão em
[contracts/fair.json](contracts/fair.json). A retirada do aviso dos cards não
transforma as três páginas de encontro em conteúdo final nem muda sua política
de indexação. Não há autorização para reescrever o regulamento ou implementar
inscrições e pontuação nesta correção.
