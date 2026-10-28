# Especificação: página institucional

**Feature**: `006-landing` | **Data**: 2026-10-28
**Estado**: especificada antes da implementação; execução em `verification.md`.
**Origem**: documento “PROMPT COMPLETO — LANDING PAGE IFES MAIS CIÊNCIA NA ESCOLA”
fornecido pelo usuário e pedido para implementar a página inicial.

## Objetivo e escopo

Apresentar o Ifes Mais Ciência na Escola em uma página institucional completa,
responsiva e predominantemente escura. O visitante deve compreender o projeto,
seu alcance, as oficinas, a rede participante, a equipe e o apoio institucional.
O conteúdo público é apresentado em português do Brasil, conforme o pedido
específico desta página; nomes técnicos, código e comentários continuam em inglês.

Esta é uma mudança nova que substitui a demonstração de sessões e saúde da
página inicial inventariada em `003-web-pwa`. A autenticação do backend continua
fora desta página pública; `/login` e `/feira` apresentam somente as mensagens
provisórias pedidas, em português do Brasil.

Os caminhos desta especificação são relativos à base pública do site.
[007-web-delivery](../007-web-delivery/spec.md) acrescenta hospedagem no prefixo
do GitHub Pages e entradas HTML físicas, preservando esta apresentação.

## Histórias e aceitação

### US1 — Conhecer o projeto e suas oportunidades (P1)

Como visitante, quero compreender a iniciativa e navegar pelas suas seções
para conhecer sua proposta, atividades e rede de colaboração.

- Dada a página inicial, quando a abro, então vejo as marcas fornecidas, a
  ilustração da jovem cientista e o título institucional em português.
- Dada a navegação, quando escolho um link interno, então alcanço a seção
  correspondente e identifico a seção ativa, também no menu móvel.
- Dadas as oficinas, quando leio seus cards, então encontro os três temas,
  descrições, ambientes virtuais e atividades de culminância fornecidos,
  sem períodos vinculados a um ano específico.

### US2 — Encontrar instituições e pessoas (P1)

Como visitante, quero explorar instituições e equipe para compreender quem
participa, sem receber informações inventadas sobre os vínculos.

- Dada a lista de instituições, quando alterno escolas e campi, então encontro
  os 21 e os nove registros fornecidos, respectivamente.
- Dada uma aba, quando busco por nome ou filtro por município, então vejo
  somente os resultados correspondentes e uma indicação se nenhum for encontrado.
- Dada uma instituição, quando abro seus detalhes, então vejo somente dados
  disponíveis. Endereços, horários e pessoas ausentes não são deduzidos.
- Dada a seção de equipe, quando a consulto, então vejo os três coordenadores
  e os seis colaboradores informados, com suas funções e sem fotos fictícias.

### US3 — Usar a página em diferentes dispositivos (P1)

Como visitante, quero uma página legível e utilizável por toque ou teclado
para acessar seu conteúdo em celular ou computador.

- Dada uma tela pequena, quando navego, então o conteúdo se reorganiza sem
  rolagem horizontal acidental e o menu abre e fecha por controle acessível.
- Dada a preferência por movimento reduzido, quando acesso o site, então
  acesso o mesmo conteúdo sem depender de animação, parallax ou contagem.
- Dado um navegador compatível, quando entra uma nova versão da PWA, então
  recebo uma ação explícita de atualização; respostas da API ficam fora do cache.
- Dado o primeiro acesso, quando estilos e interface ainda estão sendo preparados,
  então vejo imediatamente um fundo escuro e uma indicação acessível de
  carregamento, sem marcas ampliadas ou conteúdo desformatado.
- Dada a interface pronta, quando a preparação termina, então o conteúdo aparece
  sem espera artificial. Recursos lentos ou indisponíveis não mantêm um bloqueio
  indefinido; sem JavaScript, o conteúdo estático continua acessível.

### US4 — Acessar os ambientes em preparação (P2)

Como visitante, quero entender a disponibilidade do aplicativo e da feira
para saber que seus ambientes ainda estão em preparação.

- Dado o botão Aplicativo, quando o ativo, então chego a `/login` com título
  “Acesso ao Aplicativo”, a mensagem de disponibilidade futura e retorno ao site.
- Dada a página inicial, quando procuro a feira, então encontro o botão “Feira”
  em rosa no cabeçalho desktop e no menu móvel e ao lado de “Conheça Mais”.
- Dado um desses botões, quando o ativo, então chego a `/feira`, com o título
  “Feira”, a mensagem “A página da feira está em construção. Em breve, você
  encontrará aqui mais informações.” e um botão para voltar ao site.
