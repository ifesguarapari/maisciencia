# Web

Página institucional do Ifes Mais Ciência na Escola em Vite vanilla, HTML,
Tailwind CSS, Alpine.js e PWA. A especificação vigente dessa apresentação é
[006-landing](../specs/006-landing/spec.md); a Feira segue
[009-fair](../specs/009-fair/spec.md). A baseline
[003-web-pwa](../specs/003-web-pwa/spec.md) preserva o inventário da demonstração
anterior de sessões e saúde. As mudanças seguem o
[fluxo SDD](../docs/spec-driven-development.md).
Os metadados e a política de indexação seguem
[008-seo](../specs/008-seo/spec.md); o [guia de SEO](../docs/seo.md) reúne
configuração, checks e o roteiro manual do Search Console.

## Desenvolvimento

Requer Node.js 24+ e npm. Execute na pasta `web`:

```bash
npm ci
npm run dev
```

Abra `http://localhost:5173/`. A página pública contém projeto, indicadores,
metodologia, oficinas, instituições, equipe e apoio. As informações são locais;
a apresentação não depende de MongoDB, Kong ou autenticação disponíveis.

O botão Aplicativo aponta para `/login`, que exibe somente a mensagem
provisória e o retorno ao site. Os botões rosa Feira, no cabeçalho desktop,
no menu móvel e no hero, apontam para `/feira`. O hero contém somente Feira
em rosa e Aplicativo em verde, sem o botão Conheça Mais. Os dois repetem o
estilo dos equivalentes do cabeçalho: cantos de 6 px, borda e texto coloridos
e fundo na mesma cor com 10% de opacidade para Feira e 7% para Aplicativo.
Seus destinos `/feira` e `/login` respeitam a base pública. A rota `/feira`
apresenta a FEMAIS-ES, com objetivos, público, modalidades, primeira edição
e acesso ao regulamento integral em `/feira/regulamento`.
O item Oficinas no cabeçalho desktop, no menu móvel e no rodapé abre `/oficinas`,
que informa a futura apresentação do planejamento e da execução das oficinas.
Os botões “Saiba mais” dos três cards abrem as páginas correspondentes:

| Caminho | Título provisório |
| --- | --- |
| `/oficinas` | Oficinas |
| `/oficinas/ler` | Ler um Livro com Jogos |
| `/oficinas/lancar` | Lançar Foguetes com Precisão |
| `/oficinas/melhorar` | Melhorar a Cidade com Eletrônica |

As páginas provisórias do aplicativo e das oficinas exibem aviso de construção
ou disponibilidade futura e retorno ao site. Aceitam acesso direto com ou sem barra final,
respeitam a base pública e operam sem chamadas de API. Não há formulário,
restauração de sessão ou consulta de
saúde na página pública desta entrega. Os serviços de autenticação
e BFF continuam documentados em [api/README.md](../api/README.md).

## Conteúdo e identidade

`public/images/` contém os arquivos institucionais fornecidos `ifes.svg`,
`maisciencia.svg`, `popciencia.svg` e `background.webp`. As duas artes da
Feira ficam em `public/images/feira/background.webp` e
`public/images/feira/femais.svg`. A Feira preserva a paleta azul-petróleo do
fundo e botões amarelo `#f4ce2f`, azul `#0096e1` e rosa `#f09bbe`, com borda,
cantos suaves e fundo translúcido. Os cabeçalhos usam Ifes e Mais Ciência;
a logomarca da Feira aparece ampliada e proporcional no destaque principal.

O rodapé usa a imagem original `popciencia.svg`, com o subtítulo
“Programa Nacional de Popularização da Ciência”. As marcas preservam cores
e proporções. As ilustrações secundárias são decorativas e não representam
fotografias de pessoas reais.

