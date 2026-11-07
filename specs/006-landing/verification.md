# Verificação: página institucional

**Data**: 2026-10-28. Especificação escrita antes da implementação. Resultados
locais executados nesta entrega; não representam homologação humana.

## Rastreabilidade

| Requisito | Verificação prevista | Estado |
| --- | --- | --- |
| FR-001 | Idioma da interface e preservação de nomes técnicos em inglês | Interface pt-BR, dados e fontes inspecionados; metadados conferidos em Chrome. |
| FR-002 | Marcas originais, hero fornecido e composição responsiva | SVGs fornecidos preservados; três ilustrações temáticas, fontes locais e enquadramento conferidos em Chrome. |
| FR-003 | Navegação, seção ativa, rolagem e menu móvel | Estado ativo, cabeçalho rolado, menu, Escape e retorno de foco passaram em Chrome. |
| FR-004 | Nove seções, cabeçalho e rodapé | DOM e conteúdo conferidos; nove seções e um H1. |
| FR-005 | Cinco indicadores exatos, contagem e estado final com movimento reduzido | Valores finais observados em Chrome; observer e proteção contra repetição inspecionados. |
| FR-006 | Oficinas práticas, selos sem números, botões internos e culminâncias | Três botões Saiba mais com raio de 6 px, borda e texto na cor do card e fundo translúcido conferidos na fonte, build e Chrome. Destinos e culminâncias preservados. |
| FR-007 | Contagem 21/9, busca, filtro, abas, detalhes e estado vazio | Sete testes Node passaram; fluxos interativos passaram em Chrome. |
| FR-008 | Pessoas e dados limitados ao material fornecido | Marcelene Alves Duarte substitui o suporte em Informática na colaboração; função e iniciais atualizadas. Mantidas três pessoas na coordenação e seis na colaboração. |
| FR-009 | Identificações, faixa de apoios, projetos, Instagram e parceria Profe | Projetos e faixa conferidos; parceria com nome e CNPJ exatos dentro do mesmo parágrafo da missão em footer-identity, inclusive em 320 px. Processo Ifes PROEX continua ausente. |
| FR-010 | Seis páginas provisórias, variantes com barra final, retorno e ausência de API | Aplicativo, feira e quatro rotas de oficinas conferidos nas duas bases, com H1 e mensagens próprios; retorno e acesso direto passaram no Chrome. |
| FR-011 | Layout, teclado, semântica, foco e movimento reduzido | Chrome em 1440, 390 e 320 px, teclado das abas, Escape, foco e redução de movimento passaram. |
| FR-012 | Head SEO, locale PWA, cache estático e atualização explícita | Build e manifesto pt-BR com 26 entradas; navegação estática offline passou no Chrome. Instalação e ciclo de atualização não executados. |
| FR-013 | Fundo crítico, indicador, prontidão, foco e recuperação | Sete cenários novos de carregamento passaram no Chrome; script inline aprovado pelo ESLint. |
| FR-014 | Ausência de animação de escala nas marcas e nas imagens das oficinas | Animação das marcas, atraso associado, keyframes e zoom de hover removidos; busca no CSS e build conferidos. |
| FR-015 | Três links Feira e abertura somente com Feira rosa e Aplicativo verde | Hero sem Conheça Mais; cores, borda e raio iguais aos botões do cabeçalho conferidos no Chrome em 1440, 390 e 320 px. Cliques nos dois botões do hero e retorno passaram. |

## Execução local

