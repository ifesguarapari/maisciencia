---
description: Planejar a solução técnica e produzir pesquisa, modelo, contratos e verificação.
handoffs:
  - label: Criar tarefas
    agent: speckit.tasks
    prompt: Decompor o plano em tarefas rastreáveis.
    send: true
  - label: Criar checklist de requisitos
    agent: speckit.checklist
    prompt: Criar um checklist para o domínio solicitado.
---

# Planejar a implementação

Leia [o protocolo comum](README.md), considere `$ARGUMENTS` e execute
`before_plan`.

1. Resolva os caminhos com
   `.specify/scripts/bash/check-prerequisites.sh --json --paths-only`.
   Se `IMPL_PLAN` ainda não existir, execute
   `.specify/scripts/bash/setup-plan.sh --json` e leia os caminhos retornados.
   Se já existir, leia o plano e resolva o modelo por
   `.specify/scripts/bash/resolve-template.sh plan-template --json`;
   evolua seu conteúdo sem executar o script que o sobrescreveria.
2. Leia a especificação, a constituição, a arquitetura e o modelo ativo.
   Registre linguagem, dependências, persistência, validação, plataforma,
   limites e escala conhecidos, sem inventar metas.
3. Confira os princípios antes da pesquisa. Registre atendimento e desvios
   justificados; uma violação sem resolução não é uma aprovação tácita.
4. Produza `research.md` com decisão, justificativa e alternativas. Resolva
   `NEEDS CLARIFICATION` materiais antes de depender deles; diferencie uma
   pesquisa técnica de uma decisão que exige contexto do usuário.
5. Produza `data-model.md` quando houver dados, explicitando entidades,
   responsabilidade, relações, validações, estados e migração aplicáveis.
   Para uma feature de processo, registre os artefatos pertinentes.
6. Produza `contracts/` quando houver interfaces, com formatos de máquina em
   inglês, e `quickstart.md` com reprodução verificável. Registre quando uma
   categoria não se aplicar, em vez de inventar uma interface.
7. Descreva a estrutura de arquivos e a rastreabilidade FR-### para solução,
   contratos e testes. Reavalie a constituição depois do desenho.
8. Prepare `verification.md` com fontes, critérios de aceitação e evidências
   esperadas. Resultados ainda não executados permanecem pendentes.

Execute `after_plan`. Encerre no desenho, sem implementar a aplicação;
informe os caminhos produzidos, decisões e pendências para `tasks`.
