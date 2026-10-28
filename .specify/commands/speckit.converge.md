---
description: Comparar implementação e intenção e acrescentar tarefas para lacunas restantes.
---

# Verificar a convergência

Leia [o protocolo comum](README.md), considere `$ARGUMENTS` e consulte
`before_converge`. Use esta etapa depois de `tasks` e de uma execução de
`implement` sobre as tarefas atuais.

## Limite de escrita

A única escrita permitida é acrescentar uma seção `## Phase N: Convergence`
ao final de `tasks.md`. Não altere spec, plano, código, checklists, tarefas
existentes, IDs, ordem ou marcações. Sem lacunas, mantenha `tasks.md` idêntico,
byte por byte, sem criar uma seção vazia. Hooks respeitam o mesmo limite.

## Avaliação e acréscimo

1. Execute `SPECIFY_FEATURE_NO_PERSIST=1 .specify/scripts/bash/check-prerequisites.sh --json --require-spec --require-tasks --include-tasks`.
   Se faltar spec, plano ou tarefas, pare e indique `specify`, `plan` ou `tasks`.
   A variável impede escrita incidental em `feature.json`.
2. Use spec, plano e tarefas como fonte exclusiva de intenção, governada pela
   constituição. Inspecione o código nos caminhos e conceitos delimitados
   por esses artefatos. Não use comparação de branches ou histórico Git.
3. Inventarie requisitos, cenários, critérios implementáveis, decisões e
   princípios. Avalie todas as tarefas, inclusive marcadas e fases anteriores;
   checkbox concluído não substitui evidência. Avalie o comportamento resultante,
   sem exigir detalhes de uma implementação já substituída legitimamente.
4. Classifique as lacunas como `missing`, `partial`, `contradicts` ou
   `unrequested`. Registre ID, `source-ref`, `gap-type`, severidade e evidência.
   Código excedente só pode gerar tarefa para revisar, justificar ou remover;
   esta etapa não o remove. Código ausente é trabalho pendente, não erro do fluxo.
5. Priorize `CRITICAL` para violações constitucionais e bloqueios de histórias
   P1; `HIGH` para requisitos centrais; `MEDIUM` para lacunas secundárias ou
   adições injustificadas; `LOW` para acabamento. Se a constituição for apenas
   um modelo não preenchido, registre que a análise de princípios foi omitida.
6. Antes de escrever, apresente achados por severidade, origem, evidência e
   trabalho restante, com contagens de requisitos, decisões e princípios
   avaliados e lacunas por tipo.
7. Havendo achados acionáveis, determine o maior ID `M` e a próxima fase `N`.
   Acrescente uma única seção `## Phase N: Convergence` e uma tarefa por lacuna,
   com `T{M+1:03d}` em diante, origem e tipo. Violações constitucionais vêm
   primeiro e indicam `CRITICAL`. Nunca reutilize IDs nem reescreva fases anteriores.
8. Informe `tasks_appended`, quantidade e fase, recomendando `implement` para
   executar o trabalho. Sem lacunas, informe `converged` e as contagens
   avaliadas, sem atribuir revisão humana ou resultados de testes não executados.

Somente após informar o resultado, consulte `after_converge`. Nenhum hook pode
converter esta etapa em alteração de intenção ou implementação.