| Verificação | Resultado observado | Alcance |
| --- | --- | --- |
| `npm run lint`, em `web` | Passou | ESLint do frontend e dos testes Node. |
| `npm test`, em `web` | Sete testes passaram | Contagens, acentos, busca, composição de filtros, opções de municípios, imutabilidade e estado vazio. |
| `npm run build`, em `web` | Passou; PWA com 26 entradas e cerca de 536 KiB de precache | Artefatos estáticos e manifesto; sem inferir instalação. |
| `python3 scripts/validate-specs.py` | Passou: seis features, 54 requisitos e 48 tarefas | Estrutura e rastreabilidade, sem aprovação semântica automática. |
| Script oficial de pré-requisitos com `SPECIFY_FEATURE_DIRECTORY=specs/006-landing` | Feature, plano e tarefas reconhecidos | Integração genérica; sem despacho automático de workflow. |
| Inspeção de dados, HTML, SVGs, contratos e links | Sem omissões materiais ou destinos ausentes | Comparação com o material fornecido, sem fontes institucionais adicionais. |
| Automação final no Chrome local | 21 verificações passaram; zero erros de runtime, recursos com falha ou chamadas de API | Navegação e interações reais no navegador, em desktop e viewports móveis emulados. |

O servidor Vite foi executado localmente em `127.0.0.1:5173`. A validação usou
Chrome headless real por DevTools, com automação temporária sem instalar novas
dependências no projeto. Foram verificadas navegação ativa, mudanças de aba,
busca sem acentos, filtro por município, estado vazio, detalhes, teclado,
menu móvel, Escape com foco restituído, indicadores, `/login` e retorno.

Em desktop, a área útil de 1425 px tinha `scrollWidth` de 1425 px; nos viewports
móveis de 390 e 320 px, o documento manteve exatamente essas larguras. Foram
inspecionadas capturas do hero, oficinas e versão móvel. As conferências
identificaram e corrigiram ícones sem traço herdado e o enquadramento móvel.
Na preferência de movimento reduzido, animações e parallax ficaram desativados
e o conteúdo permaneceu visível.

Os scripts temporários de navegador exigiram ajustes nos seletores de elementos
visíveis e no posicionamento de cliques durante rolagem suave. Essas falhas de
automação foram diferenciadas dos comportamentos da página. A reprodução manual
dos fluxos está em [quickstart.md](quickstart.md).

## Build de produção e cache offline

O build final foi servido com `npm run preview -- --host 127.0.0.1 --port 4173
--strictPort`. Em um perfil novo do Chrome, o service worker foi registrado e
ativado. Depois, a rede foi desativada pela emulação do navegador. Uma navegação
nova para `/login` apresentou a mensagem provisória; o retorno a `/` carregou a
página e a troca para a aba de campi apresentou os nove registros sem rede.
Foram observadas 40 respostas atendidas pelo service worker e zero erros de
runtime nesse exercício. Não se trata de login autenticado offline.

Essa evidência confirma a navegação estática testada após o primeiro acesso
online. Não comprova instalação no sistema operacional nem o ciclo de detecção
e aceitação de uma nova versão. Os servidores usados para verificação foram
encerrados depois dos testes; não houve publicação remota.

## Evolução: carregamento e imagens estáveis

Em 2026-10-28, a apresentação inicial foi verificada novamente em Chrome real
com sete cenários: abertura normal com 21 instituições; CSS pausado; módulo
pausado; falha de CSS seguida de recarga; fontes e imagem principal atrasadas;
movimento reduzido; JavaScript desativado. Todos passaram sobre o build servido
localmente. A captura com CSS pausado mostrou o indicador em fundo escuro e
o conteúdo oculto. A liberação ocorreu após a retomada dos recursos.

A falha de CSS apresentou mensagem e botão de recarga, que recuperou a página.
Fontes e imagem atrasadas não mantiveram a interface indefinidamente bloqueada.
Sem JavaScript, o conteúdo estático permaneceu visível sobre a base escura.
O cenário normal não apresentou exceções. O cronômetro de oito segundos com
módulo permanentemente indisponível foi inspecionado no código, sem exercício
específico de duração; a recuperação exercitada foi a falha de CSS.

