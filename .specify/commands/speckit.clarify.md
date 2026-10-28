---
description: Resolver ambiguidades materiais e registrar as respostas na especificação.
handoffs:
  - label: Criar plano técnico
    agent: speckit.plan
    prompt: Criar o plano técnico da especificação esclarecida.
---

# Esclarecer a especificação

Leia [o protocolo comum](README.md), considere `$ARGUMENTS` e execute
`before_clarify`.

1. Execute `.specify/scripts/bash/check-prerequisites.sh --json --paths-only`
   e leia `FEATURE_SPEC`, `FEATURE_DIR` e a constituição. Se a seleção ou a
   especificação faltar, informe o pré-requisito de `specify`.
2. Avalie escopo, atores, dados, jornadas, erros, recuperação, restrições,
   integrações, segurança, critérios de sucesso e terminologia. Classifique
   as categorias como claras, parciais ou ausentes.
3. Priorize dúvidas pelo impacto e pela incerteza. Faça no máximo cinco
   perguntas nesta execução, uma por vez, somente quando a resposta alterar
   uma decisão material. Exclua informações já respondidas e detalhes rotineiros.
4. Apresente alternativas mutuamente exclusivas ou peça uma resposta curta.
   Explique a recomendação e os efeitos em linguagem clara. Uma sugestão só
   vira decisão quando sustentada pelo contexto autorizado ou por resposta.
5. Após cada resposta aceita, registre pergunta e resposta em uma seção de
   esclarecimentos com data ISO, usando `Q:` e `A:`; atualize imediatamente
   os requisitos ou cenários correspondentes. Remova a ambiguidade substituída,
   preserve IDs e evite afirmações contraditórias ou duplicadas.
6. Se existir `checklists/requirements.md`, reavalie a qualidade da spec e
   registre regressões e melhorias. Não altere checklists personalizados.
7. Se não houver ambiguidade material, informe esse resultado e siga para o
   plano. Respeite a decisão explícita de pular esclarecimentos, registrando
   o que continuará indefinido, sem inventar perguntas obrigatórias.

Execute `after_clarify`. Informe perguntas respondidas, seções modificadas,
cobertura das categorias, estado do checklist interno e decisões pendentes.
