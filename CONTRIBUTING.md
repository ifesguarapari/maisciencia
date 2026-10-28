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
