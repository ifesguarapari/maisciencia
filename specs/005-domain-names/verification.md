# Verificação: nomes dos domínios

## Rastreabilidade

| Requisito | Evidência esperada | Situação |
| --- | --- | --- |
| FR-001 | runtime, Kong, consumidores e testes de identidade | Atualizados; suíte Python com 47 testes passou. |
| FR-002 | inicialização, factories e contrato de coleções | Mapeamentos e permissões atualizados; simulação passou. |
| FR-003 | chaves locais preservadas, ignoradas e sem segredos na saída | Senhas preservadas e correspondência conferida sem publicar valores. |
| FR-004 | inspeção padrão, conflitos e aplicação explícita em simulação | Dez cenários Node passaram; sem banco real. |
| FR-005 | testes de qualidade e artefatos coerentes | Black, Pylint, ESLint, build, Compose e estrutura SDD passaram. |

## Execução em 2026-10-27

| Verificação | Resultado e alcance |
| --- | --- |
| `.venv/bin/python -m unittest discover -s tests -v`, em `api` | 47 testes passaram; cliente Flask e dependências controladas. |
| Black nos 24 arquivos Python da API | Passou por arquivo, sequencialmente. O modo multiprocess não funcionou no sandbox. |
| Pylint em `common/maisciencia_common services tests` | Passou, nota 10/10; análise estática. |
| `node --test --test-isolation=none --test-reporter=spec api/tests/test_migration.cjs` | Dez testes passaram; estado MongoDB simulado em memória. |
| `npm run lint` e `npm run build`, em `web` | Passaram; PWA gerada com 17 entradas de precache. |
| `docker compose -f api/compose.yaml --env-file api/.env config --quiet` | Passou; não inicia containers. |
| `node --check` nos dois scripts de `api/mongo/` | Passou; valida apenas sintaxe JavaScript. |
| `poetry -C api/services/administrations check --lock` | Não executou: o Poetry global aponta para Python 3.12 ausente e falha ao iniciar. Nenhuma dependência ou lock foi alterado pela renomeação. |
| `python3 scripts/validate-specs.py` | Passou; cinco features, 42 requisitos e 39 tarefas. |
| Busca por nomes antigos no código atual | Restam apenas na migração e nos seus testes; histórico de nomes preservado na spec. |

O script administrativo usa inspeção por padrão, exige `MIGRATION_APPLY=true`
e `MIGRATION_CONFIRM_DATABASE` para escrever e recusa colisões antes da primeira
mutação. Preserva temporariamente a identidade legada para recuperação. Roles
e coleções são atualizadas sem transformar campos dos documentos. Operações
administrativas não são transacionais; a retomada é coberta pela simulação.

## Limitações

Migração contra MongoDB real, permissões reais e execução do conjunto Docker
não foram verificadas. Nenhum dado existente foi migrado nesta entrega.
Retirada da identidade legada e validação de acesso real são tarefas operacionais
posteriores à conferência da migração no ambiente de destino.
