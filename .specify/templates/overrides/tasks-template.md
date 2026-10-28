---
description: "Modelo de tarefas verificáveis para implementar uma funcionalidade"
---

# Tarefas: [FEATURE NAME]

**Documentos de entrada**: `specs/[###-feature-name]/spec.md`, `plan.md` e artefatos aplicáveis.
**Organização**: Dependências compartilhadas, histórias por prioridade e consolidação.
**Validação**: Incluir testes pertinentes ao risco, à especificação e à constituição; não criar testes que apenas repitam a implementação.

## Convenção

- Formato: `- [ ] T001 [P] [US1] descrição com caminho exato`.
- IDs `T###` são únicos; aceitar quatro ou mais dígitos quando necessário.
- `[P]` indica arquivos distintos, ausência de dependência e execução realmente independente.
- `[US1]` relaciona a tarefa à história; tarefas compartilhadas podem não ter esse marcador.
- Cada tarefa deve indicar ação, arquivo, dependências relevantes e critério de conclusão verificável.
- `[x]` exige trabalho concluído e evidência adequada; uma execução futura não é evidência.

<!-- As tarefas abaixo são exemplos. Substituir por ações reais baseadas em spec.md, plan.md e contratos. Não reiniciar numeração ou apagar evidências de tarefas concluídas quando a especificação evoluir. -->

## Fase 1: Preparação

**Objetivo**: [Preparar somente o que esta funcionalidade precisa.]

- [ ] T001 Registrar [decisão necessária] em specs/[###-feature-name]/research.md.

## Fase 2: Dependências compartilhadas

**Objetivo**: [Dependências que bloqueiam histórias específicas; explicitar quais. Remover a fase se não houver.]

- [ ] T002 Implementar [pré-requisito] em [exact/file/path] para FR-001.

## Fase 3: US1 — [Título] (Prioridade: P1)

**Resultado**: [Valor entregue.]
**Verificação independente**: [Procedimento observável e caminho do teste, quando aplicável.]
**Dependências**: [IDs das tarefas realmente necessárias.]

- [ ] T003 [US1] Verificar [cenário de FR-001/SC-001] em [exact/test/path].
- [ ] T004 [US1] Implementar [comportamento de FR-001] em [exact/source/path], conforme [contract/path].

## Fase final: Consolidação

- [ ] T005 Registrar comandos executados, resultados e limitações em specs/[###-feature-name]/quickstart.md.

## Dependências e paralelismo

[Descrever a ordem necessária, oportunidades reais de paralelismo e a menor entrega com valor. Remover fases e tarefas sem aplicação.]

## Rastreabilidade

| Requisito | História | Critério de sucesso | Tarefas | Validação e caminho da evidência |
|-----------|----------|---------------------|---------|--------------------------------|
| FR-001 | US1 | SC-001 | T003, T004 | [Teste ou procedimento verificável] |

## Evidências e pendências

| Tarefa | Estado observado | Comando, arquivo ou resultado | Pendência |
|--------|------------------|------------------------------|-----------|
| T003 | [Planejada/concluída/bloqueada] | [Evidência real ou ainda não executada] | [Limitação] |

[Execuções impedidas por ambiente permanecem explícitas. Não usar todos os checkboxes marcados como prova de validação integral.]

## Regras deste repositório

- Usar caminhos reais de web/, api/services/ e specs/; preservar api/services/web e api/services/administrations.
- Referenciar FR-###, US# e SC-### nas tarefas ou na matriz acima; explicitar requisitos sem cobertura.
- Manter artefatos Markdown em português do Brasil; usar inglês nos identificadores, nomes de arquivos e código.
- Preservar .env ignorados e registrar apenas nomes de configurações, nunca valores secretos.
- Registrar validações pertinentes com as ferramentas existentes; Black e Pylint são complementares.
- Preservar evidências retrospectivas e indicar sua origem. Não criar checkboxes concluídos apenas porque uma intenção foi documentada.
- Após uma alteração de intenção, reconciliar os artefatos e acrescentar trabalho preservando tarefas concluídas; /speckit.converge apenas acrescenta correções, sem alterar a intenção.