O ESLint do frontend e do bootstrap extraído do HTML passou. O build final
passou após retirar a animação contínua e a ampliação no hover das imagens.
A busca no CSS não encontrou chamadas de `scale()` nem `brand-breathe`.
O validador SDD passou com seis features, 56 requisitos e 52 tarefas.

## Evolução: retirada da referência ao processo Ifes PROEX

Em 2026-10-28, foram removidas as duas referências da página: a identificação
na seção de apoio e o parágrafo do rodapé. O processo CNPq foi preservado.
O build Vite/PWA passou e a inspeção da fonte pública e do HTML gerado confirmou
a ausência do identificador e de sua legenda. Não foi necessário alterar código
JavaScript ou acrescentar testes para essa remoção de texto.

## Evolução: pontuação da página

Em 2026-10-28, quatro travessões foram substituídos por hífen simples no
conteúdo institucional e nos rótulos acessíveis das marcas. A busca nas fontes
públicas não encontrou variantes codificadas ou geradas dinamicamente. O build
Vite/PWA passou e o HTML gerado foi conferido sem o caractere substituído.
Não foram acrescentados testes para essa alteração de texto.

## Evolução: oficinas práticas e ambientes virtuais

Em 2026-10-28, o usuário solicitou alterar o título da seção, retirar os três
períodos previstos e apresentar os ambientes virtuais fornecidos. A categoria
de foguetes passa a “FÍSICA + MATEMÁTICA”. A fonte e o HTML do build foram
conferidos com os três destinos do contrato, rótulos “Ambiente virtual”, abertura
em nova aba e `rel="noopener noreferrer"`. Os períodos e a categoria anterior
não aparecem na página; as três atividades de culminância foram preservadas.
Os links recebem destaque, sublinhado e área de interação de 44 px de altura.

`npm run lint`, `npm run build` e `python3 scripts/validate-specs.py` passaram.
A validação estrutural registrou seis features, 56 requisitos e 55 tarefas.
Não foram acrescentados testes de comportamento para essa revisão de conteúdo.
Disponibilidade e conteúdo dos sites externos não foram verificados.

## Evolução: dois projetos aprovados

Em 2026-10-28, o usuário solicitou a área “PROJETOS APROVADOS” com duas entradas:
o projeto de leitura e jogos, processo CNPq 441618/2024-3 e R$ 3 milhões; e
FEMAIS-ES, processo CNPq 401593/2026-6 e R$ 210 mil. O contrato preserva os
títulos completos e associa cada valor ao respectivo processo. A página apresenta
duas entradas com campos “Processo CNPq” e “Valor”, separadas visualmente e com
metadados que permitem quebra de linha. Os indicadores globais foram preservados.

Os dois títulos, processos e valores foram comparados ao contrato na fonte e no
HTML gerado. A legenda singular foi removida e não houve reintrodução de processo
Ifes PROEX ou travessão. `npm run lint`, `npm run build` e a validação estrutural
SDD passaram; o validador registrou seis features, 56 requisitos e 56 tarefas.
Não foram acrescentados testes para essa revisão de conteúdo nem executada
nova conferência em navegador.

## Evolução: colaboração em Matemática

Em 2026-10-28, o registro `collaborator-6` foi atualizado para Marcelene Alves
Duarte, com função “Colaboração em Matemática” e iniciais `MD`. A importação dos
dados conferiu nome, função, iniciais e a manutenção das contagens da equipe.
A busca nas fontes públicas não encontrou outras referências ao colaborador
substituído; o novo build contém o nome atualizado e não contém o anterior.

ESLint, build Vite/PWA e validação SDD passaram. Não foram acrescentados testes
para essa atualização de dados, nem realizada nova conferência em navegador.

## Evolução: atividades extracurriculares orientadas

Em 2026-10-28, o texto de “Atividades Semanais” foi substituído pela redação
fornecida sobre atividades extracurriculares orientadas, retirando a carga
horária fixa. A nova frase foi conferida na fonte e no HTML gerado; a anterior
não permanece nesses arquivos. O build Vite/PWA e a validação estrutural SDD
passaram. Não foram acrescentados testes ou executado novo teste em navegador
para essa atualização de texto.

