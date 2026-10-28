# Verificação e rastreabilidade

**Captura**: 2026-10-27. O inventário abaixo resulta de inspeção de arquivos.
A execução local acrescentada abaixo foi realizada nesta adoção. Resultados
de outros ciclos não são convertidos em execução comprovada desta captura.

## Requisitos, fontes e evidências

| Requisito | Fonte observada | Teste existente ou verificação necessária | Estado nesta captura |
| --- | --- | --- | --- |
| FR-001 | `api/compose.yaml`, `api/services/*/app.py` | `test_all_service_factories_create_distinct_applications`; saúde do BFF | Suíte local passou; publicação real pendente. |
| FR-002 | `api/gateway/kong.yaml` | Consultar os oito prefixos por Kong real | Configuração inspecionada; integração pendente. |
| FR-003 | Regex de rotas e rota `authentication-health` | Prefixos semelhantes e rotas internas pelo gateway | Configuração inspecionada; integração pendente. |
| FR-004 | `api/common/maisciencia_common/__init__.py` | `test_health_does_not_query_database`, `test_database_health_pings_configured_database` | Testes locais passaram; dependência simulada. |
| FR-005 | `api/mongo/init-services.js` | Um acesso permitido e outro proibido por usuário | Roles inspecionadas; RBAC real pendente. |
| FR-006 | `api/services/web/app.py`, `api/compose.yaml` | `test_health_has_no_database_or_authentication_dependency` | Teste local passou; dependências controladas. |
| FR-007 | Erro de dependência na factory comum | `test_database_error_does_not_disclose_credentials` | Teste local passou; dependências controladas. |
| FR-008 | `api/Dockerfile`, manifests e locks dos serviços | Construção de cada imagem pelo lock correspondente | Arquivos inspecionados; construção real pendente. |
| FR-009 | `api/.gitignore`, `web/.gitignore`, `.dockerignore` | Verificar exclusão sem exibir conteúdo dos `.env` | Exclusões Git confirmadas sem publicar valores. |
| FR-010 | Inicializador Mongo e `api/README.md` | Testar migração apropriada a um ambiente existente | Comportamento de inicialização documentado; migração não executada. |

## Critérios de sucesso

| Critério | Evidência necessária | Estado |
| --- | --- | --- |
| SC-001 | Oito identidades em processos realmente publicados | Pendente no ambiente integrado. |
| SC-002 | Sete acessos próprios aceitos e sete acessos fora do escopo recusados | Pendente em MongoDB real. |
| SC-003 | Respostas preservadas após parar um domínio | Pendente no ambiente integrado. |
| SC-004 | Processo e dependência distinguíveis em sete APIs; BFF sem banco | Suíte local passou; dependências reais pendentes. |
| SC-005 | Configuração sem credencial Mongo para BFF e rejeição pública de rotas internas | Inspeção favorável; validação do gateway real pendente. |

## Registro de execução desta adoção

| Verificação | Resultado registrado |
| --- | --- |
| Inspeção de fontes e testes | Realizada para produzir os artefatos; sem leitura de `.env`. |
| Testes Python, Black e Pylint | Passaram nesta adoção; detalhes abaixo. |
| ESLint e build do frontend | Passaram; detalhes na feature `003-web-pwa`. |
| Compose e inicializador JavaScript | Compose e simulação administrativa passaram; containers não executados. |
| Kong, MongoDB e permissões reais | Não verificados nesta captura. |

Atualize esta tabela com comando, data, resultado e limite da evidência.
Mantenha resultados de cliente Flask, mocks e persistência em memória separados
de testes com gateway e banco reais.

## Verificação documental executada em 2026-10-27

Foi executado um script local de inspeção para conferir: referências FR dos
requisitos em `tasks.md` e `verification.md`, existência dos destinos de links
Markdown locais e leitura dos contratos com PyYAML/JSON. Resultado: sem erros
nesses checks. Nas interfaces de sessão, todos os `$ref` locais e entre os
dois arquivos OpenAPI foram resolvidos. Isso não é validação completa pelo
schema oficial OpenAPI, teste de contrato HTTP nem execução de infraestrutura.

## Execução local consolidada em 2026-10-27

Os 47 testes Python passaram com cliente Flask e dependências controladas.
Black passou nos 24 arquivos Python, sequencialmente; Pylint passou com nota
10/10. A configuração Compose passou com `docker compose -f api/compose.yaml
--env-file api/.env config --quiet`. Exclusões Git dos arquivos locais e
do ambiente Spec Kit foram confirmadas sem publicar valores.

Essa execução fornece evidência local para saúde, isolamento das factories
e sanitização. Publicação real, falha independente de processos, gateway
e RBAC continuam pendentes; consultar a configuração não executa containers.
