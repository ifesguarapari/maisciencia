---
description: Criar um checklist para revisar a qualidade dos requisitos da funcionalidade.
---

# Criar checklist de requisitos

Leia [o protocolo comum](README.md), considere `$ARGUMENTS` e execute
`before_checklist`.

1. Execute `.specify/scripts/bash/check-prerequisites.sh --json --template checklist-template`.
   Leia `FEATURE_DIR`, `AVAILABLE_DOCS`, `TEMPLATE_CONTENT` e a constituição.
2. Determine foco, público, rigor e momento da revisão pela solicitação e
   pelos artefatos. Pergunte somente o que alterar materialmente a lista:
   até três perguntas iniciais e, havendo lacunas relevantes, no máximo duas
   adicionais. Não repita decisões já dadas. Sem necessidade de interação,
   use rigor padrão, revisor de PR para código e os dois focos mais relevantes.
3. Leia os trechos necessários de spec, plano e tarefas. Gere perguntas que
   avaliem completude, clareza, consistência, mensurabilidade, cobertura,
   casos de borda, restrições, dependências e premissas dos requisitos.
4. Cada item deve perguntar sobre a definição da intenção, com referência
   FR-###, SC-###, US# ou `[Gap]`; não deve pedir execução de teste da aplicação.
   Prefira "O requisito define o resultado de sessão expirada?" a "Executar logout".
5. Use o modelo ativo em `checklists/<domain>.md`, com domínio em inglês.
   Se o arquivo existir, preserve seu conteúdo e acrescente itens continuando
   os IDs `CHK###`; nunca apague, substitua ou renumere itens anteriores.
6. Todo item novo fica `[ ]`. Somente o revisor pode considerar satisfeito o
   critério. A geração não certifica requisitos nem conclui implementação.
   O checklist interno `requirements.md`, de `specify` e `clarify`, tem ciclo
   próprio e não altera esta regra para checklists personalizados.
7. Agrupe perguntas relacionadas e evite listas enormes de variações de baixo
   impacto. Registre o que não puder ser avaliado por falta de definição.

Execute `after_checklist`. Informe arquivo, quantidade de itens, foco, público,
rigor e pendências. Não marque aprovação humana nem teste executado.
