---
description: Executar as tarefas autorizadas e registrar a verificação da implementação.
---

# Implementar a funcionalidade

Leia [o protocolo comum](README.md), considere `$ARGUMENTS` e execute
`before_implement`.

1. Execute `.specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks`
   e identifique a funcionalidade e seus artefatos.
2. Leia os checklists existentes apenas para informar total, concluídos e
   pendentes. `requirements.md` é o checklist interno de qualidade da spec;
   os personalizados pertencem ao revisor. Não altere seus marcadores nem
   confunda `[x]` de revisão com conclusão da implementação.
3. Se houver itens pendentes, apresente o estado e respeite a autorização já
   dada para continuar. Quando faltar uma decisão exigida por um checklist
   aplicável, solicite-a explicando a origem; não invente aprovação humana.
4. Leia tarefas, especificação, plano, constituição e contratos pertinentes.
   Confira a configuração local e os arquivos de ignore conforme as ferramentas
   efetivamente usadas, preservando `.env`, credenciais e trabalho existente.
5. Execute as tarefas conforme as dependências: preparação, pré-requisitos,
   histórias, integração e consolidação. Tarefas nos mesmos arquivos são
   sequenciais; `[P]` só permite paralelismo quando não houver dependência.
6. Quando houver testes de comportamento necessários, escreva ou ajuste-os
   antes da mudança correspondente. Não acrescente testes mecânicos sem
   valor de verificação. Siga os comandos de qualidade de `CONTRIBUTING.md`.
7. Após cada tarefa efetivamente concluída, marque seu checkbox e registre
   evidência. Falha em dependência sequencial exige correção antes de seguir;
   em tarefas independentes, continue as não afetadas e relate a falha.
8. Confira comportamento contra intenção, contratos e plano. Registre comando,
   resultado e limitação em `verification.md`; mocks, configuração e build
   não comprovam MongoDB real, Kong, navegador ou homologação humana.
9. Não reescreva a intenção para justificar um desvio. Se a intenção precisar
   mudar, reconcilie os artefatos pelo fluxo apropriado antes de depender dela.

Execute `after_implement` antes do relato de conclusão. Informe alterações,
verificações e pendências materiais; tarefas externas não executadas continuam
abertas. `converge` pode avaliar lacunas restantes sem implementar por conta própria.
