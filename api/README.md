# APIs

As alterações seguem o [fluxo SDD](../docs/spec-driven-development.md).
Consulte a [arquitetura](../docs/architecture.md), a baseline
[001](../specs/001-platform-foundation/spec.md) e, para sessões, a baseline
[002](../specs/002-web-sessions/spec.md) antes de modificar contratos.

Oito serviços Flask independentes, publicados pelo Kong Gateway: sete APIs
por domínio e o BFF em `services/web`, com um único banco MongoDB da aplicação.
Cada serviço possui `app.py`,
`pyproject.toml`, `poetry.lock`, `poetry.toml`, `.env` e `.venv` próprios.
Os arquivos `.env` e os ambientes virtuais ficam locais, ignorados pelo Git.

## Serviços e dados

| Serviço / pasta em `services/` | Prefixo no Kong | Coleções sob sua responsabilidade |
| --- | --- | --- |
| `administrations` | `/api/administrations` | `schools`, `students`, `teams`, `memberships` |
| `activities` | `/api/activities` | `workshops`, `practices`, `records` |
| `events` | `/api/events` | `events`, `registrations`, `attendances` |
| `content` | `/api/content` | `publications`, `news`, `informations` |
| `authentication` | `/api/authentication/health` | `users`, `sessions`, `recoveries` |
| `messaging` | `/api/messaging` | `conversations`, `messages`, `notifications` |
| `integrations` | `/api/integrations` | `pipelines`, `agents` |
| `web` | `/api/web` | Sem coleções ou credenciais MongoDB; consulta `authentication`. |

O serviço da pasta `administrations` usa o usuário MongoDB `administrations` e
é publicado em `/api/administrations`.

Os nomes das coleções são o contrato inicial de responsabilidade. O usuário
MongoDB de cada serviço pode ler, escrever e criar índices apenas nas suas
coleções. A troca de dados entre domínios deve usar contratos das APIs.

Esta base fornece inicialização, configuração, conexão, verificações de saúde
e infraestrutura, além de login e gerenciamento de sessões pelo BFF. As rotas
de negócio, mensagens e chamadas a provedores externos serão implementadas
nos respectivos serviços. Novos controllers de negócio deverão validar a
sessão e aplicar as permissões da operação; os endpoints atuais de saúde
continuam públicos.

## Executar com Docker Compose

Requer Docker com acesso ao daemon e Compose 2.24+. Os arquivos `.env` locais
já estão presentes nesta cópia de trabalho. Confira a configuração antes da
primeira inicialização; em outro ambiente, crie os arquivos conforme as
tabelas da próxima seção. Execute na pasta `api`:

```bash
docker compose up -d --build
docker compose ps
```

O Compose cria dez containers: oito serviços Flask, Kong e MongoDB. Cada serviço é construído
separadamente, usando seu lockfile e o código do seu domínio, e executada por
Gunicorn com dois processos de trabalho. A biblioteca local `common` é
incluída na imagem.

O Kong opera em modo DB-less: `gateway/kong.yaml` define serviços, rotas e CORS.
Seu proxy fica em `http://localhost:8000`; a Admin API está desativada. As APIs
ficam na rede Docker. O MongoDB é publicado em `127.0.0.1:27017` para permitir
desenvolvimento Python direto. As portas publicadas ficam restritas à máquina
local nesta configuração.

O gateway inicia independentemente dos domínios. Um serviço indisponível
produz erro na sua própria rota; os demais continuam atendendo. As sete APIs
com banco aguardam a inicialização do MongoDB. O BFF inicia independentemente
da disponibilidade de `authentication` e mantém sua rota `/health` disponível.

```bash
curl http://localhost:8000/api/administrations/health
curl http://localhost:8000/api/activities/health
curl http://localhost:8000/api/activities/health/db
curl http://localhost:8000/api/web/health
curl http://localhost:8000/api/web/status
docker compose logs -f activities
```

Para reconstruir e publicar um domínio:

```bash
docker compose up -d --build activities
```

Para encerrar os containers preservando o volume de dados:

```bash
docker compose down
```

## Configuração local

O Compose lê `api/.env` automaticamente. As variáveis necessárias são:

