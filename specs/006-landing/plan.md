# Plano: página institucional

**Feature**: `006-landing` | **Data**: 2026-10-28
**Especificação**: [spec.md](spec.md)

## Solução

Manter Vite vanilla, HTML, Tailwind CSS, Alpine.js e o plugin PWA existentes.
O documento menciona React como sugestão; a landing page não exige outro
framework. O conteúdo principal fica em HTML indexável; dados repetidos das
instituições e pessoas são separados em `web/src/data.js`. `web/src/main.js`
coordena menu, navegação, filtros, detalhes e efeitos progressivos. Não incluir
o cliente de autenticação na inicialização da página pública.

`web/index.html` apresenta a landing page em `/` e o conteúdo provisório em
`/login` e `/feira`, selecionados pelo caminho atual, incluindo barra final.
O servidor de produção deve oferecer fallback HTML para essas rotas. Não criar
formulário nem simular login ou funcionalidades da feira.

A evolução [007-web-delivery](../007-web-delivery/spec.md) substitui a dependência
de fallback por entradas HTML físicas para hospedagem estática. Conteúdo e
comportamento desta feature são preservados; a base pública pode incluir o
prefixo do site de projeto do Pages.

## Constituição e evolução

A especificação precede esta mudança, distinta das baselines retrospectivas.
A regra geral de interface em inglês recebe uma exceção específica para o
site institucional em português, autorizada pelo documento fornecido.
Identificadores, caminhos e comentários continuam em inglês. A constituição
registra a exceção com uma versão minor, pois amplia os idiomas permitidos
por escopo sem mudar a arquitetura ou os demais padrões técnicos.

A baseline `003` permanece como inventário histórico, com nota de substituição
da demonstração pública por esta feature. O serviço de autenticação, seus
controles e contratos permanecem disponíveis no backend, sem exposição nesta página.

## Apresentação e interação

- Hero com `background.webp`, sobreposição escura, texto à esquerda e controle
  do enquadramento móvel. SVGs oficiais preservam suas proporções e cores.
- Nove seções com ritmo visual próprio, cards de oficinas e indicadores.
  Ilustrações temáticas podem ser SVGs originais de caráter decorativo, sem
  representar marcas ou retratos institucionais.
- `IntersectionObserver` revela conteúdo e dispara uma única contagem por
  indicador. Um listener passivo de rolagem, limitado por `requestAnimationFrame`,
  identifica a última seção de navegação alcançada e atualiza o cabeçalho.
  O estado final permanece disponível sem efeitos.
- Parallax discreto somente no desktop e sem movimento reduzido; menu móvel
  e abas usam controles HTML com estados ARIA e foco visível.
- Busca e filtro trabalham somente com os dados fornecidos. Não consultar
  serviços externos, inferir pessoas ou preencher horários ausentes.
- Imagens e logomarcas mantêm tamanho estável. Remover a animação contínua
  das marcas e a escala das imagens das oficinas no hover, conforme FR-014.

## Abertura progressiva

Incluir em `web/index.html` estilos críticos pequenos, independentes do bundle,
para fundo escuro, indicador acessível e ocultação temporária da apresentação.
Um bootstrap executado antes de analisar o corpo habilita a espera somente
quando JavaScript está disponível. O conteúdo em preparação não deve aceitar
foco ou interações.

A inicialização coordenará estilos principais e estado Alpine antes de liberar
a apresentação. Fontes e imagem principal podem participar da preparação com
espera limitada; imagens secundárias sob demanda ficam fora desse bloqueio.
Não criar um atraso mínimo artificial quando os recursos já estiverem prontos.

Os caminhos de falha devem terminar a espera com apresentação legível ou estado
de recuperação acessível, mantendo a base escura. Sem JavaScript, não habilitar
um bloqueio que dependa dele para desaparecer. O indicador respeitará a
preferência de movimento reduzido. A implementação deve registrar os sinais e
limites efetivamente adotados para liberação e recuperação.

A folha principal é ligada no HTML com `media="print"`, para permitir pintar
o indicador antes de recebê-la; o evento de carregamento ativa `media="all"`
e resolve `stylesReady`. O frontend aguarda esse sinal e a sentinela
`--page-styled: 1` antes de exibir a interface. Fontes, marcas e imagem principal
têm orçamento adicional máximo de 1,8 segundo, sem espera mínima. Um limite
geral de oito segundos e os eventos de falha encerram o indicador com uma
mensagem e botão de recarga se a preparação não puder terminar.

Sem JavaScript, o bloqueio não é ativado. A base crítica fornece fundo escuro,
textos e links legíveis e dimensões limitadas de imagens e ícones, permitindo
consultar o conteúdo estático. O CSS principal continua sendo compilado pelo
Vite; não se acrescenta uma folha bloqueante duplicada no build.

## Matriz de rastreabilidade