`public/favicon.svg` é a origem dos quatro ícones PNG em `public/icons/`:
Apple Touch com 180 px, PWA com 192 e 512 px e maskable com 512 px. Ao atualizar
essa arte, reexporte os PNGs nas mesmas dimensões. Apple Touch e maskable usam
fundo cinza opaco; a marca maskable fica dentro da área circular central de
raio igual a 40% da largura. `interface.svg` contém os símbolos dos controles
da página e é independente dos ícones de instalação.

`public/icons/slide.webp` é o cartão de compartilhamento de 750 por 425 px,
composto a partir de `images/background.webp`, `images/ifes.svg` e
`images/maisciencia.svg`. Ele permanece na inicial e nas páginas
institucionais. A família de rotas `/feira` usa o cartão
`public/icons/feira/slide.webp`, também de 750 por 425 px, composto a partir
de `images/feira/background.webp`, `images/ifes.svg` e
`images/feira/femais.svg`. O bloco Open Graph do HTML inicial de cada rota
aponta para a URL absoluta do cartão correspondente, com tipo WebP, dimensões
e texto alternativo. O cartão Twitter acompanha a mesma imagem. A leitura
desses sinais no build não comprova indexação ou prévia externa já atualizada.

Os dados de instituições e equipe ficam separados da apresentação em
`src/data.js`. Há 21 escolas municipais, nove campi, três coordenadores e
seis colaboradores, conforme o material do usuário. O documento `site.docx`
não foi fornecido; endereços, horários, cursos e vínculos de profissionais
não disponíveis não devem ser inventados. O usuário confirmou prosseguir
com os dados já informados.

Os três selos de oficina mostram apenas “OFICINA”, sem número. Cada card oferece
um botão “Saiba mais” com cantos de 6 px, borda e texto na cor da oficina e
fundo na mesma cor com 10% de opacidade, seguindo o estilo de Feira e Aplicativo.
Esses botões substituem a legenda Ambiente virtual e os links das antigas
marcas externas. “Voltar ao Início”, no encerramento, segue esse mesmo estilo
na cor menta, com foco visível em todos esses controles.
O rodapé preserva missão, navegação, informações e Instagram e apresenta a
parceria em três linhas dentro do mesmo parágrafo da missão, no quadrante
`.footer-identity`, após “Ciência, tecnologia e inovação aproximando escolas
e comunidades.”:

```text
Desenvolvido em parceria com:
Profe - Soluções em Tecnologia Educacional Ltda
CNPJ: 66.907.525/0001-13
```

A interface institucional, incluindo Feira, regulamento, dezembro e sete páginas provisórias, usa português
do Brasil por pedido específico de `006-landing`. Código, identificadores,
arquivos e comentários continuam em inglês; `/feira` e `/oficinas` preservam
os caminhos públicos solicitados pelo usuário. A exceção de idioma está registrada na
[constituição](../.specify/memory/constitution.md).

## FEMAIS-ES

A Feira substitui sua antiga tela provisória. O cronograma vigente da
Primeira edição segue o pedido do usuário, em três etapas:

| Período | Local | Página da etapa |
| --- | --- | --- |
| 04 de dezembro de 2026 | IFES Vila Velha | `/feira/202612` |
| Março de 2027 | IFES Piúma | `/feira/202703` |
| Junho de 2027 | IFES Linhares | `/feira/202706` |

A apresentação caracteriza uma feira expositiva científica e tecnológica
voltada a professores, alunos e pais do programa Mais Ciência na Escola.
Os cards usam “Encontro” sem numeração e mostram as instituições fornecidas,
na ordem do contrato: 13 no primeiro, 12 no segundo e cinco no terceiro.
Os cards preservam as listas; a página `/feira/202612` apresenta o encontro
de dezembro com programação no Ifes Vila Velha, cinco eixos e 20 atividades
ilustradas a partir de `202612.docx`. Cada card identifica exposição, expositor
e interatividade, com descrição completa em detalhes nativos. As 20 artes SVG
ficam em `public/images/feira/activities/`, no padrão visual das oficinas.
A programação tem credenciamento às 14h30, visita aos estandes às 15h, momento
cultural às 17h30 e encerramento às 18h, em 04 de dezembro de 2026
(04/12/2026), conforme confirmação do usuário. A página preserva o público convidado das 13 instituições.

