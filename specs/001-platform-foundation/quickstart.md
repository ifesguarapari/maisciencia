# Verificação da base da plataforma

Execute a partir da raiz do repositório. Estes comandos são um roteiro;
sua presença não comprova execução. Registre resultados em [verification.md](verification.md).

## Artefatos da feature

```bash
SPECIFY_FEATURE=001-platform-foundation .specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks
```

A variável seleciona a feature sem alterar a branch Git corrente.

## Checks locais

```bash
cd api
poetry install --with dev
poetry run python -m unittest discover -s tests -v
poetry run black --config pyproject.toml --check common/maisciencia_common services tests
poetry run pylint --rcfile=pyproject.toml common/maisciencia_common services tests
docker compose config --quiet
```

Os testes usam mocks e persistência em memória. A configuração do Compose
pode ser validada sem iniciar containers. Use os `.env` locais descritos em
[api/README.md](../../api/README.md); valores não fazem parte desta baseline.

## Verificações de integração pendentes

Com acesso ao daemon Docker e um ambiente apropriado:

```bash
cd api
docker compose up -d --build
docker compose ps
curl http://localhost:8000/api/administrations/health
curl http://localhost:8000/api/administrations/health/db
curl http://localhost:8000/api/web/health
curl http://localhost:8000/api/web/status
```

Verifique as oito identidades, a falha isolada de um domínio, os limites dos
prefixos e a ausência de rota pública para `/internal/*` de autenticação.
Exercite permissões usando cada usuário de serviço, incluindo um acesso
fora de suas coleções. Não recrie volumes nem usuários existentes para
transformar uma falha de migração em resultado de sucesso.