| Requisito | Solução e caminhos |
| --- | --- |
| FR-001 | Conteúdo de `web/index.html`, `web/src/data.js`, idioma e uso de hífen simples em textos e rótulos |
| FR-002 | Imagens originais em `web/public/images/`, HTML e estilos |
| FR-003 | Cabeçalho HTML e estado/observers em `web/src/main.js`; rótulo Projeto nos menus e rodapé, e PROJETO na seção, em `web/index.html` |
| FR-004 | Nove seções em `web/index.html`; Atividades Semanais com atividades extracurriculares orientadas, sem carga horária fixa |
| FR-005 | Indicadores HTML e contagem progressiva no módulo principal |
| FR-006 | Título, categoria, cards sem datas e links de ambientes virtuais em `web/index.html`; ilustrações temáticas |
| FR-007 | Dados de instituições, abas, busca, filtro e painéis Alpine |
| FR-008 | Listas em `web/src/data.js`, incluindo Marcelene Alves Duarte em Matemática, e estados sem dados não fornecidos |
| FR-009 | Seção de apoio com dois projetos, processos CNPq e valores individuais; faixa com somente a imagem `web/public/images/apoio.svg` centralizada; rodapé sem referência ao processo Ifes PROEX |
| FR-010 | Seleção de caminho e apresentações provisórias de `/login` e `/feira`, com retorno ao site e sem cliente de API |
| FR-011 | HTML, CSS responsivo e comportamento de redução de movimento |
| FR-012 | Head SEO, `web/vite.config.js`, recursos estáticos, quatro ícones PNG derivados de `web/public/favicon.svg` e atualização PWA |
| FR-013 | CSS crítico e bootstrap em `web/index.html`, coordenação de prontidão e recuperação do frontend |
| FR-014 | Remoção de animações e transformações de escala das imagens em `web/src/style.css` |
| FR-015 | Links Feira em `web/index.html`, variações rosa em `web/src/style.css` e seleção da apresentação provisória em `web/src/main.js` |

## Validação planejada

Executar ESLint, build e `python3 scripts/validate-specs.py`. Testes de filtros
devem cobrir composição de busca, aba e município, inclusive acentos e estado
vazio, se implementados em funções isoláveis. Verificar com navegador disponível
o layout móvel/desktop, links, menu, abas, expansão, `/login`, foco e ausência de
pedidos de API. A execução de navegador e a instalação/offline PWA são evidências
distintas; os resultados efetivos pertencem a [verification.md](verification.md).

Para a evolução de abertura, observar o primeiro frame com CSS ou módulo
atrasado, a liberação após prontidão, falhas de recursos, JavaScript desativado
e movimento reduzido. Registrar separadamente esses resultados; as verificações
anteriores não comprovam o novo estado de carregamento.

## Evolução: oficinas práticas e ambientes virtuais

Substituir o início do título por “Oficinas práticas”, retirar os três blocos
de período e suas datas e apresentar “Ambiente virtual” com links HTTPS
para Letreirama, Foguetrõnica e Tecidade, na sequência definida em FR-006.
A categoria de foguetes passa a “FÍSICA + MATEMÁTICA”. Preservar descrições
e atividades de culminância. Links devem ser reconhecíveis, operáveis por
teclado e associados aos destinos fornecidos; não pressupõem disponibilidade
ou criação de conteúdo nesses serviços externos.

## Evolução: projetos aprovados

Apresentar o rótulo “PROJETOS APROVADOS” e duas entradas semânticas
`article.approved-project` no bloco `project-record` de `web/index.html`.
Cada entrada tem título e lista de descrição com “Processo CNPq” e “Valor”.
Os processos e valores são vinculados ao título correspondente conforme
`contracts/ui.json`; preservar sua leitura em telas pequenas. Os dados foram
fornecidos pelo usuário e não exigem consulta a serviço externo. Não somar os
valores aos indicadores globais nem reintroduzir o processo Ifes PROEX.

## Evolução: imagem dos apoios

Apresentar somente a imagem com `src="/images/apoio.svg"` em `.institution-row`,
conforme a revisão do usuário que retira também o bloco Ifes/Mais Ciência dessa
linha. Preservar o SVG fornecido e sua proporção de 1000 por 80, sem recortes,
filtros ou animação de escala. Centralizar a imagem com largura máxima de 1000 px
e largura responsiva nas telas menores. Remover o separador lateral e os estilos
exclusivos do bloco retirado. Usar texto alternativo com as instituições
representadas e manter o recurso no contrato e no cache estático PWA existente.

## Evolução: ícones da aplicação

Rasterizar o SVG fornecido em `web/public/favicon.svg` com Inkscape local,
mantendo os caminhos e cores originais. Gerar `apple-touch-icon.png` com 180 px,
`pwa-192x192.png` com 192 px e os dois arquivos PWA de 512 px nos caminhos
existentes de `web/public/icons/`. As versões PWA comuns preservam a transparência
externa da origem; Apple Touch e maskable usam o fundo cinza opaco `#4d4d4d`
da arte. Conferir que toda a marca da versão maskable cabe no círculo central
de raio 204,8 px. Não alterar `favicon.svg` nem o sprite de símbolos da interface.
Os links HTML e o manifesto já apontam aos arquivos pedidos; conferir sua
presença no build e no precache PWA. Registrar inspeção visual e limites reais.

## Evolução: acesso à feira

Manter o documento único com Alpine e acrescentar o estado `isFair` e o estado
derivado `isPlaceholder` para compartilhar a apresentação provisória, sem mudar
o conteúdo de `/login`. `/feira` recebe título, descrição e detalhes rosa; usa
o mesmo retorno ao site e não inicializa chamadas de API.

Adicionar um link nativo “Feira” no cabeçalho e no menu móvel com o formato de
`header-app` e uma variação rosa. No hero, inserir um botão rosa logo depois de
“Conheça Mais”, preservando o acesso ao Aplicativo. Usar o rosa `#d94b91` do tema
em borda, fundo e foco, com texto claro para contraste. Ajustar espaçamento da
navegação na faixa intermediária e permitir quebra de linha dos botões do hero.
Conferir os três links, acesso direto e com barra final, retorno, regressão de
`/login`, menu, foco e larguras desktop/móvel no navegador.