A Jornada de Integração tem apresentação própria, com `jic2026.svg` e link
para seu site oficial. O período 30/11–04/12/2026 e a programação aberta ao
público pertencem à Jornada, que reúne também Fecinc e Semana de Ciência e
Tecnologia do Campus Vila Velha. Março e junho continuam em construção,
com retorno à Feira e o aviso “(A confirmar)” junto aos locais.

A proposta gamificada incentiva a interação com expositores e atividades,
com acúmulo de pontos que contribuem para troféus e premiações ao final.
A apresentação não implementa um sistema de pontuação nem define quantidades,
regras de classificação ou prêmios específicos.

O menu e o trecho
Regulamento apontam para `/feira/regulamento`, com os dois parágrafos de
preâmbulo e as 17 seções normativas da proposta fornecida. O texto conserva
numeração, subitens e percentuais de inclusão; não exibe orçamento ou quantias
monetárias. Não há formulário nem inscrição efetivamente disponível.

`src/fair.html`, `src/fair.js` e `src/fair.css` mantêm a apresentação específica;
`src/fair-data.js` compartilha as etapas e listas de instituições;
`src/regulation.js` contém os dados normativos, preservados nas correções. A renderização compartilhada
fornece conteúdo ao HTML estático e ao shell PWA antes da inicialização Alpine.
Início, Feira, regulamento e dezembro são indexáveis; aplicativo, oficinas e
duas etapas provisórias permanecem fora do sitemap com `noindex,follow`.

As evidências e os limites desta implementação ficam em
[009-fair/verification.md](../specs/009-fair/verification.md). A publicação
0.4.0 não inclui o novo conteúdo do encontro de dezembro; uma nova release deve
seguir o fluxo de entrega quando solicitada. A issue #2 permanece aberta.

## Comandos e verificação

```bash
npm run lint
npm run lint:fix
npm test
npm run build
npm run check:build
npm run preview
```

`npm test` executa os testes locais de dados, filtros e SEO com o runner nativo
do Node.js, sem serviços externos. `check:build` confere recursos e sinais de
SEO do artefato; resultados e limites de SEO ficam em
[008-seo/verification.md](../specs/008-seo/verification.md).

Na raiz do repositório, execute `python3 scripts/validate-specs.py`.
Os resultados de filtros, navegação e layout devem ser registrados em
[verification.md](../specs/006-landing/verification.md). ESLint e build não
substituem testes de teclado, toque, menu, movimento reduzido ou enquadramento
em navegador. O [roteiro institucional](../specs/006-landing/quickstart.md)
inclui os dois botões do hero, os três botões das oficinas, o item Oficinas
nos menus e rodapé, as quatro novas rotas, o estilo de “Voltar ao Início” e
as três linhas da parceria no mesmo parágrafo da missão no quadrante de
identidade.

O ESLint usa flat config, com globais de navegador nos módulos de `src` e
Node.js nos arquivos de configuração. Para criar commits com Commitizen,
prepare os arquivos com `git add` e execute `npm run commit` na pasta `web`.
O commit abrange os arquivos preparados do repositório inteiro.

## Configuração local e publicação

O arquivo `web/.env` é local e ignorado pelo Git; preserve seus valores.
A variável `VITE_API_URL` permanece disponível para futuras integrações,
mas a landing não faz chamadas de API. Variáveis `VITE_*` são públicas no build:
não inclua senhas, tokens ou segredos internos.

Em produção, sirva `dist/` por HTTPS. `src/pages.js` centraliza as três
páginas de conteúdo, as sete provisórias e as onze entradas HTML físicas.
A interface, o plugin de rotas estáticas e o verificador de build usam o
mesmo catálogo. As entradas permitem acesso direto em servidor estático sem
fallback SPA, incluindo caminhos aninhados. O servidor pode normalizar a URL
para barra final. Quando o aplicativo passar a usar o backend, encaminhe
`/api` para o Kong e siga o contrato do BFF.
O proxy local de Vite é uma configuração de desenvolvimento.