## Evolução: rótulo Projeto

Em 2026-10-28, os links dos menus desktop e móvel e do rodapé passaram a
“Projeto”; a identificação da seção passou a “PROJETO”. As quatro alterações
foram conferidas na fonte e no HTML gerado, preservando as frases corridas
com “o projeto”. O build Vite/PWA passou. Não foram acrescentados testes
ou executada nova conferência em navegador para essa revisão de texto.

## Evolução: imagem dos apoios

Em 2026-10-28, as três colunas textuais MCTI, CNPq e FNDCT foram substituídas
pela imagem fornecida `web/public/images/apoio.svg`. O primeiro bloco Ifes/Mais
Ciência foi preservado. A arte permanece inteira, branca sobre o fundo escuro,
com proporção de 1000 por 80 e texto alternativo com CNPq, FNDCT, Ministério
da Educação, Ministério da Ciência, Tecnologia e Inovação e Governo do Brasil.
Foram removidos os estilos específicos das colunas substituídas.

`npm run lint` e `npm run build` passaram. Fonte e HTML gerado foram comparados
ao contrato; o SVG do build é idêntico ao arquivo fornecido e está no precache
PWA. O build registrou 27 entradas. Não foi repetido o exercício offline.

O preview de produção foi conferido em Chrome headless nas larguras de 1440,
768, 390 e 320 px, com movimento reduzido. A imagem carregou, manteve sua
proporção, não recebeu animação ou transformação e permaneceu dentro da largura
útil. Não houve rolagem horizontal da página ou exceções de runtime. Nas telas
pequenas, a faixa ocupa uma linha abaixo do bloco inicial; suas marcas são
reduzidas proporcionalmente. Capturas de desktop e celular foram inspecionadas.
Um erro de sintaxe no script temporário de automação foi corrigido antes da
execução completa; ele não pertencia ao código da página. Não foram adicionados
testes permanentes para essa mudança de apresentação.

A validação estrutural SDD passou com seis features, 56 requisitos e 60 tarefas;
`git diff --check` também passou. O preview local foi encerrado após a conferência.

## Evolução: somente apoio.svg na faixa

Em 2026-10-28, a revisão posterior do usuário retirou também as marcas Ifes e
Mais Ciência da linha de apoio. A faixa agora contém somente `apoio.svg`, com
largura responsiva e máxima de 1000 px, centralizada e sem separador lateral.
Foram removidos o bloco HTML e os estilos exclusivos das marcas nessa linha.
O contrato foi sincronizado com essa nova intenção; a evidência anterior
registra a apresentação que existia antes dessa revisão.

`npm run lint` e `npm run build` passaram. Fonte e HTML gerado foram conferidos:
a faixa contém uma única imagem, com o caminho e texto alternativo do contrato;
as marcas Ifes e Mais Ciência permanecem no cabeçalho e rodapé. O SVG do build
é idêntico ao fornecido. Não foram acrescentados testes permanentes nem repetida
a conferência em navegador para essa remoção e ajuste de alinhamento.

## Evolução: ícones derivados do favicon

Em 2026-10-28, os quatro PNGs de `web/public/icons/` foram rasterizados com
Inkscape 1.4.3 a partir do `web/public/favicon.svg` fornecido: Apple Touch com
180 por 180 px, PWA com 192 e 512 px e maskable com 512 px. A marca branca
com detalhes verde, azul, amarelo e vermelho e fundo cinza foi inspecionada
visualmente nos quatro arquivos. As cores e dimensões foram conferidas em
Pillow, sem redesenhar a arte.

