# Decisões observadas e alternativas

**Captura**: 2026-10-27. Este registro documenta escolhas já presentes no código;
não reconstrói aprovações humanas nem decisões históricas não registradas.

| Decisão observada | Evidência e motivo operacional | Alternativa não adotada |
| --- | --- | --- |
| Estado da sessão em `authentication` | `app.py` persiste e verifica sessões no banco central; BFF consulta por HTTP. | Sessões em memória de cada worker. |
| Cookie com token opaco; visão pública separada | BFF remove `session_token` do JSON e configura `HttpOnly`. | Token reutilizável no estado persistente do navegador. |
| Verificador SHA-256 do token aleatório | `_digest` e teste de persistência comprovam ausência do token bruto no registro. | Guardar o token reutilizável na coleção. |
| Senha com scrypt do Werkzeug | `create-user` e `check_password_hash` usam biblioteca do framework. | Algoritmo de senha próprio. |
| Consulta central e rotação condicional | Expiração e revogação são avaliadas antes de devolver a identidade. | Validação local com token autossuficiente. |
| Origem e JSON no BFF; CSRF para mutações de sessão | Validadores e testes rejeitam chamadas fora do contrato. | Aceitar formulários arbitrários com cookie implícito. |
| TTL somente para limpeza | Expiração é checada pela aplicação antes da remoção física. | Esperar a limpeza assíncrona para negar acesso. |
| Destinos fixos e redirects bloqueados | Cliente não aceita URL do navegador nem segue redirecionamento privado. | Proxy genérico com encaminhamento de credenciais. |

Fontes: [código de autenticação](../../api/services/authentication/app.py),
[BFF](../../api/services/web/README.md),
[sessões Flask](https://flask.palletsprojects.com/en/stable/quickstart/#sessions),
[gestão de sessões OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
e [índices TTL](https://www.mongodb.com/docs/manual/core/index-ttl/).

Não há evidência nesta auditoria de benchmark, disponibilidade em produção,
aprovação de requisitos por um revisor ou execução completa com MongoDB/Kong.