| Variável | Configuração |
| --- | --- |
| `MONGO_DB` | Nome do banco da aplicação; o valor inicial é `maisciencia`. |
| `MONGO_ROOT_USERNAME` | Nome do usuário administrativo criado na primeira inicialização. |
| `MONGO_ROOT_PASSWORD` | Senha desse usuário administrativo. |
| `ADMINISTRATIONS_DB_PASSWORD` | Senha do usuário MongoDB `administrations`. |
| `ACTIVITIES_DB_PASSWORD` | Senha do usuário MongoDB `activities`. |
| `EVENTS_DB_PASSWORD` | Senha do usuário MongoDB `events`. |
| `CONTENT_DB_PASSWORD` | Senha do usuário MongoDB `content`. |
| `AUTHENTICATION_DB_PASSWORD` | Senha do usuário MongoDB `authentication`. |
| `MESSAGING_DB_PASSWORD` | Senha do usuário MongoDB `messaging`. |
| `INTEGRATIONS_DB_PASSWORD` | Senha do usuário MongoDB `integrations`. |
| `AUTH_INTERNAL_TOKEN` | Segredo compartilhado somente entre o BFF e `authentication`. |
| `SESSION_IDLE_TIMEOUT_SECONDS` | Prazo de inatividade da sessão, inicialmente `1800`. |
| `SESSION_ABSOLUTE_TIMEOUT_SECONDS` | Duração máxima da sessão, inicialmente `28800`. |
| `WEB_ALLOWED_ORIGINS` | Origens autorizadas a alterar estado pelo BFF, separadas por vírgula. |
| `SESSION_COOKIE_SECURE` | `true` para HTTPS; o `.env` local usa `false` para HTTP. |
| `SESSION_COOKIE_SAMESITE` | Política do cookie; o valor inicial é `Lax`. |

O Compose fornece as variáveis de conexão diretamente aos containers. Para
executar uma das sete APIs com banco usando Poetry, configure o `.env` da
pasta desse serviço:

| Variável | Configuração |
| --- | --- |
| `MONGO_URI` | Endereço do MongoDB; para o servidor local, `mongodb://localhost:27017/`. |
| `MONGO_DB` | Mesmo nome de banco definido em `api/.env`. |
| `MONGO_USERNAME` | Usuário MongoDB atribuído ao serviço, conforme `compose.yaml`. |
| `MONGO_PASSWORD` | Senha correspondente definida em `api/.env`. |
| `MONGO_AUTH_SOURCE` | Mesmo banco da aplicação, onde o usuário foi criado. |
| `MONGO_MAX_POOL_SIZE` | Limite do pool por cliente; o valor inicial é `10`. |
| `CORS_ORIGINS` | Origens permitidas no acesso direto, separadas por vírgula. |

O `.env` de `authentication` também recebe `AUTH_INTERNAL_TOKEN` e os dois
prazos da sessão. O `.env` do BFF usa `AUTHENTICATION_URL`, o mesmo segredo,
`WEB_ALLOWED_ORIGINS` e as opções do cookie, com `SESSION_COOKIE_PATH=/api/web`.
No Docker, o endereço de autenticação é `http://authentication:5000`; no
desenvolvimento nativo, o valor local é `http://127.0.0.1:5005`.
O BFF funciona sem variáveis ou usuário MongoDB.

Os arquivos `.env` são usados diretamente e ficam ignorados pelo Git e pelo
build Docker. Preserve as configurações locais existentes ao atualizar o
projeto. Variáveis exportadas no ambiente têm prioridade sobre o `.env`.

## MongoDB central e permissões

O script `mongo/init-services.js` cria as coleções, uma role específica e um
usuário por serviço no banco central. O usuário administrativo é usado pela
inicialização e pela verificação de saúde do MongoDB; as APIs recebem suas
credenciais específicas.

O script de inicialização é executado pela imagem MongoDB apenas quando o
volume de dados está vazio. Alterar `.env` ou o script depois disso não muda
automaticamente os usuários, senhas ou permissões já existentes. Essas
alterações precisam ser aplicadas ao banco com uma migração administrativa.
O mesmo cuidado vale para bancos existentes que ainda usem os nomes antigos
de usuários ou coleções: a padronização dos arquivos não migra os dados.

### Migrar os nomes de um volume existente

