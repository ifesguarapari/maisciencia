# Web

Página institucional do Ifes Mais Ciência na Escola em Vite vanilla, HTML,
Tailwind CSS, Alpine.js e PWA. A especificação vigente dessa apresentação é
[006-landing](../specs/006-landing/spec.md); a baseline
[003-web-pwa](../specs/003-web-pwa/spec.md) preserva o inventário da demonstração
anterior de sessões e saúde. As mudanças seguem o
[fluxo SDD](../docs/spec-driven-development.md).

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
no menu móvel e depois de Conheça Mais, apontam para `/feira`. Essa rota exibe
o título “Feira”, uma mensagem de página em construção e o retorno ao site.
Ambas as rotas aceitam acesso direto com ou sem barra final e operam sem
chamadas de API. Não há formulário, restauração de sessão ou consulta de
saúde na página pública desta entrega. Os serviços de autenticação
e BFF continuam documentados em [api/README.md](../api/README.md).

## Conteúdo e identidade

`public/images/` contém os arquivos fornecidos `ifes.svg`, `maisciencia.svg`
e `background.webp`. As marcas preservam cores e proporções. As ilustrações
secundárias são decorativas e não representam fotografias de pessoas reais.

`public/favicon.svg` é a origem dos quatro ícones PNG em `public/icons/`:
Apple Touch com 180 px, PWA com 192 e 512 px e maskable com 512 px. Ao atualizar
essa arte, reexporte os PNGs nas mesmas dimensões. Apple Touch e maskable usam
fundo cinza opaco; a marca maskable fica dentro da área circular central de
raio igual a 40% da largura. `interface.svg` contém os símbolos dos controles
da página e é independente dos ícones de instalação.

Os dados de instituições e equipe ficam separados da apresentação em
`src/data.js`. Há 21 escolas municipais, nove campi, três coordenadores e
seis colaboradores, conforme o material do usuário. O documento `site.docx`
não foi fornecido; endereços, horários, cursos e vínculos de profissionais
não disponíveis não devem ser inventados. O usuário confirmou prosseguir
com os dados já informados.

A interface institucional, incluindo as páginas provisórias `/login` e `/feira`,
usa português do Brasil por pedido específico de `006-landing`. O idioma da
feira segue o conteúdo institucional já autorizado. Código, identificadores,
arquivos e comentários continuam em inglês; `/feira` preserva a rota solicitada
pelo usuário. A exceção de idioma está registrada na
[constituição](../.specify/memory/constitution.md).

## Comandos e verificação

```bash
npm run lint
npm run lint:fix
npm test
npm run build
npm run check:build
npm run preview
```

`npm test` executa os testes locais de dados e filtros com o runner nativo do
Node.js, sem serviços externos.

Na raiz do repositório, execute `python3 scripts/validate-specs.py`.
Os resultados de filtros, navegação e layout devem ser registrados em
[verification.md](../specs/006-landing/verification.md). ESLint e build não
substituem testes de teclado, toque, menu, movimento reduzido ou enquadramento
em navegador.

O ESLint usa flat config, com globais de navegador nos módulos de `src` e
Node.js nos arquivos de configuração. Para criar commits com Commitizen,
prepare os arquivos com `git add` e execute `npm run commit` na pasta `web`.
O commit abrange os arquivos preparados do repositório inteiro.

## Configuração local e publicação

O arquivo `web/.env` é local e ignorado pelo Git; preserve seus valores.
A variável `VITE_API_URL` permanece disponível para futuras integrações,
mas a landing não faz chamadas de API. Variáveis `VITE_*` são públicas no build:
não inclua senhas, tokens ou segredos internos.

Em produção, sirva `dist/` por HTTPS. O build fornece `login/index.html` e
`feira/index.html`, permitindo abrir as rotas provisórias diretamente em um
servidor estático sem fallback SPA. O servidor pode normalizar a URL para barra
final. Quando o aplicativo passar a usar o backend, encaminhe `/api` para o
Kong e siga o contrato do BFF.
O proxy local de Vite é uma configuração de desenvolvimento.

## GitHub Actions e Pages

O workflow [Web](../.github/workflows/web.yml) valida PRs para `main` e executa
instalação pelo lockfile, ESLint, testes, SDD, build e conferência do artefato.
Somente pushes ou execuções manuais em `main` enviam `dist/` ao GitHub Pages.
Configure **Settings → Pages → Source → GitHub Actions** no repositório.
O roteiro completo está em [007-web-delivery](../specs/007-web-delivery/quickstart.md).

O desenvolvimento local usa a base `/`. Para reproduzir o site de projeto:

```bash
WEB_BASE_PATH=/maisciencia/ npm run build
WEB_BASE_PATH=/maisciencia/ npm run check:build
```

`WEB_BASE_PATH` é uma variável pública de build; não exige mudar `.env`.
Na publicação, a configuração do Pages fornece a base efetiva. Caminhos de
recursos, navegação e PWA acompanham essa base. O backend e o VPS não participam
desse workflow, e uma configuração local não significa publicação já realizada.

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