Apple Touch e maskable têm todos os pixels opacos. As versões PWA comuns
preservam a transparência externa dos cantos arredondados do SVG. A marca
maskable ocupa raio máximo de 173,33 px, dentro do círculo seguro de raio
204,8 px. Essa medição tolera dois níveis por canal para distinguir o fundo
cinza de seus pixels de antialiasing; a primeira comparação exata havia
classificado nove pixels cinza da borda como parte da marca. O SVG da origem
e `interface.svg` foram preservados, conforme comparação SHA256 anterior e
posterior à exportação.

`npm run build` passou. Os quatro arquivos do build são idênticos aos PNGs
exportados e constam no precache. O link Apple Touch e os tamanhos e propósitos
dos ícones no manifesto foram conferidos; os caminhos existentes foram mantidos.
O Inkscape emitiu avisos de cache de fontes e configuração sem escrita no
sandbox; a arte é composta de caminhos vetoriais e os arquivos foram gerados
e conferidos. Não foram repetidos testes de instalação, atualização ou offline
em navegador, nem adicionados testes permanentes para essa troca de imagens.

## Evolução: botões e página provisória da feira

Em 2026-10-28, foram adicionados links nativos “Feira” no cabeçalho desktop,
no menu móvel e imediatamente depois de “Conheça Mais” no hero. Os botões usam
borda e fundo com o rosa `#d94b91`, texto claro e foco em rosa. O formato do
cabeçalho acompanha Aplicativo. O hero mantém também o acesso ao Aplicativo e
permite quebra de linha dos botões em telas menores.

`/feira` e `/feira/` apresentam o título “Feira”, a mensagem de página em
construção do contrato e um botão de retorno, com detalhes rosa. O estado
compartilhado `isPlaceholder` mantém a apresentação de `/login` e desativa as
seções públicas nas duas rotas provisórias. README, arquitetura e roteiro local
documentam o fallback HTML para essas rotas e seu conteúdo em português.

ESLint e build Vite/PWA passaram. Fonte e HTML gerado contêm os três links;
as revisões anteriores de textos foram preservadas. O build final registrou
27 entradas de precache. A validação estrutural SDD passou com seis features,
57 requisitos e 65 tarefas; `git diff --check` também passou.

O build servido localmente foi conferido em Chrome headless nas larguras de
1440, 1024, 951, 950, 768, 390 e 320 px. Página inicial, `/feira`, `/feira/`,
`/login` e `/login/` permaneceram sem rolagem horizontal em todas essas larguras.
Os três botões Feira foram acionados por cliques reais e abriram a rota correta.
Título, descrição, H1 único visível, mensagem e retorno passaram. O menu móvel
abriu com Enter e fechou com Escape, devolvendo foco ao controle. As cores
computadas confirmaram os detalhes rosa. Capturas do hero e da feira em desktop
e celular foram inspecionadas.

O exercício não registrou chamadas de API/Fetch/XHR, exceções de runtime,
erros de console, falhas de rede ou respostas HTTP de erro. O script temporário
de automação exigiu ajustes para troca de contexto, síntese de Enter e espera
da transição do menu; a execução final passou sem mudanças na implementação
motivadas por esses ajustes. Não foram adicionados testes permanentes nem
repetidos os testes de instalação e offline nesta evolução.

A inspeção visual identificou o texto auxiliar “Abrir menu” desenhado no controle
móvel: a classe `sr-only` não tinha regra no CSS compilado. Essa divergência de
apresentação foi corrigida com uma regra explícita, preservando o nome acessível.
Após novo build, a verificação direcionada em 390 e 320 px confirmou texto
auxiliar de 1 por 1 px, recortado, Enter, Escape, foco, link Feira e retorno,
sem overflow, chamadas de API ou erros. A nova captura móvel foi inspecionada.
O Chrome e o preview locais foram encerrados após essa conferência final.

## Evolução: nova arte do favicon em 2026-11-07