A alteração [005-domain-names](../specs/005-domain-names/spec.md) troca a
identidade pública para `/api/administrations` e simplifica seis coleções.
O prefixo anterior deixa de ser publicado. Atualize os consumidores junto
da implantação. O script `mongo/migrate-concepts.js` atende um banco já
inicializado; em volumes novos, use apenas `mongo/init-services.js`.

Antes de aplicar, faça uma cópia de segurança consistente e interrompa os
serviços da aplicação para impedir gravações concorrentes. Na pasta `api`,
`docker compose down` preserva o volume. Depois inicie somente o MongoDB com
a configuração atual, que fornece `ADMINISTRATIONS_DB_PASSWORD` com a senha
local preservada:

```bash
docker compose down
docker compose up -d --no-deps mongo
docker compose cp mongo/migrate-concepts.js mongo:/tmp/migrate-concepts.js
docker compose exec -T mongo bash -c 'mongosh --quiet --username "$MONGO_INITDB_ROOT_USERNAME" --password "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin /tmp/migrate-concepts.js'
```

O último comando apenas inspeciona e informa as operações planejadas, sem
mostrar senhas. Se uma coleção antiga e sua substituta coexistirem, ou faltar
uma coleção esperada, a ferramenta interrompe antes de qualquer alteração.
Resolva o conflito com base nos dados reais; não remova destinos para contornar
a verificação.

Para aplicar após conferir o relatório, confirme explicitamente o nome do banco
no comando abaixo; substitua `maisciencia` se sua configuração usar outro nome:

```bash
docker compose exec -T -e MIGRATION_APPLY=true -e MIGRATION_CONFIRM_DATABASE=maisciencia mongo bash -c 'mongosh --quiet --username "$MONGO_INITDB_ROOT_USERNAME" --password "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin /tmp/migrate-concepts.js'
```

A ferramenta renomeia coleções sem sobrescrever destinos, atualiza as permissões
por domínio e cria a identidade `administrations` quando necessária. Não altera
campos dos documentos. As operações administrativas não são uma transação;
uma nova inspeção reconhece as etapas já concluídas e permite retomada.

Confira contagens, índices e acessos permitidos e negados com MongoDB real antes
de iniciar a aplicação com `docker compose up -d --build`. O usuário e a role
antigos são mantidos temporariamente; retire-os administrativamente após validar
a atualização. Para recuperação integral, restaure a cópia de segurança com os
serviços parados e recoloque a versão anterior e sua configuração. A ferramenta
não oferece reversão automática. Esta entrega não executou migração real.

Na inicialização de um volume vazio, os índices `users.email` e
`sessions.token_hash` são únicos e `sessions.expires_at` recebe um índice TTL.
Para atualizar os índices de um banco existente sem recriar o volume, execute:

```bash
docker compose exec authentication .venv/bin/flask --app app init-db
```

O comando é idempotente para índices compatíveis. Endereços de e-mail
duplicados podem impedir o índice único; resolva os registros antes de
reexecutá-lo. O comando não remove usuários nem recria o banco.
O TTL limpa sessões expiradas de forma assíncrona; a aplicação verifica a
expiração em cada validação e rejeita sessões vencidas mesmo antes da limpeza.

Cada processo de trabalho cria seu próprio `MongoClient` após o fork e
reutiliza seu pool. `MONGO_MAX_POOL_SIZE` limita o pool de cada cliente por
servidor MongoDB. Os serviços compartilham a capacidade e a disponibilidade
do banco, enquanto os processos Flask são independentes.

## Identidade e sessões web

O BFF em `services/web` recebe as chamadas do navegador. Ele mantém o
identificador de sessão em cookie e usa uma chamada interna a
`authentication` para criar, consultar, renovar ou revogar a sessão.
`authentication` verifica a senha, administra a identidade e persiste o
estado no MongoDB; somente o hash do identificador opaco é armazenado.

| Método | Rota pública | Dados |
| --- | --- | --- |
| `POST` | `/api/web/login` | JSON com `email` e `password`. |
| `GET` | `/api/web/session` | Retorna `user`, `csrf_token` e `expires_at`. |
| `POST` | `/api/web/logout` | JSON `{}` e cabeçalho `X-CSRF-Token`. |
| `POST` | `/api/web/session/refresh` | JSON `{}` e cabeçalho `X-CSRF-Token`; troca o identificador. |
| `GET` | `/api/web/status` | Retorna `services`, com `slug` e `status` para os oito serviços. |