- Dada a página pública ou provisória, quando a abro, então não são enviados
  pedidos de sessão, saúde ou autenticação ao backend.

## Requisitos

- **FR-001**: A página DEVE apresentar em português do Brasil o conteúdo
  institucional fornecido, mantendo código, caminhos e identificadores em inglês.
  Os textos públicos, incluindo rótulos acessíveis, DEVEM usar hífen simples
  no lugar do caractere de travessão, conforme a revisão solicitada.
- **FR-002**: A composição DEVE usar a paleta escura, as marcas SVG originais
  no cabeçalho e rodapé e `background.webp` com a personagem à direita, sem
  recriar marcas governamentais ou fotografias de profissionais.
- **FR-003**: A navegação DEVE ser fixa, adaptar-se à rolagem, indicar a seção
  ativa e oferecer menu móvel com abertura e fechamento acessíveis.
  Os links da seção de projeto DEVEM usar “Projeto” nos menus e no rodapé;
  a identificação da seção DEVE usar “PROJETO”, sem o artigo inicial.
- **FR-004**: A página DEVE conter início, projeto, impacto, metodologia,
  oficinas, instituições, equipe, apoio e encerramento, além de rodapé.
  Em “Atividades Semanais”, a metodologia DEVE descrever atividades
  extracurriculares orientadas, sem fixar uma carga horária semanal.
- **FR-005**: Os indicadores DEVEM comunicar os números fornecidos: 21 escolas,
  nove campi, 11 municípios, 300 estudantes e R$ 3 milhões de investimento
  global, com contagem progressiva uma vez ao entrar na área visível quando
  o movimento não estiver reduzido.
- **FR-006**: A seção DEVE usar o título “Oficinas práticas. Muitas possibilidades
  de descoberta.” e apresentar as três oficinas fornecidas com suas respectivas
  atividades de culminância. Os cards DEVEM substituir períodos e datas por
  “Ambiente virtual”, com Letreirama (`https://www.letreirama.com.br/`) para
  Ler um Livro com Jogos; Foguetrõnica (`https://www.foguetronica.com.br/`) para
  Lançar Foguetes com Precisão; e Tecidade (`https://www.tecidade.com.br/`) para
  Melhorar a Cidade com Eletrônica. A categoria da oficina de foguetes DEVE ser
  “FÍSICA + MATEMÁTICA”.
- **FR-007**: A rede DEVE oferecer abas, busca por instituição, filtro por
  município, cards e detalhes expansíveis para as 21 escolas e os nove campi.
- **FR-008**: Pessoas, vínculos e informações complementares DEVEM limitar-se
  ao conteúdo fornecido. A equipe DEVE conter coordenação, colaboração e duas
  áreas expansíveis das redes, sem nomes ou dados institucionais inventados.
  A colaboração DEVE apresentar Marcelene Alves Duarte, com a função
  “Colaboração em Matemática”, conforme a substituição solicitada pelo usuário.
- **FR-009**: O apoio DEVE identificar MCTI, CNPq e FNDCT, a chamada e uma área
  “PROJETOS APROVADOS” com os dois projetos, processos CNPq e valores fornecidos
  abaixo, omitindo a referência ao processo Ifes PROEX em toda a página.
  A faixa de instituições DEVE apresentar somente a imagem fornecida `apoio.svg`,
  centralizada, inteira, proporcional e com texto alternativo que identifique os
  apoios representados, sem as marcas Ifes/Mais Ciência nessa linha.
  O rodapé DEVE apontar ao Instagram
  `@ifesmaisciencia`, sem inventar contatos ou outras redes.
- **FR-010**: `/login` e `/feira` DEVEM exibir somente suas apresentações
  provisórias e o botão de retorno ao site, inclusive no acesso direto e com
  barra final. A página pública e as provisórias DEVEM operar sem chamadas ao
  backend. `/login` mantém seu conteúdo; `/feira` apresenta o título e mensagem
  definidos em US4, em português do Brasil.
- **FR-011**: A página DEVE usar HTML semântico, um único H1 por rota visível,
  rótulos e estados acessíveis, foco visível, operação por teclado, redução
  de movimento e comportamento responsivo sem depender dos efeitos visuais.
- **FR-012**: A entrega DEVE incluir título e descrição SEO fornecidos,
  metadados em português e cache PWA de recursos estáticos, mantendo a API
  excluída e a atualização dependente de ação explícita do visitante.
  Os quatro ícones PNG da aplicação DEVEM reproduzir a marca e as cores de
  `web/public/favicon.svg`: Apple Touch com 180 por 180 px, PWA com 192 e
  512 px e maskable com 512 px. Apple Touch e maskable DEVEM ter fundo opaco;
  a marca da versão maskable DEVE permanecer dentro da área circular central
  com raio de 40% da largura. O sprite `interface.svg` permanece independente.
