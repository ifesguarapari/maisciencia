# Verificação da baseline de sessões

## Testes locais sem banco real

Na pasta `api`, com o ambiente de desenvolvimento instalado:

```bash
poetry run python -m unittest discover -s tests -p test_authentication.py -v
poetry run python -m unittest discover -s tests -p test_web_backend.py -v
poetry run black --config pyproject.toml --check common/maisciencia_common services tests
poetry run pylint --rcfile=pyproject.toml common/maisciencia_common services tests
```

Esses testes usam clientes Flask, mocks e coleções em memória. Registre o
resultado e a data em [verification.md](verification.md); não o trate como
comprovação de MongoDB, Kong ou navegador reais.

## Exercício com a infraestrutura

Com os `.env` locais configurados, execute a partir de `api`:

```bash
docker compose up -d --build
docker compose exec authentication .venv/bin/flask --app app init-db
docker compose exec authentication .venv/bin/flask --app app create-user --email user@example.org --name "Example User"
```

A senha é solicitada de forma oculta e deve ter 12 a 1024 caracteres. Os
comandos não criam uma conta padrão. O índice único exige resolver e-mails
duplicados existentes, sem remover o volume como procedimento de atualização.

Em outro terminal, execute `npm run dev` na pasta `web` e abra a aplicação na
origem permitida. Entre, recarregue, renove a sessão e saia. Confira o cookie
`HttpOnly`, seu caminho `/api/web`, as respostas sem cache e a ausência de
`session_token` no JSON público e em `localStorage`.

Valide também rejeição de origem/CSRF inválidos, sessão vencida antes do TTL,
revogação do identificador antigo e comportamento de falha do provedor. Não
registre cookies, senhas ou segredos reais como evidência nos artefatos.

Os endpoints e configurações estão em
[contrato público](contracts/openapi.yaml),
[contrato interno](contracts/internal-auth.openapi.yaml) e
[documentação do BFF](../../api/services/web/README.md).