As respostas públicas de login, consulta e renovação omitem `session_token`;
o identificador é entregue em cookie `HttpOnly`, com `SameSite=Lax`, sem
domínio compartilhado e com caminho `/api/web`. O código usa `Secure=true`
por padrão. O `.env` local define `SESSION_COOKIE_SECURE=false` para HTTP;
em produção, use HTTPS e configure essa variável como `true`.

Todas as operações que alteram estado exigem `Origin` presente em
`WEB_ALLOWED_ORIGINS` e `Content-Type: application/json`. Essa validação
protege o login antes de existir uma sessão. Encerramento e renovação também
exigem o token CSRF vinculado à sessão. O frontend usa
`credentials: 'include'` e guarda o token CSRF apenas no estado da página.

O prazo inicial é de 30 minutos de inatividade e 8 horas de duração absoluta.
Consultar a sessão válida atualiza sua atividade; renovar troca o
identificador, invalida o anterior e preserva o prazo absoluto original.
O encerramento revoga a sessão no servidor antes de remover o cookie.
Sessões expiradas e contas desativadas são rejeitadas.

Sessão inválida recebe `401`; falha de CSRF recebe `403`. Se o serviço de
autenticação ou o banco estiver indisponível, o BFF retorna `503`, sem expor
detalhes internos. Uma tentativa de saída com `503` preserva o cookie e não
é apresentada como encerramento bem-sucedido. A validação por consulta
interna facilita a revogação, mas faz as operações autenticadas dependerem
da disponibilidade de `authentication`.

Os endpoints internos de `authentication` exigem `X-Internal-Token`, com o
segredo `AUTH_INTERNAL_TOKEN`. O Kong publica somente a saúde desse serviço;
as rotas `/internal/*` ficam fora das rotas públicas. O navegador acessa as
operações de sessão exclusivamente por `/api/web`. Respostas do BFF usam
`Cache-Control: no-store`; os dados da sessão ficam fora do cache PWA.

Para criar uma conta inicial, execute:

```bash
docker compose exec authentication .venv/bin/flask --app app create-user --email user@example.org --name "Example User"
```

A senha é solicitada de forma oculta, com confirmação e comprimento mínimo
de 12 caracteres. A ferramenta cria os índices necessários e grava o hash da
senha. As contas são criadas pela ferramenta administrativa, sem conta ou
senha predefinida. O BFF não oferece cadastro público.

O contrato detalhado e a execução nativa estão em
[services/web/README.md](services/web/README.md).

## Contratos de saúde

O Kong remove o prefixo do serviço antes de encaminhar a requisição:

| Rota nativa | Exemplo pelo gateway | Resposta |
| --- | --- | --- |
| `GET /health` | `/api/activities/health` | `200 {"status":"ok","service":"activities"}` |
| `GET /health/db` | `/api/activities/health/db` | `200 {"status":"ok","database":"connected"}` ou `503 {"status":"error","database":"unavailable"}` |

Nas sete APIs com banco, `/health` verifica o processo; `/health/db` verifica o banco com timeout de
3 segundos. As respostas de erro omitem detalhes de conexão e credenciais.
Rotas novas de cada domínio devem ser registradas na respectiva aplicação
Flask.

O BFF oferece somente `/health` para seu próprio processo; ele não tem
`/health/db`. `/api/web/status` agrega a saúde dos oito processos e pode
continuar respondendo quando uma dependência estiver indisponível. A saúde
dos processos não substitui a verificação de acesso ao banco.

## Desenvolvimento Python de um serviço

Requer Python 3.11+ e Poetry 2.2+. Com o MongoDB do Compose disponível e o
`.env` do serviço configurado, execute em outro terminal, a partir de `api`:

```bash
cd services/activities
poetry install
poetry run flask --app app run --debug --port 5002
```

Use `http://localhost:5002/health` para acessar esse processo diretamente.
O Kong do Compose aponta para os containers na porta interna 5000. Para
encaminhar chamadas ao processo nativo, ajuste o upstream e a conectividade
do gateway para o endereço desse processo.