- **FR-013**: A abertura DEVE apresentar fundo escuro e indicador acessível de
  carregamento antes de exibir a interface preparada, evitando o flash de
  conteúdo sem estilos. O conteúdo oculto não deve receber foco; a liberação
  deve ocorrer assim que os recursos essenciais estiverem prontos, com espera
  limitada e recuperação legível em falhas. Movimento reduzido e acesso sem
  JavaScript DEVEM continuar atendidos.
- **FR-014**: As imagens e logomarcas DEVEM manter seu tamanho estável, sem
  animação de crescimento e redução nem ampliação ao passar o ponteiro.
- **FR-015**: A página DEVE oferecer links “Feira” para `/feira`, com aparência
  de botão e detalhes na cor rosa do tema, no cabeçalho desktop, no menu móvel
  e imediatamente depois de “Conheça Mais” no hero. O botão do cabeçalho DEVE
  seguir o formato de Aplicativo. Os botões DEVEM ter foco visível e permitir
  reorganização em telas estreitas sem sobreposição ou rolagem horizontal.

### Projetos aprovados de FR-009

| Projeto | Processo CNPq | Valor |
| --- | --- | --- |
| Ler um Livro como uma Experiência de Aprendizagem sobre Pensamento Computacional por meio de Programação de Jogos Digitais | 441618/2024-3 | R$ 3 milhões |
| FEMAIS-ES: Feira Estadual Mais Ciência na Escola do Espírito Santo | 401593/2026-6 | R$ 210 mil |

Os valores pertencem a cada projeto. Esta apresentação não recalcula os
indicadores globais nem deduz um novo investimento total.

## Critérios de sucesso

- **SC-001**: As nove seções e a navegação correspondente são encontradas com
  os textos e dados fornecidos, sem conteúdo institucional fabricado.
- **SC-002**: As duas abas apresentam 21 escolas e nove campi; busca, filtro,
  estado vazio e expansão de detalhes respondem corretamente.
- **SC-003**: As larguras de celular e desktop permitem navegar, ler e acionar
  controles sem estouro horizontal; o conteúdo permanece disponível com movimento reduzido.
- **SC-004**: Os três links Feira abrem `/feira`; o acesso direto a `/login`,
  `/feira` e suas variantes com barra final e o retorno ao site funcionam sem
  pedidos de API ou formulário de autenticação.
- **SC-005**: ESLint, build e validação estrutural SDD passam; evidências de
  navegador, instalação e offline são registradas somente quando executadas.
- **SC-006**: Em acesso inicial com recursos atrasados, o navegador mostra o
  estado escuro de carregamento antes do conteúdo e libera a página pronta.
  Falha de recursos, movimento reduzido e JavaScript desativado não deixam
  a pessoa presa em uma tela de espera.

## Premissas e esclarecimento

React é uma tecnologia sugerida no documento, não uma exigência de migração.
A arquitetura acordada em Vite, Tailwind CSS e Alpine.js é mantida.

Em 2026-10-28, o usuário confirmou continuar com as instituições e equipe já
informadas. `site.docx` não está disponível; endereços, horários, cursos,
supervisores e monitores não fornecidos ficam de fora. Os cards das oficinas
não exibem períodos ou datas fixas, permitindo reutilizar a apresentação em
outros anos.

Os indicadores e processos reproduzem o material fornecido e não representam
uma auditoria externa. A publicação em hospedagem e mudanças do backend não
integram esta implementação local.

Em 2026-10-28, o usuário relatou a exibição temporária de logomarcas, fundos
brancos e conteúdo sem formatação antes do CSS. A evolução de carregamento
é registrada nesta especificação viva, mantendo os requisitos e as evidências
anteriores. O objetivo é preparar a apresentação, sem impor duração mínima
ao carregamento nem aguardar imagens secundárias carregadas sob demanda.

Em 2026-10-28, o usuário solicitou retirar o efeito de crescimento e redução
das imagens. Essa decisão substitui a animação de escala sugerida no documento
original; as revelações e os deslocamentos já existentes não ampliam imagens.

Em 2026-10-28, o usuário solicitou retirar da página a identificação do processo
Ifes PROEX. A apresentação do apoio e o rodapé seguem essa atualização de FR-009.

Em 2026-10-28, o usuário solicitou a revisão de FR-006 para tornar os cards
independentes de períodos anuais e associar cada oficina ao ambiente virtual
fornecido. “Foguetrõnica” preserva a grafia solicitada; “Tecidade” é o rótulo
inferido do domínio fornecido. A disponibilidade dos destinos não foi verificada.
