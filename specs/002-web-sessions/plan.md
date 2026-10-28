# Plano técnico: identidade e sessões web

**Feature**: `002-web-sessions` | **Data**: 2026-10-27  
**Especificação**: [spec.md](spec.md)  
**Natureza**: reconstrução técnica retrospectiva da implementação existente.

## Resumo e contexto

O BFF `api/services/web` recebe operações do navegador e consulta o serviço
`authentication` por HTTP privado. Somente `authentication` acessa `users`
e `sessions` no MongoDB central. O BFF usa Flask, cliente HTTP da biblioteca
padrão e Gunicorn; o provedor de identidade usa Flask, PyMongo e Werkzeug.
Os projetos usam Python 3.11+ e Poetry. Black e Pylint seguem 88 caracteres.

## Verificação da constituição

- A especificação conserva a intenção observada e distingue limitações de conclusão.
- O banco central e a responsabilidade exclusiva por coleções são preservados.
- O BFF mantém configuração e execução próprias, sem cliente MongoDB.
- Documentação é PT-BR; código, rotas, nomes e contratos de máquina são em inglês.
- Credenciais continuam nos `.env` locais; nenhum valor é copiado para artefatos.
- Verificação com dependências simuladas não equivale à homologação real.

## Desenho observado

1. Kong remove `/api/web` e encaminha ao BFF; de `authentication`, publica
   somente saúde, sem tornar `/internal/*` público.
2. O BFF exige `Origin` permitido e `Content-Type: application/json` nas
   alterações, autenticando seu cliente interno com `X-Internal-Token`.
3. `authentication` verifica senha com scrypt do Werkzeug e gera token opaco
   aleatório. Persiste SHA-256 em `token_hash`, nunca o token reutilizável.
4. O BFF recebe o token privado e emite cookie `maisciencia_session`, host-only,
   `HttpOnly`, `SameSite=Lax`, caminho `/api/web` e `Secure` por padrão. O `.env`
   local permite HTTP; produção depende da configuração HTTPS do operador.
5. Consultas e mutações internas usam `Authorization: Bearer ...`. Saída e
   rotação também enviam `X-CSRF-Token`; o backend compara as provas recebidas.
6. O prazo padrão é 1800 segundos de inatividade e 28800 segundos absolutos,
   ambos configuráveis. A aplicação valida datas UTC antes de aceitar a sessão.
7. Renovação usa atualização condicional do hash; saída revoga por `_id` após
   validar a sessão, impedindo que uma rotação concorrente preserve o acesso.
8. O cliente HTTP limita tempo e tamanho, bloqueia redirects e proxies de
   ambiente, e permite somente erros públicos conhecidos.

## Artefatos e implementação

| Responsabilidade | Fonte |
| --- | --- |
| Identidade, persistência, ciclo de vida e CLI | `api/services/authentication/app.py` |
| Cookie, origem e composição de rotas | `api/services/web/app.py`, `routes.py` |
| Transporte privado e sanitização | `api/services/web/client.py` |
| Agregação de saúde | `api/services/web/status.py` |
| Rotas públicas, CORS e execução | `api/gateway/kong.yaml`, `api/compose.yaml` |
| Índices iniciais | `api/mongo/init-services.js` |

Os contratos ficam em [contracts/openapi.yaml](contracts/openapi.yaml) e
[contracts/internal-auth.openapi.yaml](contracts/internal-auth.openapi.yaml).

## Estratégia de verificação

Os testes existentes cobrem o ciclo de vida, limites do BFF, falhas do cliente
e comandos administrativos. A matriz em [verification.md](verification.md)
registra os métodos concretos. A validação real de índices, TTL, RBAC,
roteamento Kong e atributos do cookie no navegador continua separada.

## Complexidade e evolução

A consulta central facilita revogação imediata, mas torna operações
autenticadas dependentes da disponibilidade de `authentication`. Esta
baseline não acrescenta cache de sessão, JWT, cadastro público ou acesso do
BFF ao banco. Uma mudança nessas decisões deverá alterar intenção, modelo,
contratos e verificações antes de implementar novos fluxos.
