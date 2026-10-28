---
description: Gerar tarefas rastreáveis, específicas e ordenadas pelas dependências reais.
handoffs:
  - label: Analisar consistência
    agent: speckit.analyze
    prompt: Analisar a consistência entre especificação, plano e tarefas.
    send: true
  - label: Implementar
    agent: speckit.implement
    prompt: Executar as tarefas autorizadas conforme suas dependências.
    send: true
---

# Organizar as tarefas

Leia [o protocolo comum](README.md), considere `$ARGUMENTS` e execute
`before_tasks`.

1. Execute `.specify/scripts/bash/setup-tasks.sh --json`. Leia `FEATURE_DIR`,
   `TASKS_TEMPLATE_CONTENT`, `TASKS_TEMPLATE` e `AVAILABLE_DOCS`. Use o conteúdo
   retornado do modelo; em scripts antigos sem esse campo, leia o caminho.
2. Leia obrigatoriamente `spec.md` e `plan.md`; consulte constituição, pesquisa,
   modelo, contratos e quickstart disponíveis conforme o impacto.
3. Organize preparação, dependências compartilhadas, histórias por prioridade
   e consolidação. Não crie fases sem trabalho pertinente.
4. Cada tarefa usa `- [ ] T001 [P] [US1] descrição com caminho exato`.
   IDs têm pelo menos três dígitos e são únicos. `[P]` é opcional e só indica
   trabalho independente em arquivos distintos. `[US1]` é obrigatório quando
   a tarefa pertencer a uma história; tarefas compartilhadas podem omiti-lo.
5. Relacione cada FR-### a tarefas e evidências, diretamente ou por matriz.
   Inclua dependências, critérios verificáveis de conclusão, contratos e
   testes afetados. Testes novos devem corresponder ao risco e à constituição,
   evitando repetição mecânica da implementação.
6. Explique a ordem das histórias, oportunidades reais de paralelismo e a
   menor entrega com valor. Não transforme validação futura em tarefa concluída.
7. Ao evoluir uma especificação viva, preserve tarefas concluídas e sua
   evidência. Acrescente trabalho novo sem apagar o histórico de execução.
8. Valide formato, IDs, cobertura dos requisitos e verificabilidade de cada
   história. Use `python3 scripts/validate-specs.py` para a parte estrutural;
   o resultado não substitui a análise semântica de `analyze`.

Grave o resultado em `FEATURE_DIR/tasks.md`. O script de preparação retorna
o modelo e seus metadados; ele não grava a lista de tarefas por conta própria.

Execute `after_tasks`. Informe caminho, quantidade de tarefas por história,
pendências, dependências e próxima etapa. Não implemente código nesta etapa.