Os quatro PNGs foram reexportados com Inkscape 1.4.3 a partir da nova versão
fornecida de `web/public/favicon.svg`, que contém o logotipo completo. Foram
preservados os tamanhos de 180, 192 e 512 px. Apple Touch e maskable têm fundo
cinza opaco; os dois PNGs PWA comuns preservam os cantos transparentes da origem.
Na versão maskable, a arte foi centralizada a 95% sobre o mesmo fundo, com raio
máximo da marca de 200,50 px, dentro dos 204,80 px previstos em FR-012. A medição
tolera dois níveis por canal no fundo para distinguir o antialiasing da marca.

As quatro imagens foram inspecionadas visualmente e tiveram dimensões,
opacidade e cores conferidas. Todas diferem dos PNGs anteriores. Comparações
SHA256 confirmaram que o SVG fornecido e `interface.svg` foram preservados.
O build com `WEB_BASE_PATH=/maisciencia/` e `npm run check:build` passaram;
os quatro arquivos publicados são idênticos às exportações e constam no precache.
Não foram adicionados testes permanentes nem repetidos os exercícios de
instalação, navegação ou atualização em navegador para essa troca de imagens.

## Evolução: oficinas e parceria em 2026-11-07

Os três selos passaram a exibir somente “OFICINA”. A legenda Ambiente virtual
e os links externos foram substituídos por botões nativos “Saiba mais”, com
fundo rosa, amarelo ou verde correspondente ao card, cantos retos e rótulos
acessíveis específicos. As culminâncias foram preservadas. Os três links de
navegação Oficinas agora abrem a página geral `/oficinas`.

O catálogo compartilhado `web/src/pages.js` reúne as seis páginas provisórias:
aplicativo, feira, oficinas e as três oficinas individuais. Títulos, descrições
e cores são usados pela interface; as sete entradas físicas incluem a página
inicial e são usadas também pelo emissor de HTML e pelo verificador do artefato.
A página geral informa o futuro conteúdo sobre planejamento e execução; as
três oficinas exibem mensagem de construção e retorno ao site.

O rodapé apresenta a mensagem de parceria Profe e o CNPJ fornecido, em três
linhas. Texto, selos, destinos e ausência dos links anteriores foram comparados
ao contrato na fonte e nos HTMLs compilados nas bases `/` e `/maisciencia/`.

ESLint e os 37 testes Node passaram. Builds e `check:build` passaram nas duas
bases, com 33 arquivos e 701 referências na raiz e 698 no prefixo. As sete
entradas físicas estão presentes no precache. Não foram criados testes que
apenas reproduzissem a redação dos cards ou da parceria; os casos novos cobrem
roteamento aninhado, fronteiras do prefixo, contratos e ausência de entradas.

Chrome headless, com servidor HTTP estático sem fallback, conferiu 26 acessos
diretos: 14 respostas 200 e 12 redirecionamentos nativos 301. Cards, rodapé,
links e páginas foram conferidos em 1440, 390 e 320 px, nas duas bases. Os
botões têm 44 px de altura mínima, cantos de raio zero, foco visível de 2 px
e contrastes de 7,55:1, 10,32:1 e 10,76:1. A parceria permaneceu em três linhas,
sem quebra adicional, inclusive em 320 px.

Os cliques nos botões, os links de Oficinas no desktop, menu e rodapé, o retorno
e o fechamento do menu com Escape passaram. Não houve rolagem horizontal,
erro de runtime ou rede, chamada de API ou endereço escapando da base nos
62 casos de navegação observados. Quatro capturas finais foram inspecionadas.
O helper foi ajustado para aceitar os dois retornos legítimos de cada página
e aguardar o título após navegação; a execução final não teve falhas.

O validador SDD e `git diff --check` passaram. O Chrome e os servidores locais
foram encerrados após os checks. Não foram repetidos os exercícios de instalação,
atualização ou offline em navegador para essa evolução; não houve publicação remota.

## Evolução: parceria integrada e padrão dos botões em 2026-11-07

