# Modelo dos artefatos

Esta feature não altera dados da aplicação.

| Artefato | Identidade | Relações |
| --- | --- | --- |
| Feature | Prefixo numérico e nome em inglês | Especificação, plano, tarefas e verificação |
| Requisito | `FR-###` local à feature | História, tarefas e evidência |
| História | `US#` local à feature | Cenários e prioridade |
| Critério | `SC-###` local à feature | Resultado esperado e alcance da evidência |
| Tarefa | `T###` local à feature | História, requisitos, arquivos e conclusão observada |

O ponteiro local `.specify/feature.json` seleciona uma feature para os scripts;
não integra o modelo MongoDB e não é versionado.
