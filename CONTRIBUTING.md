# Padrões de contribuição

## Especificação antes da implementação

Leia a [constituição](.specify/memory/constitution.md), o
[contexto arquitetural](docs/architecture.md), o
[guia SDD](docs/spec-driven-development.md) e a especificação afetada em `specs/`.
Atualize a intenção e seus cenários antes de alterar comportamento; registre a
solução no plano e relacione requisitos, tarefas, contratos e verificação.
Use as instruções de `.specify/commands/` explicitamente nesta integração genérica.

Na raiz, execute:

```bash
python3 scripts/validate-specs.py
python3 -m unittest discover -s tests -v
```

Esses checks verificam os artefatos e sua ferramenta. Complete as verificações
da aplicação conforme o impacto e registre os limites em `verification.md`.
Checklists humanos exigem revisão humana e não são aprovados pelo agente.

## Idioma

- Escreva as explicações dos arquivos `.md` em português do Brasil.
- Use inglês nos demais arquivos: nomes de pastas e arquivos, variáveis,
  funções, classes, comentários, docstrings e textos da interface.
- Mantenha os identificadores técnicos em inglês também nos exemplos da
  documentação, incluindo rotas, coleções e variáveis de ambiente.

A página institucional e a apresentação provisória de `/login` usam português
do Brasil por solicitação explícita em `006-landing`. Essa exceção se aplica
ao conteúdo apresentado ao visitante; código, nomes e comentários seguem inglês.

As pastas dos serviços usam nomes como `administrations`, `activities` e
`authentication`. O prefixo HTTP correspondente à gestão escolar é
`/api/administrations`.

## Configuração local

Use os arquivos `.env` diretamente. Eles são locais e ficam ignorados pelo
Git e pelo build Docker. Preserve os valores existentes ao atualizar o
projeto. Em uma nova clonagem, crie os arquivos usando as variáveis descritas
em [api/README.md](api/README.md) e [web/README.md](web/README.md).

As senhas usadas por um serviço devem corresponder às configuradas para seu
usuário no MongoDB. Alterações de nomes, permissões ou credenciais de um banco
existente devem ser aplicadas com uma migração administrativa.

## Formatação e validação

Na pasta `api`, use Black para formatar Python e Pylint para analisar o código.
As configurações centrais em `pyproject.toml` adotam 88 caracteres por linha
e alvo Python 3.11:

```bash
poetry install --with dev
poetry run black --config pyproject.toml common/maisciencia_common services tests
poetry run black --config pyproject.toml --check common/maisciencia_common services tests
poetry run pylint --rcfile=pyproject.toml common/maisciencia_common services tests
poetry run python -m unittest discover -s tests -v
```

Para alterações de nomes ou permissões MongoDB, execute também a simulação
administrativa com Node.js 24+, na pasta `api`:

```bash
node --test --test-isolation=none tests/test_migration.cjs
```

Esses cenários não acessam MongoDB real. A migração de um ambiente existente
exige a conferência administrativa descrita em `api/README.md`.

Na pasta `web`, use os comandos ESLint e o build Vite:

```bash
npm run lint
npm test
npm run build
npm run check:build
```

O workflow [Web](.github/workflows/web.yml) executa esses checks e a validação
SDD em pull requests para `main` e na própria `main`. A publicação no Pages é
restrita a `main`, após sucesso dos checks; PRs não publicam. Para conferir o
mesmo prefixo do site de projeto, use `WEB_BASE_PATH=/maisciencia/` tanto no
build quanto em `npm run check:build`, sem alterar `.env`. Consulte o
[roteiro da entrega web](specs/007-web-delivery/quickstart.md).

## Commits

Instale os hooks a partir de `api`:

```bash
poetry run pre-commit install --config ../.pre-commit-config.yaml
```

Na etapa `pre-commit`, Black formata os arquivos Python e Pylint analisa o
código em seguida. O hook `commit-msg` verifica Conventional Commits.
Use mensagens em inglês, como
`feat(activities): add workshop registration`.

Prepare os arquivos com `git add` e use `poetry run cz commit` em `api` ou
`npm run commit` em `web` para abrir o assistente Commitizen. Se um hook
alterar um arquivo, revise o resultado e prepare esse arquivo novamente.

## Versões e releases da web

A web segue [Semantic Versioning 2.0.0](https://semver.org/) no formato
`MAJOR.MINOR.PATCH`. O contrato público da web é a navegação, as rotas e os
comportamentos descritos em `specs/006-landing/` e `specs/007-web-delivery/`.
Correções compatíveis usam patch; novas funcionalidades compatíveis usam minor;
mudanças incompatíveis usam major a partir de 1.0.0. Durante o desenvolvimento
inicial 0.y.z, novas funcionalidades e mudanças incompatíveis usam minor,
com o impacto registrado no changelog; correções compatíveis usam patch.

A versão da web fica sincronizada em `web/package.json` e
`web/package-lock.json`. A API tem versão independente. As tags seguem o
padrão existente sem prefixo, por exemplo `0.2.0`, e não são substituídas
depois de publicadas. Registre cada versão em `CHANGELOG.md`. O `npm version`
já aplica SemVer, sem exigir biblioteca adicional.

Após revisar e commitar as mudanças com Conventional Commits, finalize a
branch de trabalho em `develop`. Para uma branch `bugfix/landing-details`,
uma release minor partindo de 0.1.0 segue esta sequência:

```bash
git flow bugfix finish landing-details
git flow release start 0.2.0
cd web
npm version minor --no-git-tag-version
npm ci
npm run lint
npm test
WEB_BASE_PATH=/ npm run build
WEB_BASE_PATH=/ npm run check:build
cd ..
python3 scripts/validate-specs.py
```

Atualize o changelog e registre os checks antes do commit de preparação da
release. O Git Flow cria a tag, portanto `npm version` usa
`--no-git-tag-version`. Não execute esse bump novamente na mesma release.
Depois de preparar os arquivos e criar `chore(release): prepare 0.2.0`:

```bash
GIT_MERGE_AUTOEDIT=no git flow release finish -m "Release 0.2.0" 0.2.0
git push --atomic origin main develop refs/tags/0.2.0
```

Use `release/<version>` para releases regulares e `hotfix/<version>` para
correções urgentes que partem de `main`; finalize a hotfix nas duas branches.
Não use push forçado. Se o servidor não aceitar push atômico, confira as
referências antes de enviar cada uma sem reescrever histórico.

O push de `main` inicia o workflow Web. Acompanhe o run do commit exato até
build e deploy terminarem, confira o site e publique as notas da versão no
GitHub vinculadas à tag existente. O Pages utiliza o domínio configurado;
em 2026-11-07 ele é `https://maisciencia.ifes.app.br/`, com base `/` e HTTPS.
O pipeline faz uma instalação limpa e executa seus próprios checks antes de
publicar. Uma release da web não implanta a API.
