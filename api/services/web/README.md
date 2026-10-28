# Backend do frontend

O BFF em `api/services/web` é um serviço Flask independente, dedicado à
interface em `web/`. Ele coordena as sessões do navegador por meio de
`authentication` e agrega verificações de saúde dos demais serviços.
Possui projeto Poetry, lockfile, ambiente virtual e imagem próprios.

## Responsabilidades

- Receber login, consulta, renovação e encerramento de sessão pelo navegador.
- Criar e remover o cookie de sessão somente conforme a resposta confirmada
  de `authentication`.
- Validar a origem e o tipo de conteúdo das operações que alteram estado.
- Encaminhar o token CSRF nas operações que o exigem.
- Agregar a disponibilidade dos oito serviços por uma lista fixa de destinos.

O estado persistente da sessão e a identidade pertencem a `authentication`.
O BFF funciona sem cliente, usuário ou coleções MongoDB. O estado persistente
fica no serviço de autenticação, permitindo atender a mesma sessão por
workers diferentes. Os dados são consultados no serviço responsável.

As rotas de negócio ainda serão desenvolvidas nos domínios correspondentes.
Novos controllers deverão validar a sessão e aplicar suas permissões. O BFF
atual não oferece um proxy genérico para encaminhar URLs fornecidas pelo
cliente.

## Rotas públicas

O Kong remove `/api/web` antes de encaminhar a chamada ao serviço:

| Método | Rota pública | Contrato |
| --- | --- | --- |
| `GET` | `/api/web/health` | `200 {"status":"ok","service":"web"}`. |
| `POST` | `/api/web/login` | Recebe `email` e `password` em JSON; cria o cookie e retorna a visão pública da sessão. |
| `GET` | `/api/web/session` | Retorna a visão pública da sessão atual. |
| `POST` | `/api/web/logout` | Recebe JSON `{}` e `X-CSRF-Token`; revoga a sessão e remove o cookie após confirmação. |
| `POST` | `/api/web/session/refresh` | Recebe JSON `{}` e `X-CSRF-Token`; troca o identificador do cookie. |
| `GET` | `/api/web/status` | Agrega os estados dos oito serviços. |

A visão pública contém `user`, com `id`, `email` e `name`, além de
`csrf_token` e `expires_at`. O identificador opaco `session_token` é entregue
ao navegador somente em cookie `HttpOnly` e fica fora das respostas JSON.
O token CSRF pode ser lido pelo JavaScript para enviar o cabeçalho exigido.

A agregação retorna a estrutura abaixo, com uma entrada para `web` e para
cada uma das sete APIs de domínio:

```json
{
  "services": [
    { "slug": "web", "status": "ok" },
    { "slug": "administrations", "status": "ok" },
    { "slug": "activities", "status": "unavailable" },
    { "slug": "events", "status": "ok" },
    { "slug": "content", "status": "ok" },
    { "slug": "authentication", "status": "ok" },
    { "slug": "messaging", "status": "ok" },
    { "slug": "integrations", "status": "ok" }
  ]
}
```

Os valores são `ok` ou `unavailable`; cada dependência é verificada
independentemente, com timeout
limitado. O resultado indica saúde do processo, não disponibilidade de todos
os recursos ou do MongoDB. O BFF tem `/health`, mas não possui `/health/db`.

## Cookie, origem e CSRF

O cookie padrão se chama `maisciencia_session`, é `HttpOnly`, usa
`SameSite=Lax`, caminho `/api/web` e não define um domínio compartilhado.
O código aplica `Secure=true` por padrão. O `.env` local usa
`SESSION_COOKIE_SECURE=false` para HTTP; em produção, use HTTPS e `true`.

Toda operação `POST`, `PUT`, `PATCH` ou `DELETE` exige um cabeçalho `Origin`
presente em `WEB_ALLOWED_ORIGINS` e `Content-Type: application/json`. Essa
validação protege o login antes de existir uma sessão. Encerramento e
renovação também exigem `X-CSRF-Token`, validado pelo serviço de autenticação.