Para desenvolver os componentes de sessão diretamente, inicie
`authentication` em `5005` e o BFF em `5008`. Em cada terminal, comece na
pasta `api`:

```bash
cd services/authentication
poetry install
poetry run flask --app app run --debug --port 5005
```

```bash
cd services/web
poetry install
poetry run flask --app app run --debug --port 5008
```

O `.env` do BFF aponta para `http://127.0.0.1:5005`. Para usar esse processo
com o navegador, ajuste o upstream público `/api/web` no gateway para a
porta nativa do BFF, mantendo o caminho do cookie coerente com o prefixo.

## Formatação, análise, testes e hooks

O `pyproject.toml` de `api/` mantém o ambiente de ferramentas para formatar,
analisar e testar todos os serviços. Dentro de `api`, execute:

```bash
poetry install --with dev
poetry run pre-commit install --config ../.pre-commit-config.yaml
poetry run black --config pyproject.toml common/maisciencia_common services tests
poetry run black --config pyproject.toml --check common/maisciencia_common services tests
poetry run pylint --rcfile=pyproject.toml common/maisciencia_common services tests
poetry run python -m unittest discover -s tests -v
poetry run pre-commit run --config ../.pre-commit-config.yaml --all-files
poetry check --lock
```

Black, Pylint, Commitizen e pre-commit pertencem ao grupo `dev`. Black aplica
a formatação Python e Pylint analisa o código. As duas configurações usam
limite de 88 caracteres por linha e alvo Python 3.11.
Cada clone deve instalar os hooks uma vez. Na etapa `pre-commit`, Black
formata os arquivos Python preparados de `api/` e Pylint os analisa em seguida.
O hook `commit-msg` valida Conventional Commits no repositório inteiro,
incluindo commits feitos pelo assistente npm de `web`.
Se a formatação modificar um arquivo, revise e prepare esse arquivo novamente.

`--all-files` considera os arquivos já conhecidos pelo Git. Para formatar um
arquivo novo antes de adicioná-lo:

```bash
poetry run pre-commit run black --config ../.pre-commit-config.yaml --files services/activities/app.py
poetry run pre-commit run pylint --config ../.pre-commit-config.yaml --files services/activities/app.py
```

Prepare os arquivos com `git add` e use `poetry run cz commit` para abrir o
assistente Python. Os hooks usam diretamente `api/.venv/bin/python`, conforme
o ambiente Linux/Bash do projeto, e funcionam sem ativar o venv.

Os testes verificam as sete fábricas com banco, seus clientes independentes,
os contratos de saúde e a configuração. Há testes específicos para sessões,
expiração, revogação, origem, CSRF, cookies e erros entre os dois backends.
O BFF é verificado separadamente, sem cliente MongoDB. Os testes usam o
cliente Flask e dependências controladas para dispensar serviços externos.

Para validar a configuração Docker sem iniciar containers:

```bash
docker compose config --quiet
```

Os cenários simulados da migração de nomes usam Node.js 24+, disponível também
no ambiente de desenvolvimento do frontend. Na pasta `api`, execute:

```bash
node --test --test-isolation=none tests/test_migration.cjs
```

Eles cobrem inspeção sem mutações, conflitos, confirmação explícita, aplicação
e retomada parcial. A simulação não comprova uma migração com MongoDB real.

Os padrões de idioma e contribuição estão em
[CONTRIBUTING.md](../CONTRIBUTING.md).

## Referências

[Flask: fábricas de aplicação](https://flask.palletsprojects.com/en/stable/patterns/appfactories/),
[PyMongo: pools de conexão](https://www.mongodb.com/docs/languages/python/pymongo-driver/current/connect/connection-options/connection-pools/),
[Kong: modo DB-less](https://developer.konghq.com/gateway/db-less-mode/),
[Docker Compose](https://docs.docker.com/compose/),
[Poetry](https://python-poetry.org/docs/),
[Black](https://black.readthedocs.io/en/stable/),
[Pylint](https://pylint.readthedocs.io/en/stable/),
[Commitizen](https://commitizen-tools.github.io/commitizen/)
e [pre-commit](https://pre-commit.com/).