A parceria passou para dentro do mesmo parágrafo da missão em `.footer-identity`,
logo abaixo da descrição existente. Os três textos fornecidos permanecem
íntegros, sem faixa independente. Os botões Saiba mais e Voltar ao Início
passaram a usar raio de 6 px, borda e texto coloridos, fundo com 10% de
opacidade e 20% no hover. As oficinas mantêm suas cores e o retorno usa menta.

Chrome headless conferiu rodapé e os quatro botões em 1440, 390 e 320 px.
Os 12 casos confirmaram altura mínima de 44 px, borda de 1 px, raio de 6 px
e foco visível de 2 px. O menor contraste de texto calculado foi 4,76:1 no
hover da oficina rosa. A parceria permaneceu no mesmo parágrafo, sem overflow,
com nome e CNPJ legíveis nas três larguras. Voltar ao Início retornou ao topo;
os três cliques das oficinas e seus retornos passaram.

## Evolução: duas ações na abertura em 2026-11-07

Conheça Mais foi retirado da área de ações. Feira rosa e Aplicativo verde
reutilizam as classes do cabeçalho, preservando borda, texto, raio de 6 px e
fundo translúcido: 10% para Feira e 7% para Aplicativo. A altura mínima no
hero é de 44 px. Variantes antigas sem uso foram removidas do CSS.

`WEB_BASE_PATH=/maisciencia/ npm run build` e o mesmo prefixo em
`npm run check:build` passaram: 33 arquivos e 691 referências internas.
Fonte, contrato e as sete entradas HTML compiladas foram comparados: todos
contêm somente os dois links na ordem Feira e Aplicativo, com destinos
dentro da base. O build PWA gerou 30 entradas de precache.

A conferência em Chrome headless usou o build servido por HTTP estático nas
larguras de 1440, 390 e 320 px. Cores, borda e fundo dos dois botões do hero
coincidiram com os equivalentes do cabeçalho. Foco, layout e menu móvel
passaram sem rolagem horizontal. Os cliques de Feira e Aplicativo abriram
suas páginas provisórias e o retorno funcionou. Nos cinco percursos de clique
e retorno, incluindo as oficinas, e nos três acessos iniciais, os 13 casos
de rede não registraram erros HTTP, exceções de runtime ou chamadas de API.
Capturas do hero, cards, menu e rodapé em desktop e celular foram inspecionadas.

O coletor temporário teve três falsos negativos: dois ao ler o menu antes
da pintura de `x-show` e um ao medir contraste em um recorte deslocado pelo
relayout durante a captura. A recoleta direcionada aguardou a pintura e
usou captura do viewport com recorte pelas coordenadas atuais, passando sem
falhas e sem alteração do produto. O contraste de Feira em 1440 px foi
8,42:1 no estado normal e 7,43:1 no hover. Os menus móveis tinham controles
de 47 px e fecharam com Escape.

O validador SDD passou com sete features, 66 requisitos e 80 tarefas;
`git diff --check` passou. Estas revisões de HTML/CSS não acrescentaram testes
permanentes nem repetiram ESLint, testes Node, instalação, atualização ou
offline. As evidências desses exercícios anteriores continuam com seu alcance
original. Não houve publicação remota nesta revisão.

## Limitações preservadas

O usuário confirmou continuar sem os dados complementares de `site.docx`.
Não há aprovação humana dos artefatos. Instalação, ciclo de atualização e
publicação em hospedagem não foram executados. A evidência offline limita-se
ao exercício descrito acima, sem operações autenticadas ou banco de dados.
Dados e processos institucionais reproduzem o texto fornecido; não representam
auditoria externa. Não se prevê execução de MongoDB, Kong ou autenticação nesta feature.
As larguras móveis foram emuladas no Chrome; aparelhos físicos, outros motores
de navegador e leitores de tela não foram homologados nesta entrega.
