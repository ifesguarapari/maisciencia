---
description: Criar ou atualizar a especificação a partir da solicitação de uma funcionalidade.
handoffs:
  - label: Criar plano técnico
    agent: speckit.plan
    prompt: Criar o plano técnico da especificação.
  - label: Esclarecer requisitos
    agent: speckit.clarify
    prompt: Esclarecer decisões materiais da especificação.
    send: true
---

# Especificar a funcionalidade

Leia [o protocolo comum](README.md), considere `$ARGUMENTS` e execute os hooks
`before_specify`. Esta etapa produz intenção verificável; não implementa código.

## Diretório e seleção

1. Extraia atores, ações, dados, restrições e um nome conciso em inglês da
   solicitação. Se a solicitação estiver vazia, informe que falta a descrição.
2. Uma branch só pode ser criada por hook de Git configurado e autorizado.
   Passe `GIT_BRANCH_NAME` explícito sem alterar o valor; anote `BRANCH_NAME`
   e `FEATURE_NUM` retornados. Branch e diretório são independentes.
3. Respeite `SPECIFY_FEATURE_DIRECTORY` explícito. Sem ele, leia
   `.specify/init-options.json`: `feature_numbering: sequential` ou ausência
   usa o próximo número de três dígitos encontrado em `specs/`; `timestamp`
   usa `YYYYMMDD-HHMMSS`. O nome será `<prefix>-<short-name>`.
   `branch_numbering` só é fallback legado: informe sua depreciação.
4. Crie somente uma funcionalidade por execução. Resolva o modelo ativo com
   `.specify/scripts/bash/resolve-template.sh spec-template --json`; use
   `TEMPLATE_CONTENT`, preservando a resolução de overrides e presets.
5. Crie `spec.md` no diretório resolvido, sem sobrescrever conteúdo existente
   inadvertidamente. Para uma especificação viva já selecionada, evolua seus
   requisitos e mantenha os IDs. Persista a seleção local ignorada pelo Git:

```json
{"feature_directory": "specs/006-feature-name"}
```

O valor de `.specify/feature.json` deve ser o caminho efetivamente resolvido,
nunca o nome literal de uma variável. Não derive a seleção da branch.

## Conteúdo e revisão de qualidade

- Preencha o modelo com objetivo, escopo, histórias US1 etc. priorizadas,
  aceitação observável, casos de borda, requisitos FR-### e critérios SC-###.
- Descreva o que deve acontecer e por quê; detalhes de solução ficam no plano.
- Registre premissas razoáveis. Use no máximo três marcadores
  `[NEEDS CLARIFICATION: pergunta específica]`, apenas quando não houver
  padrão razoável e a decisão alterar materialmente escopo, segurança ou uso.
- Para dúvidas materiais, apresente contexto, alternativas e efeitos; aguarde
  a resposta para o trabalho dependente. Não invente resposta ou aprovação.
- Gere `checklists/requirements.md` pelo modelo de checklist. Avalie completude,
  clareza, consistência, verificabilidade, cobertura, limites e ausência de
  decisões técnicas indevidas. Esse checklist interno de qualidade pode ser
  atualizado por `specify` e `clarify`; checklists personalizados pertencem
  ao revisor.
- Corrija problemas verificáveis da especificação e repita a revisão até três
  vezes. Se restarem problemas, documente-os sem marcar aprovação fictícia.
- Em uma baseline, declare a reconstrução retrospectiva, fontes observadas e
  limites; não atribua desenvolvimento orientado por uma spec anterior.

Execute `after_specify` e informe `SPECIFY_FEATURE_DIRECTORY`, `SPEC_FILE`,
estado do checklist, decisões pendentes e prontidão para `clarify` ou `plan`.