## GitHub Actions e Pages

O workflow [Web](../.github/workflows/web.yml) valida PRs para `main` e executa
instalação pelo lockfile, ESLint, testes, SDD, build e conferência do artefato.
Somente pushes ou execuções manuais em `main` enviam `dist/` ao GitHub Pages.
Na consulta de 2026-11-07, Pages está configurado com `build_type: workflow`,
domínio `https://maisciencia.ifes.app.br/`, HTTPS e base `/`. A opção equivalente
na interface é **Settings → Pages → Source → GitHub Actions**.
O roteiro completo está em [007-web-delivery](../specs/007-web-delivery/quickstart.md).

O desenvolvimento local e o domínio atual usam a base `/`. Sem domínio próprio,
o endereço alternativo de projeto é `https://ifesguarapari.github.io/maisciencia/`.
Para conferir também essa base de projeto:

```bash
WEB_SITE_ORIGIN=https://ifesguarapari.github.io WEB_BASE_PATH=/maisciencia/ npm run build
WEB_SITE_ORIGIN=https://ifesguarapari.github.io WEB_BASE_PATH=/maisciencia/ npm run check:build
```

`WEB_BASE_PATH` é uma variável pública de build; não exige mudar `.env`.
`WEB_SITE_ORIGIN` define opcionalmente a origem HTTPS dos URLs de SEO, sem
credenciais, caminho de página, consulta ou fragmento; seu padrão é
`https://maisciencia.ifes.app.br`. Use a mesma origem e base no build e no
`check:build`, conforme os [exemplos de SEO](../docs/seo.md#verificação-local).
Na publicação, a configuração do Pages fornece a base efetiva. Caminhos de
recursos, navegação e PWA acompanham essa base. O backend e o VPS não participam
desse workflow, e uma configuração local não significa publicação já realizada.

A autorização de 2026-11-07 permite concluir o Git Flow e publicar a web.
Siga a [política de versões e releases](../CONTRIBUTING.md#versões-e-releases-da-web)
e registre as alterações no [changelog](../CHANGELOG.md). A release `0.2.0`
incorpora as novas rotas das oficinas e as revisões da página, seguindo
`bugfix/landing-details → develop → release/0.2.0 → main`, com tag `0.2.0`
e sincronização de `develop`. O push de `main` inicia o workflow; acompanhe
o commit exato até build e deploy concluírem e confira o site publicado antes
de declarar sucesso. A versão da API permanece independente.

## PWA

O build gera manifesto e service worker para cache de recursos estáticos,
incluindo as imagens e fontes locais necessárias. Os caminhos de API ficam
excluídos da navegação substituta e não têm regra de cache de respostas.
Uma versão nova deve oferecer uma ação explícita de atualização.

Use `npm run build` e `npm run preview` para conferir o build em
`http://localhost:4173/`. O service worker fica desabilitado em desenvolvimento.
Instalação, atualização e abertura offline precisam de origem adequada e
navegador compatível; só devem ser declaradas verificadas após execução real.

As demais convenções estão em [CONTRIBUTING.md](../CONTRIBUTING.md).

## Publicação 0.5.0

A release 0.5.0 foi publicada em 2026-11-18 pelo GitHub Actions, com build e
deploy aprovados. Acesse o
[encontro de 04/12/2026 no Ifes Vila Velha](https://maisciencia.ifes.app.br/feira/202612/).
A conferência HTTPS cobriu onze rotas e 66 arquivos; metadados, imagens,
robots e sitemap passaram. O Chrome confirmou a apresentação em desktop e
celular. A issue #2 continua aberta e a feature foi recriada pelo Git Flow.
Consulte o [registro da implantação](../specs/007-web-delivery/verification.md).
