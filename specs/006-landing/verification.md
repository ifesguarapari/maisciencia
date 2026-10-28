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
| FR-006 | Oficinas práticas, categoria de foguetes, ambientes virtuais e culminâncias | Título e categoria atualizados; três datas substituídas pelos links fornecidos. Fonte e HTML gerado conferidos; ESLint e build passaram. |
| FR-007 | Contagem 21/9, busca, filtro, abas, detalhes e estado vazio | Sete testes Node passaram; fluxos interativos passaram em Chrome. |
| FR-008 | Pessoas e dados limitados ao material fornecido | Marcelene Alves Duarte substitui o suporte em Informática na colaboração; função e iniciais atualizadas. Mantidas três pessoas na coordenação e seis na colaboração. |
| FR-009 | Identificações, faixa de apoios fornecida, dois projetos aprovados com processos CNPq e valores, e Instagram fornecido | Dois projetos conferidos na fonte e no HTML gerado. A faixa apresenta somente `apoio.svg`, conforme revisão posterior; fonte e build conferidos. ESLint e build passaram; processo Ifes PROEX continua ausente. |
| FR-010 | `/login`, `/feira`, variantes com barra final, retorno e ausência de chamadas de API | Títulos, conteúdo provisório, H1 único e retorno conferidos no Chrome em sete larguras; zero requisições de API no fluxo observado. |
| FR-011 | Layout, teclado, semântica, foco e movimento reduzido | Chrome em 1440, 390 e 320 px, teclado das abas, Escape, foco e redução de movimento passaram. |
| FR-012 | Head SEO, locale PWA, cache estático e atualização explícita | Build e manifesto pt-BR com 26 entradas; navegação estática offline passou no Chrome. Instalação e ciclo de atualização não executados. |
| FR-013 | Fundo crítico, indicador, prontidão, foco e recuperação | Sete cenários novos de carregamento passaram no Chrome; script inline aprovado pelo ESLint. |
| FR-014 | Ausência de animação de escala nas marcas e nas imagens das oficinas | Animação das marcas, atraso associado, keyframes e zoom de hover removidos; busca no CSS e build conferidos. |
| FR-015 | Três links Feira com detalhes rosa, destino provisório e layout responsivo | Cores computadas e três cliques reais conferidos no Chrome; menu por teclado, foco e sete larguras passaram. |

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

## Limitações preservadas

O usuário confirmou continuar sem os dados complementares de `site.docx`.
Não há aprovação humana dos artefatos. Instalação, ciclo de atualização e
publicação em hospedagem não foram executados. A evidência offline limita-se
ao exercício descrito acima, sem operações autenticadas ou banco de dados.
Dados e processos institucionais reproduzem o texto fornecido; não representam
auditoria externa. Não se prevê execução de MongoDB, Kong ou autenticação nesta feature.
As larguras móveis foram emuladas no Chrome; aparelhos físicos, outros motores
de navegador e leitores de tela não foram homologados nesta entrega.
