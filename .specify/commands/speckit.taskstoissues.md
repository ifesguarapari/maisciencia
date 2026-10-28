---
description: Converter tarefas em issues do GitHub somente quando solicitado explicitamente.
tools: ['github/github-mcp-server/list_issues', 'github/github-mcp-server/issue_write']
---

# Converter tarefas em issues

Informe primeiro que `/speckit.taskstoissues` está depreciado no Spec Kit
1.2.4 e será removido em uma versão minor futura. A substituição é a extensão
`github`, instalada por `specify extension add github`, com o comando
`/speckit.github.taskstoissues`. Não instale a extensão nem execute o substituto
por conta própria.

Leia [o protocolo comum](README.md) e considere `$ARGUMENTS`. A adoção do SDD
não autoriza criar issues. Prossiga somente quando a conversão tiver sido
explicitamente solicitada; fora disso, informe o limite sem contatar terceiros.

1. Execute `before_taskstoissues` e
   `.specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks`.
   Leia as tarefas e a constituição.
2. Consulte `git config --get remote.origin.url`. O destino deve ser o
   repositório GitHub correspondente ao remote; não crie issues em outro lugar.
   Sem remote GitHub ou ferramenta suficiente, informe o impedimento.
3. Extraia IDs com `\bT\d{3,}\b`. Liste issues abertas e fechadas antes de criar
   qualquer uma, com páginas de até cem registros e cursor `after`; encerre
   quando todos os IDs forem encontrados ou não houver outra página.
4. Considere IDs já encontrados como duplicados e pule-os. Para os demais,
   remova checkbox e marcadores `[P]`/`[US#]` da descrição e use o título
   `T001: <description>`, com o ID uma única vez. Preserve conteúdo e quebras
   de linha ao enviar descrição pela ferramenta estruturada.
5. Execute `after_taskstoissues` e informe issues criadas, duplicadas e limites.
   Não altere tarefas nem afirme que uma issue representa implementação pronta.