O frontend usa `credentials: 'include'`. Ele mantém somente a identidade, a
expiração e o token CSRF no estado em memória da página. O identificador de
sessão fica fora de `localStorage`. Todas as respostas do BFF recebem
`Cache-Control: no-store`, e o PWA guarda apenas arquivos estáticos.

## Serviço de autenticação

As chamadas internas usam `AUTHENTICATION_URL` e o segredo compartilhado
`AUTH_INTERNAL_TOKEN`, enviado em `X-Internal-Token`. O identificador da
sessão é encaminhado em `Authorization: Bearer ...` somente pelo backend.
Os cabeçalhos internos são montados pelo BFF a partir da sua configuração,
sem confiar em identidade fornecida pelo navegador.

`authentication` cria as sessões no MongoDB, armazena somente o hash do
identificador e valida a conta, a expiração absoluta e a inatividade.
O prazo inicial é de 30 minutos sem atividade e de 8 horas de duração total.
A renovação troca o identificador e invalida o anterior, preservando a
expiração absoluta original. O TTL do MongoDB apenas limpa registros
expirados; a validação da aplicação rejeita a sessão imediatamente ao vencer.

O Kong publica somente as rotas de saúde de `authentication`; suas rotas
`/internal/*` ficam fora das rotas públicas. As operações do navegador passam
exclusivamente pelo BFF. A consulta interna facilita a revogação das sessões,
mas torna as operações autenticadas dependentes da disponibilidade desse
serviço.

Sessões inválidas recebem `401` e removem o cookie. Origem ou CSRF inválidos
recebem `403`; conteúdo incompatível recebe `415`. Falhas de rede, timeout,
respostas inválidas da dependência ou indisponibilidade do banco retornam
`503`, sem detalhes internos. Se o encerramento falhar com `503`, o cookie é
preservado e a operação não é indicada como bem-sucedida.

## Configuração e execução

No Compose, o serviço é construído com `SERVICE=web` e executado pelo mesmo
Dockerfile das APIs, com Gunicorn. O endereço de autenticação é
`http://authentication:5000`. O BFF inicia sem aguardar a saúde da dependência.

O `.env` local deste serviço contém as seguintes variáveis:

| Variável | Uso |
| --- | --- |
| `AUTHENTICATION_URL` | Endereço do serviço; localmente, `http://127.0.0.1:5005`. |
| `AUTH_INTERNAL_TOKEN` | Mesmo segredo configurado em `authentication` e no `.env` do Compose. |
| `WEB_ALLOWED_ORIGINS` | Lista de origens completas, separadas por vírgula. |
| `SESSION_COOKIE_SECURE` | `false` somente para desenvolvimento em HTTP; `true` para HTTPS. |
| `SESSION_COOKIE_SAMESITE` | Política do cookie, inicialmente `Lax`. |
| `SESSION_COOKIE_PATH` | Caminho público do cookie, inicialmente `/api/web`. |

Os arquivos `.env` são locais e ignorados pelo Git e pelo build Docker.
Preserve as configurações já existentes. `SameSite=None` exige cookie seguro.
Para um frontend em outra origem, atualize também o CORS do Kong, mantendo
origens explícitas e suporte a credenciais.

Para executar diretamente nesta pasta:

```bash
poetry install
poetry run flask --app app run --debug --port 5008
```

Inicie `authentication` na porta `5005` em outro terminal. A porta `5008`
expõe as rotas nativas, como `/health`. Para testar o navegador com esse
processo, encaminhe o prefixo público `/api/web` do Kong para o endereço
nativo do BFF, mantendo o caminho do cookie coerente com o prefixo.

A agregação de saúde usa destinos fixos no Docker. Para verificar serviços
nativos, configure os endereços correspondentes, como
`ADMINISTRATIONS_URL`, `ACTIVITIES_URL`, `EVENTS_URL`, `CONTENT_URL`,
`AUTHENTICATION_URL`, `MESSAGING_URL` e `INTEGRATIONS_URL`.

Para preparar os índices de sessão e criar uma conta inicial, siga
[api/README.md](../../README.md). Os comandos administrativos solicitam a
senha de forma oculta; não há conta ou senha predefinida.
